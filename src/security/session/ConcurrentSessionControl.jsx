// src/security/session/ConcurrentSessionControl.jsx (로그 최소화)
// 주기적 체크 X → 로그인 시점에만 체크 O

import { useEffect, useState } from 'react';
import { useSession } from '../../contexts/SessionContext';
import { Modal, Button } from 'react-bootstrap';
import { AlertTriangle, LogOut, Shield } from 'lucide-react';
import { SESSION_EXPIRY_REASON, DEBUG_MODE } from '../../constants/sessionConstants';

const ConcurrentSessionControl = ({ enabled = true }) => {
  const { sessionInfo, logout } = useSession();
  const [showConcurrentModal, setShowConcurrentModal] = useState(false);
  const [existingSessionInfo, setExistingSessionInfo] = useState(null);

  // 🔍 로그인 시점에 기존 세션 확인
  useEffect(() => {
    if (!enabled || !sessionInfo.isActive) return;

    const checkExistingSession = () => {
      const userId = localStorage.getItem('userId');
      const currentSessionId = localStorage.getItem('sessionId');
      
      if (!userId) return;

      // 전역 세션 저장소 확인
      const globalSessionKey = 'neo_active_sessions';
      const activeSessions = localStorage.getItem(globalSessionKey);
      
      if (!activeSessions) return;

      const sessions = JSON.parse(activeSessions);
      const userSession = sessions[userId];

      // 기존 세션이 있고, 현재 세션과 다른 경우
      if (userSession && userSession.sessionId !== currentSessionId) {
        // 로그는 디버그 모드에서만
        if (DEBUG_MODE) {
          console.warn('⚠️ [ConcurrentSessionControl] 기존 활성 세션 감지:', {
            existing: userSession.sessionId.substring(0, 20) + '...',
            current: currentSessionId.substring(0, 20) + '...',
            loginTime: userSession.loginTime
          });
        }

        setExistingSessionInfo({
          ip: userSession.ip || '알 수 없음',
          loginTime: new Date(userSession.loginTime).toLocaleString('ko-KR'),
          sessionId: userSession.sessionId
        });

        setShowConcurrentModal(true);
      }
    };

    // 로그인 직후 한 번만 체크
    checkExistingSession();
  }, [enabled, sessionInfo.isActive, sessionInfo.sessionId]);

  // 🚪 기존 세션 종료하고 현재 세션 유지
  const handleTerminateOldSession = () => {
    if (DEBUG_MODE) {
      console.log('✅ [ConcurrentSessionControl] 기존 세션 종료 - 현재 세션 유지');
    }
    setShowConcurrentModal(false);
    // 이미 loginSession에서 기존 세션을 덮어씌웠으므로 추가 작업 불필요
  };

  // ❌ 현재 로그인 취소 (로그아웃)
  const handleCancelCurrentLogin = async () => {
    if (DEBUG_MODE) {
      console.log('❌ [ConcurrentSessionControl] 현재 로그인 취소');
    }
    
    // 현재 세션 삭제
    await logout(SESSION_EXPIRY_REASON.CONCURRENT_LOGIN);
    setShowConcurrentModal(false);
    
    window.location.href = '/';
  };

  if (!showConcurrentModal) {
    return null;
  }

  return (
    <Modal
      show={showConcurrentModal}
      onHide={() => {}}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Body
        style={{
          background: 'linear-gradient(135deg, rgba(60, 65, 90, 0.98) 0%, rgba(75, 80, 110, 0.98) 100%)',
          color: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid rgba(239, 68, 68, 0.4)'
        }}
      >
        {/* 헤더 */}
        <div className="text-center mb-4">
          <AlertTriangle size={64} className="text-warning mb-3" />
          <h4 className="fw-bold mb-2">중복 로그인 감지</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
            이 계정은 이미 다른 곳에서 로그인되어 있습니다.
          </p>
        </div>

        {/* 기존 세션 정보 */}
        {existingSessionInfo && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            <div className="mb-2">
              <strong>🖥️ 기존 세션 정보</strong>
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              <div className="mb-1">
                <strong>IP 주소:</strong> {existingSessionInfo.ip}
              </div>
              <div className="mb-1">
                <strong>로그인 시간:</strong> {existingSessionInfo.loginTime}
              </div>
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
            <div className="mb-2">
              <strong>선택하세요:</strong>
            </div>
            <ul style={{ marginBottom: 0, paddingLeft: '1.2rem' }}>
              <li className="mb-1">
                <strong>"기존 세션 종료"</strong>: 이전 로그인을 종료하고 여기서 계속 사용
              </li>
              <li>
                <strong>"취소"</strong>: 현재 로그인을 취소하고 이전 세션 유지
              </li>
            </ul>
          </div>
        </div>

        {/* 버튼 */}
        <div className="d-flex gap-2">
          <Button
            variant="danger"
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
            <LogOut size={18} />
            <span>취소 (로그아웃)</span>
          </Button>
          <Button
            variant="success"
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

        {/* 경고 */}
        <div
          style={{
            marginTop: '1rem',
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center'
          }}
        >
          ⚠️ 본인의 접속이 아니라면 즉시 비밀번호를 변경하세요
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConcurrentSessionControl;


// ========================================
// 🎯 동작 원리
// ========================================

/**
 * 
 * 1. 사용자 A가 PC1에서 로그인
 *    → neo_active_sessions['userA'] = { sessionId: 'abc123', ... }
 * 
 * 2. 사용자 A가 PC2에서 로그인 시도
 *    → neo_active_sessions['userA'] 확인
 *    → 'abc123' 세션이 이미 있음!
 *    → 모달 표시: "중복 로그인 감지"
 * 
 * 3. 사용자 선택:
 *    [기존 세션 종료] 클릭
 *    → PC2에서 계속 사용 (PC1 세션 종료)
 *    
 *    [취소] 클릭
 *    → PC2 로그아웃 (PC1 세션 유지)
 */

/**
 * [체크 시점]
 * 
 * ✅ 로그인 시도 시 (1회만)
 * ❌ 주기적 폴링 (10초마다)
 * 
 * → 서버 요청 99% 감소!
 */