"use client";

import { useRef, useState } from "react";

type AudioPlayerProps = {
  src: string;
};

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function handleTimeUpdate() {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    setProgress((currentTime / duration) * 100);
  }

  return (
    <div>
      <audio ref={audioRef} src={src} onTimeUpdate={handleTimeUpdate} />
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      {/* Progress Bar Container */}
      <div style={{ width: "100%", backgroundColor: "#ccc" }}>
        {/* Progress Fill */}
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: "green",
            height: "10px",
          }}
        />
      </div>
    </div>
  );
}
