
import React from 'react';

interface LoaderProps {
  progress: { current: number; total: number };
  lastImage?: string;
}

const Loader: React.FC<LoaderProps> = ({ progress, lastImage }) => {
  const percentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;
  const loadingMessages = [
    "Warming up the AI's creativity...",
    "Analyzing the song's vibe...",
    "Painting the first scene...",
    "Crafting the visual narrative...",
    "Syncing pixels to the beat...",
    "Almost there, adding finishing touches..."
  ];

  const messageIndex = Math.min(loadingMessages.length - 1, Math.floor((percentage / 100) * (loadingMessages.length-1)));

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-purple-400 mb-2">
            {loadingMessages[messageIndex]}
        </h2>
        <p className="text-gray-400">
          Generating image {progress.current} of {progress.total}
        </p>
        <div className="w-full bg-gray-700 rounded-full h-4 mt-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      {lastImage && (
        <div className="mt-6 w-full max-w-lg aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <img src={lastImage} alt="Latest generated frame" className="w-full h-full object-cover animate-pulse-slow"/>
        </div>
      )}
    </div>
  );
};

export default Loader;
