# 시스템 아키텍처 및 컴포넌트 구성

## 📐 전체 구조

```
┌─────────────────────────────────────────────────────────────┐
│                         App.jsx                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              AuthProvider (Context)                    │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │           BrowserRouter (Routing)               │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │           Routes                          │  │  │  │
│  │  │  │  ┌─────────────────────────────────────┐ │  │  │  │
│  │  │  │  │  ProtectedRoute / PublicOnlyRoute   │ │  │  │  │
│  │  │  │  │  ┌───────────────────────────────┐  │ │  │  │  │
│  │  │  │  │  │  Login / Dashboard / Admin   │  │ │  │  │  │
│  │  │  │  │  └───────────────────────────────┘  │ │  │  │  │
│  │  │  │  └─────────────────────────────────────┘ │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─── Utils Layer
                            │    ├── browserStorage.js
                            │    ├── cryptoUtils.js
                            │    └── securityUtils.js
                            │
                            └─── Browser Storage
                                 ├── Cookies
                                 ├── LocalStorage
                                 └── SessionStorage
```

---

## 🏗️ 레이어 구조

### 1. 유틸리티 레이어 (Utilities)

가장 하위 레벨의 순수 함수들로 구성된 레이어입니다.

```javascript
src/utils/
├── browserStorage.js    // 저장소 관리
├── cryptoUtils.js       // 암호화/토큰
└── securityUtils.js     // 보안 기능
```

**역할**: 재사용 가능한 로직 제공, 다른 레이어의 의존성

---

### 2. 컨텍스트 레이어 (Context)

전역 상태 관리를 담당하는 레이어입니다.

```javascript
src/contexts/
└── AuthContext.jsx      // 인증 상태 관리
```

**역할**:
- 인증 상태 관리
- 유틸리티 레이어 활용
- 하위 컴포넌트에 상태/메서드 제공

---

### 3. 컴포넌트 레이어 (Components)

재사용 가능한 컴포넌트들입니다.

```javascript
src/components/
└── ProtectedRoute.jsx   // 라우트 보호
```

**역할**:
- 인증 검증
- 권한 체크
- 조건부 렌더링

---

### 4. 페이지 레이어 (Pages)

실제 화면을 구성하는 페이지 컴포넌트들입니다.

```javascript
src/pages/auth/
├── Login.jsx           // 로그인 페이지
└── Dashboard.jsx       // 대시보드 페이지
```

**역할**:
- UI 렌더링
- 사용자 인터랙션 처리
- 컨텍스트/유틸리티 활용

---

## 🔄 데이터 흐름

### 1. 로그인 플로우

```
┌──────────────┐
│  Login.jsx   │  사용자가 ID/PW 입력
└──────┬───────┘
       │ 1. 입력값 정리 (XSSProtection.sanitizeInput)
       ↓
┌──────────────────┐
│ securityUtils.js │
└──────┬───────────┘
       │ 2. login() 호출
       ↓
┌──────────────────┐
│ AuthContext.jsx  │  인증 처리
└──────┬───────────┘
       │ 3. 토큰 생성 (TokenGenerator)
       │ 4. CSRF 토큰 생성 (CSRFProtection)
       ↓
┌──────────────────┐
│ cryptoUtils.js   │
└──────┬───────────┘
       │ 5. 저장소에 암호화하여 저장
       ↓
┌───────────────────┐
│ browserStorage.js │  LocalStorage / Cookie / SessionStorage
└───────────────────┘
       │ 6. 상태 업데이트
       ↓
┌──────────────────┐
│   Dashboard      │  리다이렉트
└──────────────────┘
```

### 2. 보호된 페이지 접근 플로우

```
사용자가 /dashboard 접근 시도
       │
       ↓
┌─────────────────┐
│ ProtectedRoute  │  1. 인증 상태 확인
└────────┬────────┘
         │
         ├─ isAuthenticated?
         │
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    │         └──→ /login으로 리다이렉트
    │
    ├─ requiredRole 확인
    │
    ├─ hasPermission(role)?
    │
┌───┴───┐
│       │
YES    NO
│       │
│       └──→ 403 Forbidden 표시
│
└──→ Dashboard 렌더링
```

### 3. 세션 갱신 플로우

```
사용자 활동 감지 (마우스/키보드)
       │
       ↓
┌──────────────────┐
│  AuthContext     │  5초 디바운스
└────────┬─────────┘
         │
         ↓ refreshSession()
┌──────────────────┐
│ browserStorage   │  lastActivity 업데이트
└────────┬─────────┘
         │
         ↓
    세션 유지됨
```

---

## 📊 상태 관리

### AuthContext 상태 구조

```javascript
{
  status: 'authenticated' | 'unauthenticated' | 'loading' | 'error',
  isAuthenticated: boolean,
  user: {
    userId: string,
    userName: string,
    userRole: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER' | 'GUEST',
    email: string
  },
  token: string,
  sessionId: string,
  lastActivity: ISO8601 timestamp,
  error: string | null
}
```

### AuthContext 메서드

```javascript
{
  login(credentials, options),      // 로그인
  logout(),                          // 로그아웃
  refreshSession(),                  // 세션 갱신
  hasPermission(requiredRole),       // 권한 체크
  config: {                          // 설정
    storageType,
    useEncryption,
    sessionTimeout,
    enableCSRF,
    rememberMe
  }
}
```

---

## 🔌 컴포넌트 연결 방법

### 1. App.jsx 구성

```javascript
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, StorageType } from './contexts/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Dashboard from './pages/auth/Dashboard';

function App() {
  return (
    // 1️⃣ AuthProvider로 전체 앱 감싸기
    <AuthProvider config={{
      storageType: StorageType.LOCAL,
      useEncryption: true,
      sessionTimeout: 30 * 60 * 1000,
      enableCSRF: true,
      rememberMe: true
    }}>
      {/* 2️⃣ 라우터 설정 */}
      <BrowserRouter>
        <Routes>
          {/* 3️⃣ 공개 라우트 */}
          <Route path="/login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } />

          {/* 4️⃣ 보호된 라우트 */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* 5️⃣ 역할 기반 라우트 */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminPanel />
            </ProtectedRoute>
          } />

          {/* 6️⃣ 기본 리다이렉트 */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

### 2. 페이지에서 인증 사용

```javascript
// Login.jsx
import { useAuth } from '../../contexts/AuthContext';
import { XSSProtection } from '../../utils/securityUtils';

const Login = () => {
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 입력값 정리
    const sanitizedUserId = XSSProtection.sanitizeInput(userId);

    // 로그인
    const result = await login({
      userId: sanitizedUserId,
      password,
      userName: sanitizedUserId,
      userRole: 'USER'
    });

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 로그인 폼 */}
    </form>
  );
};
```

```javascript
// Dashboard.jsx
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>환영합니다, {user.userName}님!</h1>
      <p>역할: {user.userRole}</p>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
};
```

### 3. 컴포넌트 내부 권한 체크

```javascript
import { useAuth } from '../../contexts/AuthContext';
import { PermissionGate } from '../../components/ProtectedRoute';

const MyComponent = () => {
  const { hasPermission } = useAuth();

  return (
    <div>
      <h1>일반 콘텐츠</h1>

      {/* 방법 1: 조건부 렌더링 */}
      {hasPermission('ADMIN') && (
        <button>관리자 기능</button>
      )}

      {/* 방법 2: PermissionGate 사용 */}
      <PermissionGate requiredRole="ADMIN">
        <button>관리자 기능</button>
      </PermissionGate>
    </div>
  );
};
```

---

## 🔐 보안 레이어

```
┌─────────────────────────────────────────────────┐
│            Application Layer                     │
│  ┌───────────────────────────────────────────┐  │
│  │      Security Layer                       │  │
│  │  ┌─────────────────────────────────────┐ │  │
│  │  │  XSS Protection                     │ │  │
│  │  │  - HTML Escape                      │ │  │
│  │  │  - Input Sanitization               │ │  │
│  │  │  - URL Validation                   │ │  │
│  │  └─────────────────────────────────────┘ │  │
│  │  ┌─────────────────────────────────────┐ │  │
│  │  │  CSRF Protection                    │ │  │
│  │  │  - Token Generation                 │ │  │
│  │  │  - Token Validation                 │ │  │
│  │  │  - SameSite Cookie                  │ │  │
│  │  └─────────────────────────────────────┘ │  │
│  │  ┌─────────────────────────────────────┐ │  │
│  │  │  Encryption                         │ │  │
│  │  │  - Data Encryption                  │ │  │
│  │  │  - Token Generation                 │ │  │
│  │  │  - Hash Function                    │ │  │
│  │  └─────────────────────────────────────┘ │  │
│  │  ┌─────────────────────────────────────┐ │  │
│  │  │  Input Validation                   │ │  │
│  │  │  - SQL Injection Detection          │ │  │
│  │  │  - Email/Password Validation        │ │  │
│  │  └─────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      │
                      ↓
              Browser Storage
          (Encrypted if enabled)
```

---

## 📦 저장소 전략

### 저장소 선택 가이드

```
┌─────────────────────────────────────────────────┐
│  데이터 타입         │ 추천 저장소              │
├─────────────────────┼─────────────────────────┤
│  인증 토큰          │ LocalStorage (암호화)    │
│  세션 ID            │ LocalStorage (암호화)    │
│  CSRF 토큰          │ SessionStorage           │
│  사용자 설정        │ LocalStorage             │
│  임시 폼 데이터     │ SessionStorage           │
│  분석/추적 ID       │ Cookie (SameSite)        │
└─────────────────────────────────────────────────┘
```

### 저장소 계층

```
┌──────────────────────────────────────────────────┐
│               Application                         │
└────────────────┬─────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼─────────┐      ┌────────▼──────┐
│ Encrypted   │      │  Browser      │
│  Storage    │      │  Storage      │
│  (Wrapper)  │      │  (Direct)     │
└───┬─────────┘      └────────┬──────┘
    │                         │
    │ (암호화/복호화)          │
    │                         │
    └────────────┬────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼─────┐  ┌────▼─────┐  ┌─▼──────┐
│ Local   │  │ Session  │  │ Cookie │
│ Storage │  │ Storage  │  │        │
└─────────┘  └──────────┘  └────────┘
```

---

## 🎯 컴포넌트별 책임

### AuthContext
- ✅ 인증 상태 관리
- ✅ 로그인/로그아웃 처리
- ✅ 세션 타임아웃 관리
- ✅ 활동 감지 및 자동 갱신
- ✅ CSRF 토큰 초기화
- ✅ 저장소 통합

### ProtectedRoute
- ✅ 인증 확인
- ✅ 권한 체크
- ✅ 리다이렉트 처리
- ✅ 로딩 상태 표시

### Login
- ✅ 사용자 입력 받기
- ✅ 입력값 검증
- ✅ XSS 방어 (입력 정리)
- ✅ 로그인 요청
- ✅ 에러 처리

### Dashboard
- ✅ 사용자 정보 표시
- ✅ 세션 정보 표시
- ✅ 로그아웃 처리
- ✅ 권한별 UI 표시

### browserStorage
- ✅ 쿠키 관리
- ✅ 로컬 스토리지 관리
- ✅ 세션 스토리지 관리
- ✅ 통합 인터페이스

### cryptoUtils
- ✅ 암호화/복호화
- ✅ 해시 생성
- ✅ 토큰 생성
- ✅ CSRF 토큰 관리

### securityUtils
- ✅ XSS 방어
- ✅ CSRF 방어
- ✅ 입력 검증
- ✅ 데이터 마스킹
- ✅ 세션 보안

---

## 🔗 의존성 그래프

```
Pages (Login, Dashboard)
    │
    ├──→ AuthContext (useAuth hook)
    │       │
    │       ├──→ browserStorage
    │       ├──→ cryptoUtils
    │       └──→ securityUtils
    │
    └──→ securityUtils (XSSProtection, InputValidation)

ProtectedRoute
    │
    └──→ AuthContext (useAuth hook)

AuthContext
    │
    ├──→ browserStorage (저장소 관리)
    ├──→ cryptoUtils (암호화, CSRF)
    └──→ securityUtils (세션 보안)
```

---

## 📝 실제 사용 시나리오

### 시나리오 1: 새로운 보호된 페이지 추가

```javascript
// 1. 페이지 컴포넌트 생성
// src/pages/Profile.jsx
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  return <div>프로필: {user.userName}</div>;
};

// 2. 라우트 추가 (App.jsx)
<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
```

### 시나리오 2: 관리자 전용 기능 추가

```javascript
// src/pages/admin/UserManagement.jsx
import { PermissionGate } from '../../components/ProtectedRoute';

const UserManagement = () => {
  return (
    <div>
      <h1>사용자 관리</h1>

      <PermissionGate requiredRole="ADMIN">
        <button>사용자 삭제</button>
      </PermissionGate>
    </div>
  );
};

// App.jsx
<Route path="/admin/users" element={
  <ProtectedRoute requiredRole="ADMIN">
    <UserManagement />
  </ProtectedRoute>
} />
```

### 시나리오 3: 커스텀 저장소 사용

```javascript
import { BrowserStorage } from './utils/browserStorage';

// 사용자 설정 저장 (로컬 스토리지)
const saveUserSettings = (settings) => {
  BrowserStorage.set('userSettings', settings, { type: 'local' });
};

// 임시 데이터 저장 (세션 스토리지)
const saveTempData = (data) => {
  BrowserStorage.set('tempData', data, { type: 'session' });
};

// 쿠키로 분석 ID 저장
const saveAnalyticsId = (id) => {
  BrowserStorage.set('analytics_id', id, {
    type: 'cookie',
    days: 365,
    secure: true,
    sameSite: 'Strict'
  });
};
```

---

## 🎓 핵심 개념

### 1. Provider Pattern
AuthProvider가 하위 컴포넌트에 상태와 메서드를 제공합니다.

### 2. HOC (Higher-Order Component)
ProtectedRoute가 컴포넌트를 감싸서 인증/권한을 체크합니다.

### 3. Custom Hooks
useAuth 훅으로 어디서든 인증 상태에 접근할 수 있습니다.

### 4. Layered Architecture
각 레이어가 명확한 책임을 가지며, 하위 레이어만 의존합니다.

### 5. Security by Design
모든 레이어에서 보안을 고려한 설계입니다.

---

이 구조는 확장 가능하며, 새로운 기능 추가 시 적절한 레이어에 구현하면 됩니다!
