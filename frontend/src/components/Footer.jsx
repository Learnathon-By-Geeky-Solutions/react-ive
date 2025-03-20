import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{ background: 'linear-gradient(135deg, #D0A6FF 0%, #9B6BBF 50%, #7A5FB1 100%)' }} className="text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="mb-6 md:mb-0">
            <h3 className="font-bold text-xl mb-4">JobNode</h3>
            <p className="text-gray-200 mb-4">Connecting talent with opportunity through innovative technology solutions.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Jobs</a></li>
              <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Employers</a></li>
              <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Career Advice</a></li>
              <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-200 hover:text-white transition-colors">API Docs</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-200">
              <li>1234 Market Street</li>
              <li>Suite 1000</li>
              <li>San Francisco, CA 94103</li>
              <li className="mt-4"><a href="mailto:contact@jobnode.com" className="hover:text-white transition-colors">contact@jobnode.com</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-200 mb-4 md:mb-0">© {currentYear} JobNode. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-200 hover:text-white transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-gray-200 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-200 hover:text-white transition-colors text-sm">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;