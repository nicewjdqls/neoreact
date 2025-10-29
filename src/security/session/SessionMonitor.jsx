// src/security/session/SessionMonitor.jsx (로그 최소화)

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext.jsx';
import InactivityDetector from './InactivityDetector.jsx';
import SessionExpiredModal from './SessionExpiredModal.jsx';
import { 
  SESSION_EXPIRY_REASON, 
  SESSION_STATUS,
  SESSION_TIMEOUT,
  SESSION_WARNING_TIME,
  DEBUG_MODE 
} from '../../constants/sessionConstants.js';

const SessionMonitor = () => {
  const navigate = useNavigate();
  const { sessionInfo, setWarning, setExpired, setActive, refresh, logout } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [modalReason, setModalReason] = useState(null);
  const [countdown, setCountdown] = useState(null);

  // 세션 경고 핸들러 (30초 경과)
  const handleWarning = useCallback(() => {
    if (DEBUG_MODE) {
      console.log('[SessionMonitor] ⚠️ 자동 로그아웃 모달 표시');
    }
    
    setWarning();
    setShowModal(true);
    setModalReason(SESSION_EXPIRY_REASON.INACTIVITY);
    
    // 남은 시간 계산 (초 단위)
    const remainingTime = Math.floor((SESSION_TIMEOUT - SESSION_WARNING_TIME) / 1000);
    setCountdown(remainingTime);
  }, [setWarning]);

  // 세션 타임아웃 핸들러 (1분 경과)
  const handleTimeout = useCallback(async () => {
    if (DEBUG_MODE) {
      console.log('[SessionMonitor] 🔴 세션 타임아웃 - 자동 로그아웃');
    }
    
    setExpired(SESSION_EXPIRY_REASON.TIMEOUT);
    setShowModal(true);
    setModalReason(SESSION_EXPIRY_REASON.TIMEOUT);
    setCountdown(null);
    
    // 자동 로그아웃 실행
    await logout(SESSION_EXPIRY_REASON.TIMEOUT);
    
    // 즉시 로그인 페이지로 이동
    setShowModal(false);
    navigate('/', { replace: true });
  }, [setExpired, logout, navigate]);

  // 활동 감지 핸들러
  const handleActivity = useCallback(async () => {
    // 경고 상태였다면 세션 갱신 및 모달 닫기
    if (sessionInfo.status === SESSION_STATUS.WARNING) {
      if (DEBUG_MODE) {
        console.log('[SessionMonitor] 🟢 활동 감지 - 경고 해제');
      }
      
      await refresh();
      setActive();
      setShowModal(false);
      setCountdown(null);
    }
  }, [sessionInfo.status, refresh, setActive]);

  // 세션 연장 버튼 핸들러
  const handleExtendSession = useCallback(async () => {
    if (DEBUG_MODE) {
      console.log('[SessionMonitor] 🔄 세션 연장 요청');
    }
    
    await refresh();
    setActive();
    setShowModal(false);
    setCountdown(null);
  }, [refresh, setActive]);

  // 로그아웃 핸들러
  const handleLogout = useCallback(async () => {
    if (DEBUG_MODE) {
      console.log('[SessionMonitor] 🚪 사용자 로그아웃');
    }
    
    await logout(SESSION_EXPIRY_REASON.MANUAL_LOGOUT);
    setShowModal(false);
    
    // 즉시 로그인 페이지로 이동
    navigate('/', { replace: true });
  }, [logout, navigate]);

  return (
    <>
      {/* 비활동 감지 컴포넌트 */}
      <InactivityDetector
        enabled={sessionInfo.isActive}
        onWarning={handleWarning}
        onTimeout={handleTimeout}
        onActivity={handleActivity}
      />

      {/* 세션 만료 모달 */}
      <SessionExpiredModal
        isOpen={showModal}
        reason={modalReason}
        countdown={countdown}
        onExtend={handleExtendSession}
        onLogout={handleLogout}
      />
    </>
  );
};

export default SessionMonitor;