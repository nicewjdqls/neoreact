import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Card,
  Badge
} from 'react-bootstrap';
import {
  User,
  Lock,
  UserPlus,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Info,
  ShieldCheck,
  Cpu,
  GaugeCircle,
  BarChart2,
  ArrowRight,
  Sparkles,
  Globe2
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Index.css';

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('—');
  const [loginForm, setLoginForm] = useState({ userid: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });

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

  const heroFeatures = [
    {
      Icon: ShieldCheck,
      title: '엔터프라이즈 보안',
      description: '제로 트러스트 인증과 실시간 감사를 통해 민감 데이터를 안전하게 보호합니다.'
    },
    {
      Icon: Cpu,
      title: '멀티 모델 오케스트레이션',
      description: 'LLM · 음성 · 비전 모델을 단일 파이프라인으로 통합해 워크플로우를 자동화합니다.'
    },
    {
      Icon: Globe2,
      title: '글로벌 엣지 인프라',
      description: '11개 리전에서 40ms 이하 응답 속도로 전 세계 사용자에게 일관된 경험을 제공합니다.'
    }
  ];

  const kpiCards = [
    {
      Icon: GaugeCircle,
      title: '활성 세션',
      value: '1,248',
      helper: '동시 사용자 · 5분 평균',
      delta: '+4.2%'
    },
    {
      Icon: BarChart2,
      title: '평균 응답시간 (p90)',
      value: '218 ms',
      helper: '모델 + 네트워크 지연',
      delta: '-12 ms'
    },
    {
      Icon: Cpu,
      title: 'GPU 활용률',
      value: '78%',
      helper: '클러스터 전체',
      delta: '+5%'
    },
    {
      Icon: ShieldCheck,
      title: 'SLA 가동률',
      value: '99.99%',
      helper: '금일 누적',
      delta: '+0.2%'
    }
  ];

  const initiativeCards = [
    {
      title: 'LLM 품질 프로그램',
      description:
        '실사용 피드백과 휴리스틱 평가를 결합해 모델 응답 품질을 분기별로 향상합니다.',
      owner: 'Experience Lab'
    },
    {
      title: 'AI 거버넌스 옵스',
      description:
        '승인·검토·감사를 자동화한 정책 엔진으로 규제와 컴플라이언스 요구에 대응합니다.',
      owner: 'Trust Office'
    },
    {
      title: '데이터 패브릭 허브',
      description:
        '내부·외부 데이터를 연결하는 보안 파이프라인으로 학습/추론 모두를 지원합니다.',
      owner: 'Data Platform'
    }
  ];

  const insightHighlights = [
    { label: 'Production', value: '가동률 99.99%', helper: 'SLA 5월 대비 +0.2%' },
    { label: 'Latency', value: '218 ms', helper: '북미 리전 기준' },
    { label: 'Cost Guardrail', value: '예산 대비 92%', helper: '예측: 안정' }
  ];

  const timelineUpdates = [
    {
      time: '09:24',
      title: '신규 파인튜닝 배포',
      detail: 'korean-mistral v1.3 모델이 AP Northeast 리전에 적용되었습니다.'
    },
    {
      time: '08:51',
      title: '알림: 토큰 사용 급증',
      detail: '파트너 서비스의 API 토큰 사용량이 기준 대비 18% 증가했습니다.'
    },
    {
      time: '08:05',
      title: '보안 감사 완료',
      detail: 'Access Policy 2.1이 전사 정책과 정합성을 유지하는 것으로 확인되었습니다.'
    }
  ];

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

    if (loginForm.userid === 'admin' && loginForm.password === 'admin') {
      setIsLoggedIn(true);
      setCurrentUser(loginForm.userid);
      showNotification('로그인 성공', '성공적으로 로그인되었습니다.', 'success');
    } else {
      showNotification('로그인 실패', '아이디 또는 비밀번호가 올바르지 않습니다.', 'danger');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('—');
    setLoginForm({ userid: '', password: '' });
    setShowLoginPassword(false);
    showNotification('로그아웃 완료', '성공적으로 로그아웃되었습니다.', 'info');
  };

  const handleSignupChange = (field, value) => {
    setSignupData((prev) => ({
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
    <div className="neo-portal page Index">
      <div className="neo-background" />
      <div className="neo-gridlines" aria-hidden="true" />
      <div className="neo-shell">
        <header className="neo-header">
          <div className="neo-brand">
            <span className="neo-brand-mark">NEO</span>
            <div>
              <div className="neo-brand-name">Orion AI Control Center</div>
              <p className="neo-brand-helper">
                엔터프라이즈급 모델 운영과 거버넌스를 위한 차세대 포털
              </p>
            </div>
          </div>

          <nav className="neo-nav">
            <Link to="/">모니터링</Link>
            <Link to="/datacollector">데이터</Link>
            <Link to="/modelmanage">모델</Link>
            <Link to="/chat">대화형 AI</Link>
            <Link to="/code">APIs</Link>
          </nav>

          <div className="neo-header-actions">
            <Badge bg="" className="neo-badge-enterprise">
              <Sparkles size={14} />
              <span>Enterprise</span>
            </Badge>
            {isLoggedIn ? (
              <Button className="neo-header-btn" onClick={handleLogout}>
                로그아웃
              </Button>
            ) : (
              <Button className="neo-header-btn" onClick={() => setShowSignupModal(true)}>
                무료 체험
              </Button>
            )}
          </div>
        </header>

        {!isLoggedIn ? (
          <main className="neo-hero">
            <section className="neo-hero-copy">
              <Badge bg="" className="neo-badge-launch">
                <Sparkles size={14} />
                <span>Neo AI Portal 3.0</span>
              </Badge>
              <h1>
                기업 규모의 <span className="neo-gradient-text">AI 오케스트레이션</span>을 위한
                프리미엄 허브
              </h1>
              <p>
                모델 모니터링, 비용 거버넌스, 데이터 파이프라인을 하나의 콘솔에서 연결하고 AI 서비스 혁신 속도를
                높이세요.
              </p>

              <ul className="neo-feature-list">
                {heroFeatures.map(({ Icon, title, description }) => (
                  <li key={title}>
                    <span className="neo-feature-icon">
                      <Icon size={18} />
                    </span>
                    <div>
                      <strong>{title}</strong>
                      <p>{description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="neo-cta-group">
                <Button className="neo-primary-btn" onClick={() => setShowSignupModal(true)}>
                  엔터프라이즈 도입 문의 <ArrowRight size={16} />
                </Button>
                <Button
                  className="neo-ghost-btn"
                  variant="outline-light"
                  onClick={() => navigate('/index2')}
                >
                  라이브 데모 보기
                </Button>
              </div>
            </section>

            <Card className="neo-login-card shadow-lg border-0">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h5 className="mb-1">보안 로그인</h5>
                    <p className="neo-muted">데모 계정 admin / admin</p>
                  </div>
                  <Badge bg="" className="neo-badge-secure">
                    <ShieldCheck size={14} />
                    <span>SSO Ready</span>
                  </Badge>
                </div>

                <Form onSubmit={handleLogin} className="neo-form">
                  <Form.Group controlId="loginUser" className="mb-3">
                    <Form.Label>아이디</Form.Label>
                    <div className="neo-input-wrapper">
                      <User size={16} />
                      <Form.Control
                        type="text"
                        value={loginForm.userid}
                        onChange={(e) =>
                          setLoginForm((prev) => ({ ...prev, userid: e.target.value }))
                        }
                        className="neo-input"
                        placeholder="enterprise.admin"
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group controlId="loginPass" className="mb-3">
                    <Form.Label>비밀번호</Form.Label>
                    <div className="neo-input-wrapper">
                      <Lock size={16} />
                      <Form.Control
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                        }
                        className="neo-input"
                        placeholder="********"
                        required
                      />
                      <button
                        type="button"
                        className="neo-eye-btn"
                        onClick={() => setShowLoginPassword((prev) => !prev)}
                        aria-label="비밀번호 보기 전환"
                      >
                        {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Form.Group>

                  <div className="neo-form-actions">
                    <Button type="submit" className="neo-primary-btn w-100">
                      로그인
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      className="neo-link-btn"
                      onClick={handleGuest}
                    >
                      게스트로 둘러보기
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </main>
        ) : (
          <main className="neo-dashboard">
            <section className="neo-dashboard-header">
              <div>
                <h2>실시간 운영 현황</h2>
                <p className="neo-muted">
                  모델 성능, 사용자 경험, 컴플라이언스를 한눈에 살펴보세요.
                </p>
              </div>
              <div className="neo-dashboard-meta">
                <span>환경: Production</span>
                <span>사용자: {currentUser}</span>
              </div>
            </section>

            <section className="neo-kpi-grid">
              {kpiCards.map(({ Icon, title, value, helper, delta }) => (
                <div key={title} className="neo-card neo-kpi-card">
                  <span className="neo-kpi-icon">
                    <Icon size={20} />
                  </span>
                  <div className="neo-kpi-content">
                    <div className="neo-kpi-title">{title}</div>
                    <div className="neo-kpi-value">{value}</div>
                    <div className="neo-kpi-helper">{helper}</div>
                  </div>
                  <Badge
                    bg=""
                    className={`neo-kpi-delta ${delta.startsWith('-') ? 'is-negative' : 'is-positive'}`}
                  >
                    {delta}
                  </Badge>
                </div>
              ))}
            </section>

            <section className="neo-dashboard-grid">
              <div className="neo-card neo-card-large">
                <div className="neo-card-header">
                  <div>
                    <h3>모델 처리량 & 지연</h3>
                    <p className="neo-muted">요청 성공률과 응답시간 추이를 실시간 분석합니다.</p>
                  </div>
                  <Badge bg="" className="neo-badge-live">
                    <span className="neo-pulse" />
                    Live
                  </Badge>
                </div>
                <div className="neo-chart-placeholder">차트는 데이터 소스 연결 시 활성화됩니다.</div>
                <div className="neo-highlight-bar">
                  {insightHighlights.map((item) => (
                    <div key={item.label}>
                      <span className="neo-highlight-label">{item.label}</span>
                      <strong>{item.value}</strong>
                      <p>{item.helper}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="neo-card neo-card-medium">
                <div className="neo-card-header">
                  <div>
                    <h3>전략 과제</h3>
                    <p className="neo-muted">Quarterly OKR과 연계된 핵심 이니셔티브</p>
                  </div>
                </div>
                <ul className="neo-initiative-list">
                  {initiativeCards.map((item) => (
                    <li key={item.title}>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                      </div>
                      <span>{item.owner}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="neo-card neo-card-medium">
                <div className="neo-card-header">
                  <div>
                    <h3>실시간 알림</h3>
                    <p className="neo-muted">시스템 이벤트와 거버넌스 알림 스트림</p>
                  </div>
                </div>
                <ul className="neo-timeline">
                  {timelineUpdates.map((item) => (
                    <li key={item.title}>
                      <span className="neo-timeline-time">{item.time}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </main>
        )}
      </div>

      <Modal show={showAlertModal} onHide={() => setShowAlertModal(false)} centered backdrop="static">
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
              background:
                alertConfig.variant === 'success'
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

      <Modal
        show={showSignupModal}
        onHide={() => setShowSignupModal(false)}
        centered
        size="lg"
        backdrop="static"
        dialogClassName="neo-signup-modal"
      >
        <Form onSubmit={handleSignupSubmit}>
          <Modal.Header closeButton className="border-0 neo-signup-header">
            <Modal.Title className="fw-bold d-flex align-items-center">
              <UserPlus size={20} className="me-2" />
              회원가입
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-4">
            <Row className="g-3">
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
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center">
                    <Lock size={16} className="me-2 text-primary" />
                    비밀번호 <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
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
                  <small className="text-muted">영문 대소문자, 숫자, 특수문자 포함 8자 이상</small>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center">
                    <Lock size={16} className="me-2 text-primary" />
                    비밀번호 확인 <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={signupData.password_confirm}
                      onChange={(e) =>
                        handleSignupChange('password_confirm', e.target.value)
                      }
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

            <Row className="g-3 mt-3">
              <Col>
                <Form.Check
                  type="checkbox"
                  id="agree"
                  checked={signupData.agree}
                  onChange={(e) => handleSignupChange('agree', e.target.checked)}
                  label={
                    <span className="fw-medium">
                      <span
                        className="text-primary text-decoration-underline"
                        style={{ cursor: 'pointer' }}
                      >
                        이용약관
                      </span>{' '}
                      및{' '}
                      <span
                        className="text-primary text-decoration-underline"
                        style={{ cursor: 'pointer' }}
                      >
                        개인정보 처리방침
                      </span>
                      에 동의합니다.
                    </span>
                  }
                  required
                />
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer className="border-0 bg-light neo-signup-footer">
            <Button
              variant="outline-secondary"
              onClick={() => setShowSignupModal(false)}
              className="px-4"
              style={{ borderRadius: '12px' }}
              type="button"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="px-4 neo-primary-btn"
              style={{ borderRadius: '12px' }}
            >
              가입 완료
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Index;
