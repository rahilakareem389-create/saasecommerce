import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingLocal(true);
    
    // 1. Try to login
    const res = await login(email, password);
    
    // 2. If login fails, try to automatically register them
    if (res && res.success === false) {
      // It might be "Invalid credentials" (wrong password) OR "User not found"
      // We will blindly attempt to register.
      // If they already exist but typed the wrong password, register will fail with "User already exists" or similar.
      const name = email.split('@')[0] || 'User';
      const regRes = await register(name, email, password);
      
      if (regRes && regRes.success) {
         if (regRes.data?.role === 'admin') {
           navigate('/admin');
         } else {
           navigate('/user-dashboard');
         }
         setLoadingLocal(false);
         return;
      } else {
         // Registration failed (meaning they probably DO exist, just wrong password)
         // Show the original login error so they know they typed the wrong password.
         setError(res.message);
         setLoadingLocal(false);
         return;
      }
    }
    
    // 3. Login was successful
    const data = res.data || res;
    if (data.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/user-dashboard');
    }
    setLoadingLocal(false);
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white dark:bg-[#2a2a3c] p-8 border rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">Welcome Back</h2>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-transparent dark:bg-[#1a1a24] text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-transparent dark:bg-[#1a1a24] text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loadingLocal}
          className="w-full bg-primary-600 text-white font-medium py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {loadingLocal ? 'Processing...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
