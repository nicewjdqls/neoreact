import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { UserPlus, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Member = ({ show, onHide, onSuccess }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignupChange = (field, value) => {
    setSignupData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const checkDuplicate = () => {
    if (!signupData.userid.trim()) {
      onSuccess('아이디 오류', '아이디를 입력해주세요.', 'danger');
      return;
    }
    onSuccess('중복확인 완료', '사용 가능한 아이디입니다.', 'success');
  };

  const validateSignupForm = () => {
    if (!signupData.userid.trim()) {
      onSuccess('아이디 오류', '아이디를 입력해주세요.', 'danger');
      return false;
    }
    
    if (!signupData.name.trim()) {
      onSuccess('이름 오류', '이름을 입력해주세요.', 'danger');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      onSuccess('이메일 오류', '올바른 이메일 형식을 입력해주세요.', 'danger');
      return false;
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(signupData.password)) {
      onSuccess(
        '비밀번호 오류', 
        '비밀번호는 8자 이상이며, 영문 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.', 
        'danger'
      );
      return false;
    }
    
    if (signupData.password !== signupData.password_confirm) {
      onSuccess('비밀번호 오류', '비밀번호가 일치하지 않습니다.', 'danger');
      return false;
    }
    
    if (!signupData.agree) {
      onSuccess('약관 동의', '이용약관 및 개인정보 처리방침에 동의해주세요.', 'danger');
      return false;
    }
    
    return true;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateSignupForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSuccess(
        '회원가입 완료', 
        '회원가입이 성공적으로 완료되었습니다. 로그인해주세요.', 
        'success'
      );
      
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
      
      onHide();
    } catch (error) {
      onSuccess('회원가입 실패', '회원가입 중 오류가 발생했습니다.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
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
      onHide();
    }
  };

  return (
    <div>
      <style>{`
        .member-modal .modal-content {
          background: linear-gradient(135deg, rgba(42, 48, 70, 0.98) 0%, rgba(54, 61, 90, 0.98) 100%);
          border: 1px solid rgba(99, 102, 241, 0.4);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        }
        
        .member-modal .modal-header {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%);
          border-bottom: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 16px 16px 0 0;
          color: #fff;
        }
        
        .member-modal .modal-body {
          color: #fff;
        }
        
        .member-modal .modal-footer {
          background: rgba(30, 33, 52, 0.5);
          border-top: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 0 0 16px 16px;
        }
        
        .member-modal .btn-close {
          filter: brightness(0) invert(1);
          opacity: 0.8;
        }
        
        .member-modal .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.5rem;
        }
        
        .member-modal .form-control,
        .member-modal .form-select,
        .member-modal input[type="email"],
        .member-modal input[type="password"],
        .member-modal input[type="text"] {
          background: rgba(54, 61, 90, 0.6) !important;
          border: 1px solid rgba(99, 102, 241, 0.3) !important;
          border-radius: 8px !important;
          color: #fff !important;
          padding: 0.75rem 1rem !important;
        }
        
        .member-modal .form-control:focus,
        .member-modal .form-select:focus,
        .member-modal input[type="email"]:focus,
        .member-modal input[type="password"]:focus,
        .member-modal input[type="text"]:focus {
          background: rgba(54, 61, 90, 0.6) !important;
          border-color: rgba(99, 102, 241, 0.6) !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
          color: #fff !important;
        }
        
        .member-modal .form-control:disabled,
        .member-modal .form-select:disabled {
          background: rgba(54, 61, 90, 0.4) !important;
          opacity: 0.6 !important;
        }
        
        .member-modal .form-control::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        
        .member-modal input:-webkit-autofill,
        .member-modal input:-webkit-autofill:hover,
        .member-modal input:-webkit-autofill:focus,
        .member-modal input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgba(54, 61, 90, 0.6) inset !important;
          -webkit-text-fill-color: #fff !important;
          border: 1px solid rgba(99, 102, 241, 0.3) !important;
        }
        
        .member-modal .form-select {
          background: rgba(54, 61, 90, 0.6) url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") no-repeat right 0.75rem center !important;
          background-size: 16px 12px !important;
          padding-right: 2.5rem !important;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
        }
        
        .member-modal .form-select:focus {
          background: rgba(54, 61, 90, 0.6) url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") no-repeat right 0.75rem center !important;
          background-size: 16px 12px !important;
        }
        
        .member-modal .form-select option {
          background: #2a3046;
          color: #fff;
        }
        
        .member-modal .form-check-input {
          background-color: rgba(30, 33, 52, 0.6);
          border: 1px solid rgba(99, 102, 241, 0.4);
          width: 1.25rem;
          height: 1.25rem;
        }
        
        .member-modal .form-check-input:checked {
          background-color: rgba(99, 102, 241, 0.8);
          border-color: rgba(99, 102, 241, 0.8);
        }
        
        .member-modal .form-check-label {
          color: rgba(255, 255, 255, 0.9);
          margin-left: 0.5rem;
        }
        
        .member-modal .text-primary {
          color: rgba(99, 102, 241, 1) !important;
        }
        
        .member-modal .text-danger {
          color: #ef4444 !important;
        }
        
        .member-modal .text-muted {
          color: rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>

      <Modal 
        show={show} 
        onHide={handleClose}
        centered
        size="lg"
        backdrop="static"
        className="member-modal"
      >
        <Modal.Header closeButton={!isSubmitting}>
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
                  <Form.Label className="d-flex align-items-center">
                    <User size={16} className="me-2 text-primary" />
                    아이디 <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="아이디를 입력하세요"
                      value={signupData.userid}
                      onChange={(e) => handleSignupChange('userid', e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                    <Button 
                      variant="outline-primary"
                      onClick={checkDuplicate}
                      type="button"
                      size="sm"
                      disabled={isSubmitting}
                      style={{ 
                        whiteSpace: 'nowrap',
                        borderRadius: '8px',
                        background: 'rgba(99, 102, 241, 0.2)',
                        borderColor: 'rgba(99, 102, 241, 0.4)',
                        color: '#fff'
                      }}
                    >
                      중복확인
                    </Button>
                  </div>
                </Form.Group>
              </Col>

              {/* 이름 */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <User size={16} className="me-2 text-primary" />
                    이름 <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={signupData.name}
                    onChange={(e) => handleSignupChange('name', e.target.value)}
                    disabled={isSubmitting}
                    required
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mt-1">
              {/* 비밀번호 */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <Lock size={16} className="me-2 text-primary" />
                    비밀번호 <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요"
                      value={signupData.password}
                      onChange={(e) => handleSignupChange('password', e.target.value)}
                      disabled={isSubmitting}
                      required
                      style={{ paddingRight: '3rem' }}
                    />
                    <Button 
                      variant="link"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      disabled={isSubmitting}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        padding: '0.25rem'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  <small className="text-muted d-block mt-1">
                    영문 대소문자, 숫자, 특수문자 포함 8자 이상
                  </small>
                </Form.Group>
              </Col>

              {/* 비밀번호 확인 */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <Lock size={16} className="me-2 text-primary" />
                    비밀번호 확인 <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={signupData.password_confirm}
                      onChange={(e) => handleSignupChange('password_confirm', e.target.value)}
                      disabled={isSubmitting}
                      required
                      style={{ paddingRight: '3rem' }}
                    />
                    <Button 
                      variant="link"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      type="button"
                      disabled={isSubmitting}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        padding: '0.25rem'
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mt-1">
              {/* 이메일 */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <Mail size={16} className="me-2 text-primary" />
                    이메일 <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={signupData.email}
                    onChange={(e) => handleSignupChange('email', e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </Form.Group>
              </Col>

              {/* 역할 */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <UserPlus size={16} className="me-2 text-primary" />
                    역할
                  </Form.Label>
                  <Form.Select
                    value={signupData.role}
                    onChange={(e) => handleSignupChange('role', e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="user">일반 사용자</option>
                    <option value="admin">관리자</option>
                    <option value="monitor">모니터링 담당</option>
                  </Form.Select>
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
                  disabled={isSubmitting}
                  label={
                    <span>
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
        
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={handleClose}
            disabled={isSubmitting}
            style={{
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: '#fff'
            }}
          >
            취소
          </Button>
          <Button 
            onClick={handleSignupSubmit}
            disabled={isSubmitting}
            style={{ 
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
              border: '2px solid rgba(99, 102, 241, 0.6)',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                <span>가입중...</span>
              </>
            ) : (
              <>
                <UserPlus size={16} style={{ flexShrink: 0 }} />
                <span style={{ marginLeft: '0.5rem' }}>가입하기</span>
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Member;