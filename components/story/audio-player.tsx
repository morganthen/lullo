"use client";

import { useRef, useState, useMemo } from "react";

type AudioPlayerProps = {
  src: string;
};

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>("0:00");
  const [duration, setDuration] = useState<string>("0:00");
  const [durationSeconds, setDurationSeconds] = useState<number>(0);

  const bars = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => {
        const h =
          12 +
          28 *
            Math.abs(Math.sin(i * 0.42 + 1.2)) *
            Math.abs(Math.sin(i * 0.13 + 0.5));
        return h;
      }),
    [],
  );

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function skip(seconds: number) {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(
      0,
      Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + seconds,
      ),
    );
  }

  function handleTimeUpdate() {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    if (duration > 0) {
      setProgress(currentTime / duration);
    }
    setCurrentTime(formatTime(currentTime));
  }

  function handleLoadedMetadata() {
    if (!audioRef.current) return;
    setDuration(formatTime(audioRef.current.duration));
    setDurationSeconds(audioRef.current.duration);
  }

  function handleEnded() {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime("0:00");
  }

  function handleBarClick(barIndex: number) {
    if (!audioRef.current || !audioRef.current.duration) return;
    const pct = barIndex / bars.length;
    audioRef.current.currentTime = pct * audioRef.current.duration;
  }

  return (
    <div className="space-y-4">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Waveform */}
      <div className="flex items-center gap-[1.5px] h-[52px] px-0.5">
        {bars.map((h, i) => {
          const filled = i / bars.length < progress;
          return (
            <div
              key={i}
              onClick={() => handleBarClick(i)}
              className="flex-1 rounded-sm cursor-pointer"
              style={{
                height: `${h}px`,
                background: filled ? "var(--terra)" : "var(--terra-light)",
                opacity: filled ? 0.9 : 0.35,
                transition: "background 0.1s",
                transformOrigin: "center",
                animation: isPlaying
                  ? `barPulse ${0.55 + (i % 7) * 0.09}s ${(i % 5) * 0.07}s ease-in-out infinite`
                  : "none",
              }}
            />
          );
        })}
      </div>

      {/* Time */}
      <div
        className="flex justify-between text-xs opacity-70"
        style={{ color: "var(--brown-mid)" }}
      >
        <span>{currentTime}</span>
        <span>{duration}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5">
        {/* Skip back 15s */}
        <button
          onClick={() => skip(-15)}
          className="flex flex-col items-center gap-0.5 border-none bg-transparent cursor-pointer"
          style={{ color: "var(--brown-mid)" }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M18 7L10 14L18 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="3"
              y="25"
              fontSize="7"
              fontFamily="DM Sans, sans-serif"
              fill="currentColor"
              fontWeight="600"
            >
              15
            </text>
          </svg>
          <span className="text-[10px]">&minus;15s</span>
        </button>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full flex items-center justify-center border-none text-white cursor-pointer transition-shadow duration-300"
          style={{
            background: "var(--terra)",
            boxShadow: isPlaying
              ? "0 0 0 8px rgba(196,102,58,0.2), 0 4px 20px rgba(196,102,58,0.35)"
              : "0 4px 20px rgba(196,102,58,0.28)",
          }}
        >
          {isPlaying ? (
            <svg width="18" height="20" viewBox="0 0 18 20" fill="white">
              <rect x="1" y="1" width="5" height="18" rx="2" />
              <rect x="11" y="1" width="5" height="18" rx="2" />
            </svg>
          ) : (
            <svg width="16" height="20" viewBox="0 0 16 20" fill="white">
              <path d="M2 1l13 9-13 9V1z" />
            </svg>
          )}
        </button>

        {/* Skip forward 15s */}
        <button
          onClick={() => skip(15)}
          className="flex flex-col items-center gap-0.5 border-none bg-transparent cursor-pointer"
          style={{ color: "var(--brown-mid)" }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M10 7l8 7-8 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="13"
              y="25"
              fontSize="7"
              fontFamily="DM Sans, sans-serif"
              fill="currentColor"
              fontWeight="600"
            >
              15
            </text>
          </svg>
          <span className="text-[10px]">+15s</span>
        </button>
      </div>
    </div>
  );
}
