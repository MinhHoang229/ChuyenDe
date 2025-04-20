import React from 'react';
import { assets } from '../assets/assets'; // Assuming you have a logo in your assets

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-16 mt-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14 mb-10">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-indigo-400 cursor-pointer">Home</li>
              <li className="hover:text-indigo-400 cursor-pointer">Collection</li>
              <li className="hover:text-indigo-400 cursor-pointer">About</li>
              <li className="hover:text-indigo-400 cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li>Email: info@example.com</li>
              <li>Phone: +1 234 567 890</li>
              <li>Address: 123 Street, City</li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400">
                <i className="fab fa-facebook"></i> {/* Add icon for Facebook */}
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400">
                <i className="fab fa-twitter"></i> {/* Add icon for Twitter */}
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400">
                <i className="fab fa-instagram"></i> {/* Add icon for Instagram */}
              </a>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <form>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-md text-gray-700"
                placeholder="Enter your email"
              />
              <button className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-600 pt-6 mt-6 text-center text-sm text-gray-400">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <img src={assets.logo} alt="Logo" className="h-10" /> {/* Display logo */}
            <span>© 2024 Your Store. All rights reserved.</span>
          </div>
          <div className="space-x-6">
            <a href="#" className="hover:text-indigo-400">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-400">Terms of Service</a>
            <a href="#" className="hover:text-indigo-400">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
