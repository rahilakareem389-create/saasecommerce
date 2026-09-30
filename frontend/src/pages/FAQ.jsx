import React from 'react';

export default function FAQ() {
  const faqs = [
    { q: "What is your return policy?", a: "We offer a 30-day money-back guarantee for all unused items." },
    { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Expedited options are available at checkout." },
    { q: "Do you ship internationally?", a: "Yes, we ship worldwide. Shipping costs apply and will be added at checkout." },
    { q: "How can I track my order?", a: "Once your order ships, we'll send you an email with the tracking information." }
  ];

  return (
    <div className="bg-white dark:bg-[#2a2a3c] p-8 rounded-xl border shadow-sm max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-4 last:border-0">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-2">{faq.q}</h3>
            <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
