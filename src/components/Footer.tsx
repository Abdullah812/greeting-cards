import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-amber-200 text-amber-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-center md:text-right">
              جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - بطاقات المعايدة مناسك المشاعر
            </p>
          </div>
          <div className="flex items-center justify-center">
            <span>صنع بكل حب عبدالله مقيص</span>
            <Heart className="h-4 w-4 mx-1 text-amber-600 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;