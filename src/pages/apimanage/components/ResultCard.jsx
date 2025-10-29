import React from 'react';
import '../Apimanage-styles.css';

const ResultCard = ({ result, onClick, onDelete }) => {
  return (
    <div 
      className="result-card"
      onClick={onClick}
    >
      <div className="result-card-header">
        <div className="result-card-content">
          <div className="result-card-title">
            <span className={`result-status ${result.success ? 'success' : 'error'}`}>
              {result.success ? '✓' : '✗'}
            </span>
            <h3 className="result-model-name">{result.model.name}</h3>
          </div>
          <div className="result-endpoint">{result.endpoint}</div>
          <div className="result-timestamp">
            {new Date(result.timestamp).toLocaleString()}
          </div>
        </div>
        <button 
          className="result-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          삭제
        </button>
      </div>
      
      <div className="result-card-footer">
        <div className="result-card-hint">
          <svg style={{width: '0.875rem', height: '0.875rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          클릭하여 상세 정보를 불러오기
        </div>
      </div>
    </div>
  );
};

export default ResultCard;