import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCardContext } from '../context/CardContext';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { ArrowRight, Download, Share2, Edit, Facebook, MessageCircle } from 'lucide-react';

const CardView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCard, categories } = useCardContext();
  const [card, setCard] = useState<any>(null);
  const [category, setCategory] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      const foundCard = getCard(id);
      if (foundCard) {
        setCard(foundCard);
        const foundCategory = categories.find(c => c.id === foundCard.categoryId);
        setCategory(foundCategory?.name || '');
      } else {
        navigate('/');
      }
    }
  }, [id, getCard, categories, navigate]);

  useEffect(() => {
    if (id) {
      const url = `${window.location.origin}/view/${id}`;
      setShareUrl(url);
    }
  }, [id]);

  const downloadImage = async () => {
    if (cardRef.current) {
      try {
        setIsExporting(true);
        
        // Create a filter function to avoid CORS issues with external stylesheets
        const filter = (node: HTMLElement) => {
          // Keep all nodes except link elements with external stylesheets
          if (node.tagName === 'LINK' && node.getAttribute('rel') === 'stylesheet') {
            return false;
          }
          return true;
        };
        
        const dataUrl = await toPng(cardRef.current, { 
          quality: 0.95,
          filter,
          skipFonts: false, // Try to include fonts
          fontEmbedCSS: document.querySelector('style')?.innerHTML || '', // Include inline styles
          backgroundColor: '#ffffff'
        });
        
        saveAs(dataUrl, `بطاقة-${card.title.replace(/\s+/g, '-')}.png`);
      } catch (error) {
        console.error('Error generating image:', error);
        alert('حدث خطأ أثناء تصدير الصورة. يرجى المحاولة مرة أخرى.');
      } finally {
        setIsExporting(false);
      }
    }
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const text = `${card.text} - شاهد البطاقة: ${shareUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (!card) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">جاري تحميل البطاقة...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
        >
          <ArrowRight className="h-5 w-5 ml-1" />
          <span>العودة إلى لوحة التحكم</span>
        </button>
        <h1 className="text-3xl font-bold text-purple-800 mr-4">عرض البطاقة</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{card.title}</h2>
              <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                {category}
              </span>
            </div>
            <div 
              ref={cardRef} 
              className="w-full h-[600px] bg-no-repeat rounded-lg overflow-hidden relative"
              style={{ 
                backgroundImage: `url(${card.backgroundImage})`,
                backgroundColor: '#f3f4f6',
                backgroundSize: 'contain',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0">
                <div 
                  className="absolute flex flex-col gap-4 w-full"
                  style={{
                    top: `${card.styles?.position?.vertical || 80}%`,
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div 
                    className="bg-black rounded-lg whitespace-nowrap text-center mx-auto"
                    style={{ 
                      backgroundColor: `rgba(0, 0, 0, ${card.styles?.nameBoxOpacity || 0.3})`,
                      padding: `${card.styles?.textPadding?.vertical || 8}px ${card.styles?.textPadding?.horizontal || 24}px`
                    }}
                  >
                    <p 
                      className="text-white text-shadow"
                      style={{ 
                        fontSize: `${card.styles?.nameSize || 24}px`,
                        fontFamily: card.fontFamily,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      {card.text.split('\n\n')[1] || 'الاسم'}
                    </p>
                  </div>

                  <div 
                    className="bg-black rounded-lg whitespace-nowrap text-center mx-auto"
                    style={{ 
                      backgroundColor: `rgba(0, 0, 0, ${card.styles?.jobBoxOpacity || 0.3})`,
                      padding: `${card.styles?.textPadding?.vertical || 8}px ${card.styles?.textPadding?.horizontal || 24}px`
                    }}
                  >
                    <p 
                      className="text-white text-shadow"
                      style={{ 
                        fontSize: `${card.styles?.fontSize || 32}px`,
                        fontFamily: card.fontFamily,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      {card.text.split('\n\n')[0] || 'المهنة'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">مشاركة البطاقة</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">رابط المشاركة</label>
              <div className="flex">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-grow border border-gray-300 rounded-r-lg px-4 py-2"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    alert('تم نسخ الرابط!');
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-l-lg hover:bg-purple-700 transition-colors"
                >
                  نسخ
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={shareToFacebook}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span>مشاركة على فيسبوك</span>
              </button>
              <button
                onClick={shareToWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>مشاركة على واتساب</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">خيارات</h2>
            <div className="space-y-3">
              <button
                onClick={downloadImage}
                disabled={isExporting}
                className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 w-full transition-colors ${isExporting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Download className="h-5 w-5" />
                <span>{isExporting ? 'جاري التصدير...' : 'تحميل كصورة'}</span>
              </button>
              <Link
                to={`/editor/${id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 w-full transition-colors"
              >
                <Edit className="h-5 w-5" />
                <span>تعديل البطاقة</span>
              </Link>
              <button
                onClick={() => {
                  const text = `${card.text}`;
                  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                  window.open(url, '_blank');
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 w-full transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span>مشاركة النص فقط</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">معلومات البطاقة</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex justify-between">
                <span className="font-medium">التصنيف:</span>
                <span>{category}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">نوع الخط:</span>
                <span>{fontFamilyToArabic(card.fontFamily)}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">حجم الخط:</span>
                <span>{card.fontSize}px</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">لون النص:</span>
                <span className="flex items-center">
                  <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: card.textColor }}></span>
                  {card.textColor}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

function fontFamilyToArabic(fontFamily: string): string {
  const fontMap: Record<string, string> = {
    'Amiri': 'أميري',
    'Cairo': 'القاهرة',
    'Tajawal': 'تجوال',
    'Scheherazade New': 'شهرزاد',
    'Noto Sans Arabic': 'نوتو سانس'
  };
  
  return fontMap[fontFamily] || fontFamily;
}

export default CardView;