
import React, { useState, useCallback, useRef } from 'react';
import FileUpload from './components/FileUpload';
import PromptInput from './components/PromptInput';
import Loader from './components/Loader';
import VideoPlayer from './components/VideoPlayer';
import { generateImage } from './services/geminiService';
import { AppState, ArtStyle, GeneratedImage } from './types';
import { SEGMENT_DURATION, ART_STYLES } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [artStyle, setArtStyle] = useState<ArtStyle>(ART_STYLES[0]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      setAudioFile(file);
      setError(null);
    }
  };

  const resetState = () => {
    setAppState(AppState.IDLE);
    setAudioFile(null);
    setPrompt('');
    setArtStyle(ART_STYLES[0]);
    setGeneratedImages([]);
    setError(null);
    setGenerationProgress({ current: 0, total: 0 });
  };

  const handleGenerateClick = useCallback(async () => {
    if (!audioFile || !prompt.trim()) {
      setError('Please upload an audio file and enter a prompt.');
      return;
    }
    setAppState(AppState.GENERATING);
    setError(null);
    setGeneratedImages([]);

    const audioUrl = URL.createObjectURL(audioFile);
    const audio = new Audio(audioUrl);

    audio.onloadedmetadata = async () => {
      const duration = audio.duration;
      const numImages = Math.max(1, Math.ceil(duration / SEGMENT_DURATION));
      setGenerationProgress({ current: 0, total: numImages });

      try {
        const images: GeneratedImage[] = [];
        for (let i = 0; i < numImages; i++) {
          const timestamp = i * SEGMENT_DURATION;
          const scenePrompt = `${prompt}, ${artStyle.prompt}, scene at ${Math.round(timestamp)} seconds.`;
          
          const imageBytes = await generateImage(scenePrompt);
          const imageUrl = `data:image/jpeg;base64,${imageBytes}`;
          
          images.push({ timestamp, imageUrl });
          setGeneratedImages([...images]);
          setGenerationProgress({ current: i + 1, total: numImages });
        }
        setAppState(AppState.READY);
      } catch (err) {
        console.error(err);
        setError('Failed to generate images. Please check your API key and try again.');
        setAppState(AppState.IDLE);
      } finally {
        URL.revokeObjectURL(audioUrl);
      }
    };
    audio.onerror = () => {
        setError("Could not load audio file metadata.");
        setAppState(AppState.IDLE);
        URL.revokeObjectURL(audioUrl);
    }
  }, [audioFile, prompt, artStyle]);

  const renderContent = () => {
    switch (appState) {
      case AppState.GENERATING:
        return <Loader progress={generationProgress} lastImage={generatedImages[generatedImages.length - 1]?.imageUrl} />;
      case AppState.READY:
        return audioFile && <VideoPlayer audioUrl={URL.createObjectURL(audioFile)} images={generatedImages} onFinish={resetState} />;
      case AppState.IDLE:
      default:
        return (
          <div className="w-full max-w-2xl mx-auto space-y-8">
            <FileUpload onFileChange={handleFileChange} audioFile={audioFile} />
            <PromptInput
              prompt={prompt}
              onPromptChange={setPrompt}
              artStyle={artStyle}
              onArtStyleChange={setArtStyle}
            />
            {error && <p className="text-red-400 text-center font-medium">{error}</p>}
            <button
              onClick={handleGenerateClick}
              disabled={!audioFile || !prompt}
              className="w-full bg-purple-600 text-white font-bold py-4 px-6 rounded-xl text-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-900/50"
            >
              Generate Music Video
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          AI Music Video Generator
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Turn your audio into a visual masterpiece with Gemini.
        </p>
      </div>
      <div className="w-full max-w-4xl p-4 sm:p-8 bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700">
        {renderContent()}
      </div>
       <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>Powered by Google Gemini. Created for demonstration purposes.</p>
      </footer>
    </div>
  );
};

export default App;
