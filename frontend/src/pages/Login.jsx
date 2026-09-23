import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res && res.success === false) {
      setError(res.message);
      return;
    }
    const data = res.data || res;
    if (data.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/user-dashboard'); // Changed from /
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 border rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Welcome Back</h2>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary-600 text-white font-medium py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Sign In
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-slate-600">
        Don't have an account? <Link to="/register" className="text-primary-600 font-medium hover:underline">Register here</Link>
      </div>
    </div>
  );
}
