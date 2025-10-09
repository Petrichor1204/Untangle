// MoodSelector.js - Reusable mood selector component
import React from 'react';
import { MOOD_OPTIONS } from '../utils/moodConfig';

const MoodSelector = ({ selectedMood, onMoodChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        How are you feeling about your hair today?
      </label>
      <div className="grid grid-cols-5 gap-2">
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodChange(mood.id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedMood === mood.id
                ? mood.color + ' scale-105'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-3xl mb-1">{mood.emoji}</div>
            <div className="text-xs font-medium text-gray-700">{mood.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;