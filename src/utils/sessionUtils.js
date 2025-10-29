// src/utils/sessionUtils.js (중복 로그인 체크 추가)

import { STORAGE_KEYS } from '../constants/sessionConstants.js';

// 전역 세션 저장소 키 (여러 탭에서 공유)
const GLOBAL_SESSION_KEY = 'neo_active_sessions';

// Mock 지연 시간 (실제 API처럼)
const MOCK_DELAY = 300;

// Promise 지연 함수
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 랜덤 세션 ID 생성
const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

// 활성 세션 목록 가져오기
const getActiveSessions = () => {
  try {
    const sessions = localStorage.getItem(GLOBAL_SESSION_KEY);
    return sessions ? JSON.parse(sessions) : {};
  } catch {
    return {};
  }
};

// 활성 세션 목록 저장
const saveActiveSessions = (sessions) => {
  localStorage.setItem(GLOBAL_SESSION_KEY, JSON.stringify(sessions));
};

// 1️⃣ 세션 검증 API (userRole 추가!)
export const validateSession = async () => {
  await delay(MOCK_DELAY);
  
  const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  const userName = localStorage.getItem(STORAGE_KEYS.USER_NAME);
  const userRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
  
  // 세션 정보가 없으면 실패
  if (!sessionId || !userId) {
    console.warn('⚠️ [validateSession] 세션 정보 없음');
    return {
      success: false,
      message: '세션이 존재하지 않습니다.'
    };
  }
  
  // 활성 세션 목록 확인
  const activeSessions = getActiveSessions();
  const currentSession = activeSessions[userId];
  
  // 다른 세션이 활성화된 경우 (중복 로그인)
  if (currentSession && currentSession.sessionId !== sessionId) {
    console.warn('🚫 [validateSession] 중복 로그인 감지');
    return {
      success: false,
      message: '다른 위치에서 로그인되었습니다.',
      reason: 'concurrent_login'
    };
  }
  
  console.log('✅ [validateSession] 세션 유효:', { userId, userRole });
  
  return {
    success: true,
    data: {
      userId,
      userName,
      userRole,
      sessionId,
      lastActivity: lastActivity ? new Date(lastActivity) : new Date(),
      ip: '192.168.0.100',
      loginTime: currentSession?.loginTime || new Date().toISOString()
    }
  };
};

// 2️⃣ 세션 갱신 API
export const refreshSession = async () => {
  await delay(MOCK_DELAY);
  
  const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  
  if (!sessionId || !userId) {
    return {
      success: false,
      message: '세션이 존재하지 않습니다.'
    };
  }
  
  // 마지막 활동 시간 업데이트
  const now = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, now);
  
  // 활성 세션 업데이트
  const activeSessions = getActiveSessions();
  if (activeSessions[userId]) {
    activeSessions[userId].lastActivity = now;
    saveActiveSessions(activeSessions);
  }
  
  return {
    success: true,
    message: '세션이 갱신되었습니다.',
    data: {
      lastActivity: now
    }
  };
};

// 3️⃣ 로그인 API (세션 생성 + 중복 체크!)
export const loginSession = async (userId, userName, userRole = 'USER') => {
  await delay(MOCK_DELAY);
  
  const sessionId = generateSessionId();
  const loginTime = new Date().toISOString();
  const roleUpper = userRole.toUpperCase();
  
  console.log('🔐 [loginSession] 로그인 시도:', { userId, userName, userRole: roleUpper });
  
  // 🔥 중복 로그인 체크 (덮어쓰기 전에!)
  const activeSessions = getActiveSessions();
  const existingSession = activeSessions[userId];
  
  let hasConcurrentSession = false;
  let existingSessionInfo = null;
  
  if (existingSession) {
    console.warn('⚠️ [loginSession] 기존 활성 세션 발견:', {
      sessionId: existingSession.sessionId.substring(0, 20) + '...',
      loginTime: existingSession.loginTime
    });
    
    hasConcurrentSession = true;
    existingSessionInfo = {
      sessionId: existingSession.sessionId,
      loginTime: existingSession.loginTime,
      ip: existingSession.ip || '192.168.0.100'
    };
  }
  
  // 로컬스토리지에 세션 정보 저장
  localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  localStorage.setItem(STORAGE_KEYS.USER_NAME, userName);
  localStorage.setItem(STORAGE_KEYS.USER_ROLE, roleUpper);
  localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, loginTime);
  
  // 활성 세션 등록 (기존 세션 덮어쓰기)
  activeSessions[userId] = {
    sessionId,
    loginTime,
    lastActivity: loginTime,
    ip: '192.168.0.100'
  };
  saveActiveSessions(activeSessions);
  
  console.log('✅ [loginSession] 로그인 성공:', {
    userId,
    userRole: roleUpper,
    sessionId,
    hasConcurrentSession
  });
  
  return {
    success: true,
    message: '로그인 성공',
    sessionId,
    hasConcurrentSession, // 👈 중복 세션 여부 반환!
    existingSessionInfo,  // 👈 기존 세션 정보 반환!
    data: {
      userId,
      userName,
      userRole: roleUpper,
      sessionId,
      loginTime
    }
  };
};

// 4️⃣ 로그아웃 API (세션 삭제)
export const logoutSession = async () => {
  await delay(MOCK_DELAY);
  
  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  
  console.log('🚪 [logoutSession] 로그아웃:', { userId });
  
  // 로컬스토리지 세션 정보 삭제
  localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
  localStorage.removeItem(STORAGE_KEYS.USER_NAME);
  localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
  localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
  
  // 활성 세션에서 제거
  if (userId) {
    const activeSessions = getActiveSessions();
    delete activeSessions[userId];
    saveActiveSessions(activeSessions);
  }
  
  return {
    success: true,
    message: '로그아웃되었습니다.'
  };
};

// 5️⃣ 중복 로그인 체크 API
export const checkConcurrentSession = async () => {
  await delay(200);
  
  const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  
  if (!sessionId || !userId) {
    return { concurrent: false };
  }
  
  const activeSessions = getActiveSessions();
  const currentSession = activeSessions[userId];
  
  // 다른 세션이 활성화되어 있으면 중복 로그인
  if (currentSession && currentSession.sessionId !== sessionId) {
    return {
      concurrent: true,
      message: '다른 위치에서 로그인되었습니다.',
      newSession: {
        ip: currentSession.ip || '192.168.0.100',
        loginTime: currentSession.loginTime
      }
    };
  }
  
  return { concurrent: false };
};

// 6️⃣ 현재 세션 정보 조회
export const getCurrentSession = () => {
  return {
    sessionId: localStorage.getItem(STORAGE_KEYS.SESSION_ID),
    userId: localStorage.getItem(STORAGE_KEYS.USER_ID),
    userName: localStorage.getItem(STORAGE_KEYS.USER_NAME),
    userRole: localStorage.getItem(STORAGE_KEYS.USER_ROLE),
    lastActivity: localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY)
  };
};