import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Heart, Disc } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  src: string;
}

const PLAYLIST: Song[] = [
  {
    id: 1,
    title: "Acoustic Breeze",
    artist: "Benjamin Tissot",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60",
    src: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3"
  },
  {
    id: 2,
    title: "Creative Minds",
    artist: "Benjamin Tissot",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60",
    src: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3"
  },
  {
    id: 3,
    title: "Ukulele",
    artist: "Benjamin Tissot",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=60",
    src: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3"
  }
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSong = PLAYLIST[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentIndex, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.8;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  return (
    <main>
      <h1><Music aria-hidden="true" /> Moodify</h1>
      <section aria-label="Music player">
        <img src={currentSong.cover} alt={`Cover for ${currentSong.title}`} width={300} height={300} />
        <h2>{currentSong.title}</h2>
        <p>{currentSong.artist}</p>
        <audio
          ref={audioRef}
          src={currentSong.src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              audioRef.current.volume = isMuted ? 0 : volume;
            }
            handleTimeUpdate();
          }}
          onEnded={handleNext}
        />
        <div>
          <button type="button" onClick={handlePrev} aria-label="Previous song">
            <SkipBack aria-hidden="true" />
          </button>
          <button type="button" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
          <button type="button" onClick={handleNext} aria-label="Next song">
            <SkipForward aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setLiked(!liked)} aria-label="Like song" aria-pressed={liked}>
            <Heart aria-hidden="true" fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
        <label>
          Playback position
          <input type="range" min={0} max={duration} step={0.1} value={currentTime} onChange={handleSeek} />
        </label>
        <div>
          <button type="button" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
          </button>
          <label>
            Volume
            <input type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : volume} onChange={handleVolumeChange} />
          </label>
        </div>
      </section>
      <section aria-label="Playlist">
        <h2><Disc aria-hidden="true" /> Playlist</h2>
        <ol>
          {PLAYLIST.map((song, index) => (
            <li key={song.id}>
              <button
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-current={index === currentIndex ? 'true' : undefined}
              >
                {song.title} — {song.artist}
              </button>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
