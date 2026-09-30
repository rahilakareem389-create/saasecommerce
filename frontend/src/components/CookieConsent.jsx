import { useState, useEffect } from 'react';
import { ShieldAlert, Check, X } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Small delay for better UX so it doesn't just flash instantly on load
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-[#2a2a3c] border border-slate-200 dark:border-[#3d3d5c] rounded-2xl shadow-2xl p-6 z-[99999] animate-in slide-in-from-bottom-5 duration-500 font-sans">
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full p-2 shrink-0">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">We value your privacy</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies. Read our <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 justify-end mt-4">
        <button 
          onClick={handleDecline}
          className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#3d3d5c] rounded-lg transition-colors flex items-center gap-2"
        >
          <X size={16} /> Decline
        </button>
        <button 
          onClick={handleAccept}
          className="px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-primary-500/20"
        >
          <Check size={16} /> Accept All
        </button>
      </div>
    </div>
  );
}
