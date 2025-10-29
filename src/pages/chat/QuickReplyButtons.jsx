import React from 'react';
import './Chat-styles.css';

const QuickReplyButtons = ({ prompts, onSelect }) => {
  if (!prompts || prompts.length === 0) return null;

  const handleClick = (prompt, e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(prompt);
  };

  return (
    <div className="quick-reply-container">
      <div className="quick-reply-buttons">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            className="quick-reply-btn"
            onClick={(e) => handleClick(prompt, e)}
            onMouseDown={(e) => e.preventDefault()} // 즉시 반응하도록
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplyButtons;