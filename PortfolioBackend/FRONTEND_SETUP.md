# React Frontend Configuration for Mobile Device Access

This guide provides the configuration files needed to allow your React frontend to be accessible from mobile devices on your local network.

## Files to Update in Your React Frontend Project

### 1. Contact.tsx

Update the API_BASE_URL constant to use your computer's local IP address:

```tsx
import React, { useState } from 'react';

const API_BASE_URL = 'http://192.168.1.15:8000';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Message sent successfully!',
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <h2>Contact Me</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="phone">Phone (Optional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>

        {submitStatus.type && (
          <div className={`status ${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default Contact;
```

### 2. vite.config.ts

Update the Vite configuration to listen on all network interfaces:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173, // or your preferred port
    strictPort: true,
  },
});
```

## How to Find Your Local IP Address

### Windows:
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x or 10.x.x.x)

### macOS/Linux:
```bash
ifconfig
# or
ip addr show
```
Look for your local network IP (usually starts with 192.168.x.x or 10.x.x.x)

### Quick Method:
1. Open Command Prompt (Windows) or Terminal (Mac/Linux)
2. Run the command above
3. Find the IP address that's not 127.0.0.1 (localhost)
4. Replace `192.168.1.15` in Contact.tsx with your actual IP address

## Steps to Test on Mobile Device

1. **Update Contact.tsx** with your computer's local IP address
2. **Update vite.config.ts** with the server configuration
3. **Start the Laravel backend:**
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```
4. **Start the React frontend:**
   ```bash
   npm run dev
   ```
5. **On your mobile device:**
   - Connect to the same Wi-Fi network as your computer
   - Open a browser and navigate to: `http://YOUR_IP_ADDRESS:5173`
   - Example: `http://192.168.1.15:5173`

## Important Notes

- Both devices (computer and phone) must be on the same Wi-Fi network
- Make sure your firewall allows incoming connections on ports 5173 (Vite) and 8000 (Laravel)
- The IP address `192.168.1.15` is a placeholder - replace it with your actual local IP
- For production, use environment variables instead of hardcoding the IP address

## Environment Variable Alternative (Recommended)

Create a `.env` file in your React project:

```env
VITE_API_BASE_URL=http://192.168.1.15:8000
```

Then in Contact.tsx:
```tsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
```

This allows you to easily change the API URL without modifying code.

