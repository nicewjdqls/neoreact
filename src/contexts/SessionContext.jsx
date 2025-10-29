// src/contexts/SessionContext.jsx (userRole 수정)

import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  validateSession, 
  refreshSession, 
  logoutSession
} from '../utils/sessionUtils.js';
import { 
  SESSION_STATUS, 
  SESSION_EXPIRY_REASON
} from '../constants/sessionConstants.js';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  // 🔧 초기값: localStorage 확인해서 세션 복원
  const getInitialSession = () => {
    const sessionId = localStorage.getItem('sessionId');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    
    // localStorage에 세션이 있으면 복원
    if (sessionId && userId) {
      return {
        isActive: true, // 👈 일단 활성으로 시작
        userId,
        userName,
        userRole,
        sessionId,
        ip: null,
        loginTime: null,
        lastActivity: localStorage.getItem('lastActivity'),
        status: SESSION_STATUS.ACTIVE, // 👈 ACTIVE로 시작
        expiryReason: null
      };
    }
    
    // localStorage에 세션 없으면 기본값
    return {
      isActive: false,
      userId: null,
      userName: null,
      userRole: null,
      sessionId: null,
      ip: null,
      loginTime: null,
      lastActivity: null,
      status: SESSION_STATUS.LOGGED_OUT,
      expiryReason: null
    };
  };

  const [sessionInfo, setSessionInfo] = useState(getInitialSession());
  const [isLoading, setIsLoading] = useState(false);

  // 🔍 세션 검증
  const validate = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const response = await validateSession();
      
      if (response.success) {
        setSessionInfo({
          isActive: true,
          userId: response.data.userId,
          userName: response.data.userName,
          userRole: response.data.userRole || null,  // 👈 userRole 추가!
          sessionId: response.data.sessionId,
          ip: response.data.ip,
          loginTime: response.data.loginTime,
          lastActivity: response.data.lastActivity,
          status: SESSION_STATUS.ACTIVE,
          expiryReason: null
        });
        
    
        
        return true;
      } else {
        
        // 중복 로그인인 경우
        if (response.reason === 'concurrent_login') {
          setSessionInfo(prev => ({
            ...prev,
            isActive: false,
            status: SESSION_STATUS.EXPIRED,
            expiryReason: SESSION_EXPIRY_REASON.CONCURRENT_LOGIN
          }));
        }
        
        return false;
      }
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔄 세션 갱신
  const refresh = useCallback(async () => {
    try {
      const response = await refreshSession();
      
      if (response.success) {
        setSessionInfo(prev => ({
          ...prev,
          lastActivity: response.data.lastActivity
        }));
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }, []);

  // 🚪 로그아웃
  const logout = useCallback(async (reason = SESSION_EXPIRY_REASON.MANUAL_LOGOUT) => {
    try {
      await logoutSession();
      
      setSessionInfo({
        isActive: false,
        userId: null,
        userName: null,
        userRole: null,
        sessionId: null,
        ip: null,
        loginTime: null,
        lastActivity: null,
        status: SESSION_STATUS.LOGGED_OUT,
        expiryReason: reason
      });
      
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  // ⚠️ 세션 경고 상태로 변경
  const setWarning = useCallback(() => {
    setSessionInfo(prev => ({
      ...prev,
      status: SESSION_STATUS.WARNING
    }));
  }, []);

  // 🔴 세션 만료 상태로 변경
  const setExpired = useCallback((reason = SESSION_EXPIRY_REASON.TIMEOUT) => {
    setSessionInfo(prev => ({
      ...prev,
      isActive: false,
      status: SESSION_STATUS.EXPIRED,
      expiryReason: reason
    }));
  }, []);

  // 🟢 세션 활성 상태로 복구
  const setActive = useCallback(() => {
    setSessionInfo(prev => ({
      ...prev,
      status: SESSION_STATUS.ACTIVE,
      expiryReason: null
    }));
  }, []);

  const value = {
    sessionInfo,
    isLoading,
    validate,
    refresh,
    logout,
    setWarning,
    setExpired,
    setActive
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};