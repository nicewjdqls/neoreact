// src/security/access/PermissionGate.jsx
// 컴포넌트 레벨 권한 제어 - 특정 권한이 있을 때만 자식 컴포넌트 렌더링

import React from 'react';
import { STORAGE_KEYS } from '../../constants/sessionConstants.js';

/**
 * 권한 게이트 컴포넌트
 * 
 * @param {string|string[]} require - 필요한 권한 (단일 또는 배열)
 * @param {string} mode - 'any' (하나라도 만족) 또는 'all' (모두 만족)
 * @param {React.ReactNode} children - 권한이 있을 때 렌더링할 컴포넌트
 * @param {React.ReactNode} fallback - 권한이 없을 때 렌더링할 컴포넌트 (선택)
 * @param {boolean} hideOnFail - 권한 없을 때 아예 숨김 (기본: true)
 * 
 * @example
 * // 단일 권한 체크
 * <PermissionGate require="ADMIN">
 *   <button>삭제</button>
 * </PermissionGate>
 * 
 * @example
 * // 여러 권한 중 하나라도 만족 (OR)
 * <PermissionGate require={["ADMIN", "USER"]} mode="any">
 *   <button>수정</button>
 * </PermissionGate>
 * 
 * @example
 * // 모든 권한 필요 (AND)
 * <PermissionGate require={["ADMIN", "SUPERUSER"]} mode="all">
 *   <button>시스템 설정</button>
 * </PermissionGate>
 * 
 * @example
 * // 권한 없을 때 대체 컴포넌트 표시
 * <PermissionGate 
 *   require="ADMIN" 
 *   fallback={<span className="text-gray-400">권한 없음</span>}
 * >
 *   <button>관리자 기능</button>
 * </PermissionGate>
 */
const PermissionGate = ({ 
  require, 
  mode = 'any', 
  children, 
  fallback = null,
  hideOnFail = true 
}) => {
  // 현재 사용자 권한 가져오기
  const getUserRole = () => {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  };

  // 권한 체크 함수
  const checkPermission = () => {
    const userRole = getUserRole();
    
    // 로그인 안 한 경우
    if (!userRole) {
      console.log('⚠️ [PermissionGate] 권한 없음 - 로그인 필요');
      return false;
    }

    // 필요한 권한이 배열인 경우
    if (Array.isArray(require)) {
      if (mode === 'all') {
        // 모든 권한 필요 (AND)
        const hasAllPermissions = require.every(role => userRole === role);
        console.log(`🔒 [PermissionGate] 권한 체크 (ALL):`, {
          userRole,
          required: require,
          result: hasAllPermissions
        });
        return hasAllPermissions;
      } else {
        // 하나라도 만족 (OR)
        const hasAnyPermission = require.some(role => userRole === role);
        console.log(`🔒 [PermissionGate] 권한 체크 (ANY):`, {
          userRole,
          required: require,
          result: hasAnyPermission
        });
        return hasAnyPermission;
      }
    }

    // 단일 권한 체크
    const hasPermission = userRole === require;
    console.log(`🔒 [PermissionGate] 권한 체크:`, {
      userRole,
      required: require,
      result: hasPermission
    });
    return hasPermission;
  };

  // 권한 확인
  const hasPermission = checkPermission();

  // 권한이 있으면 자식 컴포넌트 렌더링
  if (hasPermission) {
    return <>{children}</>;
  }

  // 권한이 없을 때
  if (hideOnFail) {
    // 완전히 숨김
    return null;
  } else {
    // fallback 컴포넌트 렌더링
    return <>{fallback}</>;
  }
};

export default PermissionGate;


// ========================================
// 🎯 사용 예시
// ========================================

/**
 * 1. 기본 사용 (ADMIN만 버튼 보임)
 */
// <PermissionGate require="ADMIN">
//   <button className="btn-danger">삭제</button>
// </PermissionGate>

/**
 * 2. 여러 권한 허용 (ADMIN 또는 USER)
 */
// <PermissionGate require={["ADMIN", "USER"]} mode="any">
//   <button className="btn-primary">수정</button>
// </PermissionGate>

/**
 * 3. 모든 권한 필요 (ADMIN이면서 SUPERUSER)
 */
// <PermissionGate require={["ADMIN", "SUPERUSER"]} mode="all">
//   <button className="btn-warning">시스템 설정</button>
// </PermissionGate>

/**
 * 4. 권한 없을 때 대체 UI 표시
 */
// <PermissionGate 
//   require="ADMIN"
//   hideOnFail={false}
//   fallback={
//     <button className="btn-disabled" disabled>
//       삭제 (권한 없음)
//     </button>
//   }
// >
//   <button className="btn-danger">삭제</button>
// </PermissionGate>

/**
 * 5. 테이블 행 단위 권한 제어
 */
// <table>
//   <tbody>
//     {users.map(user => (
//       <tr key={user.id}>
//         <td>{user.name}</td>
//         <td>
//           <PermissionGate require="ADMIN">
//             <button onClick={() => handleDelete(user.id)}>
//               삭제
//             </button>
//           </PermissionGate>
//         </td>
//       </tr>
//     ))}
//   </tbody>
// </table>

/**
 * 6. 섹션 전체 권한 제어
 */
// <PermissionGate require="ADMIN">
//   <div className="admin-panel">
//     <h2>관리자 패널</h2>
//     <button>사용자 관리</button>
//     <button>시스템 설정</button>
//   </div>
// </PermissionGate>

/**
 * 7. 조건부 스타일 적용
 */
// <div className="card">
//   <h3>프로필</h3>
//   <PermissionGate require={["ADMIN", "USER"]}>
//     <button>프로필 수정</button>
//   </PermissionGate>
//   <PermissionGate require="GUEST">
//     <p className="text-muted">게스트는 수정 불가</p>
//   </PermissionGate>
// </div>