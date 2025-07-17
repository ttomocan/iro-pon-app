// Defines the structure for a single color data entry.
export interface ColorData {
  id: number;
  grade: number; // The certification level (e.g., 3, 2, 1)
  color_name: string; // The traditional Japanese color name (e.g., 珊瑚色)
  system_name: string; // The systematic color name (e.g., 赤みの強い橙色)
  color_code: string; // The hex code for the color (e.g., #F76C5E)
  explanation: string; // A brief explanation of the color.
  pccs_notation: string; // The PCCS notation for the color (e.g., p24+)
  munsell_value: string; // The Munsell value for the color (e.g., 10RP 9/2.5)
}

// Represents the different screens or states of the application.
export enum GameState {
  Home = 'HOME',
  Quiz = 'QUIZ',
  Results = 'RESULTS',
  ColorList = 'COLOR_LIST',
}

// Defines the structure for a single quiz question.
export interface QuizQuestion {
  correctAnswer: ColorData;
  options: string[]; // An array of color names, one of which is the correct answer.
}

// Defines the structure for a color in the Grade 1 gradient quiz.
export interface GradientColorData {
  color_name: string; // The traditional Japanese color name
  system_name: string; // The systematic color name
  color_code: string; // The hex code for the color
  munsell_value: string; // The Munsell value for the color
}

// Defines the structure for a single Grade 1 quiz question.
export interface GradientQuizQuestion {
  id: number;
  // 'lightness' for sorting by brightness, 'saturation' for sorting by saturation.
  type: 'lightness' | 'saturation';
  // Direction of the sort. 'desc' for high-to-low, 'asc' for low-to-high.
  direction: 'desc' | 'asc';
  // The instruction text for the user.
  description: string;
  // The set of colors to be sorted.
  colors: GradientColorData[];
}