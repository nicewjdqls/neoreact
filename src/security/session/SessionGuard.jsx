// src/security/session/SessionGuard.jsx (로그 최소화)

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext.jsx';
import SessionMonitor from './SessionMonitor.jsx';
import SessionRefresh from './SessionRefresh.jsx';
import ConcurrentSessionControl from './ConcurrentSessionControl.jsx';
import { SESSION_STATUS, STORAGE_KEYS, DEBUG_MODE } from '../../constants/sessionConstants.js';

const SessionGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionInfo, validate } = useSession();
  const [isChecking, setIsChecking] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  // ✅ 로그인 불필요 페이지 목록
  const publicPaths = ['/', '/login', '/register', '/memberjoint'];
  const isPublicPath = publicPaths.includes(location.pathname);

  // 🎯 ADMIN 전용 페이지 목록
  const adminOnlyPaths = [
    '/menu',
    '/code',
    '/sourcedbconfig',
    '/auth',
    '/authaprove',
    '/authorizationRequest',
    '/datacollector',
    '/datacollectorchain',
    '/datacollector_back',
    '/modelmanage',
    '/Apimanage',
    '/statsession',
    '/statresponse',
    '/stattoken',
    '/statserver',
    '/statsllmmodel',
    '/statdatacollector',
    '/statnode',
    '/stattotalmonitor',
    '/statalarm',
    '/statapis',
    '/statsatisfaction'
  ];

  // 🔐 로컬 세션 직접 확인 (localStorage)
  const getLocalSession = () => {
    const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    const userRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    
    // 로그 제거 (디버그 모드에서만 출력)
    if (DEBUG_MODE) {
      
    }
    
    return { sessionId, userId, userRole };
  };

  // 🚦 권한 확인 및 라우팅
  useEffect(() => {
    // 중복 실행 방지
    if (hasChecked && location.pathname === sessionStorage.getItem('lastCheckedPath')) {
      if (DEBUG_MODE) {
        console.log('⏭️ [SessionGuard] 이미 체크함 - 스킵');
      }
      setIsChecking(false);
      return;
    }

    const checkSessionAndPermission = async () => {
      if (DEBUG_MODE) {
        console.log('\n🔒 [SessionGuard] 시작 ====================================');
        console.log('   경로:', location.pathname);
      }
      
      // 1️⃣ 공개 페이지는 항상 접근 가능
      if (isPublicPath) {
        if (DEBUG_MODE) {
          console.log('✅ [SessionGuard] 공개 페이지 - 접근 허용');
        }
        setIsChecking(false);
        setHasChecked(true);
        return;
      }

      // 2️⃣ localStorage에서 직접 세션 정보 읽기
      const localSession = getLocalSession();
      
      if (!localSession.sessionId || !localSession.userId) {
        if (DEBUG_MODE) {
          console.log('⚠️ [SessionGuard] 세션 없음 - 로그인 페이지로 이동');
        }
        navigate('/', { replace: true });
        setIsChecking(false);
        setHasChecked(true);
        return;
      }

      // 3️⃣ 세션 유효성 검증 (옵션)
      try {
        const isValid = await validate();
        
        if (!isValid) {
          if (DEBUG_MODE) {
            console.warn('❌ [SessionGuard] 세션 만료 - 로그인 페이지로 이동');
          }
          navigate('/', { replace: true });
          setIsChecking(false);
          setHasChecked(true);
          return;
        }
      } catch (error) {
        console.error('❌ [SessionGuard] 세션 검증 오류:', error);
        navigate('/', { replace: true });
        setIsChecking(false);
        setHasChecked(true);
        return;
      }

      // 4️⃣ 권한 기반 라우팅 (localStorage의 userRole 직접 사용!)
      const userRole = localSession.userRole || localStorage.getItem(STORAGE_KEYS.USER_ROLE);
      const currentPath = location.pathname;
      
      if (DEBUG_MODE) {
        console.log('🔑 [SessionGuard] 권한 체크:', {
          path: currentPath,
          userRole: userRole,
          isAdminPath: adminOnlyPaths.includes(currentPath)
        });
      }

      // ADMIN이 아닌데 ADMIN 전용 페이지 접근 시도
      if (userRole !== 'ADMIN' && adminOnlyPaths.includes(currentPath)) {
        console.warn('🚫 [SessionGuard] 권한 없음 - /main1로 리다이렉트');
        if (DEBUG_MODE) {
          console.log(`   현재 권한: ${userRole}, 필요 권한: ADMIN`);
        }
        navigate('/main1', { replace: true });
        setIsChecking(false);
        setHasChecked(true);
        return;
      }

      // ✅ 권한 확인 완료
      if (DEBUG_MODE) {
        console.log('✅ [SessionGuard] 접근 허용!');
        console.log('========================================== 종료 🔒\n');
      }
      
      setIsChecking(false);
      setHasChecked(true);
      sessionStorage.setItem('lastCheckedPath', location.pathname);
    };

    checkSessionAndPermission();
  }, [location.pathname]);

  // 🔴 세션 만료/로그아웃 시 자동 리다이렉트 (초기 체크 완료 후에만)
  useEffect(() => {
    // 초기 체크 전에는 리다이렉트하지 않음
    if (!hasChecked) {
      return;
    }

    const localSession = getLocalSession();
    
    // localStorage에 세션이 있는데 sessionInfo가 만료 상태인 경우만 리다이렉트
    if (
      !isPublicPath &&
      localSession.sessionId && // localStorage에 세션 있음
      sessionInfo.isActive === false && // sessionInfo는 비활성
      (sessionInfo.status === SESSION_STATUS.EXPIRED ||
       sessionInfo.status === SESSION_STATUS.LOGGED_OUT)
    ) {
      if (DEBUG_MODE) {
        console.log('🚪 [SessionGuard] 세션 종료 감지 - 로그인 페이지로 이동');
      }
      navigate('/', { replace: true });
    }
  }, [sessionInfo.status, sessionInfo.isActive, isPublicPath, navigate, hasChecked]);

  // ✅ 공개 페이지는 즉시 렌더링
  if (isPublicPath) {
    return <>{children}</>;
  }

  // ⏳ 세션 검증 중에는 로딩 표시
  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#1e2139'
      }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: 'rgba(99, 102, 241, 1)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            권한 확인 중...
          </div>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 🎯 보호된 페이지 렌더링
  const localSession = getLocalSession();
  const shouldMonitor = localSession.sessionId && sessionInfo.isActive;

  return (
    <>
      {shouldMonitor && (
        <>
          <SessionMonitor />
          <SessionRefresh enabled={true} />
          <ConcurrentSessionControl enabled={true} />
        </>
      )}
      {children}
    </>
  );
};

export default SessionGuard;