import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
  playbackId?: string;
  poster?: string;
  title?: string;
}

const VideoPlayer = ({ playbackId, poster, title }: VideoPlayerProps) => {
  if (!playbackId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No video available</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      <MuxPlayer
        playbackId={playbackId}
        poster={poster}
        metadata={{
          video_title: title || "Video",
        }}
        accentColor="hsl(var(--primary))"
        className="h-full w-full"
        streamType="on-demand"
      />
    </div>
  );
};

export default VideoPlayer;
