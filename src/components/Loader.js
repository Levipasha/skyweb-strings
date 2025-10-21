import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loader = ({ size = 200 }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div style={{ width: size, height: size }}>
        <DotLottieReact
          src="https://lottie.host/93eea06b-8ecb-457c-99a3-e977de4346bd/Ewt2bksXmM.lottie"
          loop
          autoplay
        />
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading...</p>
      <p className="text-sm text-gray-500">Strings by SkyWeb</p>
    </div>
  );
};

export default Loader;

