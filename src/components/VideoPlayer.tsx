import * as React from "react";
import { useRef, useImperativeHandle, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";
import { supabase } from "@/integrations/supabase/client";

export interface VideoPlayerHandle {
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
}

interface VideoPlayerProps {
  playbackId?: string;
  chapterId?: string;
  poster?: string;
  title?: string;
  onTimeUpdate?: (currentTime: number) => void;
}

interface PlaybackTokens {
  policy: "public" | "signed";
  playback: string | null;
  thumbnail: string | null;
}

const VideoPlayer = React.forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  ({ playbackId, chapterId, poster, title, onTimeUpdate }, ref) => {
    const playerRef = useRef<MuxPlayerElement>(null);

    const { data: tokens, isLoading: tokensLoading } = useQuery({
      queryKey: ["mux-playback-token", chapterId, playbackId],
      queryFn: async (): Promise<PlaybackTokens | null> => {
        const { data, error } = await supabase.functions.invoke("mux-playback-token", {
          body: { chapterId },
        });
        if (error) throw error;
        return data as PlaybackTokens;
      },
      enabled: !!playbackId && !!chapterId,
      staleTime: 1000 * 60 * 60, // tokens live 2h
      retry: 1,
    });

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (playerRef.current) {
          playerRef.current.currentTime = seconds;
        }
      },
      getCurrentTime: () => {
        return playerRef.current?.currentTime ?? 0;
      },
    }));

    const handleTimeUpdate = useCallback(() => {
      if (onTimeUpdate && playerRef.current) {
        onTimeUpdate(playerRef.current.currentTime);
      }
    }, [onTimeUpdate]);

    if (!playbackId) {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">No video available</p>
        </div>
      );
    }

    if (chapterId && tokensLoading) {
      return <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted animate-pulse" />;
    }

    const isSigned = tokens?.policy === "signed" && !!tokens.playback;
    const muxThumbnail = isSigned
      ? tokens?.thumbnail
        ? `https://image.mux.com/${playbackId}/thumbnail.jpg?token=${tokens.thumbnail}`
        : poster
      : `https://image.mux.com/${playbackId}/thumbnail.jpg?time=0`;
    const posterUrl = muxThumbnail || poster;

    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <MuxPlayer
          ref={playerRef}
          playbackId={playbackId}
          tokens={isSigned ? { playback: tokens!.playback!, thumbnail: tokens!.thumbnail ?? undefined } : undefined}
          poster={posterUrl}
          metadata={{
            video_title: title || "Video",
          }}
          accentColor="hsl(var(--primary))"
          className="h-full w-full"
          streamType="on-demand"
          onTimeUpdate={handleTimeUpdate}
        />
      </div>
    );
  }
);
VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
