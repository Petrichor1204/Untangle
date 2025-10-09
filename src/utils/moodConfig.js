// moodConfig.js - Mood options and style recommendations

export const MOOD_OPTIONS = [
  { id: 'amazing', emoji: '🤩', label: 'Amazing', color: 'bg-green-100 border-green-500' },
  { id: 'confident', emoji: '😊', label: 'Confident', color: 'bg-blue-100 border-blue-500' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: 'bg-yellow-100 border-yellow-500' },
  { id: 'frustrated', emoji: '😤', label: 'Frustrated', color: 'bg-orange-100 border-orange-500' },
  { id: 'discouraged', emoji: '😔', label: 'Discouraged', color: 'bg-red-100 border-red-500' }
];

export const STYLE_RECOMMENDATIONS = {
  amazing: {
    title: "Show It Off! 💁‍♀️",
    styles: [
      "Try a bold new protective style like passion twists",
      "Experiment with hair accessories and decorative clips",
      "Rock a high puff or statement updo",
      "Try a twist-out or braid-out for defined curls"
    ]
  },
  confident: {
    title: "Keep the Momentum Going! ✨",
    styles: [
      "Maintain your current routine - it's working!",
      "Try a subtle variation of your go-to style",
      "Add some edge styling for a polished look",
      "Experiment with half-up, half-down styles"
    ]
  },
  okay: {
    title: "Easy & Comfortable 🌸",
    styles: [
      "Go for a simple bun or low ponytail",
      "Try a headwrap or scarf style",
      "Opt for two-strand twists for easy maintenance",
      "Use a protective style to give your hair a break"
    ]
  },
  frustrated: {
    title: "Low-Maintenance Styles 🧘‍♀️",
    styles: [
      "Give your hair a break with box braids or cornrows",
      "Try a simple slicked-back bun",
      "Use a satin bonnet and embrace wash-and-go",
      "Focus on deep conditioning before styling"
    ]
  },
  discouraged: {
    title: "Gentle Self-Care First 💜",
    styles: [
      "Start with a deep conditioning treatment",
      "Try protective styles that require minimal manipulation",
      "Consider a simple twist or braid style",
      "Focus on scalp care and moisturizing routine"
    ],
    encouragement: "Remember: Hair journeys have ups and downs. Be patient with yourself! 💕"
  }
};

// Helper function to get mood emoji
export const getMoodEmoji = (moodId) => {
  const mood = MOOD_OPTIONS.find(m => m.id === moodId);
  return mood ? mood.emoji : '😊';
};

// Helper function to get mood label
export const getMoodLabel = (moodId) => {
  const mood = MOOD_OPTIONS.find(m => m.id === moodId);
  return mood ? mood.label : 'Confident';
};