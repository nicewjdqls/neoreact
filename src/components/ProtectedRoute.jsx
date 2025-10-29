// src/components/ProtectedRoute.jsx
// 보호된 라우트 컴포넌트 (인증/인가)

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * 보호된 라우트 컴포넌트
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 *
 * @example
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 *
 * @example
 * <ProtectedRoute requiredRole="ADMIN">
 *   <AdminPanel />
 * </ProtectedRoute>
 */
export const ProtectedRoute = ({
  children,
  requiredRole = null,
  redirectTo = '/login',
  fallback = null
}) => {
  const { isAuthenticated, hasPermission, status } = useAuth();
  const location = useLocation();

  // 로딩 중
  if (status === 'loading') {
    return (
      fallback || (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      )
    );
  }

  // 인증되지 않음
  if (!isAuthenticated) {
    console.warn('⚠️ [ProtectedRoute] 미인증 사용자 - 로그인 페이지로 리다이렉트');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 권한 체크
  if (requiredRole && !hasPermission(requiredRole)) {
    console.warn('⚠️ [ProtectedRoute] 권한 부족:', requiredRole);
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">접근 권한 없음</h4>
          <p>이 페이지에 접근할 권한이 없습니다.</p>
          <hr />
          <p className="mb-0">필요한 권한: <strong>{requiredRole}</strong></p>
        </div>
      </div>
    );
  }

  console.log('✅ [ProtectedRoute] 접근 허용');
  return children;
};

/**
 * 역 보호 라우트 (로그인한 사용자는 접근 불가)
 * 예: 로그인 페이지, 회원가입 페이지
 *
 * @example
 * <PublicOnlyRoute>
 *   <LoginPage />
 * </PublicOnlyRoute>
 */
export const PublicOnlyRoute = ({
  children,
  redirectTo = '/'
}) => {
  const { isAuthenticated, status } = useAuth();

  // 로딩 중
  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
      </div>
    );
  }

  // 이미 로그인됨
  if (isAuthenticated) {
    console.log('ℹ️ [PublicOnlyRoute] 이미 로그인됨 - 메인 페이지로 리다이렉트');
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

/**
 * 역할 기반 라우트 (특정 역할만 접근 가능)
 *
 * @example
 * <RoleBasedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
 *   <AdminDashboard />
 * </RoleBasedRoute>
 */
export const RoleBasedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = '/unauthorized',
  fallback = null
}) => {
  const { isAuthenticated, user, status } = useAuth();
  const location = useLocation();

  // 로딩 중
  if (status === 'loading') {
    return (
      fallback || (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      )
    );
  }

  // 인증되지 않음
  if (!isAuthenticated) {
    console.warn('⚠️ [RoleBasedRoute] 미인증 사용자');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 역할 체크
  if (!allowedRoles.includes(user?.userRole)) {
    console.warn('⚠️ [RoleBasedRoute] 허용되지 않은 역할:', user?.userRole);
    return <Navigate to={redirectTo} replace />;
  }

  console.log('✅ [RoleBasedRoute] 접근 허용:', user?.userRole);
  return children;
};

/**
 * 조건부 라우트 (커스텀 조건)
 *
 * @example
 * <ConditionalRoute condition={(user) => user.isEmailVerified}>
 *   <VerifiedUserPage />
 * </ConditionalRoute>
 */
export const ConditionalRoute = ({
  children,
  condition,
  redirectTo = '/',
  fallbackMessage = '접근 조건을 만족하지 않습니다.'
}) => {
  const { isAuthenticated, user, status } = useAuth();
  const location = useLocation();

  // 로딩 중
  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
      </div>
    );
  }

  // 인증되지 않음
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 조건 체크
  if (typeof condition === 'function' && !condition(user)) {
    console.warn('⚠️ [ConditionalRoute] 조건 불만족');
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">접근 제한</h4>
          <p>{fallbackMessage}</p>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * 권한 게이트 (컴포넌트 내부에서 사용)
 *
 * @example
 * <PermissionGate requiredRole="ADMIN" fallback={<AccessDenied />}>
 *   <AdminButton />
 * </PermissionGate>
 */
export const PermissionGate = ({
  children,
  requiredRole = null,
  fallback = null
}) => {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return fallback;
  }

  if (requiredRole && !hasPermission(requiredRole)) {
    return fallback;
  }

  return children;
};

export default ProtectedRoute;
