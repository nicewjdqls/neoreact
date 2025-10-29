// src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 🔒 Session 관련 import
import { SessionProvider } from './contexts/SessionContext';
import SessionGuard from './security/session/SessionGuard';

// 🔐 Access 보안 컴포넌트
import DeviceFingerprint from './security/access/DeviceFingerprint';
import IpWhitelist from './security/access/IpWhitelist';

// 📄 기존 페이지 import
import Index from './pages/UserAuthorizationMgt/index.jsx';
import Main1 from './pages/main/Main1.jsx';
import Menu from './pages/menu/Menu.jsx';
import Chat from './pages/chat/Chat.jsx';
import Code from './pages/code/Code.jsx';
import Auth from './pages/auth/Auth.jsx';
import Authaprove from './pages/auth/Authaprove.jsx';
import AuthorizationRequest from './pages/auth/AuthorizationRequest.jsx';
import Datacollector from './pages/data/Datacollector.jsx';
import DataCollectorWrapper from './pages/data/DataCollectorWrapper.jsx';
import Datacollectorchain from './pages/data/Datacollectorchain.jsx';
import Memberjoint from './pages/members/Memberjoint.jsx';
import Modelmanage from './pages/models/Modelmanage.jsx';
import ModelmanageWrapper from './pages/models/ModelmanageWrapper.jsx';  // 🆕 추가
import Apimanage from './pages/apimanage/Apimanage.jsx';
import StatSession from './pages/stats/StatSession.jsx';
import StatResponse from './pages/stats/StatResponse.jsx';
import StatToken from './pages/stats/StatToken.jsx';
import StatServer from './pages/stats/StatServer.jsx';
import StatSLLMModel from './pages/stats/StatSLLMModel.jsx';
import StatDataCollector from './pages/stats/StatDataCollector.jsx';
import StatNode from './pages/stats/StatNode.jsx';
import StatTotalMonitor from './pages/stats/StatTotalMonitor.jsx';
import StatAlarm from './pages/stats/StatAlarm.jsx';
import StatAPIs from './pages/stats/StatAPIs.jsx';
import StatSatisfaction from './pages/stats/StatSatisfaction.jsx';
import SourceDBConfig from './pages/data/SourceDBConfig.jsx';

export default function App() {
  // 🔧 보안 설정
  const DEVICE_FINGERPRINT_ENABLED = false; // 디바이스 지문 인증 (선택)
  const DEVICE_STRICT_MODE = false; // 엄격 모드
  
  const IP_WHITELIST_ENABLED = true; // IP 화이트리스트 (선택)
  const IP_STRICT_MODE = false; // 엄격 모드 (차단 시 강제 로그아웃)
  
  // 환경변수에서 허용 IP 목록 가져오기 (없으면 모두 허용)
  const allowedIPs = process.env.REACT_APP_ALLOWED_IPS?.split(',') || [];
/* IP 접근 테스트
   const allowedIPs = [
  '195.168.0.*',   // 현재 Mock IP 허용
  '127.0.0.1'      // 로컬호스트
];
*/
  // 새 디바이스 감지 시 처리
  const handleNewDevice = (device) => {
    console.log('🆕 [App] 새로운 디바이스 감지:', {
      platform: device.details.platform,
      screen: device.details.screenResolution,
      firstSeen: device.firstSeen
    });
    // TODO: 백엔드에 알림 전송
  };

  // IP 차단 시 처리
  const handleIpBlocked = ({ ip, allowedIPs }) => {
    console.warn('🚫 [App] IP 차단:', {
      blockedIP: ip,
      allowedIPs
    });
    // TODO: 백엔드에 보안 로그 전송
  };

  return (
    <SessionProvider>
      {/* 🌐 IP 화이트리스트 (선택적) */}
      <IpWhitelist 
        enabled={IP_WHITELIST_ENABLED}
        allowedIPs={allowedIPs}
        strictMode={IP_STRICT_MODE}
        onIpBlocked={handleIpBlocked}
      />

      {/* 🔐 디바이스 지문 인증 (선택적) */}
      <DeviceFingerprint 
        enabled={DEVICE_FINGERPRINT_ENABLED}
        strictMode={DEVICE_STRICT_MODE}
        onNewDevice={handleNewDevice}
      />

      {/* 🔒 SessionGuard로 세션 보호 */}
      <SessionGuard>
        <Routes>
          {/* 인증 페이지 */}
          <Route path="/" element={<Index />} />
          
          {/* 메인 대시보드 */}
          <Route path="/main1" element={<Main1 />} />
          
          {/* 메뉴/코드 관리 */}
          <Route path="/menu" element={<Menu />} />
          <Route path="/code" element={<Code />} />
          
          {/* 권한 관리 */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/authaprove" element={<Authaprove />} />
          <Route path="/authorizationRequest" element={<AuthorizationRequest />} />
          
          {/* AI 채팅 */}
          <Route path="/chat" element={<Chat />} />
          
          {/* 데이터 수집 - 🆕 DataCollectorWrapper 사용 */}
          <Route path="/datacollector" element={<DataCollectorWrapper />} />
          <Route path="/datacollectorchain" element={<Datacollectorchain />} />
          <Route path="/sourcedbconfig" element={<SourceDBConfig />} />

          {/* 회원 관리 */}
          <Route path="/memberjoint" element={<Memberjoint />} />
          
          {/* 모델/API 관리 - 🆕 ModelmanageWrapper 사용 */}
          <Route path="/modelmanage" element={<ModelmanageWrapper />} />
          <Route path="/Apimanage" element={<Apimanage />} />
          
          {/* 통계 페이지 */}
          <Route path="/statsession" element={<StatSession />} />
          <Route path="/statresponse" element={<StatResponse />} />
          <Route path="/stattoken" element={<StatToken />} />
          <Route path="/statserver" element={<StatServer />} />
          <Route path="/statsllmmodel" element={<StatSLLMModel />} />
          <Route path="/statdatacollector" element={<StatDataCollector />} />
          <Route path="/statnode" element={<StatNode />} />
          <Route path="/stattotalmonitor" element={<StatTotalMonitor />} />
          <Route path="/statalarm" element={<StatAlarm />} />
          <Route path="/statapis" element={<StatAPIs />} />
          <Route path="/statsatisfaction" element={<StatSatisfaction />} />
          
          {/* 404 - 로그인 페이지로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SessionGuard>
    </SessionProvider>
  );
}