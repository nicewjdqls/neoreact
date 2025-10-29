// src/pages/auth/Dashboard.jsx
// 대시보드 페이지 예제 (보호된 페이지)

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DataMasking } from '../../utils/securityUtils';
import { BrowserStorage } from '../../utils/browserStorage';

const Dashboard = () => {
  const { user, logout, sessionId, lastActivity, config } = useAuth();
  const navigate = useNavigate();

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  /**
   * 저장소 정보 확인
   */
  const getStorageInfo = () => {
    const storageType = config.storageType;
    const useEncryption = config.useEncryption;

    const storageTypeLabel = {
      local: '로컬 스토리지 (영구 저장)',
      session: '세션 스토리지 (브라우저 닫으면 삭제)',
      cookie: '쿠키 (서버와 공유 가능)'
    }[storageType] || '알 수 없음';

    return {
      type: storageTypeLabel,
      encrypted: useEncryption ? '예 (암호화됨)' : '아니오'
    };
  };

  const storageInfo = getStorageInfo();

  /**
   * 세션 시간 포맷
   */
  const formatLastActivity = (timestamp) => {
    if (!timestamp) return '알 수 없음';
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR');
  };

  /**
   * 역할 배지 색상
   */
  const getRoleBadgeClass = (role) => {
    const roleColors = {
      'SUPER_ADMIN': 'danger',
      'ADMIN': 'warning',
      'MANAGER': 'info',
      'USER': 'primary',
      'GUEST': 'secondary'
    };
    return `badge bg-${roleColors[role] || 'secondary'}`;
  };

  /**
   * 저장소 테스트
   */
  const testStorage = () => {
    try {
      // 쿠키 테스트
      BrowserStorage.set('test_cookie', 'Hello Cookie!', { type: 'cookie', days: 1 });
      const cookieValue = BrowserStorage.get('test_cookie', { type: 'cookie' });
      console.log('🍪 Cookie:', cookieValue);

      // 로컬 스토리지 테스트
      BrowserStorage.set('test_local', { message: 'Hello Local Storage!' }, { type: 'local' });
      const localValue = BrowserStorage.get('test_local', { type: 'local' });
      console.log('💾 Local Storage:', localValue);

      // 세션 스토리지 테스트
      BrowserStorage.set('test_session', 'Hello Session Storage!', { type: 'session' });
      const sessionValue = BrowserStorage.get('test_session', { type: 'session' });
      console.log('📦 Session Storage:', sessionValue);

      alert('저장소 테스트 완료! 콘솔을 확인하세요.');
    } catch (error) {
      console.error('❌ 저장소 테스트 실패:', error);
      alert('저장소 테스트 실패: ' + error.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          {/* 헤더 */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>대시보드</h1>
            <button className="btn btn-danger" onClick={handleLogout}>
              로그아웃
            </button>
          </div>

          {/* 사용자 정보 카드 */}
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">사용자 정보</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <strong>사용자 ID:</strong>
                  <p className="mb-0">{user?.userId}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>사용자 이름:</strong>
                  <p className="mb-0">{user?.userName}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>역할:</strong>
                  <p className="mb-0">
                    <span className={getRoleBadgeClass(user?.userRole)}>
                      {user?.userRole}
                    </span>
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>이메일:</strong>
                  <p className="mb-0">{DataMasking.maskEmail(user?.email)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 세션 정보 카드 */}
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">세션 정보</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <strong>세션 ID:</strong>
                  <p className="mb-0">
                    <code className="small">{sessionId?.substring(0, 20)}...</code>
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>마지막 활동:</strong>
                  <p className="mb-0">{formatLastActivity(lastActivity)}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>저장소 타입:</strong>
                  <p className="mb-0">{storageInfo.type}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>암호화:</strong>
                  <p className="mb-0">{storageInfo.encrypted}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 보안 기능 카드 */}
          <div className="card mb-4">
            <div className="card-header bg-warning">
              <h5 className="mb-0">활성화된 보안 기능</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <span className="badge bg-success">✓</span> XSS 공격 방어
                    </li>
                    <li className="mb-2">
                      <span className="badge bg-success">✓</span> CSRF 토큰 보호
                    </li>
                    <li className="mb-2">
                      <span className="badge bg-success">✓</span> 입력값 검증
                    </li>
                    <li className="mb-2">
                      <span className="badge bg-success">✓</span> SQL Injection 방어
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <span className="badge bg-success">✓</span> 세션 암호화
                    </li>
                    <li className="mb-2">
                      <span className="badge bg-success">✓</span> 세션 타임아웃
                    </li>
                    <li className="mb-2">
                      <span className="badge bg-success">✓</span> 자동 세션 갱신
                    </li>
                    <li className="mb-2">
                      <span className="badge bg-success">✓</span> 데이터 마스킹
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 테스트 버튼 */}
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">테스트 도구</h5>
            </div>
            <div className="card-body">
              <button className="btn btn-primary" onClick={testStorage}>
                브라우저 저장소 테스트
              </button>
              <p className="mt-3 mb-0 text-muted small">
                이 버튼을 클릭하면 쿠키, 로컬 스토리지, 세션 스토리지에 테스트 데이터를 저장하고 콘솔에 출력합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
