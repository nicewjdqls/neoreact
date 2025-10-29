// src/security/session/SessionExpiredModal.jsx (아이콘 제거)

import React, { useState, useEffect } from 'react';
import { SESSION_EXPIRY_REASON } from '../../constants/sessionConstants.js';

const SessionExpiredModal = ({ 
  isOpen, 
  reason, 
  countdown = null,
  onExtend = null, 
  onLogout 
}) => {
  const [timeLeft, setTimeLeft] = useState(countdown);

  useEffect(() => {
    if (isOpen && countdown !== null) {
      setTimeLeft(countdown);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onLogout && onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, countdown, onLogout]);

  if (!isOpen) return null;

  // 만료 이유별 메시지
  const getMessage = () => {
    switch (reason) {
      case SESSION_EXPIRY_REASON.INACTIVITY:
        return {
          title: '자동 로그아웃',
          message: '활동이 감지되지 않아 곧 자동으로 로그아웃됩니다.',
          color: 'warning'
        };
      case SESSION_EXPIRY_REASON.TIMEOUT:
        return {
          title: '세션 만료',
          message: '세션 시간이 초과되었습니다. 다시 로그인해주세요.',
          color: 'danger'
        };
      case SESSION_EXPIRY_REASON.CONCURRENT_LOGIN:
        return {
          title: '중복 로그인 감지',
          message: '다른 위치에서 로그인되어 현재 세션이 종료됩니다.',
          color: 'danger'
        };
      default:
        return {
          title: '세션 경고',
          message: '세션이 곧 만료됩니다.',
          color: 'warning'
        };
    }
  };

  const { title, message, color } = getMessage();
  const isWarning = reason === SESSION_EXPIRY_REASON.INACTIVITY;

  return (
    <div style={styles.overlay}>
      <div style={{
        ...styles.modal,
        borderTop: `4px solid ${color === 'warning' ? '#ffc107' : '#dc3545'}`
      }}>
        {/* 헤더 */}
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
        </div>

        {/* 내용 */}
        <div style={styles.body}>
          <p style={styles.message}>{message}</p>
          
          {/* 카운트다운 표시 (경고 모드일 때만) */}
          {isWarning && timeLeft !== null && (
            <div style={styles.countdown}>
              <div style={styles.countdownNumber}>
                <span style={{ color: '#ffffff' }}>{timeLeft}</span>
              </div>
              <p style={styles.countdownLabel}>초 후 자동 로그아웃</p>
            </div>
          )}

          {/* 중복 로그인 정보 */}
          {reason === SESSION_EXPIRY_REASON.CONCURRENT_LOGIN && (
            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                <strong>새 로그인 정보:</strong><br />
                IP: 192.168.0.100<br />
                시간: {new Date().toLocaleString('ko-KR')}
              </p>
            </div>
          )}
        </div>

        {/* 버튼 (아이콘 제거) */}
        <div style={styles.footer}>
          {isWarning ? (
            <>
              <button 
                style={{...styles.button, ...styles.extendButton}}
                onClick={onExtend}
              >
                세션 연장
              </button>
              <button 
                style={{...styles.button, ...styles.logoutButton}}
                onClick={onLogout}
              >
                지금 로그아웃
              </button>
            </>
          ) : (
            <button 
              style={{...styles.button, ...styles.confirmButton}}
              onClick={onLogout}
            >
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(4px)'
  },
  modal: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    animation: 'slideIn 0.3s ease-out',
    overflow: 'hidden'
  },
  header: {
    padding: '24px 24px 16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center'
  },
  body: {
    padding: '24px',
    textAlign: 'center'
  },
  message: {
    fontSize: '16px',
    color: '#e0e0e0',
    lineHeight: '1.6',
    marginBottom: '24px'
  },
  countdown: {
    marginTop: '20px',
    marginBottom: '20px',
    position: 'relative',
    zIndex: 10
  },
  countdownNumber: {
    fontSize: '96px',
    fontWeight: '300',
    color: '#ffffff',
    lineHeight: '1',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    textShadow: 'none',
    marginBottom: '12px',
    letterSpacing: '-2px',
    opacity: 1,
    position: 'relative',
    zIndex: 10,
    WebkitTextFillColor: '#ffffff',
    display: 'block'
  },
  countdownLabel: {
    fontSize: '14px',
    color: '#b0b0b0',
    margin: 0,
    fontWeight: '500'
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  infoText: {
    fontSize: '14px',
    color: '#e0e0e0',
    margin: 0,
    lineHeight: '1.6',
    textAlign: 'left'
  },
  footer: {
    padding: '16px 24px 24px',
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '140px'
  },
  extendButton: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
  },
  logoutButton: {
    background: 'linear-gradient(135deg, #757575 0%, #616161 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(117, 117, 117, 0.4)'
  },
  confirmButton: {
    background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)'
  }
};

// CSS 애니메이션 추가
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  try {
    styleSheet.insertRule(`
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `, styleSheet.cssRules.length);
  } catch (e) {
    // 이미 존재하는 경우 무시
  }
}

export default SessionExpiredModal;