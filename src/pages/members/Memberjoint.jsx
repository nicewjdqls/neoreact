import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Modal, 
  Button, 
  Form, 
  Row,
  Col,
  Card,
  InputGroup
} from 'react-bootstrap';
import { User, Lock, UserPlus, Mail, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Memberjoint = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });
  
  const [formData, setFormData] = useState({
    userid: '',
    name: '',
    email: '',
    password: '',
    password_confirm: '',
    role: 'user',
    agree: false
  });

  const showNotification = (title, message, variant = 'danger') => {
    const iconMap = {
      success: <CheckCircle size={48} className="text-success mb-3" />,
      danger: <XCircle size={48} className="text-danger mb-3" />
    };
    
    setAlertConfig({
      title,
      message,
      variant,
      icon: iconMap[variant]
    });
    setShowAlertModal(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const checkDuplicate = () => {
    if (!formData.userid.trim()) {
      showNotification('아이디 오류', '아이디를 입력해주세요.', 'danger');
      return;
    }
    // 실제로는 서버 API 호출
    showNotification('중복확인 완료', '사용 가능한 아이디입니다.', 'success');
  };

  const validateForm = () => {
    if (!formData.userid.trim()) {
      showNotification('아이디 오류', '아이디를 입력해주세요.', 'danger');
      return false;
    }
    
    if (!formData.name.trim()) {
      showNotification('이름 오류', '이름을 입력해주세요.', 'danger');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showNotification('이메일 오류', '올바른 이메일 형식을 입력해주세요.', 'danger');
      return false;
    }
    
    // 비밀번호 복잡성 검사
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      showNotification(
        '비밀번호 오류', 
        '비밀번호는 8자 이상이며, 영문 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.', 
        'danger'
      );
      return false;
    }
    
    if (formData.password !== formData.password_confirm) {
      showNotification('비밀번호 오류', '비밀번호가 일치하지 않습니다.', 'danger');
      return false;
    }
    
    if (!formData.agree) {
      showNotification('약관 동의', '이용약관 및 개인정보 처리방침에 동의해주세요.', 'danger');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // 실제로는 서버 API 호출
    showNotification(
      '회원가입 완료', 
      '회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.', 
      'success'
    );
    
    // 성공 후 로그인 페이지로 이동
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{ 
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           padding: '20px'
         }}>
      
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
                : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
              border: 'none'
            }}
          >
            확인
          </Button>
        </Modal.Body>
      </Modal>

      <Card className="shadow-lg" style={{ width: '500px', borderRadius: '20px' }}>
        <Card.Header className="text-center border-0" style={{ 
          background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
          borderRadius: '20px 20px 0 0',
          color: 'white'
        }}>
          <div className="d-flex align-items-center justify-content-center mb-2">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)' }}
            >
              <UserPlus size={24} />
            </div>
            <div>
              <h4 className="mb-0 fw-bold">Neo AI Portal</h4>
              <small className="opacity-75">회원가입</small>
            </div>
          </div>
        </Card.Header>
        
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            {/* 아이디 */}
            <Row className="g-3 mb-3">
              <Col>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center">
                    <User size={16} className="me-2 text-success" />
                    아이디 <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="아이디를 입력하세요"
                      value={formData.userid}
                      onChange={(e) => handleInputChange('userid', e.target.value)}
                      required
                      className="shadow-sm"
                      style={{ borderRadius: '12px 0 0 12px' }}
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={checkDuplicate}
                      type="button"
                      style={{ borderRadius: '0 12px 12px 0' }}
                    >
                      중복확인
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            {/* 이름 */}
            <Row className="g-3 mb-3">
              <Col>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center">
                    <User size={16} className="me-2 text-success" />
                    이름 <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="shadow-sm"
                    style={{ borderRadius: '12px' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* 이메일 */}
            <Row className="g-3 mb-3">
              <Col>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center">
                    <Mail size={16} className="me-2 text-success" />
                    이메일 <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="shadow-sm"
                    style={{ borderRadius: '12px' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* 비밀번호 */}
            <Row className="g-3 mb-3">
              <Col>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center">
                    <Lock size={16} className="me-2 text-success" />
                    비밀번호 <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      className="shadow-sm"
                      style={{ borderRadius: '12px 0 0 12px' }}
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      style={{ borderRadius: '0 12px 12px 0' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </InputGroup>
                  <small className="text-muted">
                    영문 대소문자, 숫자, 특수문자를 모두 포함하여 8자 이상
                  </small>
                </Form.Group>
              </Col>
            </Row>

            {/* 비밀번호 확인 */}
            <Row className="g-3 mb-3">
              <Col>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center">
                    <Lock size={16} className="me-2 text-success" />
                    비밀번호 확인 <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={formData.password_confirm}
                      onChange={(e) => handleInputChange('password_confirm', e.target.value)}
                      required
                      className="shadow-sm"
                      style={{ borderRadius: '12px 0 0 12px' }}
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      type="button"
                      style={{ borderRadius: '0 12px 12px 0' }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            {/* 역할 선택 */}
            <Row className="g-3 mb-3">
              <Col>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center">
                    <UserPlus size={16} className="me-2 text-success" />
                    역할
                  </Form.Label>
                  <Form.Select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
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

            {/* 이용약관 동의 */}
            <Row className="g-3 mb-4">
              <Col>
                <Form.Check
                  type="checkbox"
                  id="agree"
                  checked={formData.agree}
                  onChange={(e) => handleInputChange('agree', e.target.checked)}
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

            {/* 회원가입 버튼 */}
            <Button 
              type="submit" 
              className="w-100 fw-medium shadow-sm mb-3"
              style={{ 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                border: 'none',
                padding: '12px'
              }}
            >
              <UserPlus size={16} className="me-2" />
              회원가입
            </Button>
          </Form>
          
          <div className="text-center">
            <small className="text-muted">
              이미 계정이 있으신가요?{' '}
              <Link 
                to="/"
                className="text-decoration-none fw-medium"
                style={{ color: '#48bb78' }}
              >
                로그인
              </Link>
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Memberjoint;