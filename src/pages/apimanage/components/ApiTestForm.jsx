import React from 'react';
import '../Apimanage-styles.css';
import ResponseDisplay from './ResponseDisplay';

const ApiTestForm = ({ 
  endpoint, 
  params, 
  isLoading, 
  apiResult,
  sampleCode,
  onSubmit, 
  onSave, 
  onEndpointChange,
  onParamsChange
}) => {
  return (
    <section className="api-card">
      <div className="api-card-header">
        <div className="api-card-icon" style={{background: 'rgba(249, 115, 22, 0.2)', border: '1px solid rgba(249, 115, 22, 0.4)'}}>
          <svg style={{width: '1rem', height: '1rem', color: '#f97316'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="api-card-title">API 호출 테스트</h2>
          <p style={{fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)'}}>모델 API를 테스트하고 결과를 확인하세요</p>
        </div>
      </div>
      
      <form onSubmit={onSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem'}}>
            엔드포인트
          </label>
          <input 
            type="text" 
            value={endpoint}
            onChange={(e) => onEndpointChange(e.target.value)}
            placeholder="/api/v1/predict"
            className="api-input"
            required 
          />
        </div>
        
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem'}}>
            요청 파라미터 (JSON)
          </label>
          <textarea 
            rows={6}
            value={params}
            onChange={(e) => onParamsChange(e.target.value)}
            className="api-textarea"
            placeholder='{"input": "예시 데이터", "model": "selected_model"}'
          />
        </div>
        
        <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
          <button 
            type="submit" 
            disabled={isLoading}
            className="api-btn api-btn-primary"
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                API 호출 중...
              </>
            ) : (
              <>
                <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                API 호출
              </>
            )}
          </button>
          <button 
            type="button" 
            onClick={onSave}
            className="api-btn api-btn-success"
          >
            <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            설정 저장
          </button>
        </div>
      </form>

      <ResponseDisplay apiResult={apiResult} sampleCode={sampleCode} />
    </section>
  );
};

export default ApiTestForm;