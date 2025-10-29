// src/security/session/SessionRefresh.jsx (로그 최소화)

import { useEffect, useRef } from 'react';
import { useSession } from '../../contexts/SessionContext';
import { SESSION_REFRESH_INTERVAL, DEBUG_MODE } from '../../constants/sessionConstants';

const SessionRefresh = ({ 
  enabled = true,
  refreshInterval = SESSION_REFRESH_INTERVAL 
}) => {
  const { refresh } = useSession();
  const refreshTimerRef = useRef(null);
  const refreshCountRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      return;
    }

    // 주기적으로 세션 갱신
    refreshTimerRef.current = setInterval(async () => {
      refreshCountRef.current += 1;

      try {
        await refresh();
        
        // 로그 제거 (필요시 DEBUG_MODE에서만 출력)
        if (DEBUG_MODE) {
        }
      } catch (error) {
        // 에러만 출력
        if (DEBUG_MODE) {
          console.error('[SessionRefresh] 세션 갱신 오류:', error);
        }
      }
    }, refreshInterval);

    // 클린업
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      refreshCountRef.current = 0;
    };
  }, [enabled, refresh, refreshInterval]);

  return null;
};

export default SessionRefresh;