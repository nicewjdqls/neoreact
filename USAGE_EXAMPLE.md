# 브라우저 저장소 기반 세션 관리 - 사용 예제

이 문서는 브라우저 저장소를 활용한 세션 관리 및 인증/인가 시스템의 실제 사용 예제를 제공합니다.

## 목차

1. [시작하기](#시작하기)
2. [기본 설정](#기본-설정)
3. [로그인/로그아웃](#로그인로그아웃)
4. [보호된 라우트](#보호된-라우트)
5. [권한 관리](#권한-관리)
6. [저장소 활용](#저장소-활용)
7. [보안 기능](#보안-기능)

---

## 시작하기

### 1. 설치

이미 구현된 시스템이므로 별도 설치 필요 없음. 다음 파일들이 생성되었습니다:

- `src/utils/browserStorage.js` - 브라우저 저장소 유틸리티
- `src/utils/cryptoUtils.js` - 암호화 유틸리티
- `src/utils/securityUtils.js` - 보안 유틸리티
- `src/contexts/AuthContext.jsx` - 인증 컨텍스트
- `src/components/ProtectedRoute.jsx` - 보호된 라우트
- `src/pages/auth/Login.jsx` - 로그인 페이지
- `src/pages/auth/Dashboard.jsx` - 대시보드 페이지

### 2. 기본 구조

```
src/
├── utils/
│   ├── browserStorage.js    # 쿠키, 로컬스토리지, 세션스토리지
│   ├── cryptoUtils.js        # 암호화, 토큰 생성
│   └── securityUtils.js      # XSS/CSRF 방어
├── contexts/
│   └── AuthContext.jsx       # 인증 상태 관리
├── components/
│   └── ProtectedRoute.jsx    # 라우트 보호
└── pages/
    └── auth/
        ├── Login.jsx         # 로그인 페이지
        └── Dashboard.jsx     # 대시보드
```

---

## 기본 설정

### App.jsx 설정

```javascript
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, StorageType } from './contexts/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Dashboard from './pages/auth/Dashboard';

function App() {
  return (
    <AuthProvider config={{
      storageType: StorageType.LOCAL,    // 로컬 스토리지 사용
      useEncryption: true,                // 암호화 활성화
      sessionTimeout: 30 * 60 * 1000,     // 30분 타임아웃
      enableCSRF: true,                   // CSRF 보호 활성화
      rememberMe: true                    // 로그인 유지
    }}>
      <BrowserRouter>
        <Routes>
          {/* 공개 라우트 (로그인한 사용자는 접근 불가) */}
          <Route path="/login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } />

          {/* 보호된 라우트 (로그인 필요) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* 기본 리다이렉트 */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## 로그인/로그아웃

### 로그인 구현

```javascript
// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { XSSProtection } from '../../utils/securityUtils';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 입력값 정리 (XSS 방어)
      const sanitizedUserId = XSSProtection.sanitizeInput(userId);
      const sanitizedPassword = XSSProtection.sanitizeInput(password);

      // 로그인 시도
      const result = await login({
        userId: sanitizedUserId,
        password: sanitizedPassword,
        userName: sanitizedUserId,  // Mock
        userRole: 'USER'             // Mock
      }, {
        rememberUser: rememberMe
      });

      if (result.success) {
        console.log('✅ 로그인 성공');
        navigate('/dashboard');
      } else {
        setError(result.error || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>로그인</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="사용자 ID"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          required
        />

        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          로그인 유지
        </label>

        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default Login;
```

### 로그아웃 구현

```javascript
// 컴포넌트 내부
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      console.log('✅ 로그아웃 성공');
      navigate('/login');
    }
  };

  return (
    <button onClick={handleLogout}>로그아웃</button>
  );
};
```

---

## 보호된 라우트

### 1. 기본 보호 (로그인 필요)

```javascript
import { ProtectedRoute } from './components/ProtectedRoute';

<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### 2. 역할 기반 보호

```javascript
// 특정 역할 필요
<Route path="/admin" element={
  <ProtectedRoute requiredRole="ADMIN">
    <AdminPanel />
  </ProtectedRoute>
} />

// 여러 역할 허용
import { RoleBasedRoute } from './components/ProtectedRoute';

<Route path="/manager" element={
  <RoleBasedRoute allowedRoles={['ADMIN', 'MANAGER']}>
    <ManagerPanel />
  </RoleBasedRoute>
} />
```

### 3. 공개 전용 라우트

```javascript
// 로그인한 사용자는 접근 불가 (로그인 페이지 등)
import { PublicOnlyRoute } from './components/ProtectedRoute';

<Route path="/login" element={
  <PublicOnlyRoute redirectTo="/dashboard">
    <LoginPage />
  </PublicOnlyRoute>
} />
```

### 4. 조건부 라우트

```javascript
import { ConditionalRoute } from './components/ProtectedRoute';

<Route path="/verified-only" element={
  <ConditionalRoute
    condition={(user) => user.isEmailVerified}
    fallbackMessage="이메일 인증이 필요합니다."
  >
    <VerifiedUserPage />
  </ConditionalRoute>
} />
```

---

## 권한 관리

### 1. 훅 사용

```javascript
import { useAuth } from '../../contexts/AuthContext';

const MyComponent = () => {
  const { isAuthenticated, user, hasPermission } = useAuth();

  // 인증 상태 확인
  if (!isAuthenticated) {
    return <div>로그인이 필요합니다.</div>;
  }

  // 권한 확인
  if (hasPermission('ADMIN')) {
    return <AdminFeature />;
  }

  return <RegularFeature />;
};
```

### 2. 권한 게이트

```javascript
import { PermissionGate } from '../../components/ProtectedRoute';

const MyComponent = () => {
  return (
    <div>
      <h1>대시보드</h1>

      {/* 관리자만 볼 수 있는 버튼 */}
      <PermissionGate
        requiredRole="ADMIN"
        fallback={<p>관리자 권한이 필요합니다.</p>}
      >
        <button>관리자 기능</button>
      </PermissionGate>

      {/* 일반 사용자도 볼 수 있는 내용 */}
      <div>일반 내용</div>
    </div>
  );
};
```

### 3. 역할 계층

```javascript
// 역할 계층 (높을수록 강력)
const roleHierarchy = {
  'SUPER_ADMIN': 4,  // 최상위 관리자
  'ADMIN': 3,        // 관리자
  'MANAGER': 2,      // 매니저
  'USER': 1,         // 일반 사용자
  'GUEST': 0         // 게스트
};

// ADMIN은 USER, GUEST 권한도 자동으로 가짐
if (hasPermission('USER')) {
  // ADMIN, MANAGER, USER 모두 통과
}
```

---

## 저장소 활용

### 1. 쿠키 사용

```javascript
import { CookieStorage } from '../../utils/browserStorage';

// 쿠키 설정 (보안 옵션 포함)
CookieStorage.set('preferences', 'dark-mode', {
  days: 30,              // 30일 유효
  secure: true,          // HTTPS only
  sameSite: 'Strict',    // CSRF 방어
  path: '/'
});

// 쿠키 가져오기
const preferences = CookieStorage.get('preferences');

// 쿠키 삭제
CookieStorage.remove('preferences');
```

### 2. 로컬 스토리지 사용

```javascript
import { LocalStorage } from '../../utils/browserStorage';

// 객체 저장 (자동 JSON 변환)
LocalStorage.set('userSettings', {
  theme: 'dark',
  language: 'ko',
  notifications: true
});

// 가져오기
const settings = LocalStorage.get('userSettings', { theme: 'light' });

// 삭제
LocalStorage.remove('userSettings');

// 접두사로 삭제
LocalStorage.clearByPrefix('user_');
```

### 3. 세션 스토리지 사용

```javascript
import { SessionStorage } from '../../utils/browserStorage';

// 임시 데이터 저장 (탭 닫으면 삭제)
SessionStorage.set('tempData', 'value');

// 가져오기
const tempData = SessionStorage.get('tempData');

// 삭제
SessionStorage.remove('tempData');
```

### 4. 통합 인터페이스

```javascript
import { BrowserStorage } from '../../utils/browserStorage';

// 저장소 타입 지정
BrowserStorage.set('key', 'value', { type: 'local' });
BrowserStorage.set('key', 'value', { type: 'session' });
BrowserStorage.set('key', 'value', { type: 'cookie', days: 7 });

// 가져오기
BrowserStorage.get('key', { type: 'local' });

// 삭제
BrowserStorage.remove('key', { type: 'local' });

// 모든 저장소 삭제
BrowserStorage.clearAll();
```

---

## 보안 기능

### 1. 입력 검증 (XSS 방어)

```javascript
import { XSSProtection, InputValidation } from '../../utils/securityUtils';

// HTML 이스케이프
const safe = XSSProtection.escapeHTML('<script>alert("XSS")</script>');
// 출력: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;

// 사용자 입력 정리
const sanitized = XSSProtection.sanitizeInput(userInput, {
  allowHTML: false,
  maxLength: 1000
});

// SQL Injection 감지
if (InputValidation.detectSQLInjection(input)) {
  alert('유효하지 않은 입력입니다.');
  return;
}

// 이메일 검증
if (!InputValidation.isValidEmail(email)) {
  alert('유효한 이메일을 입력하세요.');
  return;
}

// 비밀번호 강도 검증
const result = InputValidation.validatePassword(password);
if (!result.valid) {
  alert(result.errors.join('\n'));
  return;
}
```

### 2. CSRF 방어

```javascript
import { CSRFProtection } from '../../utils/securityUtils';

// CSRF 토큰 초기화 (AuthContext가 자동으로 처리)
CSRFProtection.initialize();

// API 요청 시 토큰 추가
const headers = CSRFProtection.addTokenToHeaders({
  'Content-Type': 'application/json'
});

fetch('/api/users', {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(data)
});

// 폼에 토큰 추가
const form = document.getElementById('myForm');
CSRFProtection.addTokenToForm(form);
```

### 3. 데이터 암호화

```javascript
import { EncryptedStorage, SimpleEncryption } from '../../utils/cryptoUtils';

// 암호화된 저장소 사용
EncryptedStorage.setItem('sensitiveData', { token: 'xxx' });
const data = EncryptedStorage.getItem('sensitiveData');

// 직접 암호화/복호화
const encrypted = SimpleEncryption.encrypt('password', 'secret-key');
const decrypted = SimpleEncryption.decrypt(encrypted, 'secret-key');
```

### 4. 데이터 마스킹

```javascript
import { DataMasking } from '../../utils/securityUtils';

// 이메일 마스킹
const maskedEmail = DataMasking.maskEmail('user@example.com');
// 출력: us***@example.com

// 전화번호 마스킹
const maskedPhone = DataMasking.maskPhone('010-1234-5678');
// 출력: 010****5678

// 신용카드 마스킹
const maskedCard = DataMasking.maskCardNumber('1234567890123456');
// 출력: **** **** **** 3456

// UI에 표시
<div>
  <p>이메일: {DataMasking.maskEmail(user.email)}</p>
  <p>전화번호: {DataMasking.maskPhone(user.phone)}</p>
</div>
```

### 5. 안전한 API 요청

```javascript
import { SecureRequest } from '../../utils/securityUtils';

// CSRF 토큰이 자동으로 추가되는 안전한 요청
const response = await SecureRequest.fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(userData)
});

const data = await response.json();
```

---

## 고급 사용 예제

### 1. 자동 로그아웃 (타임아웃)

```javascript
// AuthContext가 자동으로 처리
// sessionTimeout 옵션으로 설정
<AuthProvider config={{
  sessionTimeout: 30 * 60 * 1000  // 30분
}}>
  ...
</AuthProvider>

// 타임아웃 시 로그아웃 후 로그인 페이지로 이동
```

### 2. 활동 감지 및 세션 갱신

```javascript
// AuthContext가 자동으로 마우스, 키보드 활동을 감지하여 세션 갱신
// 5초 디바운스로 과도한 갱신 방지

// 수동 갱신도 가능
const { refreshSession } = useAuth();

const handleImportantAction = () => {
  refreshSession();  // 세션 갱신
  // ... 중요한 작업
};
```

### 3. 다중 탭 로그인 관리

```javascript
// 로그인 시 기존 세션 확인
const result = await login(credentials);

if (result.hasConcurrentSession) {
  const confirm = window.confirm(
    '다른 위치에서 로그인되어 있습니다. 기존 세션을 종료하고 계속하시겠습니까?'
  );

  if (!confirm) {
    await logout();
    return;
  }
}
```

### 4. 로그인 유지 vs 세션만 유지

```javascript
// 로그인 유지 (로컬 스토리지 사용)
<AuthProvider config={{
  storageType: StorageType.LOCAL,
  rememberMe: true
}}>
  ...
</AuthProvider>

// 세션만 유지 (세션 스토리지 사용, 브라우저 닫으면 로그아웃)
<AuthProvider config={{
  storageType: StorageType.SESSION,
  rememberMe: false
}}>
  ...
</AuthProvider>
```

---

## 테스트

### 브라우저 콘솔에서 테스트

```javascript
// 1. 저장소 테스트
import { BrowserStorage } from './utils/browserStorage';

BrowserStorage.set('test', 'Hello World', { type: 'local' });
console.log(BrowserStorage.get('test', { type: 'local' }));
BrowserStorage.remove('test', { type: 'local' });

// 2. 암호화 테스트
import { SimpleEncryption } from './utils/cryptoUtils';

const encrypted = SimpleEncryption.encrypt('secret', 'key');
console.log('Encrypted:', encrypted);
console.log('Decrypted:', SimpleEncryption.decrypt(encrypted, 'key'));

// 3. XSS 방어 테스트
import { XSSProtection } from './utils/securityUtils';

const dangerous = '<script>alert("XSS")</script>';
console.log('Safe:', XSSProtection.escapeHTML(dangerous));
```

---

## 문제 해결

### 1. 세션이 유지되지 않음

```javascript
// 저장소 타입 확인
console.log(localStorage.getItem('auth_user'));
console.log(sessionStorage.getItem('auth_user'));

// 암호화 사용 시 확인
import { EncryptedStorage } from './utils/cryptoUtils';
console.log(EncryptedStorage.getItem('auth_user'));
```

### 2. CSRF 토큰 오류

```javascript
// CSRF 토큰 확인
import { CSRFToken } from './utils/cryptoUtils';
console.log('CSRF Token:', CSRFToken.get());

// 토큰 재생성
CSRFToken.clear();
CSRFProtection.initialize();
```

### 3. 권한 체크 실패

```javascript
// 현재 사용자 정보 확인
const { user } = useAuth();
console.log('User:', user);
console.log('Role:', user?.userRole);

// 권한 체크
console.log('Has ADMIN:', hasPermission('ADMIN'));
```

---

## 추가 리소스

- [보안 가이드](./SECURITY.md)
- [API 문서](./API.md)
- [FAQ](./FAQ.md)
