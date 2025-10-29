import React from 'react';
import '../Apimanage-styles.css';

const ModelSelector = ({ models, selectedModel, onModelSelect }) => {
  return (
    <section className="api-card">
      <div className="api-card-header">
        <div className="api-card-icon" style={{background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(34, 197, 94, 0.4)'}}>
          <svg style={{width: '1rem', height: '1rem', color: '#22c55e'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="api-card-title">사용 가능한 AI 모델</h2>
          <p style={{fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)'}}>테스트할 모델을 선택하세요</p>
        </div>
      </div>
      
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem'}}>
          모델 선택
        </label>
        <select 
          value={selectedModel?.id || ''}
          onChange={(e) => onModelSelect(e.target.value)}
          className="api-select"
        >
          <option value="">-- 모델을 선택하세요 --</option>
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.version})
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default ModelSelector;