// src/security/access/MenuAccessControl.jsx

import { filterMenuGroupsByRole } from '../../utils/menuPermissions.js';
import { useUserRole } from '../../hooks/useUserRole.js';

/**
 * 메뉴 접근 제어 HOC
 * 사용자 역할에 따라 메뉴를 필터링합니다
 */
const MenuAccessControl = ({ menuGroups, children }) => {
  const { userRole, loading } = useUserRole();

  // 로딩 중
  if (loading) {
    return children(menuGroups); // 로딩 중에는 전체 메뉴 표시
  }

  // 역할이 없으면 빈 배열 반환
  if (!userRole) {
    return children([]);
  }

  // 역할에 따라 메뉴 필터링
  const filteredMenus = filterMenuGroupsByRole(menuGroups, userRole);

  // 필터링된 메뉴를 children 함수에 전달
  return children(filteredMenus);
};

export default MenuAccessControl;