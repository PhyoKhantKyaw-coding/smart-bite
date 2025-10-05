
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => (
  <footer className="w-full bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 mt-8">
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
      {/* Logo and Brand */}
      <div className="flex flex-col items-center md:items-start">
        <span className="text-2xl font-bold text-yellow-500">Smart Bite</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Delicious food, delivered fast.</span>
      </div>



      {/* Social & Contact */}
      <div className="flex flex-col items-center md:items-end gap-2">
        <div className="flex gap-3 mb-2">
          <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook" className="text-gray-500 hover:text-blue-600"><Facebook size={20} /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" className="text-gray-500 hover:text-pink-500"><Instagram size={20} /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter" className="text-gray-500 hover:text-blue-400"><Twitter size={20} /></a>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">support@smartbite.com | +1 (555) 123-4567</span>
      </div>
    </div>
    <div className="text-center text-xs text-gray-400 py-2 border-t border-gray-100 dark:border-zinc-700">
      © 2025 Smart Bite. All rights reserved.
    </div>
  </footer>
);

export default Footer;
