
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GeneratedImage } from '../types';

interface VideoPlayerProps {
  audioUrl: string;
  images: GeneratedImage[];
  onFinish: () => void;
}

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
);
const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd"></path></svg>
);
const ReplayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10M20 20l-1.5-1.5A9 9 0 003.5 14"></path></svg>
);


const VideoPlayer: React.FC<VideoPlayerProps> = ({ audioUrl, images, onFinish }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      setProgress((currentTime / duration) * 100);

      const imageIndex = images.findIndex((img, idx) => {
        const nextTimestamp = images[idx + 1]?.timestamp ?? duration + 1;
        return currentTime >= img.timestamp && currentTime < nextTimestamp;
      });

      if (imageIndex !== -1 && imageIndex !== currentImageIndex) {
        setCurrentImageIndex(imageIndex);
      }
    };
    
    const handleEnded = () => {
        setIsPlaying(false);
        setIsFinished(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl, images, currentImageIndex]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        if(isFinished) {
            audio.currentTime = 0;
            setIsFinished(false);
        }
        audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    const audio = audioRef.current;
    if (!progressBar || !audio) return;
    
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = offsetX / width;
    audio.currentTime = audio.duration * percentage;
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden relative shadow-2xl shadow-purple-900/40">
        <img
          key={currentImageIndex}
          src={images[currentImageIndex]?.imageUrl}
          alt={`Scene at ${images[currentImageIndex]?.timestamp}s`}
          className="w-full h-full object-cover animate-fade-in"
        />
         <style>{`
          @keyframes fade-in {
            from { opacity: 0.5; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-in-out;
          }
        `}</style>
      </div>
      <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-4">
        <button onClick={togglePlayPause} className="text-purple-400 hover:text-purple-300 transition-colors">
          {isFinished ? <ReplayIcon className="w-10 h-10"/> : isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}
        </button>
        <div ref={progressBarRef} onClick={handleScrub} className="w-full h-2 bg-gray-600 rounded-full cursor-pointer">
            <div className="h-full bg-purple-500 rounded-full" style={{width: `${progress}%`}}></div>
        </div>
      </div>
       <button
          onClick={onFinish}
          className="w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-xl text-md hover:bg-gray-600 transition-all duration-300"
        >
          Create Another Video
        </button>
      <audio ref={audioRef} src={audioUrl} />
    </div>
  );
};

export default VideoPlayer;
