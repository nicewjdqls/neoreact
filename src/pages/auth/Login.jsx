// src/pages/auth/Login.jsx
// 로그인 페이지 예제

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { XSSProtection, InputValidation } from '../../utils/securityUtils';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, status } = useAuth();

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    rememberMe: true
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 후 리다이렉트할 경로
  const from = location.state?.from?.pathname || '/';

  /**
   * 입력값 변경 핸들러
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // XSS 방어 - 입력값 정리
    const sanitizedValue = type === 'checkbox' ? checked : XSSProtection.sanitizeInput(value);

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : sanitizedValue
    }));

    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * 폼 검증
   */
  const validateForm = () => {
    const newErrors = {};

    // 사용자 ID 검증
    if (!formData.userId.trim()) {
      newErrors.userId = '사용자 ID를 입력하세요.';
    } else if (formData.userId.length < 3) {
      newErrors.userId = '사용자 ID는 최소 3자 이상이어야 합니다.';
    } else if (InputValidation.detectSQLInjection(formData.userId)) {
      newErrors.userId = '유효하지 않은 문자가 포함되어 있습니다.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력하세요.';
    } else if (formData.password.length < 4) {
      newErrors.password = '비밀번호는 최소 4자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 로그인 제출
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 폼 검증
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 로그인 시도
      const result = await login(
        {
          userId: formData.userId,
          password: formData.password,
          userName: formData.userId, // Mock
          userRole: 'USER' // Mock
        },
        {
          rememberUser: formData.rememberMe
        }
      );

      if (result.success) {
        console.log('✅ [Login] 로그인 성공');
        navigate(from, { replace: true });
      } else {
        setErrors({
          general: result.error || '로그인에 실패했습니다.'
        });
      }
    } catch (error) {
      console.error('❌ [Login] 로그인 오류:', error);
      setErrors({
        general: '로그인 중 오류가 발생했습니다.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">로그인</h2>

              {errors.general && (
                <div className="alert alert-danger" role="alert">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* 사용자 ID */}
                <div className="mb-3">
                  <label htmlFor="userId" className="form-label">
                    사용자 ID
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.userId ? 'is-invalid' : ''}`}
                    id="userId"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    placeholder="사용자 ID를 입력하세요"
                    autoComplete="username"
                    disabled={isLoading}
                  />
                  {errors.userId && (
                    <div className="invalid-feedback">{errors.userId}</div>
                  )}
                </div>

                {/* 비밀번호 */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력하세요"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                {/* 로그인 유지 */}
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    로그인 유지
                  </label>
                </div>

                {/* 로그인 버튼 */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      로그인 중...
                    </>
                  ) : (
                    '로그인'
                  )}
                </button>
              </form>

              <hr className="my-4" />

              {/* 추가 링크 */}
              <div className="text-center">
                <p className="mb-0">
                  <small className="text-muted">
                    테스트 계정: admin / admin
                  </small>
                </p>
              </div>
            </div>
          </div>

          {/* 보안 정보 */}
          <div className="card mt-3">
            <div className="card-body">
              <h6 className="card-title">보안 기능</h6>
              <ul className="list-unstyled small text-muted mb-0">
                <li>✓ XSS 공격 방어</li>
                <li>✓ CSRF 토큰 보호</li>
                <li>✓ 입력값 검증 및 정리</li>
                <li>✓ 세션 암호화 저장</li>
                <li>✓ SQL Injection 방어</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
