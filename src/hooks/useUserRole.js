// src/hooks/useUserRole.js

import { useState, useEffect } from 'react';
import { USER_ROLES } from '../constants/roleConstants.js';

/**
 * 사용자 역할 정보를 가져오는 커스텀 훅
 * @returns {Object} { userRole, isAdmin, isUser, isGuest, loading }
 */
export const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = () => {
    try {
      // localStorage에서 역할 가져오기
      const storedRole = localStorage.getItem('userRole');
      
      // sessionStorage에서 사용자 정보 가져오기
      const userDisplay = sessionStorage.getItem('userDisplay');
      
      if (storedRole) {
        // localStorage에 역할이 있으면 사용
        setUserRole(storedRole.toUpperCase());
      } else if (userDisplay) {
        // sessionStorage에서 사용자 정보 파싱
        try {
          const parsed = JSON.parse(userDisplay);
          if (parsed.isGuest) {
            setUserRole(USER_ROLES.GUEST);
          } else {
            // 기본값은 USER
            setUserRole(USER_ROLES.USER);
          }
        } catch {
          setUserRole(USER_ROLES.GUEST);
        }
      } else {
        // 정보가 없으면 GUEST
        setUserRole(USER_ROLES.GUEST);
      }
    } catch (error) {
      console.error('역할 로드 오류:', error);
      setUserRole(USER_ROLES.GUEST);
    } finally {
      setLoading(false);
    }
  };

  return {
    userRole,
    isAdmin: userRole === USER_ROLES.ADMIN,
    isUser: userRole === USER_ROLES.USER,
    isGuest: userRole === USER_ROLES.GUEST,
    loading
  };
};