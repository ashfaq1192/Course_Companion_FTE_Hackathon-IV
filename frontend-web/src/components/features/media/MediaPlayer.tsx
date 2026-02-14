import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface MediaPlayerProps {
  src: string;
  type: 'audio' | 'video';
  title?: string;
  onPlaybackRateChange?: (rate: number) => void;
  onVolumeChange?: (volume: number) => void;
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({ 
  src, 
  type, 
  title,
  onPlaybackRateChange,
  onVolumeChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement>(null);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const updateTime = () => setCurrentTime(media.currentTime);
    const updateDuration = () => setDuration(media.duration);

    media.addEventListener('timeupdate', updateTime);
    media.addEventListener('loadedmetadata', updateDuration);
    media.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      media.removeEventListener('timeupdate', updateTime);
      media.removeEventListener('loadedmetadata', updateDuration);
      media.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const media = mediaRef.current;
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (mediaRef.current) {
      mediaRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (mediaRef.current) {
      mediaRef.current.volume = vol;
    }
    if (onVolumeChange) {
      onVolumeChange(vol);
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (mediaRef.current) {
      mediaRef.current.playbackRate = rate;
    }
    if (onPlaybackRateChange) {
      onPlaybackRateChange(rate);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleFullscreen = () => {
    if (!mediaRef.current) return;
    
    if (!document.fullscreenElement) {
      mediaRef.current.parentElement?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      {type === 'video' ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={src}
          className="w-full aspect-video"
          onClick={togglePlay}
        />
      ) : (
        <div className="p-4">
          <audio
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            src={src}
            className="w-full"
          />
        </div>
      )}

      <div className="p-4">
        {title && <h3 className="text-white font-medium mb-2">{title}</h3>}
        
        <div className="flex items-center space-x-4 mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={togglePlay}
            className="text-white"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </Button>
          
          <span className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm">Speed:</span>
            {[0.5, 1, 1.25, 1.5, 2].map(rate => (
              <Button
                key={rate}
                variant={playbackRate === rate ? 'primary' : 'outline'}
                size="sm"
                onClick={() => changePlaybackRate(rate)}
                className="text-xs"
              >
                {rate}x
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-white text-sm">Vol:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white"
            >
              {isFullscreen ? '⛶' : '⛶'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};