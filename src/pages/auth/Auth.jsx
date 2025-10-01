import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Modal, Button, Spinner, Form } from 'react-bootstrap';
import { CheckCircle, XCircle, Info, AlertTriangle, Plus, Menu } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Auth = () => {
  // State 관리
  const [filterName, setFilterName] = useState('');
  const [filterKey, setFilterKey] = useState('');
  const [selectedRoleKey, setSelectedRoleKey] = useState(null);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleKey, setNewRoleKey] = useState('');
  
  // 스피너 상태
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [isSelectingMenu, setIsSelectingMenu] = useState(false);

  // 알림 설정
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });

  // 초기 권한 데이터
  const [roles, setRoles] = useState([
    {
      name: '관리자',
      key: 'ADMIN',
      menus: ['dashboard', 'user_add'],
      user: '홍길동',
      date: '2025-09-18 10:00'
    },
    {
      name: '일반사용자',
      key: 'USER',
      menus: ['dashboard'],
      user: '이몽룡',
      date: '2025-09-18 11:00'
    }
  ]);

  // 메뉴 맵 (권한별 메뉴 상세 정보)
  const [menuMap, setMenuMap] = useState({});

  // 메뉴 트리 데이터 (Navigation 컴포넌트와 동일)
  const menuTree = [
    { name: '모니터링', key: 'main1', children: [] },
    { name: '데이터 수집', key: 'datacollector', children: [] },
    { name: '학습모델', key: 'modelmanage', children: [] },
    { name: 'AI Chat관리', key: 'chat', children: [] },
    { name: 'APIs', key: 'apimanage', children: [] },
    { name: '권한 관리', key: 'auth', children: [] },
    { name: '권한신청', key: 'authproposal', children: [] },
    { name: '권한 승인', key: 'authaprove', children: [] },
    { name: '메뉴관리', key: 'menu', children: [] }
  ];

  // 현재 표시된 권한 목록
  const [displayedRoles, setDisplayedRoles] = useState(roles);

  // 알림 표시 함수
  const showNotification = (title, message, variant = 'danger') => {
    const iconMap = {
      success: <CheckCircle size={48} className="text-success mb-3" />,
      danger: <XCircle size={48} className="text-danger mb-3" />,
      info: <Info size={48} className="text-info mb-3" />,
      warning: <AlertTriangle size={48} className="text-warning mb-3" />
    };
    
    setAlertConfig({
      title,
      message,
      variant,
      icon: iconMap[variant]
    });
    setShowAlertModal(true);
  };

  // 메뉴 노드 찾기 함수
  const findMenuNode = (nodes, key) => {
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children && node.children.length > 0) {
        const found = findMenuNode(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  // 초기 데이터 설정
  useEffect(() => {
    const initialMenuMap = {};
    roles.forEach(role => {
      if (!initialMenuMap[role.key]) {
        initialMenuMap[role.key] = role.menus.map(menuKey => {
          const node = findMenuNode(menuTree, menuKey);
          return {
            name: node ? node.name : menuKey,
            key: menuKey,
            user: role.user,
            date: role.date,
            permissions: {
              create: false,
              update: false,
              delete: false,
              read: true
            }
          };
        });
      }
    });
    setMenuMap(initialMenuMap);
  }, []);

  // 권한 조회
  const searchRoles = async () => {
    setIsSearching(true);
    
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const filtered = roles.filter(role => {
      const nameMatch = !filterName || role.name.toLowerCase().includes(filterName.toLowerCase());
      const keyMatch = !filterKey || role.key.toLowerCase().includes(filterKey.toLowerCase());
      return nameMatch && keyMatch;
    });
    setDisplayedRoles(filtered);
    setIsSearching(false);
  };

  // 필터 초기화
  const resetFilters = () => {
    setFilterName('');
    setFilterKey('');
    setDisplayedRoles(roles);
    setSelectedRoleKey(null);
  };

  // 권한 선택
  const selectRole = (roleKey) => {
    setSelectedRoleKey(roleKey);
  };

  // 신규 권한 등록 모달 열기/닫기
  const openAddRoleModal = () => {
    setShowAddRoleModal(true);
    setNewRoleName('');
    setNewRoleKey('');
  };

  const closeAddRoleModal = () => {
    setShowAddRoleModal(false);
    setNewRoleName('');
    setNewRoleKey('');
  };

  // 신규 권한 등록
  const addNewRole = async () => {
    if (!newRoleName.trim() || !newRoleKey.trim()) {
      showNotification('입력 오류', '권한 그룹명과 권한 그룹 키를 입력해주세요.', 'warning');
      return;
    }

    if (roles.some(r => r.key === newRoleKey)) {
      showNotification('등록 실패', '이미 존재하는 권한 그룹 키입니다.', 'warning');
      return;
    }

    setIsAddingRole(true);

    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));

      const now = new Date().toLocaleString();
      const newRole = {
        name: newRoleName,
        key: newRoleKey,
        menus: [],
        user: '홍길동',
        date: now
      };

      setRoles(prev => [...prev, newRole]);
      setDisplayedRoles(prev => [...prev, newRole]);
      setMenuMap(prev => ({ ...prev, [newRoleKey]: [] }));
      
      closeAddRoleModal();
      showNotification('등록 완료', '신규 권한 그룹이 성공적으로 등록되었습니다.', 'success');
    } catch (error) {
      showNotification('등록 실패', '권한 그룹 등록 중 오류가 발생했습니다.', 'danger');
    } finally {
      setIsAddingRole(false);
    }
  };

  // 메뉴 선택 모달 열기/닫기
  const openMenuModal = () => {
    if (!selectedRoleKey) {
      showNotification('선택 오류', '권한을 먼저 선택하세요.', 'warning');
      return;
    }
    setShowMenuModal(true);
  };

  const closeMenuModal = () => {
    setShowMenuModal(false);
  };

  // 메뉴 선택 확인
  const confirmMenuSelection = async () => {
    setIsSelectingMenu(true);

    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));

      const checkboxes = document.querySelectorAll('.menu-checkbox:checked');
      const selectedMenus = Array.from(checkboxes).map(cb => {
        const node = findMenuNode(menuTree, cb.value);
        return {
          name: node.name,
          key: node.key,
          user: '홍길동',
          date: new Date().toLocaleString(),
          permissions: {
            create: false,
            update: false,
            delete: false,
            read: true
          }
        };
      });

      if (selectedRoleKey) {
        setMenuMap(prev => ({ ...prev, [selectedRoleKey]: selectedMenus }));
        
        setRoles(prev => prev.map(role => 
          role.key === selectedRoleKey 
            ? { ...role, menus: selectedMenus.map(m => m.key) }
            : role
        ));
        
        setDisplayedRoles(prev => prev.map(role => 
          role.key === selectedRoleKey 
            ? { ...role, menus: selectedMenus.map(m => m.key) }
            : role
        ));
      }

      closeMenuModal();
      showNotification('메뉴 설정 완료', '메뉴가 성공적으로 설정되었습니다.', 'success');
    } catch (error) {
      showNotification('메뉴 설정 실패', '메뉴 설정 중 오류가 발생했습니다.', 'danger');
    } finally {
      setIsSelectingMenu(false);
    }
  };

  // 메뉴 권한 업데이트
  const updateMenuPermission = (menuIndex, permission, checked) => {
    if (!selectedRoleKey || !menuMap[selectedRoleKey]) return;

    setMenuMap(prev => ({
      ...prev,
      [selectedRoleKey]: prev[selectedRoleKey].map((menu, index) => 
        index === menuIndex 
          ? {
              ...menu,
              permissions: { ...menu.permissions, [permission]: checked },
              user: '홍길동',
              date: new Date().toLocaleString()
            }
          : menu
      )
    }));
  };

  // 권한 저장
  const saveRoles = async () => {
    setIsSaving(true);

    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));

      const dataToSave = roles.map(r => ({
        name: r.name,
        key: r.key,
        menus: menuMap[r.key] || [],
        user: r.user,
        date: r.date
      }));

      console.log("저장 데이터:", dataToSave);
      showNotification('저장 완료', '권한 정보가 성공적으로 저장되었습니다.', 'success');
    } catch (error) {
      showNotification('저장 실패', '권한 정보 저장 중 오류가 발생했습니다.', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  // 메뉴 트리 렌더링
  const renderMenuTree = (nodes, level = 0) => {
    return nodes.map(node => (
      <React.Fragment key={node.key}>
        <tr className="hover:bg-gray-50">
          <td className="px-6 py-3 text-center">
            <input 
              type="checkbox" 
              className="menu-checkbox w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
              value={node.key}
              defaultChecked={selectedRoleKey && menuMap[selectedRoleKey]?.some(m => m.key === node.key)}
            />
          </td>
          <td className="px-6 py-3">
            <div className={`flex items-center ${level > 0 ? `ml-${level * 6}` : ''}`}>
              <svg className="w-4 h-4 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
              </svg>
              <span className="text-gray-900 font-medium">{node.name}</span>
            </div>
          </td>
        </tr>
        {node.children && node.children.length > 0 && renderMenuTree(node.children, level + 1)}
      </React.Fragment>
    ));
  };

  // 현재 선택된 권한의 메뉴 목록
  const currentMenus = selectedRoleKey ? (menuMap[selectedRoleKey] || []) : [];

  return (
    <Layout 
      title="Neo AI Portal"
      subtitle="권한 관리 및 메뉴 권한 설정"
      environment="Production"
      showNavigation={true}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">권한 관리 시스템</h1>
                <p className="text-gray-600 text-sm mt-0.5">사용자 권한과 메뉴 접근 권한을 통합 관리합니다</p>
              </div>
            </div>
          </div>
        </div>

        {/* 검색 및 액션 패널 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">권한 그룹명</label>
                <input 
                  type="text" 
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="예: 관리자" 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  style={{ borderRadius: '12px' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">권한 그룹 키</label>
                <input 
                  type="text" 
                  value={filterKey}
                  onChange={(e) => setFilterKey(e.target.value)}
                  placeholder="예: ADMIN" 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  style={{ borderRadius: '12px' }}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={searchRoles}
                disabled={isSearching}
                className="px-4"
                style={{ 
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                  border: 'none'
                }}
              >
                {isSearching ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    조회중...
                  </>
                ) : (
                  '조회'
                )}
              </Button>
              <Button 
                variant="secondary"
                onClick={resetFilters}
                className="px-4"
                style={{ borderRadius: '12px' }}
              >
                초기화
              </Button>
              <Button 
                onClick={openAddRoleModal}
                disabled={isAddingRole}
                className="px-4"
                style={{ 
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  border: 'none'
                }}
              >
                {isAddingRole ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    등록중...
                  </>
                ) : (
                  '신규 등록'
                )}
              </Button>
              <Button 
                onClick={saveRoles}
                disabled={isSaving}
                className="px-4"
                style={{ 
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                {isSaving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    저장중...
                  </>
                ) : (
                  '저장'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* 권한 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">권한 목록</h2>
                <p className="text-sm text-gray-600 mt-0.5">권한을 선택하여 메뉴 권한을 설정할 수 있습니다</p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">권한 그룹명</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">권한 그룹 키</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">연결된 메뉴</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">작업자</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">작업일시</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedRoles.map(role => (
                  <tr 
                    key={role.key}
                    className={`cursor-pointer transition-colors ${
                      selectedRoleKey === role.key 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => selectRole(role.key)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          selectedRoleKey === role.key ? 'bg-blue-500' : 'bg-gray-300'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-900">{role.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {role.key}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {(menuMap[role.key] || role.menus).map(m => {
                          if (typeof m === 'string') {
                            const node = findMenuNode(menuTree, m);
                            return node ? node.name : m;
                          }
                          return m.name;
                        }).join(', ') || '메뉴 없음'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{role.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 메뉴 권한 설정 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">메뉴 권한 설정</h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  {selectedRoleKey 
                    ? `${displayedRoles.find(r => r.key === selectedRoleKey)?.name} 권한의 메뉴별 세부 권한을 설정합니다`
                    : '권한을 선택하면 메뉴별 세부 권한을 설정할 수 있습니다'
                  }
                </p>
              </div>
            </div>
            <Button 
              onClick={openMenuModal}
              disabled={isSelectingMenu}
              className="px-4"
              style={{ 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                border: 'none'
              }}
            >
              {isSelectingMenu ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  설정중...
                </>
              ) : (
                '메뉴 선택'
              )}
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">메뉴명</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">등록</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">수정</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">삭제</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">조회</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">작업자</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">작업일시</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentMenus.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">메뉴가 없습니다</h3>
                      <p className="mt-1 text-sm text-gray-500">권한을 선택하고 메뉴를 추가해보세요.</p>
                    </td>
                  </tr>
                ) : (
                  currentMenus.map((menu, index) => (
                    <tr key={menu.key} className="hover:bg-gray-50">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                          </svg>
                          <span className="text-sm font-medium text-gray-900">{menu.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={menu.permissions?.create || false}
                          onChange={(e) => updateMenuPermission(index, 'create', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={menu.permissions?.update || false}
                          onChange={(e) => updateMenuPermission(index, 'update', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={menu.permissions?.delete || false}
                          onChange={(e) => updateMenuPermission(index, 'delete', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={menu.permissions?.read || false}
                          onChange={(e) => updateMenuPermission(index, 'read', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{menu.user}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{menu.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 신규 등록 모달 */}
        <Modal 
          show={showAddRoleModal} 
          onHide={() => !isAddingRole && closeAddRoleModal()}
          centered
          backdrop="static"
        >
          <Modal.Header 
            closeButton={!isAddingRole}
            className="border-0 text-white"
            style={{ 
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              borderRadius: '20px 20px 0 0'
            }}
          >
            <Modal.Title className="fw-bold d-flex align-items-center">
              <Plus size={20} className="me-2" />
              권한 그룹 신규 등록
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body className="p-4">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">
                  권한 그룹명 <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text" 
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="예: 관리자"
                  disabled={isAddingRole}
                  className="shadow-sm"
                  style={{ borderRadius: '12px' }}
                />
              </Form.Group>
              
              <Form.Group>
                <Form.Label className="fw-medium">
                  권한 그룹 키 <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text" 
                  value={newRoleKey}
                  onChange={(e) => setNewRoleKey(e.target.value)}
                  placeholder="예: ADMIN"
                  disabled={isAddingRole}
                  className="shadow-sm"
                  style={{ borderRadius: '12px' }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          
          <Modal.Footer className="border-0 bg-light" style={{ borderRadius: '0 0 20px 20px' }}>
            <Button 
              variant="outline-secondary"
              onClick={closeAddRoleModal}
              disabled={isAddingRole}
              className="px-4"
              style={{ borderRadius: '12px' }}
            >
              취소
            </Button>
            <Button 
              onClick={addNewRole}
              disabled={isAddingRole}
              className="px-4 shadow-sm"
              style={{ 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                border: 'none'
              }}
            >
              {isAddingRole ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  등록중...
                </>
              ) : (
                '등록'
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 메뉴 선택 모달 */}
        <Modal 
          show={showMenuModal} 
          onHide={() => !isSelectingMenu && closeMenuModal()}
          centered
          backdrop="static"
          size="lg"
        >
          <Modal.Header 
            closeButton={!isSelectingMenu}
            className="border-0 text-white"
            style={{ 
              background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
              borderRadius: '20px 20px 0 0'
            }}
          >
            <Modal.Title className="fw-bold d-flex align-items-center">
              <Menu size={20} className="me-2" />
              메뉴 선택
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body className="p-4">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">선택</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">메뉴명</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {renderMenuTree(menuTree)}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          
          <Modal.Footer className="border-0 bg-light" style={{ borderRadius: '0 0 20px 20px' }}>
            <Button 
              variant="outline-secondary"
              onClick={closeMenuModal}
              disabled={isSelectingMenu}
              className="px-4"
              style={{ borderRadius: '12px' }}
            >
              취소
            </Button>
            <Button 
              onClick={confirmMenuSelection}
              disabled={isSelectingMenu}
              className="px-4 shadow-sm"
              style={{ 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                border: 'none'
              }}
            >
              {isSelectingMenu ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  설정중...
                </>
              ) : (
                '확인'
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 알림 모달 */}
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
                  : alertConfig.variant === 'warning'
                  ? 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)'
                  : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                border: 'none'
              }}
            >
              확인
            </Button>
          </Modal.Body>
        </Modal>
      </div>
    </Layout>
  );
};

export default Auth;