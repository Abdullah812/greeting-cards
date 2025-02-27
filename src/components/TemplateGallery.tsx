import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardContext } from '../context/CardContext';
import { X, Copy } from 'lucide-react';

interface TemplateGalleryProps {
  categoryId: string;
  onClose: () => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ categoryId, onClose }) => {
  const { getTemplatesByCategory, useTemplate, addCard, categories } = useCardContext();
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId);
  
  const templates = getTemplatesByCategory(selectedCategoryId);
  const category = categories.find(c => c.id === selectedCategoryId);

  const handleUseTemplate = (templateId: string) => {
    const cardData = useTemplate(templateId);
    const newCardId = Date.now().toString();
    addCard({ ...cardData, id: newCardId });
    navigate(`/editor/${newCardId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">
            قوالب {category?.name || 'المناسبات'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategoryId === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6">
          {templates.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد قوالب في هذا التصنيف</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <div key={template.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div 
                    className="h-48 bg-cover bg-center relative" 
                    style={{ backgroundImage: `url(${template.backgroundImage})` }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
                      <p 
                        className="text-center" 
                        style={{ 
                          color: template.textColor, 
                          fontSize: `${Math.min(template.fontSize, 24)}px`,
                          fontFamily: template.fontFamily,
                          whiteSpace: 'pre-line'
                        }}
                      >
                        {template.text}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-lg text-gray-800">{template.title}</h3>
                    </div>
                    <button
                      onClick={() => handleUseTemplate(template.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full transition-colors"
                    >
                      <Copy className="h-5 w-5" />
                      <span>استخدام هذا القالب</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;