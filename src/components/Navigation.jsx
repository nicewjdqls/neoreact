import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navigation = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const mainNavItems = [
    { path: '/main1', label: '모니터링' },
    { path: '/datacollector', label: '데이터 수집' },
    { path: '/modelmanage', label: '학습모델' },
    { path: '/chat', label: 'AI Chat관리' },
    { path: '/Apimanage', label: 'APIs' }
  ];

  const settingsItems = [
    { path: '/auth', label: '권한관리' },
    { path: '/authorizationRequest', label: '권한신청' },
    { path: '/authaprove', label: '권한승인' },
    { path: '/menu', label: '메뉴관리' },
    { path: '/code', label: '코드관리' },
    { path: '/sourcedbconfig', label: '코드관리' }
  ];

  // 설정 메뉴 중 하나라도 활성화되어 있는지 확인
  const isSettingsActive = settingsItems.some(item => isActive(item.path));

  // 드롭다운 토글 함수
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-light p-3 rounded mb-4 shadow-sm">
      <ul className="nav nav-pills justify-content-start align-items-center">
        {mainNavItems.map((item, index) => {
          const active = isActive(item.path);
          
          return (
            <React.Fragment key={item.path}>
              <li className="nav-item">
                <Link 
                  to={item.path}
                  className={`nav-link fw-medium text-decoration-none px-3 py-2 rounded-pill ${
                    active 
                      ? 'text-white' 
                      : 'text-dark'
                  }`}
                  style={{
                    background: active 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'transparent',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    opacity: active ? 1 : 0.8
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                      e.target.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.target.style.background = 'transparent';
                      e.target.style.opacity = '0.8';
                    }
                  }}
                >
                  {item.label}
                </Link>
              </li>
              
              <li className="nav-item">
                <span className="text-muted mx-2" style={{ fontSize: '14px' }}>|</span>
              </li>
            </React.Fragment>
          );
        })}

        {/* 설정 드롭다운 */}
        <li className="nav-item dropdown position-relative" ref={dropdownRef}>
          <button 
            className={`nav-link dropdown-toggle fw-medium px-3 py-2 rounded-pill border-0 ${
              isSettingsActive 
                ? 'text-white' 
                : 'text-dark'
            }`}
            style={{
              background: isSettingsActive 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : 'transparent',
              transition: 'all 0.3s ease',
              opacity: isSettingsActive ? 1 : 0.8
            }}
            onClick={toggleDropdown}
            onMouseEnter={(e) => {
              if (!isSettingsActive) {
                e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                e.target.style.opacity = '1';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSettingsActive) {
                e.target.style.background = 'transparent';
                e.target.style.opacity = '0.8';
              }
            }}
          >
            설정
          </button>
          <ul 
            className={`dropdown-menu shadow-sm ${isDropdownOpen ? 'show' : ''}`}
            style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              zIndex: 1000,
              minWidth: '150px',
              transform: isDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
              opacity: isDropdownOpen ? 1 : 0,
              visibility: isDropdownOpen ? 'visible' : 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            {settingsItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`dropdown-item fw-medium ${
                      active ? 'active' : ''
                    }`}
                    style={{
                      background: active 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                        : 'transparent',
                      color: active ? 'white' : 'inherit',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;