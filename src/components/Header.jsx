import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { Info } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ 
  title = "Neo AI Portal", 
  subtitle = "통합 모니터링 시스템",
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

  const handleLogoClick = () => {
    navigate('/main1');
  };

  return (
    <>
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
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                border: 'none'
              }}
            >
              확인
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <div className="d-flex justify-content-between align-items-center mb-2 p-4 rounded" 
           style={{ 
             background: '#ffffff',
             border: '1px solid rgba(0, 0, 0, 0.1)',
             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
           }}>
        
        <div 
          className="d-flex align-items-center"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <div className="rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold"
               style={{ 
                 width: '48px', 
                 height: '48px', 
                 background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                 color: '#ffffff'
               }}>
            AI
          </div>
          <div>
            <h1 className="h4 mb-0" style={{ color: '#6366f1', fontWeight: '700' }}>{title}</h1>
            <p className="small mb-0" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '0.75rem' }}>{subtitle}</p>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="text-end">
            <div className="small" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>환경</div>
            <div className="fw-medium" style={{ color: '#1a202c' }}>{environment}</div>
          </div>
          <div className="text-end">
            <div className="small" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>사용자</div>
            <div className="fw-medium" style={{ color: '#1a202c' }}>{user}</div>
          </div>
          <button 
            onClick={handleLogoutClick}
            className="btn btn-sm d-flex align-items-center fw-medium"
            style={{ 
              borderRadius: '12px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#1a202c'
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