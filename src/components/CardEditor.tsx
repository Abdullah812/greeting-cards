import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCardContext } from '../context/CardContext';
import { Save, ArrowRight } from 'lucide-react';

const backgroundOptions = [
  { value: 'https://images.unsplash.com/photo-1563889958749-625da26ed355', label: 'عيد الفطر' },
  { value: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9', label: 'رمضان' },
  { value: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16', label: 'عيد الأضحى' },
  { value: 'https://images.unsplash.com/photo-1603826773128-fefac9c22f1c', label: 'مسجد' },
  { value: 'https://images.unsplash.com/photo-1604154858776-6c1b7e8e0fd9', label: 'فانوس رمضان' },
  { value: 'https://images.unsplash.com/photo-1608555855762-2b657eb1c348', label: 'هلال' },
  { value: 'https://images.unsplash.com/photo-1513279922550-250c2129b13a', label: 'زهور' },
  { value: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946', label: 'ربيع' },
];

const fontFamilies = [
  { value: 'Amiri', label: 'أميري' },
  { value: 'Cairo', label: 'القاهرة' },
  { value: 'Tajawal', label: 'تجوال' },
  { value: 'Scheherazade New', label: 'شهرزاد' },
  { value: 'Noto Sans Arabic', label: 'نوتو سانس' },
];

const CardEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { addCard, updateCard, getCard, categories } = useCardContext();

  const [formData, setFormData] = useState({
    title: '',
    categoryId: categories[0]?.id || '',
    backgroundImage: backgroundOptions[0].value,
    text: '',
    textColor: '#ffffff',
    fontSize: 32,
    fontFamily: 'Amiri',
  });

  const [customBackgroundUrl, setCustomBackgroundUrl] = useState('');
  const [useCustomBackground, setUseCustomBackground] = useState(false);

  useEffect(() => {
    if (id) {
      const card = getCard(id);
      if (card) {
        setFormData(card);
        if (!backgroundOptions.some(option => option.value === card.backgroundImage)) {
          setUseCustomBackground(true);
          setCustomBackgroundUrl(card.backgroundImage);
        }
      }
    }
  }, [id, getCard]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, backgroundImage: value }));
  };

  const handleCustomBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBackgroundUrl(e.target.value);
    if (useCustomBackground) {
      setFormData(prev => ({ ...prev, backgroundImage: e.target.value }));
    }
  };

  const toggleCustomBackground = () => {
    const newState = !useCustomBackground;
    setUseCustomBackground(newState);
    if (newState) {
      setFormData(prev => ({ ...prev, backgroundImage: customBackgroundUrl }));
    } else {
      setFormData(prev => ({ ...prev, backgroundImage: backgroundOptions[0].value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateCard(id, formData);
    } else {
      addCard(formData);
    }
    navigate('/');
  };

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
        <h1 className="text-3xl font-bold text-purple-800 mr-4">
          {id ? 'تعديل البطاقة' : 'إنشاء بطاقة جديدة'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                عنوان البطاقة
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="categoryId" className="block text-gray-700 font-medium mb-2">
                التصنيف
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-700 font-medium">
                  صورة الخلفية
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="useCustomBackground"
                    checked={useCustomBackground}
                    onChange={toggleCustomBackground}
                    className="ml-2"
                  />
                  <label htmlFor="useCustomBackground" className="text-sm text-gray-600">
                    استخدام رابط مخصص
                  </label>
                </div>
              </div>

              {useCustomBackground ? (
                <input
                  type="url"
                  id="customBackgroundUrl"
                  value={customBackgroundUrl}
                  onChange={handleCustomBackgroundChange}
                  placeholder="أدخل رابط الصورة"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              ) : (
                <select
                  id="backgroundImage"
                  name="backgroundImage"
                  value={formData.backgroundImage}
                  onChange={handleBackgroundChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  {backgroundOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="text" className="block text-gray-700 font-medium mb-2">
                نص البطاقة
              </label>
              <textarea
                id="text"
                name="text"
                value={formData.text}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="textColor" className="block text-gray-700 font-medium mb-2">
                  لون النص
                </label>
                <input
                  type="color"
                  id="textColor"
                  name="textColor"
                  value={formData.textColor}
                  onChange={handleChange}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="fontSize" className="block text-gray-700 font-medium mb-2">
                  حجم الخط
                </label>
                <input
                  type="number"
                  id="fontSize"
                  name="fontSize"
                  value={formData.fontSize}
                  onChange={handleNumberChange}
                  min="12"
                  max="72"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="fontFamily" className="block text-gray-700 font-medium mb-2">
                نوع الخط
              </label>
              <select
                id="fontFamily"
                name="fontFamily"
                value={formData.fontFamily}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                {fontFamilies.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>{id ? 'تحديث البطاقة' : 'حفظ البطاقة'}</span>
            </button>
          </form>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">معاينة البطاقة</h2>
            <div 
              className="h-80 bg-cover bg-center rounded-lg overflow-hidden relative" 
              style={{ backgroundImage: `url(${formData.backgroundImage})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-8">
                <p 
                  className="text-center" 
                  style={{ 
                    color: formData.textColor, 
                    fontSize: `${formData.fontSize}px`,
                    fontFamily: formData.fontFamily
                  }}
                >
                  {formData.text || 'أدخل نص البطاقة هنا'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">تعليمات</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>أدخل عنوانًا وصفيًا للبطاقة</li>
              <li>اختر التصنيف المناسب للبطاقة</li>
              <li>اختر صورة خلفية من القائمة أو استخدم رابط مخصص</li>
              <li>أدخل نص التهنئة الذي تريد عرضه على البطاقة</li>
              <li>اضبط لون النص وحجمه ونوع الخط حسب رغبتك</li>
              <li>يمكنك رؤية معاينة مباشرة للبطاقة أثناء التحرير</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEditor;