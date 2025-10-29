import React from 'react';
import './Chat-styles.css';

const MessageSatisfaction = ({ messageIndex, currentRating, onRate }) => {
  const ratings = [
    { value: '매우만족', label: '매우만족', emoji: '😊', color: '#22c55e' },
    { value: '만족', label: '만족', emoji: '🙂', color: '#3b82f6' },
    { value: '보통', label: '보통', emoji: '😐', color: '#f59e0b' },
    { value: '불만족', label: '불만족', emoji: '😕', color: '#f97316' },
    { value: '매우불만족', label: '매우불만족', emoji: '😞', color: '#ef4444' }
  ];

  if (currentRating) {
    const selectedRating = ratings.find(r => r.value === currentRating);
    if (!selectedRating) return null;
    
    return (
      <div className="message-rating-completed">
        <div className="rating-completed-content">
          <div className="rating-selected-item" style={{ color: selectedRating.color }}>
            <span className="rating-emoji-completed">{selectedRating.emoji}</span>
            <span className="rating-label-completed">{selectedRating.label}</span>
          </div>
          <div className="rating-check-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>평가완료</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-rating-inline">
      <span className="rating-title-inline">이 답변이 도움이 되었나요?</span>
      <div className="rating-options-inline">
        {ratings.map((rating) => (
          <label 
            key={rating.value}
            className="rating-option-inline"
            title={rating.label}
          >
            <input
              type="radio"
              name={`rating-${messageIndex}`}
              value={rating.value}
              onChange={() => onRate(messageIndex, rating.value)}
              className="rating-radio"
            />
            <div className="rating-item-content">
              <span className="rating-emoji-inline">{rating.emoji}</span>
              <span className="rating-label-inline">{rating.label}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MessageSatisfaction;