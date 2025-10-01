import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

function Menu() {
  // State 관리
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [nextId, setNextId] = useState(12);
  const [currentEditingItem, setCurrentEditingItem] = useState(null);
  const [editState, setEditState] = useState(null); // 'adding' 또는 'deleting'
  const [expandedItems, setExpandedItems] = useState({}); // 각 노드별 펼치기/접기 상태
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    menuName: '',
    menuUrl: '',
    menuOrder: '',
    menuDescription: '',
    isActive: false,
    buttons: []
  });

  // 초기 메뉴 데이터 (HTML과 동일한 구조)
  const [menuItems, setMenuItems] = useState([
    {
      id: "1",
      name: "대시보드",
      url: "/dashboard",
      order: "1",
      active: "true",
      parent: "0",
      buttons: "",
      level: "0",
      description: "",
      temp: false,
      markedForDelete: false
    },
    {
      id: "2",
      name: "시스템 현황",
      url: "/dashboard/status",
      order: "2",
      active: "true",
      parent: "1",
      buttons: "",
      level: "1",
      description: "",
      temp: false,
      markedForDelete: false
    },
    {
      id: "3",
      name: "관리",
      url: "/manage",
      order: "3",
      active: "false",
      parent: "0",
      buttons: "",
      level: "0",
      description: "",
      temp: false,
      markedForDelete: false
    },
    {
      id: "4",
      name: "계정 관리",
      url: "/manage/account",
      order: "4",
      active: "false",
      parent: "3",
      buttons: "",
      level: "1",
      description: "",
      temp: false,
      markedForDelete: false
    },
    {
      id: "5",
      name: "권한 관리",
      url: "/manage/role",
      order: "5",
      active: "true",
      parent: "3",
      buttons: "등록,조회",
      level: "1",
      description: "",
      temp: false,
      markedForDelete: false
    },
    {
      id: "6",
      name: "메뉴 관리",
      url: "/manage/menu",
      order: "6",
      active: "true",
      parent: "3",
      buttons: "등록,조회",
      level: "1",
      description: "",
      temp: false,
      markedForDelete: false
    },
    {
      id: "7",
      name: "로그 관리",
      url: "/manage/log",
      order: "7",
      active: "true",
      parent: "0",
      buttons: "조회",
      level: "0",
      description: "",
      temp: false,
      markedForDelete: false
    },
    {
      id: "8",
      name: "로그 조회",
      url: "/manage/log/view",
      order: "8",
      active: "true",
      parent: "7",
      buttons: "조회",
      level: "1",
      description: "",
      temp: false,
      markedForDelete: false
    },
    {
      id: "9",
      name: "로그 삭제",
      url: "/manage/log/delete",
      order: "9",
      active: "false",
      parent: "7",
      buttons: "삭제",
      level: "1",
      description: "",
      temp: false,
      markedForDelete: false
    },
    {
      id: "10",
      name: "사용자 관리",
      url: "/manage/user",
      order: "10",
      active: "true",
      parent: "0",
      buttons: "등록,조회",
      level: "0",
      description: "",
      temp: false,
      markedForDelete: false
    },
    {
      id: "11",
      name: "사용자 등록",
      url: "/manage/user/add",
      order: "11",
      active: "true",
      parent: "10",
      buttons: "등록",
      level: "1",
      description: "",
      temp: false,
      markedForDelete: false
    }
  ]);

  // 초기 모든 노드 펼쳐짐 상태로 설정
  useEffect(() => {
    const expanded = {};
    menuItems.forEach(item => {
      expanded[item.id] = true;
    });
    setExpandedItems(expanded);
  }, []);

  // 트리 클릭 처리 (여백 클릭으로 선택 해제)
  const handleTreeClick = (event) => {
    // 클릭된 요소가 tree-item-content나 그 자식이 아닌 경우에만 선택 해제
    if (!event.target.closest('.tree-item-content')) {
      clearSelectionAndResetState();
    }
  };

  // 메뉴 아이템 클릭 처리
  const handleItemClick = (event, item) => {
    event.stopPropagation();
    
    // 현재 편집 중인 상태가 있고, 다른 메뉴를 클릭한 경우에만 확인
    if (currentEditingItem && editState && currentEditingItem.id !== item.id) {
      if (window.confirm('저장하지 않은 변경사항이 있습니다. 계속하시겠습니까?')) {
        resetEditingState();
      } else {
        return; // 사용자가 취소하면 클릭 무시
      }
    }
    
    selectMenuItem(item);
  };

  // 메뉴 아이템 선택
  const selectMenuItem = (item) => {
    setSelectedMenuItem(item);
    loadMenuData(item);
    setIsEditMode(true);
  };

  // 메뉴 데이터 로드
  const loadMenuData = (item) => {
    const buttons = item.buttons ? item.buttons.split(',') : [];
    setFormData({
      menuName: item.name || '',
      menuUrl: item.url || '',
      menuOrder: item.order || '',
      menuDescription: item.description || '',
      isActive: item.active === 'true',
      buttons: buttons.filter(b => b.trim() !== '')
    });
  };

  // 편집 상태 초기화
  const resetEditingState = () => {
    if (currentEditingItem && editState === 'adding') {
      // 임시 추가 아이템 제거
      setMenuItems(prev => prev.filter(item => item.id !== currentEditingItem.id));
    } else if (currentEditingItem && editState === 'deleting') {
      // 삭제 표시 제거
      setMenuItems(prev => prev.map(item => 
        item.id === currentEditingItem.id 
          ? { ...item, markedForDelete: false }
          : item
      ));
    }
    
    setCurrentEditingItem(null);
    setEditState(null);
  };

  // 선택 해제 및 상태 초기화
  const clearSelectionAndResetState = () => {
    resetEditingState();
    setSelectedMenuItem(null);
    clearForm();
  };

  // 폼 초기화
  const clearForm = () => {
    setFormData({
      menuName: '',
      menuUrl: '',
      menuOrder: '',
      menuDescription: '',
      isActive: false,
      buttons: []
    });
  };

  // 메뉴 추가
  const handleAddMenu = () => {
    if (editState === 'adding') return;
    
    if (currentEditingItem && editState === 'deleting') {
      resetEditingState();
    }
    
    const parentId = selectedMenuItem ? selectedMenuItem.id : '0';
    const parentLevel = selectedMenuItem ? parseInt(selectedMenuItem.level) : -1;
    const newLevel = parentLevel + 1;
    
    const newItem = {
      id: `temp_${nextId}`,
      name: '새 메뉴',
      url: '',
      order: nextId.toString(),
      active: 'true',
      parent: parentId,
      level: newLevel.toString(),
      buttons: '',
      description: '',
      temp: true,
      markedForDelete: false
    };
    
    setMenuItems(prev => [...prev, newItem]);
    setCurrentEditingItem(newItem);
    setEditState('adding');
    setSelectedMenuItem(newItem);
    
    // 폼 초기화 및 편집 모드 설정
    clearForm();
    setFormData(prev => ({ ...prev, menuName: '새 메뉴' }));
    setIsEditMode(false);
    setNextId(prev => prev + 1);
  };

  // 메뉴 삭제
  const handleRemoveMenu = () => {
    if (!selectedMenuItem) return;
    if (editState === 'deleting') return;
    
    if (currentEditingItem && editState === 'adding') {
      resetEditingState();
    }
    
    if (selectedMenuItem.temp) {
      // 임시 아이템은 바로 삭제
      setMenuItems(prev => prev.filter(item => item.id !== selectedMenuItem.id));
      clearSelectionAndResetState();
    } else {
      // 기존 아이템은 삭제 표시
      setMenuItems(prev => prev.map(item => 
        item.id === selectedMenuItem.id 
          ? { ...item, markedForDelete: true }
          : item
      ));
      setCurrentEditingItem(selectedMenuItem);
      setEditState('deleting');
    }
  };

  // 초기화
  const handleReset = () => {
    if (window.confirm('모든 수정 사항이 초기화됩니다. 계속하시겠습니까?')) {
      // 임시 아이템 제거 및 삭제 표시 제거
      setMenuItems(prev => prev.filter(item => !item.temp).map(item => ({
        ...item,
        markedForDelete: false
      })));
      
      setCurrentEditingItem(null);
      setEditState(null);
      clearSelectionAndResetState();
      
      alert('모든 수정 상태가 초기화되었습니다.');
    }
  };

  // 전체 펼치기
  const handleExpandAll = () => {
    const expanded = {};
    menuItems.forEach(item => {
      expanded[item.id] = true;
    });
    setExpandedItems(expanded);
  };

  // 전체 접기
  const handleCollapseAll = () => {
    const expanded = {};
    menuItems.forEach(item => {
      expanded[item.id] = false;
    });
    setExpandedItems(expanded);
  };

  // 폼 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.menuName.trim()) {
      alert('메뉴명을 입력해주세요.');
      return;
    }
    
    if (selectedMenuItem) {
      if (selectedMenuItem.markedForDelete) {
        // 삭제 처리
        setMenuItems(prev => prev.filter(item => item.id !== selectedMenuItem.id));
        alert('메뉴가 삭제되었습니다.');
      } else if (selectedMenuItem.temp) {
        // 새 메뉴 저장
        setMenuItems(prev => prev.map(item => 
          item.id === selectedMenuItem.id 
            ? {
                ...item,
                name: formData.menuName,
                url: formData.menuUrl,
                order: formData.menuOrder,
                description: formData.menuDescription,
                active: formData.isActive.toString(),
                buttons: formData.buttons.join(','),
                temp: false
              }
            : item
        ));
        alert('메뉴가 저장되었습니다.');
      } else {
        // 기존 메뉴 수정
        setMenuItems(prev => prev.map(item => 
          item.id === selectedMenuItem.id 
            ? {
                ...item,
                name: formData.menuName,
                url: formData.menuUrl,
                order: formData.menuOrder,
                description: formData.menuDescription,
                active: formData.isActive.toString(),
                buttons: formData.buttons.join(',')
              }
            : item
        ));
        alert('메뉴가 수정되었습니다.');
      }
      
      setCurrentEditingItem(null);
      setEditState(null);
      clearSelectionAndResetState();
    }
  };

  // 버튼 권한 변경
  const handleButtonChange = (buttonValue, checked) => {
    setFormData(prev => ({
      ...prev,
      buttons: checked 
        ? [...prev.buttons, buttonValue]
        : prev.buttons.filter(b => b !== buttonValue)
    }));
  };

  // 자식 메뉴 가져오기
  const getChildMenus = (parentId) => {
    return menuItems.filter(item => item.parent === parentId);
  };

  // 메뉴 아이템 렌더링
  const renderMenuItem = (item) => {
    const hasChildren = getChildMenus(item.id).length > 0;
    const isSelected = selectedMenuItem?.id === item.id;
    const isExpanded = expandedItems[item.id];
    const children = getChildMenus(item.id);
    
    return (
      <div key={item.id}>
        <div 
          className={`tree-item ${isSelected ? 'selected' : ''}`}
          onClick={(e) => handleItemClick(e, item)}
        >
          <div className={`tree-item-content inline-flex items-center p-2 rounded cursor-pointer transition-all hover:bg-gray-100 space-x-2 ${
            isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          }`}>
            {/* FontAwesome 폴더 아이콘 */}
            <svg 
              className="w-4 h-4 text-yellow-500 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
            <span className={`text-sm select-none ${item.temp ? 'italic text-gray-600' : 'text-black'}`}>
              {item.name}
            </span>
            {item.temp && (
              <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                +
              </div>
            )}
            {item.markedForDelete && (
              <div className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                -
              </div>
            )}
          </div>
        </div>
        
        {/* 자식 메뉴들 렌더링 */}
        {hasChildren && isExpanded && (
          <div className="ml-6 relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
            {children.map(child => (
              <div key={child.id} className="relative">
                <div className="absolute left-0 top-4 w-3 h-px bg-gray-300"></div>
                {renderMenuItem(child)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout 
      title="Neo AI Portal"
      subtitle="메뉴 관리 및 권한 설정 시스템"
      environment="Production"
      showNavigation={true}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <i className="fas fa-sitemap text-blue-600 text-lg" />
              <h1 className="text-lg font-semibold text-gray-900">메뉴 관리</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <button 
                onClick={handleExpandAll}
                className="px-2 py-1 text-gray-600 hover:text-gray-900"
              >
                <i className="fas fa-expand-arrows-alt mr-1" />전체 펼치기
              </button>
              <button 
                onClick={handleCollapseAll}
                className="px-2 py-1 text-gray-600 hover:text-gray-900"
              >
                <i className="fas fa-compress-arrows-alt mr-1" />전체 접기
              </button>
            </div>
          </div>
        </div>

        <div className="flex space-x-6">
          {/* Left Panel - Menu Tree */}
          <div className="w-2/5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h2 className="font-medium text-gray-900">메뉴 트리</h2>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleAddMenu}
                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors"
                  >
                    <i className="fas fa-plus mr-1" />추가
                  </button>
                  <button 
                    onClick={handleRemoveMenu}
                    disabled={!selectedMenuItem}
                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-trash mr-1" />삭제
                  </button>
                  <button 
                    onClick={handleReset}
                    className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded font-medium hover:bg-gray-700 transition-colors"
                  >
                    <i className="fas fa-refresh mr-1" />초기화
                  </button>
                </div>
              </div>

              {/* Menu Tree */}
              <div className="p-3">
                <div 
                  className="tree-container space-y-1 min-h-[400px]"
                  onClick={handleTreeClick}
                >
                  {menuItems
                    .filter(item => item.parent === "0")
                    .map(item => renderMenuItem(item))
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Menu Details */}
          <div className="w-3/5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="font-medium text-gray-900">메뉴 상세 정보</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">메뉴명 *</label>
                    <input 
                      type="text" 
                      value={formData.menuName}
                      onChange={(e) => setFormData(prev => ({ ...prev, menuName: e.target.value }))}
                      className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                      placeholder="메뉴명을 입력하세요" 
                      readOnly={isEditMode}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">정렬 순서 *</label>
                    <input 
                      type="number" 
                      min="1"
                      value={formData.menuOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, menuOrder: e.target.value }))}
                      className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                      placeholder="1" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">URL</label>
                    <input 
                      type="text" 
                      value={formData.menuUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, menuUrl: e.target.value }))}
                      className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                      placeholder="/path/to/page" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">메뉴 설명</label>
                    <input 
                      type="text" 
                      value={formData.menuDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, menuDescription: e.target.value }))}
                      className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                      placeholder="메뉴에 대한 설명을 입력하세요" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">버튼 권한</label>
                      <div className="flex space-x-4">
                        {['등록', '수정', '삭제', '조회'].map(button => (
                          <label key={button} className="flex items-center space-x-1">
                            <input 
                              type="checkbox" 
                              checked={formData.buttons.includes(button)}
                              onChange={(e) => handleButtonChange(button, e.target.checked)}
                              className="w-3.5 h-3.5 text-blue-600" 
                            />
                            <span className="text-sm">{button}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">상태</label>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="w-3.5 h-3.5 text-blue-600 mr-2" 
                        />
                        <label className="text-sm text-gray-700">활성화</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                    <button 
                      type="button" 
                      onClick={clearSelectionAndResetState}
                      className="px-4 py-2 text-sm bg-gray-600 text-white rounded font-medium hover:bg-gray-700 transition-colors"
                    >
                      취소
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
                    >
                      저장
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Menu;