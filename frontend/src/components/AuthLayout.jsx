import React from 'react';

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8D538D] to-[#514ACD]">
          {title}
        </h1>
        <p className="text-xl text-gray-700 mt-2">{subtitle}</p>
      </div>

      <div className="flex items-center bg-white shadow-lg rounded-lg overflow-hidden w-[40em]">
        {children}
        <div className="w-1/2 bg-gray-200 flex items-center justify-center">
          <img src="/loginImg.jpeg" alt="Illustration" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;