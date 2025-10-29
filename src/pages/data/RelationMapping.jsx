import React from 'react';

/**
 * RelationMapping - 매핑 결과 표시 공통 컴포넌트
 * SelectMapping과 DirectMapping의 매핑 결과 표시 부분을 공통 모듈로 분리
 */
function RelationMapping({ 
  mappings,
  deleteMapping,
  title,
  isIntegrated,
  showSendButton,
  onSendToTraining
}) {
  // 안전한 기본값 처리
  const safeMappings = mappings || [];

  return (
    <div className="select-card" style={{ 
      flexShrink: 0,
      background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.9) 0%, rgba(54, 61, 90, 0.9) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '0.75rem',
      padding: '1rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    }}>
      <h2 style={{ 
        fontSize: '1.125rem', 
        fontWeight: '600', 
        marginBottom: '0.75rem', 
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '0.75rem', height: '0.75rem', background: '#6b7280', borderRadius: '50%', marginRight: '0.5rem' }}></div>
          {title}
        </span>
        <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '400' }}>
          {isIntegrated 
            ? `총 ${safeMappings.length}개 매핑 (선택: ${safeMappings.filter(m => m.type === 'select').length}, 직접: ${safeMappings.filter(m => m.type === 'direct').length})`
            : `총 ${safeMappings.length}개`
          }
        </span>
      </h2>
      
      {safeMappings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'rgba(255, 255, 255, 0.5)' }}>
          <svg style={{ width: '3rem', height: '3rem', margin: '0 auto 0.75rem', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p style={{ fontSize: '0.875rem' }}>생성된 매핑이 없습니다.</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
            DB를 연결하고 매핑을 추가해주세요.
          </p>
        </div>
      ) : (
        <>
          <ul style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.5rem', 
            fontSize: '0.875rem', 
            color: 'rgba(255, 255, 255, 0.9)', 
            maxHeight: '12rem', 
            overflowY: 'auto', 
            marginBottom: showSendButton ? '1rem' : 0, 
            padding: 0, 
            listStyle: 'none' 
          }}>
            {safeMappings.map((mapping) => (
              <li key={mapping.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.05)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{
                      padding: '0.125rem 0.5rem',
                      fontSize: '0.6875rem',
                      borderRadius: '0.25rem',
                      background: isIntegrated && mapping.type === 'direct'
                        ? 'rgba(34, 197, 94, 0.2)' 
                        : 'rgba(99, 102, 241, 0.2)',
                      color: isIntegrated && mapping.type === 'direct'
                        ? 'rgba(34, 197, 94, 1)' 
                        : 'rgba(99, 102, 241, 1)',
                      border: isIntegrated && mapping.type === 'direct'
                        ? '1px solid rgba(34, 197, 94, 0.4)'
                        : '1px solid rgba(99, 102, 241, 0.4)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}>
                      {isIntegrated && mapping.type === 'direct' ? '직접매핑' : '선택매핑'}
                    </span>
                    <div style={{ 
                      fontWeight: '600',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <span style={{ color: '#3b82f6' }}>{mapping.sourceTable}.{mapping.sourceColumn}</span>
                      <span style={{ margin: '0 0.5rem', color: 'rgba(255, 255, 255, 0.5)' }}>→</span>
                      <span style={{ color: '#22c55e' }}>{mapping.labelTable}.{mapping.labelColumn}</span>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: isIntegrated && mapping.sqlQuery ? '0.25rem' : 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    관계: {mapping.sourceTable}.{mapping.relSource} ↔ {mapping.labelTable}.{mapping.relLabel}
                  </div>
                  {isIntegrated && mapping.sqlQuery && (
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: 'rgba(255, 255, 255, 0.5)', 
                      fontFamily: 'monospace',
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      marginTop: '0.5rem',
                      overflowX: 'auto'
                    }}>
                      {mapping.sqlQuery}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => deleteMapping(mapping.id)}
                  style={{
                    marginLeft: '0.75rem',
                    padding: '0.25rem 0.75rem',
                    color: '#ef4444',
                    fontSize: '0.75rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    background: 'rgba(239, 68, 68, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>

          {showSendButton && onSendToTraining && (
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={onSendToTraining}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.5rem',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
                }}
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                학습 데이터로 전송 ({safeMappings.length}개 매핑)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RelationMapping;