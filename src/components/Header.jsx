import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { Info } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ 
  title = "Neo AI Portal", 
  subtitle = "실시간 모델 & 인프라 모니터링 · 서비스 상태 · 사용량",
  environment = "Production"
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState('guest');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    sessionStorage.removeItem('user');
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // 메인으로 이동하는 함수 추가
  const handleLogoClick = () => {
    navigate('/main1');
  };

  return (
    <>
      {/* 로그아웃 확인 Modal */}
      <Modal 
        show={showLogoutModal} 
        onHide={handleLogoutCancel}
        centered
        backdrop="static"
      >
        <Modal.Body className="text-center p-4">
          <Info size={48} className="text-info mb-3" />
          <h5 className="fw-bold mb-3">로그아웃 확인</h5>
          <p className="text-muted mb-4">정말로 로그아웃하시겠습니까?</p>
          <div className="d-flex gap-3 justify-content-center">
            <Button 
              variant="outline-secondary"
              onClick={handleLogoutCancel}
              className="px-4"
              style={{ borderRadius: '12px' }}
            >
              취소
            </Button>
            <Button 
              variant="info"
              onClick={handleLogoutConfirm}
              className="px-4 shadow-sm"
              style={{ 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                border: 'none'
              }}
            >
              확인
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <div className="d-flex justify-content-between align-items-center mb-2 p-4 rounded" 
           style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        
        {/* 로고 영역을 클릭 가능하게 수정 */}
        <div 
          className="d-flex align-items-center cursor-pointer"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <div className="rounded-circle d-flex align-items-center justify-content-center me-3 text-white fw-bold"
               style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)' }}>
            AI
          </div>
          <div className="text-white">
            <h1 className="h4 mb-0">{title}</h1>
            <p className="small mb-0 opacity-75">{subtitle}</p>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="text-end text-white">
            <div className="small opacity-75">환경</div>
            <div className="fw-medium">{environment}</div>
          </div>
          <div className="text-end text-white">
            <div className="small opacity-75">사용자</div>
            <div className="fw-medium">{user}</div>
          </div>
          <button 
            onClick={handleLogoutClick}
            className="btn btn-sm d-flex align-items-center text-white fw-medium"
            style={{ 
              borderRadius: '12px',
              backgroundColor: 'rgba(108, 117, 125, 0.8)',
              border: '1px solid rgba(108, 117, 125, 0.5)'
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;