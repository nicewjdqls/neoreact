import React from 'react';
import '../Apimanage-styles.css';

const ResponseDisplay = ({ apiResult, sampleCode }) => {
  return (
    <div style={{marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <div>
        <h3 style={{
          fontSize: '0.875rem', 
          fontWeight: '600', 
          color: 'rgba(255, 255, 255, 0.9)', 
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <svg style={{width: '1rem', height: '1rem', color: '#22c55e'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          응답 결과
        </h3>
        <div className="code-block" style={{maxHeight: '16rem', overflowY: 'auto'}}>
          {apiResult}
        </div>
      </div>

      <div>
        <h3 style={{
          fontSize: '0.875rem', 
          fontWeight: '600', 
          color: 'rgba(255, 255, 255, 0.9)', 
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <svg style={{width: '1rem', height: '1rem', color: '#3b82f6'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          샘플 코드 (JavaScript fetch)
        </h3>
        <div className="code-block" style={{maxHeight: '16rem', overflowY: 'auto', background: 'rgba(0, 0, 0, 0.5)'}}>
          {sampleCode}
        </div>
      </div>
    </div>
  );
};

export default ResponseDisplay;