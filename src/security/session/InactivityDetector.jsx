// src/security/session/InactivityDetector.jsx (로그 최소화)

import { useEffect, useRef, useCallback } from 'react';
import { 
  ACTIVITY_EVENTS, 
  SESSION_TIMEOUT, 
  SESSION_WARNING_TIME,
  DEBUG_MODE 
} from '../../constants/sessionConstants';

const InactivityDetector = ({ 
  onWarning,      // 경고 시점 콜백 (14분)
  onTimeout,      // 타임아웃 콜백 (15분)
  onActivity,     // 활동 감지 콜백
  enabled = true  // 활성화 여부
}) => {
  const warningTimerRef = useRef(null);
  const timeoutTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // 타이머 초기화
  const clearTimers = useCallback(() => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }
  }, []);

  // 타이머 시작
  const startTimers = useCallback(() => {
    clearTimers();

    if (!enabled) return;

    // 경고 타이머 설정 (14분)
    warningTimerRef.current = setTimeout(() => {
      if (DEBUG_MODE) {
        console.log('[InactivityDetector] ⚠️ 세션 경고 (14분 경과)');
      }
      onWarning && onWarning();
    }, SESSION_WARNING_TIME);

    // 타임아웃 타이머 설정 (15분)
    timeoutTimerRef.current = setTimeout(() => {
      if (DEBUG_MODE) {
        console.log('[InactivityDetector] 🔴 세션 타임아웃 (15분 경과)');
      }
      onTimeout && onTimeout();
    }, SESSION_TIMEOUT);

    // 초기 설정 로그만 (디버그 모드에서만)
    if (DEBUG_MODE) {
      console.log('[InactivityDetector] ⏱️ 타이머 시작');
      console.log(`- 경고: ${SESSION_WARNING_TIME / 1000}초 후`);
      console.log(`- 만료: ${SESSION_TIMEOUT / 1000}초 후`);
    }
  }, [enabled, onWarning, onTimeout, clearTimers]);

  // 활동 감지 핸들러
  const handleActivity = useCallback(() => {
    if (!enabled) return;

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;

    // 마지막 활동 후 1초 이상 경과했을 때만 처리 (과도한 호출 방지)
    if (timeSinceLastActivity > 1000) {
      lastActivityRef.current = now;
      
      // 활동 감지 로그 제거 (너무 빈번함)
      
      // 타이머 리셋
      startTimers();

      // 활동 콜백 실행
      onActivity && onActivity();
    }
  }, [enabled, startTimers, onActivity]);

  // 이벤트 리스너 등록
  useEffect(() => {
    if (!enabled) {
      clearTimers();
      return;
    }

    // 초기 타이머 시작
    startTimers();

    // 활동 이벤트 등록
    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    if (DEBUG_MODE) {
      console.log('[InactivityDetector] 🎯 감지 시작:', ACTIVITY_EVENTS);
    }

    // 클린업
    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimers();
      
      if (DEBUG_MODE) {
        console.log('[InactivityDetector] 🛑 감지 종료');
      }
    };
  }, [enabled, handleActivity, startTimers, clearTimers]);

  // 이 컴포넌트는 UI를 렌더링하지 않음 (로직만)
  return null;
};

export default InactivityDetector;