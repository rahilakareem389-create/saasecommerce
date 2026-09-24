import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(name, email, password);
    if (res.success) {
      // Send Email via Web3Forms directly from the browser
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: '6d6e0418-bb66-48ed-81eb-aaf8f0a9486d',
            subject: 'New User Registered on SaaSCommerce',
            from_name: 'SaaSCommerce System',
            Name: name,
            Email: email
          })
        });
      } catch (emailErr) {
        console.error("Web3Forms Email Error:", emailErr);
      }
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 border rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Create an Account</h2>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
          Sign Up
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-slate-600">
        Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:underline">Login here</Link>
      </div>
    </div>
  );
}
