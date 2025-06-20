import React from 'react';
import { Bot  } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="nav flex justify-center items-center h-[90px] bg-zinc-900 px-4">
      <div className="flex items-center gap-[10px] text-center flex-wrap justify-center">
        <Bot size={30} color="#9333ea" />
        <span className="text-white text-xl sm:text-2xl font-bold">
          <strong className="text-white">RevynAI</strong>{' '}
          <span className="text-sm font-light text-gray-300 font-poppins">
            – Your second pair of (AI) eyes.
          </span>
        </span>
      </div>
    </div>
  );
};

export default Navbar;
