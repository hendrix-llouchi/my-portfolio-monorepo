import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormState>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setIsSuccess(false);
    
    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

      if (!accessKey) {
        // Direct email fallback when Web3Forms key isn't configured yet
        const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
        const body = encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'N/A'}\n\nMessage:\n${formData.message}`
        );
        window.location.href = `mailto:${CONTACT_INFO.email}?subject=${subject}&body=${body}`;
        setIsSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          message: formData.message,
          from_name: "Portfolio Contact Form",
          subject: `New Portfolio Message from ${formData.name}`,
        }),
      });
      
      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setIsSubmitting(false);
        setTimeout(() => {
          setIsSuccess(false);
        }, 6000);
      } else {
        const errorMsg = data.message || 'An error occurred. Please try again.';
        setErrorMessage(errorMsg);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg = error instanceof Error 
        ? error.message 
        : 'Network error. Please check your connection and try again.';
      setErrorMessage(errorMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full" />
          <p className="mt-4 text-blue-100/80 max-w-2xl mx-auto">
            Whether you have an inquiry, want to discuss a potential project or role, or just want to connect, my inbox is always open.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-blue-100/80 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-white/5 border border-white/10 focus:border-purple-500 text-white rounded-lg p-3 w-full outline-none transition-all placeholder-blue-100/30"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-100/80 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white/5 border border-white/10 focus:border-purple-500 text-white rounded-lg p-3 w-full outline-none transition-all placeholder-blue-100/30"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-blue-100/80 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-white/5 border border-white/10 focus:border-purple-500 text-white rounded-lg p-3 w-full outline-none transition-all placeholder-blue-100/30"
                  placeholder="+233..."
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-blue-100/80 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-white/5 border border-white/10 focus:border-purple-500 text-white rounded-lg p-3 w-full outline-none transition-all resize-none placeholder-blue-100/30"
                  placeholder="Your message here..."
                />
              </div>

              {errorMessage && (
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {errorMessage}
                </div>
              )}

              {isSuccess && (
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-green-300 text-sm flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                  <span>Thank you for your message! I will get back to you soon.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
