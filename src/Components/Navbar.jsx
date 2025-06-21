import React from 'react';
import { Bot } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="nav flex justify-center items-center h-[100px] bg-zinc-900 px-4 flex-col text-center">
      <div className="flex items-center gap-[10px] flex-wrap justify-center">
        <Bot size={30} color="#9333ea" />
        <span className="text-white text-xl sm:text-2xl font-bold">
          <strong className="text-white">RevynAI</strong>{' '}
          <span className="text-sm font-light text-gray-300 font-poppins">
            – Your second pair of (AI) eyes.
          </span>
        </span>
      </div>
      {/* Small font line below tagline */}
      <p className="text-xs font-light text-gray-400 mt-1">AI Code Reviewer</p>
    </div>
  );
};

export default Navbar;
