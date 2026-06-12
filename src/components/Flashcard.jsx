import React, { useState } from 'react';

export default function Flashcard({ question, answer }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      onClick={() => setIsFlipped(!isFlipped)}
      className="w-80 h-48 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 select-none"
    >
      {isFlipped ? (
        // Back of Card (Answer)
        <div className="w-full h-full bg-purple-900 border-2 border-purple-500 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-lg shadow-purple-900/20">
          <p className="text-lg font-medium text-white">{answer}</p>
          <p className="text-xs text-purple-300 mt-4 absolute bottom-4">Click to flip back</p>
        </div>
      ) : (
        // Front of Card (Question)
        <div className="w-full h-full bg-[#1a2035] border-2 border-gray-700 hover:border-gray-500 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
          <h3 className="text-lg font-semibold text-white">{question}</h3>
          <p className="text-xs text-gray-500 mt-4 absolute bottom-4">Click to reveal answer</p>
        </div>
      )}
    </div>
  );
}