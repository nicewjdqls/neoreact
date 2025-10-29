// src/pages/UserAuthorizationMgt/index.jsx (중복 로그인 처리 포함)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { User, Lock, CheckCircle, XCircle, Info, AlertTriangle, Shield } from 'lucide-react';
import Member from './Member';
import 'bootstrap/dist/css/bootstrap.min.css';

// 🔒 Session Mock API import
import { loginSession, logoutSession } from '../../utils/sessionUtils';
import { useSession } from '../../contexts/SessionContext';

const Index = () => {
  const navigate = useNavigate();
  const { validate } = useSession();
  
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showConcurrentModal, setShowConcurrentModal] = useState(false); // 👈 중복 로그인 모달
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });
  const [existingSessionInfo, setExistingSessionInfo] = useState(null); // 👈 기존 세션 정보

  const showNotification = (title, message, variant = 'danger') => {
    const iconMap = {
      success: <CheckCircle size={48} className="text-success mb-3" />,
      danger: <XCircle size={48} className="text-danger mb-3" />,
      info: <Info size={48} className="text-info mb-3" />
    };
    
    setAlertConfig({
      title,
      message,
      variant,
      icon: iconMap[variant]
    });
    setShowAlertModal(true);
  };

  // 🔥 중복 로그인 - 기존 세션 종료하고 현재 로그인 진행
  const handleTerminateOldSession = async () => {
    console.log('✅ [Index] 기존 세션 종료 - 현재 로그인 진행');
    setShowConcurrentModal(false);
    
    // validate 호출하고 메인 페이지로 이동
    await validate();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    showNotification('로그인 성공', '기존 세션을 종료하고 로그인되었습니다.', 'success');
    
    setTimeout(() => {
      navigate('/main1');
    }, 1000);
  };

  // 🔥 중복 로그인 - 현재 로그인 취소
  const handleCancelCurrentLogin = async () => {
    console.log('❌ [Index] 현재 로그인 취소');
    setShowConcurrentModal(false);
    
    // 방금 생성한 세션 삭제
    await logoutSession();
    
    showNotification('로그인 취소', '기존 세션을 유지합니다.', 'info');
  };

  // 🎮 게스트 로그인 (대문자 GUEST로 전달)
  const handleGuest = async () => {
    setIsLoading(true);
    setLoadingText('게스트 모드로 접속 중...');
    
    try {
      const response = await loginSession('guest', 'Guest User', 'GUEST');
      
      // 🔥 중복 로그인 체크
      if (response.hasConcurrentSession) {
        console.warn('⚠️ [Index] 게스트 계정 중복 로그인 감지');
        setExistingSessionInfo(response.existingSessionInfo);
        setIsLoading(false);
        setShowConcurrentModal(true);
        return;
      }
      
      await validate();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ 게스트 로그인 성공 - Role:', localStorage.getItem('userRole'));
      setIsLoading(false);
      navigate('/main1');
    } catch (error) {
      console.error('게스트 로그인 오류:', error);
      setIsLoading(false);
      showNotification('오류', '게스트 로그인에 실패했습니다.', 'danger');
    }
  };

  // 🔐 일반 로그인 (admin/admin 체크 포함)
  const handleLogin = async (e) => {
    e.preventDefault();
    const loginUser = document.getElementById('loginUser').value;
    const loginPass = document.getElementById('loginPass').value;
    
    setIsLoading(true);
    setLoadingText('로그인 중...');
    
    try {
      if (!loginUser || !loginPass) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);
        showNotification('로그인 실패', '아이디와 비밀번호를 입력해주세요.', 'danger');
        return;
      }

      // 🔥 admin 계정 체크 (대문자 ADMIN으로 전달!)
      let userRole = 'USER';
      let displayName = loginUser;
      
      if (loginUser.toLowerCase() === 'admin' && loginPass === 'admin') {
        userRole = 'ADMIN';  // 👈 대문자 ADMIN
        displayName = 'Administrator';
        console.log('🔑 ADMIN 계정으로 로그인');
      } else {
        console.log('👤 일반 USER 계정으로 로그인');
      }

      // loginSession 호출 (대문자 role 전달)
      const response = await loginSession(loginUser, displayName, userRole);

      if (response.success) {
        // 🔥 중복 로그인 체크!
        if (response.hasConcurrentSession) {
          console.warn('⚠️ [Index] 중복 로그인 감지!', response.existingSessionInfo);
          setExistingSessionInfo(response.existingSessionInfo);
          setIsLoading(false);
          setShowConcurrentModal(true);
          return; // 여기서 멈춤! 사용자 선택 대기
        }
        
        // 중복 로그인 없으면 정상 진행
        await validate();
        await new Promise(resolve => setTimeout(resolve, 800));
        
        console.log('✅ 로그인 성공:', {
          userId: loginUser,
          userName: displayName,
          userRole: localStorage.getItem('userRole'),
          sessionId: response.sessionId
        });
        
        setIsLoading(false);
        showNotification('로그인 성공', `${displayName}님, 환영합니다!`, 'success');
        
        setTimeout(() => {
          navigate('/main1');
        }, 1000);
      } else {
        setIsLoading(false);
        showNotification('로그인 실패', '로그인에 실패했습니다.', 'danger');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      setIsLoading(false);
      showNotification('로그인 오류', '로그인 처리 중 오류가 발생했습니다.', 'danger');
    }
  };

  const handleSignupSuccess = (title, message, variant) => {
    showNotification(title, message, variant);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1e2139', 
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <style>{`
        .login-card {
          background: linear-gradient(135deg, rgba(42, 48, 70, 0.95) 0%, rgba(54, 61, 90, 0.95) 100%);
          border: 1px solid rgba(99, 102, 241, 0.4);
          border-radius: 16px;
          padding: 2.5rem;
          width: 480px;
          max-width: 90vw;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          position: relative;
          overflow: hidden;
        }
        
        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .login-form-group {
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }
        
        .login-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .login-input {
          width: 100%;
          padding: 0.875rem 1rem;
          background: rgba(30, 33, 52, 0.6);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 8px;
          color: #fff;
          font-size: 0.95rem;
          transition: all 0.3s;
        }
        
        .login-input:focus {
          outline: none;
          border-color: rgba(99, 102, 241, 0.6);
          background: rgba(30, 33, 52, 0.8);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .login-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        
        .login-button {
          flex: 1;
          padding: 0.875rem;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%);
          border: 2px solid rgba(99, 102, 241, 0.6);
          border-radius: 8px;
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }
        
        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%);
        }
        
        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .guest-button {
          flex: 0 0 110px;
          padding: 0.875rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .guest-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .guest-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .signup-link {
          color: rgba(99, 102, 241, 1);
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .signup-link:hover {
          color: rgba(139, 92, 246, 1);
          text-decoration: underline;
        }
        
        .divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 1.5rem 0;
        }
        
        .loading-spinner {
          width: 4rem;
          height: 4rem;
          border: 0.4rem solid rgba(99, 102, 241, 0.2);
          border-top-color: rgba(99, 102, 241, 1);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(30, 33, 57, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="loading-spinner"></div>
          <div style={{ 
            marginTop: '2rem', 
            fontSize: '1.1rem', 
            fontWeight: '600',
            color: '#fff',
            textAlign: 'center'
          }}>
            {loadingText}
          </div>
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            잠시만 기다려주세요...
          </div>
        </div>
      )}

      {/* 🔥 중복 로그인 모달 */}
      <Modal 
        show={showConcurrentModal} 
        onHide={() => {}}
        centered
        backdrop="static"
      >
        <Modal.Body style={{
          background: 'linear-gradient(135deg, rgba(60, 65, 90, 0.98) 0%, rgba(75, 80, 110, 0.98) 100%)',
          color: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid rgba(239, 68, 68, 0.4)'
        }}>
          <div className="text-center mb-4">
            <AlertTriangle size={64} className="text-warning mb-3" />
            <h4 className="fw-bold mb-2">중복 로그인 감지</h4>
            <p className="text-muted mb-0">이 계정은 이미 다른 곳에서 로그인되어 있습니다.</p>
          </div>

          {existingSessionInfo && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div className="mb-2"><strong>🖥️ 기존 세션 정보</strong></div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                <div className="mb-1"><strong>IP 주소:</strong> {existingSessionInfo.ip}</div>
                <div><strong>로그인 시간:</strong> {new Date(existingSessionInfo.loginTime).toLocaleString('ko-KR')}</div>
              </div>
            </div>
          )}

          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.85rem'
          }}>
            <div className="mb-2"><strong>선택하세요:</strong></div>
            <ul style={{ marginBottom: 0, paddingLeft: '1.2rem' }}>
              <li className="mb-1"><strong>"기존 세션 종료"</strong>: 이전 로그인 종료하고 여기서 계속 사용</li>
              <li><strong>"취소"</strong>: 현재 로그인 취소하고 이전 세션 유지</li>
            </ul>
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              onClick={handleCancelCurrentLogin}
              className="flex-fill"
              style={{
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                border: 'none',
                padding: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span>취소</span>
            </Button>
            <Button
              variant="danger"
              onClick={handleTerminateOldSession}
              className="flex-fill"
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none',
                padding: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Shield size={18} />
              <span>기존 세션 종료</span>
            </Button>
          </div>

          <div style={{
            marginTop: '1rem',
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center'
          }}>
            ⚠️ 본인의 접속이 아니라면 즉시 비밀번호를 변경하세요
          </div>
        </Modal.Body>
      </Modal>

      {/* 알림 Modal */}
      <Modal 
        show={showAlertModal} 
        onHide={() => setShowAlertModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Body 
          className="text-center p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(60, 65, 90, 0.98) 0%, rgba(75, 80, 110, 0.98) 100%)',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}
        >
          {alertConfig.icon}
          <h5 className="fw-bold mb-3" style={{ color: '#fff' }}>{alertConfig.title}</h5>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)' }} className="mb-4">
            {alertConfig.message}
          </p>
          <Button 
            onClick={() => setShowAlertModal(false)}
            className="px-4 shadow-sm"
            style={{ 
              borderRadius: '8px',
              background: alertConfig.variant === 'success' 
                ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                : alertConfig.variant === 'info'
                ? 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
                : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
              border: 'none',
              fontWeight: '600'
            }}
          >
            확인
          </Button>
        </Modal.Body>
      </Modal>

      {/* 회원가입 Modal */}
      <Member 
        show={showSignupModal}
        onHide={() => setShowSignupModal(false)}
        onSuccess={handleSignupSuccess}
      />

      {/* Login Card */}
      <div className="login-card">
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: '700',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
          }}>
            AI
          </div>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '700',
            marginBottom: '0.5rem',
            color: '#fff'
          }}>
            Neo AI Portal
          </h1>
          <p style={{ 
            fontSize: '0.9rem', 
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: 0
          }}>
            Session Security System
          </p>
        </div>

        {/* Login Form */}
        <form id="loginForm" onSubmit={handleLogin}>
          <div className="login-form-group">
            <label className="login-label">
              <User size={16} />
              아이디
            </label>
            <input
              id="loginUser"
              type="text"
              className="login-input"
              placeholder="아이디를 입력하세요 (admin/admin)"
              disabled={isLoading}
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">
              <Lock size={16} />
              비밀번호
            </label>
            <input
              id="loginPass"
              type="password"
              className="login-input"
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
            />
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '0.75rem',
            marginBottom: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    style={{ marginRight: '0.5rem' }}
                  />
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </button>
            <button 
              type="button"
              className="guest-button"
              onClick={handleGuest}
              disabled={isLoading}
            >
              <span>게스트</span>
            </button>
          </div>
        </form>

        <div className="divider"></div>

        {/* Signup Link */}
        <div style={{ 
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <span style={{ 
            fontSize: '0.875rem', 
            color: 'rgba(255, 255, 255, 0.6)' 
          }}>
            계정이 없으신가요?{' '}
            <span
              className="signup-link"
              onClick={() => !isLoading && setShowSignupModal(true)}
              style={{ 
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              회원가입
            </span>
          </span>
        </div>

        {/* 개발용 안내 */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.75rem',
          background: 'rgba(99, 102, 241, 0.1)',
          borderRadius: '6px',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'center',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}>
          💡 <strong>관리자 계정:</strong> admin / admin<br/>
          👤 <strong>일반 사용자:</strong> 아무 ID/PW 입력
        </div>
      </div>
    </div>
  );
};

export default Index;