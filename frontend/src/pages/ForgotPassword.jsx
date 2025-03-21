import { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3500/auth/sendResetMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setError('');
      } else {
        setError(data.message || 'Something went wrong');
        setMessage('');
      }
    } catch (err) {
      console.log(err.message);
      setError('Something went wrong. Please try again later.');
      setMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="relative w-80 pb-12">
        {/* Card container with colored border and shadow */}
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border-t-8 border-purple-600 p-6 pb-12">
          <div className="absolute top-2 right-2">
            {/* Icon placeholder - you can replace with your preferred icon */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-purple-600"
            >
              <rect width="18" height="11" x="3" y="4" rx="2" ry="2" />
              <path d="M7 20h10" />
              <path d="M9 16v4" />
              <path d="M15 16v4" />
            </svg>
          </div>
          
          <h1 className="text-center text-purple-700 text-2xl font-bold mb-6 mt-2">Reset Password</h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            
            {message && <p className="text-green-500 text-center text-sm">{message}</p>}
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity duration-150 font-medium mt-2"
            >
              Send Reset Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;