// src/contexts/AuthContext.jsx
// 인증/인가 통합 컨텍스트 (브라우저 저장소 + 보안 기능)

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrowserStorage, LocalStorage } from '../utils/browserStorage';
import { EncryptedStorage, CSRFToken, TokenGenerator } from '../utils/cryptoUtils';
import { CSRFProtection, XSSProtection, SessionSecurity } from '../utils/securityUtils';

const AuthContext = createContext();

/**
 * 인증 컨텍스트 훅
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * 저장소 타입
 */
export const StorageType = {
  LOCAL: 'local',           // 영구 저장 (로그인 유지)
  SESSION: 'session',       // 세션 저장 (브라우저 닫으면 삭제)
  COOKIE: 'cookie'          // 쿠키 저장 (서버와 공유 가능)
};

/**
 * 인증 상태
 */
export const AuthStatus = {
  AUTHENTICATED: 'authenticated',     // 인증됨
  UNAUTHENTICATED: 'unauthenticated', // 미인증
  LOADING: 'loading',                 // 로딩 중
  ERROR: 'error'                      // 오류
};

/**
 * 인증 프로바이더
 */
export const AuthProvider = ({ children, config = {} }) => {
  const {
    storageType = StorageType.LOCAL,    // 기본 저장소 타입
    useEncryption = true,                 // 암호화 사용 여부
    sessionTimeout = 30 * 60 * 1000,      // 세션 타임아웃 (30분)
    enableCSRF = true,                    // CSRF 보호 활성화
    rememberMe = true                     // 로그인 유지 기능
  } = config;

  // 상태
  const [authState, setAuthState] = useState({
    status: AuthStatus.LOADING,
    isAuthenticated: false,
    user: null,
    token: null,
    sessionId: null,
    lastActivity: null,
    error: null
  });

  /**
   * 저장소에서 인증 정보 불러오기
   */
  const loadAuthFromStorage = useCallback(() => {
    try {
      console.log('🔍 [Auth] 저장소에서 인증 정보 불러오기...');

      let user, token, sessionId, lastActivity;

      if (useEncryption) {
        // 암호화된 저장소 사용
        user = EncryptedStorage.getItem('auth_user');
        token = EncryptedStorage.getItem('auth_token');
        sessionId = EncryptedStorage.getItem('auth_session_id');
        lastActivity = EncryptedStorage.getItem('auth_last_activity');
      } else {
        // 일반 저장소 사용
        user = BrowserStorage.get('auth_user', { type: storageType });
        token = BrowserStorage.get('auth_token', { type: storageType });
        sessionId = BrowserStorage.get('auth_session_id', { type: storageType });
        lastActivity = BrowserStorage.get('auth_last_activity', { type: storageType });
      }

      // 세션 타임아웃 체크
      if (lastActivity && SessionSecurity.isSessionExpired(lastActivity, sessionTimeout)) {
        console.warn('⚠️ [Auth] 세션 타임아웃');
        clearAuth();
        return false;
      }

      if (user && token && sessionId) {
        console.log('✅ [Auth] 인증 정보 복원 성공:', user.userId);
        setAuthState({
          status: AuthStatus.AUTHENTICATED,
          isAuthenticated: true,
          user,
          token,
          sessionId,
          lastActivity,
          error: null
        });
        return true;
      } else {
        console.log('ℹ️ [Auth] 저장된 인증 정보 없음');
        setAuthState(prev => ({
          ...prev,
          status: AuthStatus.UNAUTHENTICATED,
          isAuthenticated: false
        }));
        return false;
      }
    } catch (error) {
      console.error('❌ [Auth] 인증 정보 불러오기 실패:', error);
      setAuthState(prev => ({
        ...prev,
        status: AuthStatus.ERROR,
        error: error.message
      }));
      return false;
    }
  }, [storageType, useEncryption, sessionTimeout]);

  /**
   * 저장소에 인증 정보 저장
   */
  const saveAuthToStorage = useCallback((user, token, sessionId) => {
    try {
      const now = new Date().toISOString();

      if (useEncryption) {
        // 암호화하여 저장
        EncryptedStorage.setItem('auth_user', user);
        EncryptedStorage.setItem('auth_token', token);
        EncryptedStorage.setItem('auth_session_id', sessionId);
        EncryptedStorage.setItem('auth_last_activity', now);
      } else {
        // 일반 저장
        BrowserStorage.set('auth_user', user, { type: storageType });
        BrowserStorage.set('auth_token', token, { type: storageType });
        BrowserStorage.set('auth_session_id', sessionId, { type: storageType });
        BrowserStorage.set('auth_last_activity', now, { type: storageType });
      }

      console.log('💾 [Auth] 인증 정보 저장 완료');
      return true;
    } catch (error) {
      console.error('❌ [Auth] 인증 정보 저장 실패:', error);
      return false;
    }
  }, [storageType, useEncryption]);

  /**
   * 저장소에서 인증 정보 삭제
   */
  const clearAuth = useCallback(() => {
    try {
      if (useEncryption) {
        EncryptedStorage.removeItem('auth_user');
        EncryptedStorage.removeItem('auth_token');
        EncryptedStorage.removeItem('auth_session_id');
        EncryptedStorage.removeItem('auth_last_activity');
      } else {
        BrowserStorage.remove('auth_user', { type: storageType });
        BrowserStorage.remove('auth_token', { type: storageType });
        BrowserStorage.remove('auth_session_id', { type: storageType });
        BrowserStorage.remove('auth_last_activity', { type: storageType });
      }

      // CSRF 토큰도 삭제
      if (enableCSRF) {
        CSRFToken.clear();
      }

      console.log('🧹 [Auth] 인증 정보 삭제 완료');
      return true;
    } catch (error) {
      console.error('❌ [Auth] 인증 정보 삭제 실패:', error);
      return false;
    }
  }, [storageType, useEncryption, enableCSRF]);

  /**
   * 로그인
   */
  const login = useCallback(async (credentials, options = {}) => {
    try {
      const { rememberUser = rememberMe } = options;

      setAuthState(prev => ({ ...prev, status: AuthStatus.LOADING }));

      // 입력 검증
      const sanitizedUserId = XSSProtection.sanitizeInput(credentials.userId);
      const sanitizedPassword = XSSProtection.sanitizeInput(credentials.password);

      console.log('🔐 [Auth] 로그인 시도:', sanitizedUserId);

      // TODO: 실제 API 호출로 교체
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: sanitizedUserId, password: sanitizedPassword })
      // });

      // Mock 로그인 (개발용)
      await new Promise(resolve => setTimeout(resolve, 500));

      const user = {
        userId: sanitizedUserId,
        userName: credentials.userName || sanitizedUserId,
        userRole: credentials.userRole || 'USER',
        email: credentials.email || `${sanitizedUserId}@example.com`
      };

      const token = TokenGenerator.generate(64);
      const sessionId = SessionSecurity.regenerateSessionId();

      // CSRF 토큰 생성
      if (enableCSRF) {
        CSRFProtection.initialize();
      }

      // 저장소에 저장
      if (rememberUser) {
        saveAuthToStorage(user, token, sessionId);
      }

      setAuthState({
        status: AuthStatus.AUTHENTICATED,
        isAuthenticated: true,
        user,
        token,
        sessionId,
        lastActivity: new Date().toISOString(),
        error: null
      });

      console.log('✅ [Auth] 로그인 성공:', user.userId);

      return { success: true, user };
    } catch (error) {
      console.error('❌ [Auth] 로그인 실패:', error);
      setAuthState(prev => ({
        ...prev,
        status: AuthStatus.ERROR,
        error: error.message
      }));
      return { success: false, error: error.message };
    }
  }, [rememberMe, enableCSRF, saveAuthToStorage]);

  /**
   * 로그아웃
   */
  const logout = useCallback(async () => {
    try {
      console.log('🚪 [Auth] 로그아웃...');

      // TODO: 실제 API 호출로 교체
      // await fetch('/api/auth/logout', { method: 'POST' });

      clearAuth();

      setAuthState({
        status: AuthStatus.UNAUTHENTICATED,
        isAuthenticated: false,
        user: null,
        token: null,
        sessionId: null,
        lastActivity: null,
        error: null
      });

      console.log('✅ [Auth] 로그아웃 완료');

      return { success: true };
    } catch (error) {
      console.error('❌ [Auth] 로그아웃 실패:', error);
      return { success: false, error: error.message };
    }
  }, [clearAuth]);

  /**
   * 세션 갱신 (활동 감지)
   */
  const refreshSession = useCallback(() => {
    if (authState.isAuthenticated) {
      const now = new Date().toISOString();

      // 마지막 활동 시간 업데이트
      if (useEncryption) {
        EncryptedStorage.setItem('auth_last_activity', now);
      } else {
        BrowserStorage.set('auth_last_activity', now, { type: storageType });
      }

      setAuthState(prev => ({
        ...prev,
        lastActivity: now
      }));

      console.log('🔄 [Auth] 세션 갱신');
    }
  }, [authState.isAuthenticated, storageType, useEncryption]);

  /**
   * 권한 체크
   */
  const hasPermission = useCallback((requiredRole) => {
    if (!authState.isAuthenticated || !authState.user) {
      return false;
    }

    const userRole = authState.user.userRole;
    const roleHierarchy = {
      'SUPER_ADMIN': 4,
      'ADMIN': 3,
      'MANAGER': 2,
      'USER': 1,
      'GUEST': 0
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  }, [authState.isAuthenticated, authState.user]);

  /**
   * 초기화
   */
  useEffect(() => {
    console.log('🚀 [Auth] AuthProvider 초기화');

    // CSRF 토큰 초기화
    if (enableCSRF) {
      CSRFProtection.initialize();
    }

    // 저장소에서 인증 정보 불러오기
    loadAuthFromStorage();
  }, [enableCSRF, loadAuthFromStorage]);

  /**
   * 활동 감지 (자동 세션 갱신)
   */
  useEffect(() => {
    if (!authState.isAuthenticated) {
      return;
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    let debounceTimer;

    const handleActivity = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        refreshSession();
      }, 5000); // 5초 디바운스
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimeout(debounceTimer);
    };
  }, [authState.isAuthenticated, refreshSession]);

  const value = {
    // 상태
    ...authState,

    // 메서드
    login,
    logout,
    refreshSession,
    hasPermission,

    // 설정
    config: {
      storageType,
      useEncryption,
      sessionTimeout,
      enableCSRF,
      rememberMe
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
