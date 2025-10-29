import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import MenuAccessControl from '../security/access/MenuAccessControl.jsx';
import Logo from './Logo';

const Sidebar = ({ collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});

  // 🔒 세션 기반으로 수정
  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = () => {
    // sessionStorage에서 먼저 확인
    const stored = sessionStorage.getItem('userDisplay');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserInfo(parsed);
        setIsLoggedIn(true);
        return;
      } catch (error) {
        console.error('sessionStorage 사용자 정보 로드 실패:', error);
      }
    }
    
    // localStorage에서 확인
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    
    if (userId) {
      const userInfoData = {
        userId,
        userName: userName || userId,
        userRole: userRole || 'user',
        isGuest: false
      };
      setUserInfo(userInfoData);
      setIsLoggedIn(true);
      
      // sessionStorage에도 저장 (다음에는 바로 사용 가능)
      sessionStorage.setItem('userDisplay', JSON.stringify(userInfoData));
    } else {
      // 로그인 정보가 없으면 게스트
      setUserInfo({ userName: '게스트', isGuest: true });
      setIsLoggedIn(true);
    }
  };

  // 🚪 로그아웃 처리 (세션 기반)
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // 로컬스토리지 세션 정보 삭제
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('lastActivity');
      
      sessionStorage.removeItem('userDisplay');
      setUserInfo(null);
      setIsLoggedIn(false);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      navigate('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 로고 클릭 시 Main1 페이지로 이동
  const handleLogoClick = () => {
    navigate('/main1');
  };

  // 🔑 역할별 메뉴 정의
  const navigationMenus = [
    {
      groupTitle: '메인 메뉴',
      isCollapsible: false,
      items: [
        { path: '/main1', label: '모니터링' },
        { path: '/datacollector', label: '데이터 수집' },
        { path: '/modelmanage', label: '학습모델' },
        { path: '/chat', label: 'AI Chat관리' },
        { path: '/Apimanage', label: 'APIs' },
        { path: '/authorizationRequest', label: '권한신청' }
      ]
    },
    {
      groupTitle: '설정',
      isCollapsible: true,
      items: [
        { path: '/auth', label: '권한관리' },
        { path: '/authaprove', label: '권한승인' },
        { path: '/menu', label: '메뉴관리' },
        { path: '/code', label: '코드관리' },
        { path: '/sourcedbconfig', label: 'DB 연결정보 관리'}
      ]
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isPathActive = (path) => {
    return location.pathname === path;
  };

  // 그룹 토글
  const toggleGroup = (groupTitle) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  };

  return (
    <div 
      className="apm-sidebar" 
      style={{
        width: collapsed ? '60px' : '280px',
        background: '#1a2332',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        overflowY: 'auto',
        transition: 'width 0.3s',
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
{/* 헤더 - 로고 영역 */}
<div style={{ 
  padding: '0',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: collapsed ? 'center' : 'flex-start',
  justifyContent: 'center',
  background: '#1a2332',
  position: 'relative',
  minHeight: '100px' 
}}>
  {/* 로고 컨테이너 */}
<div 
  onClick={handleLogoClick}
  style={{ 
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: collapsed ? '40px' : '240px',  // ✅ 200px → 240px
    height: collapsed ? '27px' : '110px',  // ✅ 47px → 60px
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'visible',
    position: 'relative',
    padding: '0',
    paddingLeft: collapsed ? '0' : '0.5rem', // ✅ 1rem → 0.5rem (왼쪽 여백 줄이기)
    margin: '0'
  }}
    onMouseEnter={(e) => {
      e.currentTarget.style.opacity = '0.85';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.opacity = '1';
    }}
  >
    {/* SVG 로고 컴포넌트 */}
    <Logo 
      style={{
        width: '100%',
        height: '100%',
        filter: 'brightness(1.2) contrast(1.15)',
        mixBlendMode: 'screen',
        display: 'block',
        transform: 'scale(1.00)'  // ✅ 살짝 더 크게

        
      }}
    />
  </div>
  
  {/* 접기/펼치기 버튼 */}
  <button
    onClick={onToggleCollapse}
    style={{
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      right: '0.5rem',
      background: 'rgba(99, 102, 241, 0.2)',
      border: '1px solid rgba(99, 102, 241, 0.4)',
      borderRadius: '4px',
      padding: '0.35rem 0.5rem',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '0.75rem',
      transition: 'all 0.2s',
      zIndex: 10
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
    }}
  >
    {collapsed ? '→' : '←'}
  </button>
</div>
      {/* 사용자 정보 영역 */}
      <div style={{
        padding: collapsed ? '0.5rem' : '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(99, 102, 241, 0.1)'
      }}>
        {!collapsed && (
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '1rem',
                color: '#fff',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
              }}>
                {userInfo?.isGuest ? '게' : 
                 (userInfo?.userId?.toLowerCase() === 'admin' || userInfo?.userRole?.toLowerCase() === 'admin' ? '관' : 
                  (userInfo?.userName?.substring(0, 1) || userInfo?.userId?.substring(0, 1) || '사'))}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '0.2rem',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}>
                  {userInfo?.isGuest ? '게스트' : 
                   (userInfo?.userId === 'admin' || userInfo?.userRole === 'admin' ? '관리자' : 
                    (userInfo?.userName || userInfo?.userId || '사용자'))}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  {userInfo?.isGuest ? 'Guest' : 
                   (userInfo?.userId === 'admin' || userInfo?.userRole === 'admin' ? 'Administrator' : 
                    (userInfo?.userRole || 'User'))}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: isLoggingOut 
                  ? 'rgba(220, 38, 38, 0.3)' 
                  : 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(185, 28, 28, 0.2) 100%)',
                border: '1px solid rgba(220, 38, 38, 0.4)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                opacity: isLoggingOut ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoggingOut) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(185, 28, 28, 0.3) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoggingOut) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(185, 28, 28, 0.2) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.4)';
                }
              }}
            >
              {isLoggingOut ? (
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid #fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }}
                />
              ) : (
                <>
                  <LogOut size={16} />
                  <span>로그아웃</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 🔑 역할별 필터링된 네비게이션 메뉴 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        <MenuAccessControl menuGroups={navigationMenus}>
          {(filteredMenus) => (
            <>
              {filteredMenus.map((group, idx) => (
                <div key={idx} style={{ marginBottom: '1.5rem' }}>
                  {!collapsed && (
                    <>
                      {group.isCollapsible ? (
                        // 트리 구조 - 설정 메뉴
                        <div>
                          <button
                            onClick={() => toggleGroup(group.groupTitle)}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.75rem',
                              background: 'rgba(99, 102, 241, 0.15)',
                              border: '1px solid rgba(99, 102, 241, 0.3)',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              marginBottom: '0.5rem'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.25)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                            }}
                          >
                            <span>{group.groupTitle}</span>
                            {expandedGroups[group.groupTitle] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </button>
                          
                          {expandedGroups[group.groupTitle] && (
                            <div style={{ paddingLeft: '0.5rem' }}>
                              {group.items.map((item) => (
                                <button
                                  key={item.path}
                                  onClick={() => handleNavigation(item.path)}
                                  style={{
                                    width: '100%',
                                    padding: '0.65rem 1rem',
                                    marginBottom: '0.4rem',
                                    background: isPathActive(item.path) 
                                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)'
                                      : 'rgba(255, 255, 255, 0.05)',
                                    border: `1px solid ${isPathActive(item.path) ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                                    borderRadius: '6px',
                                    color: '#fff',
                                    fontSize: '0.8rem',
                                    fontWeight: isPathActive(item.path) ? '600' : '500',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s',
                                    boxShadow: isPathActive(item.path) ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isPathActive(item.path)) {
                                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isPathActive(item.path)) {
                                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    }
                                  }}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        // 평면 디자인 - 메인 메뉴
                        <div>
                          <div style={{
                            fontSize: '0.7rem',
                            color: 'rgba(255, 255, 255, 0.4)',
                            textTransform: 'uppercase',
                            fontWeight: '600',
                            marginBottom: '0.75rem',
                            paddingLeft: '0.5rem'
                          }}>
                            {group.groupTitle}
                          </div>
                          {group.items.map((item) => (
                            <div
                              key={item.path}
                              onClick={() => handleNavigation(item.path)}
                              style={{
                                position: 'relative',
                                width: '100%',
                                padding: '0.85rem 1rem 0.85rem 1.5rem',
                                marginBottom: '0.6rem',
                                background: isPathActive(item.path) 
                                  ? 'linear-gradient(to right, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.15))'
                                  : 'transparent',
                                borderLeft: `4px solid ${isPathActive(item.path) ? '#6366f1' : 'transparent'}`,
                                borderRadius: '0 8px 8px 0',
                                color: isPathActive(item.path) ? '#fff' : 'rgba(255, 255, 255, 0.75)',
                                fontSize: '0.875rem',
                                fontWeight: isPathActive(item.path) ? '700' : '600',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isPathActive(item.path) 
                                  ? 'inset 4px 0 8px rgba(99, 102, 241, 0.3), 0 2px 8px rgba(99, 102, 241, 0.2)' 
                                  : 'none',
                                overflow: 'hidden'
                              }}
                              onMouseEnter={(e) => {
                                if (!isPathActive(item.path)) {
                                  e.currentTarget.style.background = 'linear-gradient(to right, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05))';
                                  e.currentTarget.style.borderLeftColor = 'rgba(99, 102, 241, 0.6)';
                                  e.currentTarget.style.borderLeftWidth = '4px';
                                  e.currentTarget.style.paddingLeft = '1.75rem';
                                  e.currentTarget.style.color = '#fff';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isPathActive(item.path)) {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.borderLeftColor = 'transparent';
                                  e.currentTarget.style.paddingLeft = '1.5rem';
                                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
                                }
                              }}
                            >
                              <div style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: isPathActive(item.path) ? '4px' : '0px',
                                background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)',
                                transition: 'all 0.3s',
                                boxShadow: isPathActive(item.path) ? '0 0 10px rgba(99, 102, 241, 0.5)' : 'none'
                              }}></div>
                              {item.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </>
          )}
        </MenuAccessControl>
      </div>

      <style>{`
        .apm-sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .apm-sidebar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .apm-sidebar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 3px;
        }
        .apm-sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;