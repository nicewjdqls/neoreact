import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Modal, 
  Button, 
  Form, 
  Row,
  Col,
  Card
} from 'react-bootstrap';
import { User, Lock, UserPlus, Mail, Eye, EyeOff, CheckCircle, XCircle, Info } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });

  // 회원가입 폼 상태
  const [signupData, setSignupData] = useState({
    userid: '',
    name: '',
    email: '',
    password: '',
    password_confirm: '',
    role: 'user',
    agree: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showNotification = (title, message, variant = 'danger') => {
    const iconMap = {
      success: <CheckCircle size={48} className="text-success mb-3" />,
      danger: <XCircle size={48} className="text-danger mb-3" />,
      info: <Info size={48} className="text-info mb-3" />
    };
    
    setAlertConfig({
      title,
      message,
      variant,
      icon: iconMap[variant]
    });
    setShowAlertModal(true);
  };

  const handleGuest = () => {
    navigate('/main1');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const loginUser = document.getElementById('loginUser').value;
    const loginPass = document.getElementById('loginPass').value;
    
    if (loginUser === 'admin' && loginPass === 'admin') {
      setIsLoggedIn(true);
      document.getElementById('loginModal').style.display = 'none';
      document.getElementById('dashboard').classList.remove('hidden');
      document.getElementById('userName').textContent = loginUser;
      showNotification('로그인 성공', '성공적으로 로그인되었습니다.', 'success');
    } else {
      showNotification('로그인 실패', '아이디 또는 비밀번호가 올바르지 않습니다.', 'danger');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('loginForm').reset();
    showNotification('로그아웃 완료', '성공적으로 로그아웃되었습니다.', 'info');
  };

  const handleSignupChange = (field, value) => {
    setSignupData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const checkDuplicate = () => {
    if (!signupData.userid.trim()) {
      showNotification('아이디 오류', '아이디를 입력해주세요.', 'danger');
      return;
    }
    showNotification('중복확인 완료', '사용 가능한 아이디입니다.', 'success');
  };

  const validateSignupForm = () => {
    if (!signupData.userid.trim()) {
      showNotification('아이디 오류', '아이디를 입력해주세요.', 'danger');
      return false;
    }
    
    if (!signupData.name.trim()) {
      showNotification('이름 오류', '이름을 입력해주세요.', 'danger');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      showNotification('이메일 오류', '올바른 이메일 형식을 입력해주세요.', 'danger');
      return false;
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(signupData.password)) {
      showNotification(
        '비밀번호 오류', 
        '비밀번호는 8자 이상이며, 영문 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.', 
        'danger'
      );
      return false;
    }
    
    if (signupData.password !== signupData.password_confirm) {
      showNotification('비밀번호 오류', '비밀번호가 일치하지 않습니다.', 'danger');
      return false;
    }
    
    if (!signupData.agree) {
      showNotification('약관 동의', '이용약관 및 개인정보 처리방침에 동의해주세요.', 'danger');
      return false;
    }
    
    return true;
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    
    if (!validateSignupForm()) return;
    
    showNotification(
      '회원가입 완료', 
      '회원가입이 성공적으로 완료되었습니다. 로그인해주세요.', 
      'success'
    );
    
    setShowSignupModal(false);
    setSignupData({
      userid: '',
      name: '',
      email: '',
      password: '',
      password_confirm: '',
      role: 'user',
      agree: false
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="page Index">
      {/* 알림 Modal */}
      <Modal 
        show={showAlertModal} 
        onHide={() => setShowAlertModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Body className="text-center p-4">
          {alertConfig.icon}
          <h5 className="fw-bold mb-3">{alertConfig.title}</h5>
          <p className="text-muted mb-4">{alertConfig.message}</p>
          <Button 
            variant={alertConfig.variant}
            onClick={() => setShowAlertModal(false)}
            className="px-4 shadow-sm"
            style={{ 
              borderRadius: '12px',
              background: alertConfig.variant === 'success' 
                ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                : alertConfig.variant === 'info'
                ? 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
                : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
              border: 'none'
            }}
          >
            확인
          </Button>
        </Modal.Body>
              </Modal>

      {/* 회원가입 Modal */}
      <Modal 
        show={showSignupModal} 
        onHide={() => setShowSignupModal(false)}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header 
          closeButton 
          className="border-0 text-white"
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px 20px 0 0'
          }}
        >
          <Modal.Title className="fw-bold d-flex align-items-center">
            <UserPlus size={20} className="me-2" />
            회원가입
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-4">
          <Form onSubmit={handleSignupSubmit}>
            <Row className="g-3">
              {/* 아이디 */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center">
                    <User size={16} className="me-2 text-primary" />
                    아이디 <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="아이디를 입력하세요"
                      value={signupData.userid}
                      onChange={(e) => handleSignupChange('userid', e.target.value)}
                      required
                      className="shadow-sm flex-1"
                      style={{ borderRadius: '12px' }}
                    />
                    <Button 
                      variant="outline-primary"
                      onClick={checkDuplicate}
                      type="button"
                      size="sm"
                      style={{ borderRadius: '12px', whiteSpace: 'nowrap' }}
                    >
                      중복확인
                    </Button>
                  </div>
                </Form.Group>
              </Col>

              {/* 이름 */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center">
                    <User size={16} className="me-2 text-primary" />
                    이름 <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={signupData.name}
                    onChange={(e) => handleSignupChange('name', e.target.value)}
                    required
                    className="shadow-sm"
                    style={{ borderRadius: '12px' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mt-1">
              {/* 이메일 */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center">
                    <Mail size={16} className="me-2 text-primary" />
                    이메일 <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="example@email.com"
                    value={signupData.email}
                    onChange={(e) => handleSignupChange('email', e.target.value)}
                    required
                    className="shadow-sm"
                    style={{ borderRadius: '12px' }}
                  />
                </Form.Group>
              </Col>

              {/* 역할 */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center">
                    <UserPlus size={16} className="me-2 text-primary" />
                    역할
                  </Form.Label>
                  <Form.Select
                    value={signupData.role}
                    onChange={(e) => handleSignupChange('role', e.target.value)}
                    className="shadow-sm"
                    style={{ borderRadius: '12px' }}
                  >
                    <option value="user">일반 사용자</option>
                    <option value="admin">관리자</option>
                    <option value="monitor">모니터링 담당</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mt-1">
              {/* 비밀번호 */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center">
                    <Lock size={16} className="me-2 text-primary" />
                    비밀번호 <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요"
                      value={signupData.password}
                      onChange={(e) => handleSignupChange('password', e.target.value)}
                      required
                      className="shadow-sm pe-5"
                      style={{ borderRadius: '12px' }}
                    />
                    <Button 
                      variant="link"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                      style={{ background: 'none', zIndex: 10 }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  <small className="text-muted">
                    영문 대소문자, 숫자, 특수문자 포함 8자 이상
                  </small>
                </Form.Group>
              </Col>

              {/* 비밀번호 확인 */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center">
                    <Lock size={16} className="me-2 text-primary" />
                    비밀번호 확인 <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={signupData.password_confirm}
                      onChange={(e) => handleSignupChange('password_confirm', e.target.value)}
                      required
                      className="shadow-sm pe-5"
                      style={{ borderRadius: '12px' }}
                    />
                    <Button 
                      variant="link"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      type="button"
                      className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                      style={{ background: 'none', zIndex: 10 }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* 이용약관 동의 */}
            <Row className="g-3 mt-3">
              <Col>
                <Form.Check
                  type="checkbox"
                  id="agree"
                  checked={signupData.agree}
                  onChange={(e) => handleSignupChange('agree', e.target.checked)}
                  label={
                    <span className="fw-medium">
                      <span className="text-primary text-decoration-underline" style={{ cursor: 'pointer' }}>이용약관</span> 및{' '}
                      <span className="text-primary text-decoration-underline" style={{ cursor: 'pointer' }}>개인정보 처리방침</span>에 동의합니다.
                    </span>
                  }
                  required
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        
        <Modal.Footer className="border-0 bg-light" style={{ borderRadius: '0 0 20px 20px' }}>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowSignupModal(false)}
            className="px-4"
            style={{ borderRadius: '12px' }}
          >
            취소
          </Button>
          <Button 
            variant="primary"
            onClick={handleSignupSubmit}
            className="px-4 shadow-sm"
            style={{ 
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            <UserPlus size={16} className="me-2" />
            가입하기
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Login Modal */}
      <div id="loginModal" className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <Card className="shadow-lg" style={{ width: '400px', borderRadius: '20px' }}>
          <Card.Header className="text-center border-0" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px 20px 0 0',
            color: 'white'
          }}>
            <div className="d-flex align-items-center justify-content-center mb-2">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)' }}
              >
                <User size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">Neo AI Portal</h4>
                <small className="opacity-75">사용자 로그인</small>
              </div>
            </div>
          </Card.Header>
          
          <Card.Body className="p-4">
            <Form id="loginForm" onSubmit={handleLogin}>
              <Row className="g-3">
                <Col>
                  <Form.Group>
                    <Form.Label className="fw-medium d-flex align-items-center">
                      <User size={16} className="me-2 text-primary" />
                      아이디
                    </Form.Label>
                    <Form.Control
                      id="loginUser"
                      type="text"
                      placeholder="아이디를 입력하세요"
                      required
                      className="shadow-sm"
                      style={{ borderRadius: '12px' }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="g-3 mt-1">
                <Col>
                  <Form.Group>
                    <Form.Label className="fw-medium d-flex align-items-center">
                      <Lock size={16} className="me-2 text-primary" />
                      비밀번호
                    </Form.Label>
                    <Form.Control
                      id="loginPass"
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      required
                      className="shadow-sm"
                      style={{ borderRadius: '12px' }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="g-2 mt-3">
                <Col>
                  <Button 
                    type="submit" 
                    className="w-100 fw-medium shadow-sm"
                    style={{ 
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      padding: '12px'
                    }}
                  >
                    로그인
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button 
                    variant="outline-secondary"
                    onClick={handleGuest}
                    className="px-4 shadow-sm"
                    style={{ borderRadius: '12px', padding: '12px 20px' }}
                  >
                    게스트
                  </Button>
                </Col>
              </Row>
            </Form>
            
            <hr className="my-4" />
            
            <div className="text-center">
              <small className="text-muted">
                계정이 없으신가요?{' '}
                <Button
                  variant="link"
                  className="p-0 text-decoration-none fw-medium"
                  onClick={() => setShowSignupModal(true)}
                  style={{ color: '#667eea' }}
                >
                  회원가입
                </Button>
              </small>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Dashboard (기존 코드 유지) */}
      <div id="dashboard" className="max-w-[1300px] mx-auto p-6 hidden">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 grid place-items-center text-white font-bold">AI</div>
            <div>
              <h1 className="text-2xl font-semibold">Neo AI Portal</h1>
              <p className="text-sm text-gray-500">실시간 모델 & 인프라 모니터링 · 서비스 상태 · 사용량</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <div className="text-xs text-gray-500">환경</div>
              <div className="font-medium">Production</div>
            </div>
            <div className="text-sm text-right">
              <div className="text-xs text-gray-500">사용자</div>
              <div id="userName" className="font-medium">—</div>
            </div>
            <button id="logoutBtn" className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700" onClick={handleLogout}>로그아웃</button>
          </div>
        </header>

        {/* 메뉴 바 */}
        <nav className="bg-slate-100 px-4 py-2 rounded-lg mb-6">
          <ul className="flex gap-6 text-sm font-medium">
            <li><Link to="/" className="text-indigo-600">모니터링</Link></li>
            <li><Link to="/datacollector" className="hover:text-indigo-600">데이터 수집</Link></li>
            <li><Link to="/modelmanage" className="hover:text-indigo-600">학습모델</Link></li>
            <li><Link to="/chat" className="hover:text-indigo-600">AI Chat관리</Link></li>
            <li><Link to="/code" className="hover:text-indigo-600">APIs</Link></li>
            <li><span className="cursor-pointer hover:text-indigo-600">설정</span></li>
          </ul>
        </nav>
        
        {/* KPI row */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">활성 세션</div>
                <div id="kpi-sessions" className="text-2xl font-semibold">1,247</div>
                <div className="text-xs text-gray-500">동시 사용자 / 지난 1분</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">에러율</div>
                <div id="kpi-error" className="text-xl text-red-600 font-semibold">0.3%</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <div className="text-xs text-gray-500">평균 응답시간 (p90)</div>
            <div id="kpi-latency" className="text-2xl font-semibold my-2">248 ms</div>
            <div className="text-xs text-gray-500">지연 시간 추적 (모델 + 네트워크)</div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <div className="text-xs text-gray-500">토큰 사용량 (오늘)</div>
            <div id="kpi-tokens" className="text-2xl font-semibold my-2">2.3M</div>
            <div className="text-xs text-gray-500">총 토큰 / API 요청</div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <div className="text-xs text-gray-500">만족도 평가(오늘)</div>
            <div id="kpi-cost" className="text-2xl font-semibold my-2">4.2★</div>
            <div className="text-xs text-gray-500">만족도 평가 합산 (추정)</div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">APIs 사용현황(오늘)</div>
                <div id="api-sessions" className="text-2xl font-semibold my-2">8,942</div>
                <div className="text-xs text-gray-500">총 API호출 현황</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">에러율</div>
                <div id="api-error" className="text-xl text-red-600 font-semibold">0.1%</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* charts (left: 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold">모델 처리량 & 지연</h2>
                  <p className="text-sm text-gray-500">요청 수 · 성공/실패 비율 · p50/p90 응답시간</p>
                </div>
                <div className="text-sm text-gray-500 text-right">
                  <div>업데이트: <span id="chart-last-update">방금 전</span></div>
                </div>
              </div>
              <div className="relative h-64 bg-gray-50 rounded flex items-center justify-center">
                <span className="text-gray-400">차트 영역 (Chart.js 연동 필요)</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold">모델별 요청 분포</h2>
                  <p className="text-sm text-gray-500">각 모델이 처리하는 요청 비율</p>
                </div>
                <div className="flex items-center gap-2">
                  <select id="modelFilter" className="border rounded-md px-2 py-1 text-sm">
                    <option value="all">모든 모델</option>
                    <option value="gpt-4">gpt-4</option>
                    <option value="gpt-5">gpt-5</option>
                    <option value="llama">llama</option>
                  </select>
                </div>
              </div>
              <div className="relative h-64 bg-gray-50 rounded flex items-center justify-center">
                <span className="text-gray-400">파이 차트 영역</span>
              </div>
            </div>

            {/* 데이터 수집 차트 */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">데이터 수집 현황</h2>
              <p className="text-sm text-gray-500 mb-2">그룹별 수집된 데이터 건수</p>
              <div className="relative h-64 bg-gray-50 rounded flex items-center justify-center">
                <span className="text-gray-400">데이터 수집 차트 영역</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold">실시간 로그 (최근 100개)</h2>
                  <p className="text-sm text-gray-500">오류 / 경고 / 상태 변경</p>
                </div>
                <div className="text-sm text-gray-500">필터:
                  <select id="logLevel" className="border rounded-md px-2 py-1 text-sm ml-2">
                    <option>ALL</option><option>ERROR</option><option>WARN</option><option>INFO</option>
                  </select>
                </div>
              </div>
              <div id="logBox" className="h-48 overflow-y-auto p-2 border rounded-md bg-slate-50">
                <div className="text-sm text-gray-600">
                  <div>[INFO] 2024-09-21 14:32:15 - Model GPT-4 request processed successfully</div>
                  <div>[INFO] 2024-09-21 14:32:10 - New user session started</div>
                  <div>[WARN] 2024-09-21 14:31:55 - High GPU utilization detected (85%)</div>
                </div>
              </div>
            </div>
          </div>

          {/* right: infra */}
          <aside className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-md font-semibold mb-2">GPU / 서버 자원</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">GPU 사용률 (전체)</div>
                    <div id="gpuUsage" className="text-lg font-medium">73%</div>
                  </div>
                  <div className="w-[120px] h-[40px] bg-gray-100 rounded"></div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">메모리 사용</div>
                    <div id="memUsage" className="text-lg font-medium">24.3 / 32 GB</div>
                  </div>
                  <div className="w-[120px] h-[40px] bg-gray-100 rounded"></div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">큐 대기 길이</div>
                    <div id="queueLen" className="text-lg font-medium">12</div>
                  </div>
                  <div className="w-[120px] h-[40px] bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-md font-semibold mb-2">노드 상태</h3>
              <div id="nodes" className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Node-1</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">정상</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Node-2</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">정상</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Node-3</span>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">주의</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-md font-semibold mb-2">알림 & 이벤트</h3>
              <div id="alerts" className="space-y-2 text-sm text-gray-500">현재 이상 없음</div>
            </div>
          </aside>
        </section>

        {/* footer */}
        <footer className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">데이터는 샘플이며 실제 운영과 연동하려면 API 또는 WebSocket 엔드포인트를 연결하세요.</div>
          <div className="flex items-center gap-3">
            <button id="refreshBtn" className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200">강제 새로고침</button>
            <button id="pauseBtn" className="px-4 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100">알림 일시정지</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;