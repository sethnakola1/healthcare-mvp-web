import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2024 HealthHorizon. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="/privacy" className="text-sm text-gray-600 hover:text-[#219ebc]">
              Privacy Policy
            </a>
            <a href="/terms" className="text-sm text-gray-600 hover:text-[#219ebc]">
              Terms of Service
            </a>
            <a href="/help" className="text-sm text-gray-600 hover:text-[#219ebc]">
              Help
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;