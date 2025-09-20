'use client'
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const SignIn = () => {
  const [error, setError] = useState('');
  const router = useRouter();
  const auth = getAuth();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Successful sign-in
      router.push('/');
    } catch (error) {
      // console.error('Google sign-in error:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-md">
      <h1 className="font-Primary text-3xl font-normal tracking-widest text-center mb-4">Sign in</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button 
        onClick={handleGoogleSignIn} 
        className="w-full bg-white/50 text-white px-4 py-2 rounded-full border border-slate-600 flex items-center justify-center"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="mr-4 max-w-8 bg-white/0" />
        <p className='text-slate-600'>Sign in with Google</p>
      </button>
    </div>
  );
};

export default SignIn;