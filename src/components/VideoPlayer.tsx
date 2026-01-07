import * as React from "react";
import { useRef, useImperativeHandle, useCallback } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";

export interface VideoPlayerHandle {
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
}

interface VideoPlayerProps {
  playbackId?: string;
  poster?: string;
  title?: string;
  onTimeUpdate?: (currentTime: number) => void;
}

const VideoPlayer = React.forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  ({ playbackId, poster, title, onTimeUpdate }, ref) => {
    const playerRef = useRef<MuxPlayerElement>(null);

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

    // Use Mux thumbnail when available, fall back to provided poster
    const muxThumbnail = `https://image.mux.com/${playbackId}/thumbnail.jpg?time=0`;
    const posterUrl = muxThumbnail || poster;

    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <MuxPlayer
          ref={playerRef}
          playbackId={playbackId}
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
