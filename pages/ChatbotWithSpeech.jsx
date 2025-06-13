import React, { useState } from 'react';

const ChatbotWithSpeech = () => {
  const [message, setMessage] = useState('');

  const synth = window.speechSynthesis;
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  const startListening = () => {
    recognition.start();
    recognition.onresult = (event) => {
      setMessage(event.results[0][0].transcript);
    };
  };

  

  return (
    <div>
      <button onClick={startListening}>Start Speaking</button>
    
    </div>
  );
};

export default ChatbotWithSpeech;
