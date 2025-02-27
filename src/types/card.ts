export interface CardData {
  templateId: string;
  fontFamily: string;
  greetingText: string;
  senderName: string;
  backgroundImage: string;
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