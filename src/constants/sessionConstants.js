// src/constants/sessionConstants.js

// 🔧 개발/프로덕션 모드 구분
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// ⏰ 세션 타임아웃 설정 (밀리초)
export const SESSION_TIMEOUT = IS_DEVELOPMENT 
  ? 11 * 60 * 1000       // 개발: 11분 (프로덕션과 동일하게)
  : 11 * 60 * 1000;      // 프로덕션: 11분

// ⚠️ 세션 경고 시점 (10분 경과 시)
export const SESSION_WARNING_TIME = IS_DEVELOPMENT
  ? 10 * 60 * 1000       // 개발: 10분 (프로덕션과 동일하게)
  : 10 * 60 * 1000;      // 프로덕션: 10분

// 🔄 세션 자동 갱신 주기
export const SESSION_REFRESH_INTERVAL = IS_DEVELOPMENT
  ? null                 // 개발: 자동 갱신 비활성화
  : null;                // 프로덕션: 자동 갱신 비활성화

// 🎯 활동 감지 이벤트 목록
export const ACTIVITY_EVENTS = [
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'click'
];

// 📝 세션 상태
export const SESSION_STATUS = {
  ACTIVE: 'active',           // 활성
  WARNING: 'warning',         // 경고 (곧 만료)
  EXPIRED: 'expired',         // 만료됨
  LOGGED_OUT: 'logged_out'    // 로그아웃됨
};

// 🚫 세션 만료 이유
export const SESSION_EXPIRY_REASON = {
  INACTIVITY: 'inactivity',           // 비활동
  TIMEOUT: 'timeout',                 // 타임아웃
  CONCURRENT_LOGIN: 'concurrent',     // 중복 로그인
  MANUAL_LOGOUT: 'manual',            // 수동 로그아웃
  SERVER_ERROR: 'server_error'        // 서버 오류
};

// 🔐 로컬스토리지 키
export const STORAGE_KEYS = {
  USER_ID: 'userId',
  USER_NAME: 'userName',
  USER_ROLE: 'userRole',
  SESSION_ID: 'sessionId',
  LAST_ACTIVITY: 'lastActivity'
};

// 🌐 API 엔드포인트 (Mock)
export const API_ENDPOINTS = {
  SESSION_VALIDATE: '/api/session/validate',
  SESSION_REFRESH: '/api/session/refresh',
  SESSION_LOGOUT: '/api/session/logout',
  SESSION_CHECK: '/api/session/check'
};

// ⏱️ 시간 포맷
export const TIME_FORMAT = {
  SHORT: 'HH:mm:ss',
  LONG: 'YYYY-MM-DD HH:mm:ss'
};

// 🎨 디버그 모드 (콘솔 로그 표시)
export const DEBUG_MODE = IS_DEVELOPMENT;

// 📊 경고 메시지
export const WARNING_MESSAGES = {
  SESSION_EXPIRING: '세션이 곧 만료됩니다.',
  SESSION_EXPIRED: '세션이 만료되었습니다.',
  CONCURRENT_LOGIN: '다른 위치에서 로그인되었습니다.',
  INACTIVITY_DETECTED: '비활동이 감지되었습니다.'
};