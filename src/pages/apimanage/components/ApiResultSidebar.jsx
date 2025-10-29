import React from 'react';
import ResultCard from './ResultCard';
import '../Apimanage-styles.css';

const ApiResultSidebar = ({ savedResults, onLoadResult, onDeleteResult }) => {
  return (
    <aside className="api-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title-wrapper">
          <div className="sidebar-icon bg-blue">
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="sidebar-title">API 호출 결과</h2>
            <p className="sidebar-subtitle">저장된 호출 기록</p>
          </div>
        </div>
      </div>
      
      <div className="sidebar-content">
        <div className="results-list">
          {savedResults.length === 0 ? (
            <div className="empty-state" style={{
              background: 'transparent',
              padding: '3rem 1.5rem',
              textAlign: 'center'
            }}>
              <svg 
                className="empty-icon" 
                style={{
                  width: '3rem',
                  height: '3rem',
                  margin: '0 auto 1rem',
                  color: 'rgba(255, 255, 255, 0.3)'
                }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="empty-text" style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
                아직 저장된 API 호출 결과가 없습니다
              </p>
            </div>
          ) : (
            savedResults.slice().reverse().map((result, index) => (
              <ResultCard
                key={index}
                result={result}
                onClick={() => onLoadResult(result)}
                onDelete={() => onDeleteResult(savedResults.length - 1 - index)}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default ApiResultSidebar;