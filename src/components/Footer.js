import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="SkyWeb" className="h-12" />
            <div className="text-sm text-gray-600">
              <p className="font-semibold">Strings</p>
              <p className="text-xs text-gray-500">A Product of SkyWeb</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} SkyWeb. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

