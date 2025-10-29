// src/utils/menuPermissions.js

import { USER_ROLES } from '../constants/roleConstants.js';

// 메뉴별 접근 권한 정의
export const MENU_PERMISSIONS = {
  // ✅ 모든 사용자 접근 가능
  '/main1': [USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.GUEST],           // 모니터링
  '/chat': [USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.GUEST],            // AI Chat관리
  '/authorizationRequest': [USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.GUEST], // 권한신청
  
  // 🔒 ADMIN만 접근 가능
  '/datacollector': [USER_ROLES.ADMIN],        // 데이터 수집
  '/modelmanage': [USER_ROLES.ADMIN],          // 학습모델
  '/Apimanage': [USER_ROLES.ADMIN],            // APIs
  '/auth': [USER_ROLES.ADMIN],                 // 권한관리
  '/authaprove': [USER_ROLES.ADMIN],           // 권한승인
  '/menu': [USER_ROLES.ADMIN],                 // 메뉴관리
  '/code': [USER_ROLES.ADMIN]                  // 코드관리
};

/**
 * 사용자 역할에 따라 접근 가능한 메뉴인지 확인
 * @param {string} menuPath - 메뉴 경로
 * @param {string} userRole - 사용자 역할
 * @returns {boolean} 접근 가능 여부
 */
export const canAccessMenu = (menuPath, userRole) => {
  const allowedRoles = MENU_PERMISSIONS[menuPath];
  
  // 권한이 정의되지 않은 메뉴는 기본적으로 ADMIN만 접근 가능
  if (!allowedRoles) {
    return userRole === USER_ROLES.ADMIN;
  }
  
  return allowedRoles.includes(userRole);
};

/**
 * 사용자 역할에 따라 메뉴 목록 필터링
 * @param {Array} menuItems - 전체 메뉴 목록
 * @param {string} userRole - 사용자 역할
 * @returns {Array} 필터링된 메뉴 목록
 */
export const filterMenusByRole = (menuItems, userRole) => {
  return menuItems.filter(item => canAccessMenu(item.path, userRole));
};

/**
 * 사용자 역할에 따라 메뉴 그룹 필터링
 * @param {Array} menuGroups - 전체 메뉴 그룹
 * @param {string} userRole - 사용자 역할
 * @returns {Array} 필터링된 메뉴 그룹
 */
export const filterMenuGroupsByRole = (menuGroups, userRole) => {
  return menuGroups
    .map(group => ({
      ...group,
      items: filterMenusByRole(group.items, userRole)
    }))
    .filter(group => group.items.length > 0); // 항목이 없는 그룹 제거
};