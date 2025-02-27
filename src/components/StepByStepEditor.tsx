import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardContext } from '../context/CardContext';
import { ChevronRight, ChevronLeft, Eye } from 'lucide-react';
import backgroundImage from '../images/رمضان مبارك.png';
import { arabicFonts } from '../context/CardContext';

interface StepProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
}

const StepNavigation: React.FC<StepProps> = ({ currentStep, totalSteps, onNext, onPrev }) => (
  <div className="flex justify-between items-center mt-6">
    <button
      onClick={onPrev}
      disabled={currentStep === 1}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        currentStep === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'
      }`}
    >
      <ChevronRight className="h-5 w-5" />
      <span>السابق</span>
    </button>
    <span className="text-gray-600">
      الخطوة {currentStep} من {totalSteps}
    </span>
    <button
      onClick={onNext}
      disabled={currentStep === totalSteps}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        currentStep === totalSteps ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'
      }`}
    >
      <span>التالي</span>
      <ChevronLeft className="h-5 w-5" />
    </button>
  </div>
);

const StepByStepEditor: React.FC = () => {
  const navigate = useNavigate();
  const { createCardFromTemplate } = useCardContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    job: '',
    fontSize: 32,
    nameSize: 24,
    fontFamily: 'Cairo',
    backgroundImage: backgroundImage,
    textPosition: 'bottom',
    textAlignment: 'center',
    nameBoxOpacity: 0.3,
    jobBoxOpacity: 0.3,
    verticalSpacing: 20,
    textPadding: {
      horizontal: 24,
      vertical: 8,
    },
    position: {
      vertical: 80,
      horizontal: 50
    }
  });

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 2));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    const cardId = createCardFromTemplate({
      templateId: 'custom-1',
      fontFamily: formData.fontFamily,
      greetingText: formData.job,
      senderName: formData.name,
      backgroundImage: formData.backgroundImage,
      styles: {
        fontSize: formData.fontSize,
        nameSize: formData.nameSize,
        nameBoxOpacity: formData.nameBoxOpacity,
        jobBoxOpacity: formData.jobBoxOpacity,
        verticalSpacing: formData.verticalSpacing,
        textPadding: formData.textPadding,
        position: formData.position,
        textAlignment: 'center'
      }
    });
    
    if (cardId) {
      navigate(`/view/${cardId}`);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, backgroundImage: imageUrl });
    }
  };

  const renderNameAndJob = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">أدخل بياناتك</h2>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">اختر صورة الخلفية</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-purple-500 transition-colors"
            >
              <span className="text-gray-600">رفع صورة من جهازك</span>
            </label>
          </div>
          <button
            onClick={() => setFormData({ ...formData, backgroundImage: backgroundImage })}
            className={`p-4 border-2 rounded-lg ${
              formData.backgroundImage === backgroundImage
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <span className="text-gray-600">استخدام الصورة الافتراضية</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div
          className="h-[400px] bg-contain bg-center bg-no-repeat rounded-lg relative"
          style={{ 
            backgroundImage: `url(${formData.backgroundImage})`,
            backgroundColor: '#f3f4f6'
          }}
        >
          <div className="absolute inset-0">
            <div 
              className="absolute flex flex-col gap-4"
              style={{
                top: `${formData.position.vertical}%`,
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div 
                className="bg-black rounded-lg whitespace-nowrap text-center"
                style={{ 
                  backgroundColor: `rgba(0, 0, 0, ${formData.nameBoxOpacity})`,
                  padding: `${formData.textPadding.vertical}px ${formData.textPadding.horizontal}px`
                }}
              >
                <p 
                  className="text-white text-shadow"
                  style={{ 
                    fontSize: `${formData.nameSize}px`,
                    fontFamily: formData.fontFamily,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {formData.name || 'الاسم'}
                </p>
              </div>

              <div 
                className="bg-black rounded-lg whitespace-nowrap text-center"
                style={{ 
                  backgroundColor: `rgba(0, 0, 0, ${formData.jobBoxOpacity})`,
                  padding: `${formData.textPadding.vertical}px ${formData.textPadding.horizontal}px`
                }}
              >
                <p 
                  className="text-white text-shadow"
                  style={{ 
                    fontSize: `${formData.fontSize}px`,
                    fontFamily: formData.fontFamily,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {formData.job || 'المهنة'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">موضع النص</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">الموضع العمودي (%)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.position.vertical}
                onChange={(e) => setFormData({
                  ...formData,
                  position: {
                    ...formData.position,
                    vertical: parseInt(e.target.value)
                  }
                })}
                className="w-full"
              />
              <span className="text-sm text-gray-600 w-12">
                {formData.position.vertical}%
              </span>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">الموضع الأفقي (%)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.position.horizontal}
                onChange={(e) => setFormData({
                  ...formData,
                  position: {
                    ...formData.position,
                    horizontal: parseInt(e.target.value)
                  }
                })}
                className="w-full"
              />
              <span className="text-sm text-gray-600 w-12">
                {formData.position.horizontal}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">المسافة بين المستطيلين</label>
        <input
          type="range"
          min="0"
          max="50"
          value={formData.verticalSpacing}
          onChange={(e) => setFormData({ ...formData, verticalSpacing: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">المسافة الأفقية للنص</label>
          <input
            type="range"
            min="8"
            max="48"
            value={formData.textPadding.horizontal}
            onChange={(e) => setFormData({
              ...formData,
              textPadding: {
                ...formData.textPadding,
                horizontal: parseInt(e.target.value)
              }
            })}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">المسافة العمودية للنص</label>
          <input
            type="range"
            min="4"
            max="24"
            value={formData.textPadding.vertical}
            onChange={(e) => setFormData({
              ...formData,
              textPadding: {
                ...formData.textPadding,
                vertical: parseInt(e.target.value)
              }
            })}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">موضع النص</label>
          <select
            value={formData.textPosition}
            onChange={(e) => setFormData({ ...formData, textPosition: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="top">أعلى الصورة</option>
            <option value="center">وسط الصورة</option>
            <option value="bottom">أسفل الصورة</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">محاذاة النص</label>
          <select
            value={formData.textAlignment}
            onChange={(e) => setFormData({ ...formData, textAlignment: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="right">يمين</option>
            <option value="center">وسط</option>
            <option value="left">يسار</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">حجم الخط</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">حجم خط الاسم</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="16"
                max="80"
                value={formData.nameSize}
                onChange={(e) => setFormData({ ...formData, nameSize: parseInt(e.target.value) })}
                className="w-full"
              />
              <span className="text-sm text-gray-600 w-12">
                {formData.nameSize}px
              </span>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">حجم خط المهنة</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="16"
                max="80"
                value={formData.fontSize}
                onChange={(e) => setFormData({ ...formData, fontSize: parseInt(e.target.value) })}
                className="w-full"
              />
              <span className="text-sm text-gray-600 w-12">
                {formData.fontSize}px
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">أحجام خط الاسم</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFormData({ ...formData, nameSize: 24 })}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                صغير
              </button>
              <button
                onClick={() => setFormData({ ...formData, nameSize: 32 })}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                متوسط
              </button>
              <button
                onClick={() => setFormData({ ...formData, nameSize: 48 })}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                كبير
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">أحجام خط المهنة</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFormData({ ...formData, fontSize: 24 })}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                صغير
              </button>
              <button
                onClick={() => setFormData({ ...formData, fontSize: 32 })}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                متوسط
              </button>
              <button
                onClick={() => setFormData({ ...formData, fontSize: 48 })}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                كبير
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">الاسم</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="أدخل اسمك"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">المهنة</label>
          <input
            type="text"
            value={formData.job}
            onChange={(e) => setFormData({ ...formData, job: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="أدخل مهنتك"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">نوع الخط</label>
          <div className="grid grid-cols-3 gap-4">
            {arabicFonts.map((font) => (
              <button
                key={font.value}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    fontFamily: font.value
                  }));
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.fontFamily === font.value
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <p 
                  className="text-lg mb-2" 
                  style={{ fontFamily: font.value }}
                >
                  {formData.name || 'نموذج النص'}
                </p>
                <span className="text-sm text-gray-600">{font.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-2">معاينة الخط المختار</h3>
          <div 
            className="space-y-2"
            style={{ fontFamily: formData.fontFamily }}
          >
            <p className="text-xl">
              {formData.name || 'الاسم'} - {formData.job || 'المهنة'}
            </p>
            <p className="text-sm text-gray-600">
              أبجد هوز حطي كلمن سعفص قرشت ثخذ ضظغ
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <Eye className="h-5 w-5" />
          <span>إنشاء البطاقة</span>
        </button>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderNameAndJob();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {renderStep()}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={1}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default StepByStepEditor; 