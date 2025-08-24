
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  audioFile: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, audioFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        onFileChange(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('audio/')) {
        onFileChange(file);
      }
    }
  };

  const truncateFileName = (name: string, length = 30) => {
    if (name.length <= length) return name;
    return name.substring(0, length) + '...';
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isDragging ? 'border-purple-500 bg-gray-700' : 'border-gray-600 bg-gray-800'}`}
    >
      <input
        type="file"
        id="audio-upload"
        className="hidden"
        accept="audio/*"
        onChange={handleFileSelect}
      />
      <label htmlFor="audio-upload" className="cursor-pointer">
        <div className="flex flex-col items-center justify-center">
          <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l7-3v13m-7 0a2 2 0 01-2-2V8a2 2 0 012-2h.01M16 19a2 2 0 002-2V5a2 2 0 00-2-2h-.01"></path></svg>
          {audioFile ? (
            <div>
              <p className="text-lg font-semibold text-green-400">File Selected:</p>
              <p className="text-gray-300">{truncateFileName(audioFile.name)}</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-semibold text-gray-300">
                Drag & Drop your audio file here
              </p>
              <p className="text-gray-500">or click to browse</p>
            </div>
          )}
        </div>
      </label>
    </div>
  );
};

export default FileUpload;
