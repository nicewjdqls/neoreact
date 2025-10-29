import React from 'react';

function DataCollectionConnection({ 
  show, 
  onClose, 
  dbForm, 
  setDbForm, 
  onSave 
}) {
  if (!show) return null;

  const handleInputChange = (field, value) => {
    setDbForm({ ...dbForm, [field]: value });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.98) 0%, rgba(54, 61, 90, 0.98) 100%)',
        borderRadius: '1rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        width: '28rem',
        padding: '2rem',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        position: 'relative'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          marginBottom: '1.5rem', 
          color: '#fff',
          textAlign: 'center'
        }}>
          DB 연결 정보 입력
        </h2>
        
        {/* ⭐ DB연결제목 필드 추가 */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', display: 'block', marginBottom: '0.5rem' }}>
            DB연결제목 *
          </label>
          <input 
            type="text" 
            placeholder="예: 운영 DB"
            value={dbForm.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.875rem',
              color: '#fff',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.border = '1px solid rgba(99, 102, 241, 0.6)'}
            onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)'}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', display: 'block', marginBottom: '0.5rem' }}>
            호스트 *
          </label>
          <input 
            type="text" 
            placeholder="localhost"
            value={dbForm.host || ''}
            onChange={(e) => handleInputChange('host', e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.875rem',
              color: '#fff',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.border = '1px solid rgba(99, 102, 241, 0.6)'}
            onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)'}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', display: 'block', marginBottom: '0.5rem' }}>
            포트
          </label>
          <input 
            type="text" 
            placeholder="1521"
            value={dbForm.port || ''}
            onChange={(e) => handleInputChange('port', e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.875rem',
              color: '#fff',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.border = '1px solid rgba(99, 102, 241, 0.6)'}
            onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)'}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', display: 'block', marginBottom: '0.5rem' }}>
            DB 이름 *
          </label>
          <input 
            type="text" 
            placeholder="ORCL"
            value={dbForm.dbName || ''}
            onChange={(e) => handleInputChange('dbName', e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.875rem',
              color: '#fff',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.border = '1px solid rgba(99, 102, 241, 0.6)'}
            onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)'}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', display: 'block', marginBottom: '0.5rem' }}>
            사용자 계정 *
          </label>
          <input 
            type="text" 
            placeholder="scott"
            value={dbForm.user || ''}
            onChange={(e) => handleInputChange('user', e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.875rem',
              color: '#fff',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.border = '1px solid rgba(99, 102, 241, 0.6)'}
            onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)'}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', display: 'block', marginBottom: '0.5rem' }}>
            비밀번호
          </label>
          <input 
            type="password" 
            placeholder="tiger"
            value={dbForm.password || ''}
            onChange={(e) => handleInputChange('password', e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.875rem',
              color: '#fff',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.border = '1px solid rgba(99, 102, 241, 0.6)'}
            onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)'}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button 
            onClick={onClose}
            style={{
              padding: '0.625rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            취소
          </button>
          <button 
            onClick={onSave}
            style={{
              padding: '0.625rem 1.5rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataCollectionConnection;