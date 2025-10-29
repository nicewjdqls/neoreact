# 보안 설정 가이드

이 문서는 NeoReact 프로젝트의 브라우저 저장소 기반 세션 관리 및 보안 시스템에 대한 가이드입니다.

## 목차

1. [개요](#개요)
2. [브라우저 저장소](#브라우저-저장소)
3. [암호화](#암호화)
4. [XSS/CSRF 방어](#xsscsrf-방어)
5. [인증/인가](#인증인가)
6. [보안 모범 사례](#보안-모범-사례)
7. [사용 예제](#사용-예제)

---

## 개요

### 구현된 보안 기능

- ✅ **브라우저 저장소 관리** (쿠키, 로컬 스토리지, 세션 스토리지)
- ✅ **데이터 암호화** (민감한 정보 보호)
- ✅ **XSS 공격 방어** (입력값 검증 및 정리)
- ✅ **CSRF 공격 방어** (토큰 기반 보호)
- ✅ **세션 관리** (타임아웃, 자동 갱신)
- ✅ **역할 기반 접근 제어** (RBAC)
- ✅ **SQL Injection 방어**
- ✅ **데이터 마스킹**

---

## 브라우저 저장소

### 1. 저장소 유틸리티

```javascript
import { BrowserStorage, CookieStorage, LocalStorage, SessionStorage } from './utils/browserStorage';

// 통합 인터페이스 사용
BrowserStorage.set('key', 'value', { type: 'local' });
BrowserStorage.get('key', { type: 'local' });
BrowserStorage.remove('key', { type: 'local' });

// 개별 저장소 사용
CookieStorage.set('key', 'value', { days: 7, secure: true, sameSite: 'Strict' });
LocalStorage.set('key', { message: 'Hello' });
SessionStorage.set('key', 'value');
```

### 2. 저장소 타입 비교

| 타입 | 만료 | 용량 | 서버 전송 | 용도 |
|------|------|------|-----------|------|
| **Cookie** | 설정 가능 | ~4KB | 자동 | 서버와 공유 필요한 데이터 |
| **Local Storage** | 영구 | ~5-10MB | 없음 | 영구 저장 데이터 |
| **Session Storage** | 탭/브라우저 닫으면 삭제 | ~5-10MB | 없음 | 임시 데이터 |

### 3. 보안 옵션

#### 쿠키 보안 속성

```javascript
CookieStorage.set('sessionId', 'xxx', {
  days: 7,              // 만료 기간
  secure: true,         // HTTPS only
  sameSite: 'Strict',   // CSRF 방어
  path: '/'             // 경로
});
```

- **Secure**: HTTPS 환경에서만 쿠키 전송
- **SameSite**: 크로스 사이트 요청 제한 (CSRF 방어)
  - `Strict`: 동일 사이트에서만 전송
  - `Lax`: 링크 클릭 시 전송 허용
  - `None`: 모든 요청에서 전송 (Secure 필수)

---

## 암호화

### 1. 암호화 유틸리티

```javascript
import { SimpleEncryption, EncryptedStorage, Hash, TokenGenerator } from './utils/cryptoUtils';

// 간단한 XOR 암호화
const encrypted = SimpleEncryption.encrypt('password', 'secret-key');
const decrypted = SimpleEncryption.decrypt(encrypted, 'secret-key');

// 암호화된 저장소
EncryptedStorage.setItem('token', 'sensitive-data');
const token = EncryptedStorage.getItem('token');

// 해시 생성
const hash = await Hash.sha256('password');

// 랜덤 토큰 생성
const token = TokenGenerator.generate(32);
const uuid = TokenGenerator.uuid();
```

### 2. 암호화 전략

#### 클라이언트 사이드 암호화
- **용도**: 브라우저 저장소에 저장되는 민감한 데이터 보호
- **방법**: XOR 암호화 또는 Web Crypto API (AES-GCM)
- **주의**: 클라이언트 사이드 암호화는 기본 보호만 제공. 강력한 보안이 필요한 경우 서버 사이드 암호화 필수

#### 서버 사이드 암호화
- **용도**: 전송 중 데이터 보호, 데이터베이스 저장
- **방법**: HTTPS/TLS, AES-256, RSA
- **권장**: 민감한 정보 (비밀번호, 신용카드 등)는 반드시 서버에서 암호화

---

## XSS/CSRF 방어

### 1. XSS (Cross-Site Scripting) 방어

```javascript
import { XSSProtection } from './utils/securityUtils';

// HTML 특수 문자 이스케이프
const safe = XSSProtection.escapeHTML('<script>alert("XSS")</script>');

// 사용자 입력 정리
const sanitized = XSSProtection.sanitizeInput(userInput, {
  allowHTML: false,
  maxLength: 1000
});

// URL 검증
const isValid = XSSProtection.isValidURL('https://example.com');

// 안전한 innerHTML 설정
XSSProtection.setInnerHTML(element, html);
```

#### XSS 방어 전략

1. **입력 검증**
   - 모든 사용자 입력을 검증하고 정리
   - 화이트리스트 방식 사용

2. **출력 인코딩**
   - HTML 특수 문자 이스케이프
   - `textContent` 사용 (`innerHTML` 대신)

3. **Content Security Policy (CSP)**
   - 신뢰할 수 있는 소스만 허용
   - 인라인 스크립트 차단

### 2. CSRF (Cross-Site Request Forgery) 방어

```javascript
import { CSRFProtection, CSRFToken } from './utils/securityUtils';

// CSRF 토큰 초기화
CSRFProtection.initialize();

// HTTP 요청에 토큰 추가
const headers = CSRFProtection.addTokenToHeaders({
  'Content-Type': 'application/json'
});

// 폼에 토큰 추가
CSRFProtection.addTokenToForm(formElement);

// 토큰 검증
const isValid = CSRFProtection.validateToken(token);
```

#### CSRF 방어 전략

1. **CSRF 토큰**
   - 각 세션마다 고유한 토큰 생성
   - 모든 상태 변경 요청에 토큰 포함

2. **SameSite 쿠키**
   - `SameSite=Strict` 또는 `Lax` 사용
   - 크로스 사이트 요청 차단

3. **검증**
   - Origin/Referer 헤더 확인
   - 커스텀 헤더 사용

---

## 인증/인가

### 1. AuthContext 사용

```javascript
import { useAuth, AuthProvider, StorageType } from './contexts/AuthContext';

// App.jsx에서 AuthProvider 설정
<AuthProvider config={{
  storageType: StorageType.LOCAL,    // 저장소 타입
  useEncryption: true,                // 암호화 사용
  sessionTimeout: 30 * 60 * 1000,     // 세션 타임아웃 (30분)
  enableCSRF: true,                   // CSRF 보호 활성화
  rememberMe: true                    // 로그인 유지
}}>
  <App />
</AuthProvider>

// 컴포넌트에서 사용
const { isAuthenticated, user, login, logout, hasPermission } = useAuth();
```

### 2. 보호된 라우트

```javascript
import { ProtectedRoute, RoleBasedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

// 기본 보호된 라우트 (인증 필요)
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// 역할 기반 라우트 (특정 역할 필요)
<ProtectedRoute requiredRole="ADMIN">
  <AdminPanel />
</ProtectedRoute>

// 공개 전용 라우트 (로그인 시 접근 불가)
<PublicOnlyRoute>
  <LoginPage />
</PublicOnlyRoute>

// 역할 배열 기반
<RoleBasedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
  <AdminDashboard />
</RoleBasedRoute>
```

### 3. 권한 체크

```javascript
import { useAuth } from './contexts/AuthContext';
import { PermissionGate } from './components/ProtectedRoute';

// Hook 사용
const { hasPermission } = useAuth();

if (hasPermission('ADMIN')) {
  // 관리자 기능
}

// 컴포넌트 사용
<PermissionGate requiredRole="ADMIN" fallback={<AccessDenied />}>
  <AdminButton />
</PermissionGate>
```

### 4. 역할 계층

```javascript
const roleHierarchy = {
  'SUPER_ADMIN': 4,  // 최상위 관리자
  'ADMIN': 3,        // 관리자
  'MANAGER': 2,      // 매니저
  'USER': 1,         // 일반 사용자
  'GUEST': 0         // 게스트
};
```

---

## 보안 모범 사례

### 1. 민감한 데이터 처리

❌ **나쁜 예**
```javascript
// 평문으로 저장
localStorage.setItem('password', userPassword);
localStorage.setItem('creditCard', cardNumber);
```

✅ **좋은 예**
```javascript
// 암호화하여 저장 (또는 저장하지 않음)
EncryptedStorage.setItem('token', authToken);

// 민감한 데이터는 저장하지 않는 것이 최선
// 서버에서만 관리
```

### 2. 입력 검증

❌ **나쁜 예**
```javascript
// 검증 없이 사용
element.innerHTML = userInput;
const query = `SELECT * FROM users WHERE id = ${userId}`;
```

✅ **좋은 예**
```javascript
// 입력 검증 및 정리
const sanitized = XSSProtection.sanitizeInput(userInput);
element.textContent = sanitized;

// SQL Injection 방어
if (InputValidation.detectSQLInjection(userId)) {
  throw new Error('Invalid input');
}
```

### 3. 세션 관리

✅ **권장 사항**
```javascript
// 1. 로그인 시 세션 ID 재생성
const newSessionId = SessionSecurity.regenerateSessionId();

// 2. 세션 타임아웃 설정
const timeout = 30 * 60 * 1000; // 30분

// 3. 활동 감지 및 자동 갱신
// AuthContext가 자동으로 처리

// 4. 로그아웃 시 모든 저장소 삭제
BrowserStorage.clearAll();
```

### 4. HTTPS 사용

```javascript
// 프로덕션 환경에서 HTTPS 강제
if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
  window.location.href = 'https://' + window.location.host + window.location.pathname;
}
```

### 5. 데이터 마스킹

```javascript
import { DataMasking } from './utils/securityUtils';

// 이메일 마스킹
const maskedEmail = DataMasking.maskEmail('user@example.com');
// 출력: us***@example.com

// 전화번호 마스킹
const maskedPhone = DataMasking.maskPhone('010-1234-5678');
// 출력: 010****5678

// 신용카드 마스킹
const maskedCard = DataMasking.maskCardNumber('1234-5678-9012-3456');
// 출력: **** **** **** 3456
```

---

## 사용 예제

### 1. 로그인 구현

```javascript
// Login.jsx
import { useAuth } from '../../contexts/AuthContext';
import { XSSProtection } from '../../utils/securityUtils';

const Login = () => {
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 입력값 정리
    const sanitizedUserId = XSSProtection.sanitizeInput(userId);
    const sanitizedPassword = XSSProtection.sanitizeInput(password);

    // 로그인 시도
    const result = await login({
      userId: sanitizedUserId,
      password: sanitizedPassword,
      userName: sanitizedUserId,
      userRole: 'USER'
    }, {
      rememberUser: true  // 로그인 유지
    });

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="사용자 ID"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      <button type="submit">로그인</button>
    </form>
  );
};
```

### 2. 보호된 페이지

```javascript
// Dashboard.jsx
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>환영합니다, {user?.userName}님!</h1>
      <p>역할: {user?.userRole}</p>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
};

// App.jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### 3. 관리자 전용 페이지

```javascript
// AdminPanel.jsx
import { RoleBasedRoute } from '../../components/ProtectedRoute';

const AdminPanel = () => {
  return <div>관리자 패널</div>;
};

// App.jsx
<Route path="/admin" element={
  <RoleBasedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
    <AdminPanel />
  </RoleBasedRoute>
} />
```

### 4. API 요청 보안

```javascript
import { SecureRequest } from './utils/securityUtils';

// 안전한 fetch 요청 (CSRF 토큰 자동 추가)
const response = await SecureRequest.fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

---

## 추가 보안 고려사항

### 1. 환경 변수

민감한 설정은 환경 변수로 관리:

```javascript
// .env
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENCRYPTION_KEY=your-secret-key-here

// 코드에서 사용
const apiUrl = process.env.REACT_APP_API_URL;
```

### 2. Content Security Policy

```html
<!-- public/index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self';
">
```

### 3. 정기 보안 감사

- 정기적으로 의존성 업데이트
- 보안 취약점 스캔
- 로그 모니터링
- 침투 테스트

### 4. 사용자 교육

- 강력한 비밀번호 정책
- 2FA (이중 인증) 권장
- 피싱 주의사항 안내

---

## 참고 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

## 문의

보안 관련 문의사항이나 취약점 발견 시 보안팀에 연락하세요.
