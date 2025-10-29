// src/constants/roleConstants.js

// 사용자 역할
export const USER_ROLES = {
  ADMIN: 'ADMIN',           // 관리자 (전체 권한)
  USER: 'USER',             // 일반 사용자
  GUEST: 'GUEST'            // 게스트
};

// 권한 레벨
export const PERMISSION_LEVELS = {
  FULL: 'FULL',             // 전체 접근
  LIMITED: 'LIMITED',       // 제한적 접근
  READ_ONLY: 'READ_ONLY',   // 읽기만
  NONE: 'NONE'              // 접근 불가
};

// 메뉴 카테고리
export const MENU_CATEGORIES = {
  MAIN: 'MAIN',             // 메인 메뉴
  MONITORING: 'MONITORING', // 모니터링
  MANAGEMENT: 'MANAGEMENT', // 관리
  SETTINGS: 'SETTINGS'      // 설정
};