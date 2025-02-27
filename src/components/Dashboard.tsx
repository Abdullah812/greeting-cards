import React from 'react';
import { Link } from 'react-router-dom';
import { useCardContext } from '../context/CardContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { cards, deleteCard } = useCardContext();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-800">لوحة التحكم</h1>
        
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">البطاقات</h2>
        </div>
        
        {cards.length === 0 ? (
          <p className="text-gray-500 text-center py-8">لا توجد بطاقات</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map(card => (
              <div key={card.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div 
                  className="h-48 bg-cover bg-center relative" 
                  style={{ backgroundImage: `url(${card.backgroundImage})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
                    <p 
                      className="text-center"
                      style={{ 
                        color: card.textColor, 
                        fontSize: `${Math.min(card.fontSize, 24)}px`,
                        fontFamily: card.fontFamily 
                      }}
                    >
                      {card.text}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mt-4 flex justify-between">
                    <div className="flex space-x-2 space-x-reverse">
                      <Link 
                        to={`/editor/${card.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span>تعديل</span>
                      </Link>
                      <button 
                        onClick={() => deleteCard(card.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>حذف</span>
                      </button>
                    </div>
                    <Link 
                      to={`/view/${card.id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      عرض
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;