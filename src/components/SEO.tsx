import { Helmet } from "react-helmet-async";

const SITE_URL = "https://cognitio.lovable.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SEOProps {
  /** Page-specific title. Cognitio brand is appended automatically. */
  title: string;
  /** ~140-160 character meta description. */
  description: string;
  /** Path relative to site root (e.g. "/courses"). Used for canonical and og:url. */
  path: string;
  /** Optional override for the social card image (absolute URL). */
  image?: string;
  /** Optional JSON-LD payload (will be JSON.stringify'd). */
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  /** Override og:type. Defaults to "website". */
  type?: "website" | "article" | "profile";
}

/**
 * Per-route head tags. Drop into any page component once. Replaces the static
 * og:* / title / description from index.html for JS-executing crawlers
 * (Googlebot). The static fallback in index.html still serves social-preview
 * crawlers (LinkedIn, WhatsApp, Slack) since they don't execute JS.
 */
export function SEO({ title, description, path, image, jsonLd, type = "website" }: SEOProps) {
  const fullTitle = title.includes("Cognitio") ? title : `${title} | Cognitio`;
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
