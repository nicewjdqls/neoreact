// src/security/access/DeviceFingerprint.jsx
// 디바이스 지문 인증 - 브라우저/OS/해상도 등으로 디바이스 식별

import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Shield, AlertTriangle, Monitor, Info } from 'lucide-react';

/**
 * 디바이스 지문 생성 함수
 * 브라우저, OS, 화면 해상도, 타임존 등을 조합해서 고유 해시 생성
 */
const generateFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('fingerprint', 2, 2);
  const canvasHash = canvas.toDataURL().slice(-50);

  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    canvas: canvasHash,
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    deviceMemory: navigator.deviceMemory || 'unknown',
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack || 'unknown',
    plugins: Array.from(navigator.plugins || []).map(p => p.name).join(',').slice(0, 100)
  };

  // 해시 생성 (간단한 해싱)
  const fingerprintString = JSON.stringify(fingerprint);
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const char = fingerprintString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return {
    hash: Math.abs(hash).toString(36),
    details: fingerprint
  };
};

/**
 * 디바이스 지문 인증 컴포넌트
 * 
 * @param {boolean} enabled - 디바이스 인증 활성화 여부
 * @param {function} onNewDevice - 새 디바이스 감지 시 콜백
 * @param {boolean} strictMode - 엄격 모드 (새 디바이스 차단)
 */
const DeviceFingerprint = ({ 
  enabled = true, 
  onNewDevice = null,
  strictMode = false 
}) => {
  const [showNewDeviceModal, setShowNewDeviceModal] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [trustedDevices, setTrustedDevices] = useState([]);

  useEffect(() => {
    if (!enabled) return;

    // 현재 디바이스 지문 생성
    const currentDevice = generateFingerprint();
    setDeviceInfo(currentDevice.details);

    console.log('🔐 [DeviceFingerprint] 디바이스 지문 생성:', {
      hash: currentDevice.hash,
      browser: currentDevice.details.userAgent,
      screen: currentDevice.details.screenResolution
    });

    // 저장된 신뢰 디바이스 목록 가져오기
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const storageKey = `trusted_devices_${userId}`;
    const savedDevices = localStorage.getItem(storageKey);
    const devices = savedDevices ? JSON.parse(savedDevices) : [];
    setTrustedDevices(devices);

    // 현재 디바이스가 신뢰 목록에 있는지 확인
    const isKnownDevice = devices.some(d => d.hash === currentDevice.hash);

    if (!isKnownDevice) {
      console.warn('⚠️ [DeviceFingerprint] 새로운 디바이스 감지!');
      
      // 새 디바이스 정보 저장
      const newDevice = {
        hash: currentDevice.hash,
        details: currentDevice.details,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        trusted: !strictMode // 엄격 모드가 아니면 자동 신뢰
      };

      // 콜백 실행
      if (onNewDevice) {
        onNewDevice(newDevice);
      }

      // 모달 표시
      if (!strictMode) {
        setShowNewDeviceModal(true);
      }

      // 신뢰 디바이스로 추가 (엄격 모드가 아닐 때)
      if (!strictMode) {
        const updatedDevices = [...devices, newDevice];
        localStorage.setItem(storageKey, JSON.stringify(updatedDevices));
        setTrustedDevices(updatedDevices);
      }
    } else {
      console.log('✅ [DeviceFingerprint] 신뢰된 디바이스');
      
      // 마지막 접속 시간 업데이트
      const updatedDevices = devices.map(d => 
        d.hash === currentDevice.hash 
          ? { ...d, lastSeen: new Date().toISOString() }
          : d
      );
      localStorage.setItem(storageKey, JSON.stringify(updatedDevices));
    }
  }, [enabled, onNewDevice, strictMode]);

  // 디바이스 신뢰 처리
  const handleTrustDevice = () => {
    console.log('✅ [DeviceFingerprint] 디바이스 신뢰 확인');
    setShowNewDeviceModal(false);
  };

  // 신뢰하지 않고 로그아웃
  const handleDenyDevice = () => {
    console.warn('🚫 [DeviceFingerprint] 디바이스 신뢰 거부 - 로그아웃');
    
    // 현재 디바이스 제거
    const userId = localStorage.getItem('userId');
    const storageKey = `trusted_devices_${userId}`;
    const currentDevice = generateFingerprint();
    
    const updatedDevices = trustedDevices.filter(d => d.hash !== currentDevice.hash);
    localStorage.setItem(storageKey, JSON.stringify(updatedDevices));
    
    // 모달 닫기
    setShowNewDeviceModal(false);
    
    // 세션 완전 삭제 (로그아웃)
    localStorage.removeItem('sessionId');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('lastActivity');
    
    // 약간의 지연 후 로그인 페이지로 이동
    setTimeout(() => {
      window.location.href = '/';
    }, 300);
  };

  // 비활성화 시 렌더링 안 함
  if (!enabled) {
    return null;
  }

  return (
    <>
      {/* 새 디바이스 감지 모달 */}
      <Modal
        show={showNewDeviceModal}
        onHide={() => {}}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body
          style={{
            background: 'linear-gradient(135deg, rgba(60, 65, 90, 0.98) 0%, rgba(75, 80, 110, 0.98) 100%)',
            color: '#fff',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}
        >
          <div className="text-center mb-4">
            <AlertTriangle size={64} className="text-warning mb-3" />
            <h4 className="fw-bold mb-2">새로운 디바이스 감지</h4>
            <p className="text-muted mb-0">
              이 계정이 새로운 디바이스에서 접속되었습니다.
            </p>
          </div>

          {deviceInfo && (
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              <div className="d-flex align-items-center mb-2">
                <Monitor size={18} className="me-2 text-primary" />
                <strong>디바이스 정보</strong>
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                <div className="mb-1">
                  <strong>브라우저:</strong> {deviceInfo.userAgent.split(' ').slice(0, 3).join(' ')}...
                </div>
                <div className="mb-1">
                  <strong>플랫폼:</strong> {deviceInfo.platform}
                </div>
                <div className="mb-1">
                  <strong>화면 해상도:</strong> {deviceInfo.screenResolution}
                </div>
                <div className="mb-1">
                  <strong>타임존:</strong> {deviceInfo.timezone}
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              background: 'rgba(79, 70, 229, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            <div className="d-flex align-items-start">
              <Info size={18} className="me-2 text-info mt-1" />
              <div style={{ fontSize: '0.85rem' }}>
                본인의 접속이 맞다면 <strong>"신뢰"</strong>를 선택하세요.
                본인이 아니라면 즉시 <strong>"거부"</strong>를 선택하고 비밀번호를 변경하세요.
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="success"
              onClick={handleTrustDevice}
              className="flex-fill"
              style={{
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                border: 'none',
                padding: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Shield size={18} />
              <span>이 디바이스 신뢰</span>
            </Button>
            <Button
              variant="danger"
              onClick={handleDenyDevice}
              className="flex-fill"
              style={{
                background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                border: 'none',
                padding: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span>거부 및 로그아웃</span>
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DeviceFingerprint;


// ========================================
// 🎯 사용 예시
// ========================================

/**
 * 1. App.jsx에 추가 (전역 적용)
 */
// import DeviceFingerprint from './security/access/DeviceFingerprint';
// 
// function App() {
//   return (
//     <SessionProvider>
//       <DeviceFingerprint enabled={true} />
//       <Routes>
//         ...
//       </Routes>
//     </SessionProvider>
//   );
// }

/**
 * 2. 새 디바이스 감지 시 콜백 사용
 */
// <DeviceFingerprint 
//   enabled={true}
//   onNewDevice={(device) => {
//     console.log('새 디바이스:', device);
//     // 백엔드에 알림 전송
//     sendNotification(device);
//   }}
// />

/**
 * 3. 엄격 모드 (새 디바이스 차단)
 */
// <DeviceFingerprint 
//   enabled={true}
//   strictMode={true}  // 새 디바이스 자동 차단
// />

/**
 * 4. 신뢰 디바이스 목록 관리
 */
// const ManageDevices = () => {
//   const userId = localStorage.getItem('userId');
//   const devices = JSON.parse(localStorage.getItem(`trusted_devices_${userId}`) || '[]');
//   
//   return (
//     <div>
//       <h3>신뢰 디바이스 목록</h3>
//       {devices.map((device, index) => (
//         <div key={index}>
//           <p>{device.details.platform} - {device.details.screenResolution}</p>
//           <p>첫 접속: {new Date(device.firstSeen).toLocaleString()}</p>
//           <button onClick={() => removeDevice(device.hash)}>제거</button>
//         </div>
//       ))}
//     </div>
//   );
// };