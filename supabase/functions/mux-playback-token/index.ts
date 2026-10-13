import { createClient } from "npm:@supabase/supabase-js@2";
import { createPrivateKey, sign } from "node:crypto";
import { Buffer } from "node:buffer";
import { buildCors, isOriginAllowed } from "../_shared/ai.ts";

const TOKEN_TTL_SECONDS = 60 * 60 * 2; // 2h: long enough for one lecture session

const json = (body: unknown, status: number, cors: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const b64url = (input: Buffer | string) =>
  Buffer.from(input).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

// deno-lint-ignore no-explicit-any
async function getSigningKey(admin: any, muxAuth: string): Promise<{ id: string; pem: string }> {
  const envId = Deno.env.get("MUX_SIGNING_KEY_ID");
  const envKey = Deno.env.get("MUX_SIGNING_PRIVATE_KEY");
  if (envId && envKey) return { id: envId, pem: Buffer.from(envKey, "base64").toString("utf8") };

  const { data } = await admin.from("mux_signing_keys").select("id, private_key")
    .order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (data) return { id: data.id, pem: Buffer.from(data.private_key, "base64").toString("utf8") };

  // First run: create a signing key in Mux and keep it server-side only.
  const res = await fetch("https://api.mux.com/system/v1/signing-keys", {
    method: "POST", headers: { Authorization: `Basic ${muxAuth}` },
  });
  if (!res.ok) throw new Error("Failed to create Mux signing key");
  const created = (await res.json()).data;
  await admin.from("mux_signing_keys").insert({ id: created.id, private_key: created.private_key });
  return { id: created.id, pem: Buffer.from(created.private_key, "base64").toString("utf8") };
}

function signToken(keyId: string, pem: string, playbackId: string, aud: "v" | "t"): string {
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid: keyId }));
  const payload = b64url(JSON.stringify({
    sub: playbackId, aud, kid: keyId, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  }));
  const data = `${header}.${payload}`;
  const signature = sign("RSA-SHA256", Buffer.from(data), createPrivateKey(pem));
  return `${data}.${b64url(signature)}`;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = buildCors(origin);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (origin && !isOriginAllowed(origin)) return json({ error: "Origin not allowed" }, 403, cors);

  try {
    const body = await req.json().catch(() => ({}));
    const chapterId = body?.chapterId;
    if (typeof chapterId !== "string" || !/^[0-9a-f-]{36}$/i.test(chapterId)) {
      return json({ error: "chapterId is required" }, 400, cors);
    }

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Optional auth: free-preview chapters of published public/unlisted courses are open.
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const { data } = await admin.auth.getUser(authHeader.slice(7));
      userId = data.user?.id ?? null;
    }

    const { data: chapter } = await admin.from("chapters")
      .select("id, course_id, is_free_preview, mux_playback_id, mux_asset_id, courses!inner(is_published, visibility)")
      .eq("id", chapterId).maybeSingle();
    if (!chapter?.mux_playback_id) return json({ error: "Not found" }, 404, cors);

    // deno-lint-ignore no-explicit-any
    const course = (chapter as any).courses;
    const freePreview = chapter.is_free_preview === true && course?.is_published === true &&
      (course?.visibility === "public" || course?.visibility === "unlisted");
    let allowed = freePreview;
    if (!allowed && userId) {
      const { data: hasAccess } = await admin.rpc("has_course_access", { _user_id: userId, _course_id: chapter.course_id });
      allowed = hasAccess === true;
    }
    if (!allowed) return json({ error: "Forbidden" }, 403, cors);

    const muxAuth = btoa(`${Deno.env.get("MUX_TOKEN_ID")}:${Deno.env.get("MUX_TOKEN_SECRET")}`);

    // Older uploads use a public playback policy and need no token.
    let policy = "signed";
    if (chapter.mux_asset_id) {
      const assetRes = await fetch(`https://api.mux.com/video/v1/assets/${chapter.mux_asset_id}`, {
        headers: { Authorization: `Basic ${muxAuth}` },
      });
      if (assetRes.ok) {
        const asset = (await assetRes.json()).data;
        // deno-lint-ignore no-explicit-any
        const pb = (asset?.playback_ids ?? []).find((p: any) => p.id === chapter.mux_playback_id);
        if (pb?.policy) policy = pb.policy;
      }
    }
    if (policy === "public") return json({ policy: "public", playback: null, thumbnail: null }, 200, cors);

    const key = await getSigningKey(admin, muxAuth);
    return json({
      policy: "signed",
      playback: signToken(key.id, key.pem, chapter.mux_playback_id, "v"),
      thumbnail: signToken(key.id, key.pem, chapter.mux_playback_id, "t"),
      expiresIn: TOKEN_TTL_SECONDS,
    }, 200, cors);
  } catch (e) {
    console.error("mux-playback-token error:", e instanceof Error ? e.message : e);
    return json({ error: "Internal error" }, 500, cors);
  }
});
