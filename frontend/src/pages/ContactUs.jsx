import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Paperclip, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { countries } from '../utils/countries';

export default function ContactUs() {
  const slides = [
    "/contact-slider-1.jpg?v=2",
    "/contact-slider-2.jpg?v=2",
    "/contact-slider-3.jpg?v=2"
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fileName, setFileName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.code === '+1') || countries[134] || countries[0]);

  const getIso = (emoji) => {
    if (!emoji || emoji.length < 4) return 'us';
    const cp = [...emoji].map(c => c.codePointAt(0));
    return String.fromCharCode(cp[0] - 127462 + 97) + String.fromCharCode(cp[1] - 127462 + 97);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  return (
    <div className="flex flex-col gap-16 pb-12 w-full overflow-hidden">
      {/* Modern Slider Hero Section */}
      <div className="w-full relative h-[60vh] min-h-[400px] overflow-hidden bg-slate-200 dark:bg-slate-700 group">
        
        {/* Sliding track */}
        <div 
          className="absolute inset-0 flex h-full w-full transition-transform duration-[1500ms] ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div 
              key={index}
              className="w-full h-full flex-shrink-0"
            >
              <img src={slide} alt={`Slide ${index + 1}`} className="w-full h-full object-cover object-center" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10"></div>
        
        {/* Navigation Arrows */}
        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-[#2a2a3c]/20 hover:bg-white dark:bg-[#2a2a3c]/40 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-[#2a2a3c]/20 hover:bg-white dark:bg-[#2a2a3c]/40 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={32} />
        </button>
        
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4">
          <span className="text-primary-400 font-bold tracking-widest uppercase mb-2 animate-[slideInDown_0.5s_ease-out]">Get In Touch</span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg animate-[slideInDown_0.7s_ease-out]">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light animate-[slideInDown_0.9s_ease-out]">
            Have questions about our collections, your order, or just want to say hi? We'd love to hear from you.
          </p>
          
          {/* Slider Indicators */}
          <div className="absolute bottom-8 flex gap-2">
            {slides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-primary-500 w-8' : 'bg-white dark:bg-[#2a2a3c]/50 hover:bg-white dark:bg-[#2a2a3c]'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#2a2a3c] p-8 rounded-2xl border shadow-sm flex flex-col gap-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 border-b pb-4">Contact Info</h3>
              
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-50">Our Location</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Lahore, Pakistan</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-50">Phone / WhatsApp</h4>
                  <a href="https://wa.me/923217812265" target="_blank" rel="noreferrer" className="text-slate-600 dark:text-slate-400 text-sm mt-1 group-hover:text-primary-600 block transition-colors">+92 321 7812265</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-50">Email Address</h4>
                  <a href="mailto:wordpressrahila@gmail.com" className="text-slate-600 dark:text-slate-400 text-sm mt-1 group-hover:text-primary-600 block transition-colors">wordpressrahila@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-50">Working Hours</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form connected to Web3Forms */}
          <div className="lg:col-span-2 bg-white dark:bg-[#2a2a3c] p-8 md:p-10 rounded-2xl border shadow-lg relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Send us a Message</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Fill out the form below and we will get back to you as soon as possible.</p>
            
            <form action="https://api.web3forms.com/submit" method="POST" encType="multipart/form-data" className="space-y-6 relative z-10">
              {/* NOTE: User needs to replace YOUR_ACCESS_KEY_HERE with a real Web3Forms Access Key */}
              <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE" />
              <input type="hidden" name="subject" value="New Contact Form Submission from BuyNest" />
              <input type="hidden" name="redirect" value="https://web3forms.com/success" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">First Name <span className="text-red-500">*</span></label>
                  <input type="text" name="first_name" required className="w-full bg-slate-50 dark:bg-[#1f1f2e] border border-slate-200 dark:border-[#3d3d5c] rounded-xl p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-primary-300" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Last Name <span className="text-red-500">*</span></label>
                  <input type="text" name="last_name" required className="w-full bg-slate-50 dark:bg-[#1f1f2e] border border-slate-200 dark:border-[#3d3d5c] rounded-xl p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-primary-300" placeholder="Doe" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" name="email" required className="w-full bg-slate-50 dark:bg-[#1f1f2e] border border-slate-200 dark:border-[#3d3d5c] rounded-xl p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-primary-300" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                  <div className="flex relative h-[50px]">
                    <div className="relative shrink-0 h-full">
                      <input type="hidden" name="country_code" value={selectedCountry.code} />
                      <button 
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="h-full bg-slate-50 dark:bg-[#1f1f2e] border border-slate-200 dark:border-[#3d3d5c] border-r-0 rounded-l-xl px-4 flex items-center justify-between outline-none hover:bg-slate-100 dark:bg-[#2a2a3c]/50 transition-colors w-[80px] gap-2"
                      >
                        <img src={`https://flagcdn.com/w20/${getIso(selectedCountry.flag)}.png`} alt="flag" className="w-6 h-auto shadow-sm" />
                        <ChevronDown size={16} className="text-slate-500 dark:text-slate-400" />
                      </button>
                      
                      {isDropdownOpen && (
                        <div className="absolute top-[calc(100%+4px)] left-0 w-[280px] max-h-[300px] overflow-y-auto bg-white dark:bg-[#2a2a3c] border border-slate-200 dark:border-[#3d3d5c] rounded-xl shadow-2xl z-50 py-2">
                          {countries.map((c, i) => (
                            <div 
                              key={i} 
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50 cursor-pointer transition-colors"
                              onClick={() => {
                                setSelectedCountry(c);
                                setIsDropdownOpen(false);
                              }}
                            >
                              <img src={`https://flagcdn.com/w20/${getIso(c.flag)}.png`} alt={c.name} className="w-5 h-auto shadow-sm" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 truncate">{c.name}</span>
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{c.code}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 bg-slate-50 dark:bg-[#1f1f2e] border border-slate-200 dark:border-[#3d3d5c] rounded-r-xl px-4 flex items-center focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all hover:border-primary-300">
                      <span className="text-slate-600 dark:text-slate-400 font-medium mr-2">{selectedCountry.code}</span>
                      <input type="tel" name="phone" className="w-full bg-transparent outline-none h-full py-2" placeholder="(234) 567-890" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Subject <span className="text-red-500">*</span></label>
                <input type="text" name="message_subject" required className="w-full bg-slate-50 dark:bg-[#1f1f2e] border border-slate-200 dark:border-[#3d3d5c] rounded-xl p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-primary-300" placeholder="How can we help?" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Attach Document (PDF / Image)</label>
                <div className="relative">
                  <input 
                    type="file" 
                    name="attachment" 
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
                    className="hidden" 
                    id="file-upload" 
                    onChange={handleFileChange}
                  />
                  <label 
                    htmlFor="file-upload" 
                    className={`flex items-center gap-3 w-full bg-slate-50 dark:bg-[#1f1f2e] border border-slate-200 dark:border-[#3d3d5c] border-dashed rounded-xl p-4 cursor-pointer hover:bg-slate-100 dark:bg-[#2a2a3c]/50 transition-colors justify-center ${fileName ? 'text-primary-600 border-primary-300 bg-primary-50/30' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    <Paperclip size={20} />
                    <span className="font-medium">{fileName ? fileName : "Click to upload a file"}</span>
                  </label>
                </div>
                <p className="text-xs text-slate-400 mt-2">Max file size: 5MB. Allowed formats: PDF, DOCX, JPG, PNG.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message <span className="text-red-500">*</span></label>
                <textarea name="message" required className="w-full bg-slate-50 dark:bg-[#1f1f2e] border border-slate-200 dark:border-[#3d3d5c] rounded-xl p-4 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-primary-300 h-40 resize-none" placeholder="Write your message here..."></textarea>
              </div>
              
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4 mb-2 max-w-lg mx-auto">
                By signing up, you agree to receive marketing emails and text messages. View our privacy policy and terms of service for more info.
              </p>
              
              <button type="submit" className="w-full sm:w-auto bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 hover:-translate-y-1 active:translate-y-0">
                Send Message <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
