// src/security/access/IpWhitelist.jsx
// IP 화이트리스트 검증 - 허용된 IP만 접근 가능

import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Shield, AlertTriangle, Globe } from 'lucide-react';

/**
 * IP 화이트리스트 컴포넌트
 * 
 * @param {boolean} enabled - IP 검증 활성화 여부
 * @param {string[]} allowedIPs - 허용된 IP 목록
 * @param {boolean} strictMode - 엄격 모드 (차단 시 로그인 불가)
 * @param {function} onIpBlocked - IP 차단 시 콜백
 */
const IpWhitelist = ({ 
  enabled = true,
  allowedIPs = [], // 예: ['192.168.0.*', '10.0.0.1', '127.0.0.1']
  strictMode = false,
  onIpBlocked = null
}) => {
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [currentIP, setCurrentIP] = useState('알 수 없음');
  const [isBlocked, setIsBlocked] = useState(false);

  // 🌐 현재 사용자 IP 가져오기 (Mock - 실제는 백엔드에서)
  const getCurrentIP = async () => {
    try {
      // 🔥 실제 환경에서는 백엔드 API 호출
      // const response = await fetch('/api/my-ip');
      // const data = await response.json();
      // return data.ip;

      // Mock: 로컬 개발 환경
      return '192.168.0.100'; // 테스트용 IP
    } catch (error) {
      console.error('[IpWhitelist] IP 조회 실패:', error);
      return '알 수 없음';
    }
  };

  // 🔍 IP가 화이트리스트에 있는지 확인
  const isIpAllowed = (ip, whitelist) => {
    if (!whitelist || whitelist.length === 0) {
      // 화이트리스트가 비어있으면 모두 허용
      return true;
    }

    for (const allowedPattern of whitelist) {
      // 완전 일치
      if (allowedPattern === ip) {
        return true;
      }

      // 와일드카드 패턴 (192.168.0.*)
      if (allowedPattern.includes('*')) {
        const regex = new RegExp(
          '^' + allowedPattern.replace(/\./g, '\\.').replace(/\*/g, '\\d+') + '$'
        );
        if (regex.test(ip)) {
          return true;
        }
      }

      // CIDR 표기법 (192.168.0.0/24) - 간단 구현
      if (allowedPattern.includes('/')) {
        const [network, bits] = allowedPattern.split('/');
        const ipParts = ip.split('.').map(Number);
        const networkParts = network.split('.').map(Number);
        const maskBits = parseInt(bits);
        
        // 간단한 서브넷 매칭 (IPv4 기준)
        if (maskBits >= 24) {
          const match = ipParts.slice(0, 3).every((part, idx) => part === networkParts[idx]);
          if (match) return true;
        }
      }
    }

    return false;
  };

  // 🔒 IP 검증
  useEffect(() => {
    if (!enabled) return;

    const checkIP = async () => {
      const ip = await getCurrentIP();
      setCurrentIP(ip);

      console.log('🌐 [IpWhitelist] IP 검증:', {
        currentIP: ip,
        allowedIPs,
        strictMode
      });

      const allowed = isIpAllowed(ip, allowedIPs);

      if (!allowed) {
        console.warn('🚫 [IpWhitelist] IP 차단:', ip);
        setIsBlocked(true);
        setShowBlockedModal(true);

        // 콜백 실행
        if (onIpBlocked) {
          onIpBlocked({ ip, allowedIPs });
        }

        // 엄격 모드: 강제 로그아웃
        if (strictMode) {
          setTimeout(() => {
            localStorage.clear();
            window.location.href = '/';
          }, 5000);
        }
      } else {
        console.log('✅ [IpWhitelist] IP 허용:', ip);
        setIsBlocked(false);
      }
    };

    checkIP();
  }, [enabled, allowedIPs, strictMode, onIpBlocked]);

  // 비활성화 또는 차단되지 않음
  if (!enabled || !isBlocked) {
    return null;
  }

  return (
    <Modal
      show={showBlockedModal}
      onHide={() => !strictMode && setShowBlockedModal(false)}
      backdrop={strictMode ? "static" : true}
      keyboard={!strictMode}
      centered
    >
      <Modal.Body
        style={{
          background: 'linear-gradient(135deg, rgba(60, 65, 90, 0.98) 0%, rgba(75, 80, 110, 0.98) 100%)',
          color: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid rgba(239, 68, 68, 0.4)'
        }}
      >
        <div className="text-center mb-4">
          <AlertTriangle size={64} className="text-danger mb-3" />
          <h4 className="fw-bold mb-2">접근 차단</h4>
          <p className="text-muted mb-0">
            현재 IP 주소는 허용되지 않습니다.
          </p>
        </div>

        {/* 현재 IP 정보 */}
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <div className="d-flex align-items-center mb-2">
            <Globe size={18} className="me-2 text-danger" />
            <strong>현재 IP 주소</strong>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ef4444' }}>
            {currentIP}
          </div>
        </div>

        {/* 안내 메시지 */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
            <div className="mb-2">
              <strong>📌 안내사항</strong>
            </div>
            <ul style={{ marginBottom: 0, paddingLeft: '1.2rem' }}>
              <li className="mb-1">
                이 시스템은 특정 IP 주소에서만 접근 가능합니다.
              </li>
              <li className="mb-1">
                회사 네트워크 또는 VPN에 연결되어 있는지 확인하세요.
              </li>
              <li>
                접근이 필요한 경우 시스템 관리자에게 문의하세요.
              </li>
            </ul>
          </div>
        </div>

        {/* 허용된 IP 범위 (개발 모드에서만 표시) */}
        {process.env.NODE_ENV === 'development' && allowedIPs.length > 0 && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ fontSize: '0.85rem' }}>
              <div className="mb-2">
                <strong>🔓 허용된 IP 범위 (개발 모드)</strong>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', opacity: 0.8 }}>
                {allowedIPs.map((ip, idx) => (
                  <div key={idx}>• {ip}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 버튼 */}
        {strictMode ? (
          <div className="text-center">
            <div style={{ 
              fontSize: '0.9rem', 
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '1rem'
            }}>
              5초 후 자동으로 로그아웃됩니다...
            </div>
            <Button
              variant="danger"
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none',
                padding: '0.75rem 2rem',
                fontWeight: '600'
              }}
            >
              <Shield size={18} className="me-2" />
              지금 로그아웃
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            onClick={() => setShowBlockedModal(false)}
            className="w-100"
            style={{
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              border: 'none',
              padding: '0.75rem',
              fontWeight: '600'
            }}
          >
            확인
          </Button>
        )}

        {/* 경고 */}
        <div
          style={{
            marginTop: '1rem',
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center'
          }}
        >
          ⚠️ 무단 접근 시도는 기록되며 법적 조치를 받을 수 있습니다
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default IpWhitelist;


// ========================================
// 🎯 사용 예시
// ========================================

/**
 * 1. App.jsx에 추가 (전역 적용)
 */
// import IpWhitelist from './security/access/IpWhitelist';
// 
// function App() {
//   return (
//     <SessionProvider>
//       <IpWhitelist 
//         enabled={true}
//         allowedIPs={[
//           '192.168.0.*',      // 사내 네트워크
//           '10.0.0.*',         // VPN
//           '127.0.0.1',        // 로컬 (개발용)
//           '203.241.132.0/24'  // CIDR 표기법
//         ]}
//         strictMode={false}  // true면 차단 시 강제 로그아웃
//       />
//       <Routes>...</Routes>
//     </SessionProvider>
//   );
// }

/**
 * 2. 특정 페이지에만 적용
 */
// const AdminPage = () => {
//   return (
//     <>
//       <IpWhitelist 
//         enabled={true}
//         allowedIPs={['192.168.0.1']}  // 관리자 PC만
//         strictMode={true}
//       />
//       <div>관리자 페이지</div>
//     </>
//   );
// };

/**
 * 3. 환경변수로 관리
 */
// const allowedIPs = process.env.REACT_APP_ALLOWED_IPS?.split(',') || [];
// 
// <IpWhitelist 
//   enabled={process.env.NODE_ENV === 'production'}
//   allowedIPs={allowedIPs}
// />

/**
 * 4. IP 차단 시 콜백
 */
// <IpWhitelist 
//   enabled={true}
//   allowedIPs={['192.168.0.*']}
//   onIpBlocked={({ ip, allowedIPs }) => {
//     console.log('차단된 IP:', ip);
//     // 백엔드에 로그 전송
//     sendSecurityLog('ip_blocked', { ip, timestamp: new Date() });
//   }}
// />

/**
 * 5. 백엔드에서 IP 가져오기 (실제 구현)
 */
// const getCurrentIP = async () => {
//   try {
//     const response = await fetch('/api/auth/my-ip', {
//       credentials: 'include'
//     });
//     const data = await response.json();
//     return data.ip;
//   } catch (error) {
//     console.error('IP 조회 실패:', error);
//     return null;
//   }
// };