import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-amber-200 to-yellow-100 text-amber-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <img 
            src="src/images/الشعار.png" 
            alt="شعار مناسك المشاعر" 
            className="h-10 w-auto"
          />
          <Sparkles className="h-8 w-8" />
          <span>بطاقات المعايدة مناسك المشاعر</span>
        </Link>
        <nav>
          <ul className="flex space-x-6 space-x-reverse">
            <li>
              <Link to="/" className="hover:text-amber-600 transition-colors">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link to="/create" className="hover:text-amber-600 transition-colors">
                إنشاء بطاقة جديدة
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;