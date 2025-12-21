import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  playbackId?: string;
  poster?: string;
  title?: string;
}

const VideoPlayer = ({ playbackId, poster, title }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // For demo purposes - in production this would use Mux Player
  const videoUrl = playbackId 
    ? `https://stream.mux.com/${playbackId}.m3u8`
    : undefined;

  return (
    <div 
      className="relative aspect-video w-full overflow-hidden rounded-lg bg-card"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(true)}
    >
      {/* Video placeholder - would be replaced with actual Mux player */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20">
        {poster && (
          <img src={poster} alt={title} className="h-full w-full object-cover opacity-50" />
        )}
      </div>

      {/* Play button overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            className="h-16 w-16 rounded-full bg-primary/90 hover:bg-primary hover:scale-110 transition-transform"
            onClick={() => setIsPlaying(true)}
          >
            <Play className="h-8 w-8 fill-current" />
          </Button>
        </div>
      )}

      {/* Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress bar */}
        <div className="mb-3">
          <Slider
            value={[progress]}
            max={100}
            step={1}
            onValueChange={(value) => setProgress(value[0])}
            className="cursor-pointer"
          />
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <span className="text-sm text-muted-foreground">
              0:00 / 12:34
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Title overlay */}
      {title && showControls && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-background/90 to-transparent p-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
