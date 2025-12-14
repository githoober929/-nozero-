import React from 'react';

const BackgroundEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Mental / Indigo Blob */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob"></div>
      
      {/* Physical / Orange Blob */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
      
      {/* Health / Emerald Blob */}
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
      
      {/* Noise Texture Overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default BackgroundEffect;