import React from 'react';
import '../Apimanage-styles.css';

const ModelInfo = ({ selectedModel }) => {
  return (
    <section className="api-card">
      <div className="api-card-header">
        <div className="api-card-icon" style={{background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.4)'}}>
          <svg style={{width: '1rem', height: '1rem', color: '#a855f7'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="api-card-title">선택된 모델 정보</h2>
          <p style={{fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)'}}>선택한 모델의 상세 정보</p>
        </div>
      </div>
      
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)', 
        borderRadius: '0.5rem', 
        padding: '1rem', 
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {selectedModel ? (
          <div className="model-info">
            <div className="model-info-item">
              <div className="model-info-label">모델명</div>
              <div className="model-info-value">{selectedModel.name}</div>
            </div>
            <div className="model-info-item">
              <div className="model-info-label">버전</div>
              <div className="model-info-value">{selectedModel.version}</div>
            </div>
            <div className="model-info-item">
              <div className="model-info-label">카테고리</div>
              <div className="model-info-value">{selectedModel.category}</div>
            </div>
            <div className="model-info-item">
              <div className="model-info-label">모델 ID</div>
              <div className="model-info-value" style={{
                fontFamily: 'monospace', 
                fontSize: '0.8125rem',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem'
              }}>
                {selectedModel.id}
              </div>
            </div>
            <div className="model-info-item" style={{gridColumn: '1 / -1'}}>
              <div className="model-info-label">설명</div>
              <div className="model-info-value" style={{lineHeight: '1.6'}}>{selectedModel.description}</div>
            </div>
          </div>
        ) : (
          <p style={{color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', padding: '2rem 0'}}>
            모델을 선택하세요.
          </p>
        )}
      </div>
    </section>
  );
};

export default ModelInfo;