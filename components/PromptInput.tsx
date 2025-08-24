
import React from 'react';
import { ArtStyle } from '../types';
import { ART_STYLES } from '../constants';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  artStyle: ArtStyle;
  onArtStyleChange: (style: ArtStyle) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, onPromptChange, artStyle, onArtStyleChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-lg font-medium text-gray-300 mb-2">
          Visual Prompt
        </label>
        <textarea
          id="prompt"
          rows={3}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          placeholder="e.g., A lonely astronaut discovering a vibrant alien jungle..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-lg font-medium text-gray-300 mb-2">
          Art Style
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {ART_STYLES.map((style) => (
            <button
              key={style.name}
              onClick={() => onArtStyleChange(style)}
              className={`p-2 rounded-lg text-center transition-all duration-200 transform hover:scale-105 ${
                artStyle.name === style.name
                  ? 'bg-purple-600 ring-2 ring-purple-400 shadow-lg'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <img src={style.thumbnail} alt={style.name} className="w-16 h-16 rounded-md mx-auto mb-2 object-cover"/>
              <span className="text-sm font-medium">{style.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
