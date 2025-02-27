import React, { createContext, useState, useEffect, useContext } from 'react';

export interface Category {
  id: string;
  name: string;
}

export interface Card {
  id: string;
  title: string;
  categoryId: string;
  backgroundImage: string;
  text: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  styles?: {
    fontSize: number;
    nameSize: number;
    nameBoxOpacity: number;
    jobBoxOpacity: number;
    verticalSpacing: number;
    textPadding: {
      horizontal: number;
      vertical: number;
    };
    position: {
      vertical: number;
      horizontal: number;
    };
    textAlignment: string;
  };
}

export interface Template {
  id: string;
  title: string;
  categoryId: string;
  backgroundImage: string;
  text: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
}

export interface CardData {
  templateId: string;
  fontFamily: string;
  greetingText: string;
  senderName: string;
  backgroundImage: string;
  styles: {
    fontSize: number;
    nameSize: number;
    nameBoxOpacity: number;
    jobBoxOpacity: number;
    verticalSpacing: number;
    textPadding: {
      horizontal: number;
      vertical: number;
    };
    position: {
      vertical: number;
      horizontal: number;
    };
    textAlignment: string;
  };
}

interface CardContextType {
  cards: Card[];
  categories: Category[];
  templates: Template[];
  addCard: (card: Omit<Card, 'id'>) => void;
  updateCard: (id: string, card: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  getCard: (id: string) => Card | undefined;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getTemplatesByCategory: (categoryId: string) => Template[];
  useTemplate: (templateId: string) => Omit<Card, 'id'>;
  createCardFromTemplate: (data: CardData) => string | undefined;
}

export const CardContext = createContext<CardContextType | undefined>(undefined);

const defaultCards: Card[] = [];
const defaultCategories: Category[] = [
  { id: '1', name: 'بطاقات مخصصة' }
];
const defaultTemplates: Template[] = [];

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>(() => {
    const savedCards = localStorage.getItem('cards');
    return savedCards ? JSON.parse(savedCards) : defaultCards;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
  });

  const [templates] = useState<Template[]>(defaultTemplates);

  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addCard = (card: Omit<Card, 'id'>) => {
    const newCard = {
      ...card,
      id: Date.now().toString(),
    };
    setCards([...cards, newCard]);
  };

  const updateCard = (id: string, updatedCard: Partial<Card>) => {
    setCards(cards.map(card => (card.id === id ? { ...card, ...updatedCard } : card)));
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const getCard = (id: string) => {
    return cards.find(card => card.id === id);
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, updatedCategory: Partial<Category>) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, ...updatedCategory } : category
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const getTemplatesByCategory = (categoryId: string) => {
    return templates.filter(template => template.categoryId === categoryId);
  };

  const useTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    
    const { id, ...cardData } = template;
    return {
      ...cardData,
      title: `${cardData.title} - نسخة`,
    };
  };

  const createCardFromTemplate = (data: CardData) => {
    console.log('Creating card with data:', data);

    if (data.templateId.startsWith('custom-')) {
      // تحويل الصورة إلى URL نسبي إذا كانت مسار ملف
      let imageUrl = data.backgroundImage;
      if (imageUrl.startsWith('/') || imageUrl.startsWith('src/')) {
        // إذا كان المسار نسبي، نحوله إلى URL كامل
        imageUrl = new URL(imageUrl, window.location.origin).href;
      }

      const newCard: Card = {
        id: `card-${Date.now()}`,
        title: 'بطاقة مخصصة',
        categoryId: '5',
        backgroundImage: imageUrl, // استخدام URL المعدل
        text: `${data.greetingText}\n\n${data.senderName}`,
        textColor: '#ffffff',
        fontSize: data.styles.fontSize,
        fontFamily: data.fontFamily,
        styles: {
          fontSize: data.styles.fontSize,
          nameSize: data.styles.nameSize,
          nameBoxOpacity: data.styles.nameBoxOpacity,
          jobBoxOpacity: data.styles.jobBoxOpacity,
          verticalSpacing: data.styles.verticalSpacing,
          textPadding: data.styles.textPadding,
          position: data.styles.position,
          textAlignment: data.styles.textAlignment
        }
      };

      // تأكد من أن الصورة موجودة قبل حفظ البطاقة
      const img = new Image();
      img.onload = () => {
        console.log('Image loaded successfully');
        setCards(prev => [...prev, newCard]);
      };
      img.onerror = () => {
        console.error('Failed to load image:', imageUrl);
        // يمكنك هنا إضافة معالجة الخطأ أو استخدام صورة احتياطية
      };
      img.src = imageUrl;

      return newCard.id;
    }

    // القالب العادي
    const template = templates.find(t => t.id === data.templateId);
    if (!template) {
      console.error('Template not found:', data.templateId);
      return;
    }

    const newCard: Card = {
      id: `card-${Date.now()}`,
      title: template.title,
      categoryId: template.categoryId,
      backgroundImage: template.backgroundImage,
      text: `${data.greetingText}\n\n${data.senderName}`,
      textColor: template.textColor,
      fontSize: template.fontSize,
      fontFamily: data.fontFamily,
    };

    setCards(prev => [...prev, newCard]);
    return newCard.id;
  };

  return (
    <CardContext.Provider
      value={{
        cards,
        categories,
        templates,
        addCard,
        updateCard,
        deleteCard,
        getCard,
        addCategory,
        updateCategory,
        deleteCategory,
        getTemplatesByCategory,
        useTemplate,
        createCardFromTemplate,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
};

export const arabicFonts = [
  { value: 'Amiri', label: 'أميري' },
  { value: 'Cairo', label: 'القاهرة' },
  { value: 'Tajawal', label: 'تجوال' },
  { value: 'Almarai', label: 'المراعي' },
  { value: 'Reem Kufi', label: 'ريم كوفي' },
  { value: 'Aref Ruqaa', label: 'عارف رقعة' },
  { value: 'Lateef', label: 'لطيف' },
  { value: 'Changa', label: 'شنغا' },
  { value: 'IBM Plex Sans Arabic', label: 'IBM بلكس' }
];