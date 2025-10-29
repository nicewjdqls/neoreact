import React, { useState, useEffect } from 'react';
import MonitoringLayout from '../../components/MonitoringLayout';

// 성공 모달 컴포넌트
function SuccessModal({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(60, 65, 90, 0.98) 0%, rgba(75, 80, 110, 0.98) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '12px',
          padding: '2rem',
          minWidth: '400px',
          maxWidth: '500px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          textAlign: 'center'
        }}
      >
        <svg 
          style={{ 
            width: '48px', 
            height: '48px', 
            color: '#10b981', 
            marginBottom: '1rem',
            filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))'
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <h5 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#fff',
          marginBottom: '1rem'
        }}>
          성공
        </h5>
        <p style={{
          fontSize: '0.95rem',
          color: 'rgba(255, 255, 255, 0.85)',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          {message}
        </p>
        <button
          onClick={onClose}
          style={{
            padding: '0.75rem 2rem',
            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.4)';
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
}

// 확인 모달 컴포넌트
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        backdropFilter: 'blur(4px)'
      }}
      onClick={onCancel}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(60, 65, 90, 0.98) 0%, rgba(75, 80, 110, 0.98) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '12px',
          padding: '2rem',
          minWidth: '400px',
          maxWidth: '500px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          textAlign: 'center'
        }}
      >
        <svg 
          style={{ 
            width: '48px', 
            height: '48px', 
            color: '#f59e0b', 
            marginBottom: '1rem',
            filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))'
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <h5 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#fff',
          marginBottom: '1rem'
        }}>
          {title}
        </h5>
        <p style={{
          fontSize: '0.95rem',
          color: 'rgba(255, 255, 255, 0.85)',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          {message}
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
            }}
          >
            아니오
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.4)';
            }}
          >
            예
          </button>
        </div>
      </div>
    </div>
  );
}

function Menu() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [nextId, setNextId] = useState(12);
  const [currentEditingItem, setCurrentEditingItem] = useState(null);
  const [editState, setEditState] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  
  const [formData, setFormData] = useState({
    menuName: '',
    menuUrl: '',
    menuOrder: '',
    menuDescription: '',
    isActive: false,
    buttons: []
  });

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
      temp: false
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
      temp: false
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
      temp: false
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
      temp: false
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
      temp: false
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
      temp: false
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
      temp: false
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
      temp: false
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
      temp: false
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
      temp: false
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
      temp: false
    }
  ]);

  useEffect(() => {
    if (originalFormData && selectedMenuItem) {
      const isChanged = 
        formData.menuName !== originalFormData.menuName ||
        formData.menuUrl !== originalFormData.menuUrl ||
        formData.menuOrder !== originalFormData.menuOrder ||
        formData.menuDescription !== originalFormData.menuDescription ||
        formData.isActive !== originalFormData.isActive ||
        JSON.stringify(formData.buttons.sort()) !== JSON.stringify(originalFormData.buttons.sort());
      
      setHasUnsavedChanges(isChanged);
      
      if (isChanged && !selectedMenuItem.temp && !selectedMenuItem.markedForDelete) {
        setEditState('updating');
        setCurrentEditingItem(selectedMenuItem);
      } else if (!isChanged && editState === 'updating') {
        setEditState(null);
        setCurrentEditingItem(null);
      }
    }
  }, [formData, originalFormData, selectedMenuItem, editState]);

  useEffect(() => {
    const expanded = {};
    menuItems.forEach(item => {
      expanded[item.id] = true;
    });
    setExpandedItems(expanded);
  }, []);

  const handleTreeClick = (event) => {
    if (!event.target.closest('.tree-item-content')) {
      if (hasUnsavedChanges) {
        setPendingAction(() => clearSelectionAndResetState);
        setShowCancelModal(true);
      } else {
        clearSelectionAndResetState();
      }
    }
  };

  const handleItemClick = (event, item) => {
    event.stopPropagation();
    
    if (currentEditingItem && editState && currentEditingItem.id !== item.id) {
      if (hasUnsavedChanges) {
        setPendingAction(() => () => selectMenuItem(item));
        setShowCancelModal(true);
      } else {
        resetEditingState();
        selectMenuItem(item);
      }
    } else {
      selectMenuItem(item);
    }
  };

  const selectMenuItem = (item) => {
    setSelectedMenuItem(item);
    loadMenuData(item);
    setIsEditMode(false); // 항상 편집 가능하도록 변경
  };

  const loadMenuData = (item) => {
    const buttons = item.buttons ? item.buttons.split(',') : [];
    const newFormData = {
      menuName: item.name || '',
      menuUrl: item.url || '',
      menuOrder: item.order || '',
      menuDescription: item.description || '',
      isActive: item.active === 'true',
      buttons: buttons.filter(b => b.trim() !== '')
    };
    setFormData(newFormData);
    setOriginalFormData(newFormData);
    setHasUnsavedChanges(false);
  };

  const resetEditingState = () => {
    if (currentEditingItem && editState === 'adding') {
      setMenuItems(prev => prev.filter(item => item.id !== currentEditingItem.id));
    }
    
    setCurrentEditingItem(null);
    setEditState(null);
    setHasUnsavedChanges(false);
    setOriginalFormData(null);
  };

  const clearSelectionAndResetState = () => {
    resetEditingState();
    setSelectedMenuItem(null);
    clearForm();
  };

  const clearForm = () => {
    setFormData({
      menuName: '',
      menuUrl: '',
      menuOrder: '',
      menuDescription: '',
      isActive: false,
      buttons: []
    });
    setOriginalFormData(null);
    setIsEditMode(false);
  };

  const handleAddMenu = () => {
    if (editState === 'adding') return;
    
    if (hasUnsavedChanges) {
      setPendingAction(() => addNewMenu);
      setShowCancelModal(true);
      return;
    }
    
    addNewMenu();
  };

  const addNewMenu = () => {
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
      temp: true
    };
    
    setMenuItems(prev => [...prev, newItem]);
    setCurrentEditingItem(newItem);
    setEditState('adding');
    setSelectedMenuItem(newItem);
    
    const newFormData = { 
      menuName: '새 메뉴',
      menuUrl: '',
      menuOrder: nextId.toString(),
      menuDescription: '',
      isActive: true,
      buttons: []
    };
    setFormData(newFormData);
    setOriginalFormData(newFormData);
    setIsEditMode(false);
    setNextId(prev => prev + 1);
    setHasUnsavedChanges(false);
  };

  const handleRemoveMenu = () => {
    if (!selectedMenuItem) return;
    
    // 변경사항이 있으면 먼저 저장하거나 취소하도록 안내
    if (hasUnsavedChanges) {
      setPendingAction(() => () => setShowDeleteConfirmModal(true));
      setShowCancelModal(true);
      return;
    }
    
    // 삭제 확인 모달 표시
    setShowDeleteConfirmModal(true);
  };

  const executeDelete = () => {
    setShowDeleteConfirmModal(false);
    
    if (!selectedMenuItem) return;
    
    // 임시 항목은 바로 삭제
    if (selectedMenuItem.temp) {
      setMenuItems(prev => prev.filter(item => item.id !== selectedMenuItem.id));
      setSuccessMessage('메뉴가 삭제되었습니다.');
      setShowSuccessModal(true);
      clearSelectionAndResetState();
      return;
    }
    
    // 일반 항목은 트리에서 바로 삭제
    setMenuItems(prev => prev.filter(item => item.id !== selectedMenuItem.id));
    setSuccessMessage('메뉴가 삭제되었습니다.');
    setShowSuccessModal(true);
    clearSelectionAndResetState();
  };

  const handleReset = () => {
    if (hasUnsavedChanges) {
      setPendingAction(() => resetAll);
      setShowCancelModal(true);
      return;
    }
    resetAll();
  };

  const resetAll = () => {
    setMenuItems(prev => prev.filter(item => !item.temp));
    
    setCurrentEditingItem(null);
    setEditState(null);
    clearSelectionAndResetState();
    
    setSuccessMessage('모든 수정 상태가 초기화되었습니다.');
    setShowSuccessModal(true);
  };

  const handleExpandAll = () => {
    const expanded = {};
    menuItems.forEach(item => {
      expanded[item.id] = true;
    });
    setExpandedItems(expanded);
  };

  const handleCollapseAll = () => {
    const expanded = {};
    menuItems.forEach(item => {
      expanded[item.id] = false;
    });
    setExpandedItems(expanded);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.menuName.trim()) {
      alert('메뉴명을 입력해주세요.');
      return;
    }
    
    // 저장 확인 모달 표시
    setShowSaveConfirmModal(true);
  };

  const executeSubmit = () => {
    setShowSaveConfirmModal(false);
    
    if (selectedMenuItem) {
      if (selectedMenuItem.temp) {
        const permanentId = nextId.toString();
        setMenuItems(prev => prev.map(item => 
          item.id === selectedMenuItem.id 
            ? {
                ...item,
                id: permanentId,
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
        setNextId(prev => prev + 1);
        setSuccessMessage('메뉴가 저장되었습니다.');
        setShowSuccessModal(true);
      } else {
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
        setSuccessMessage('메뉴가 수정되었습니다.');
        setShowSuccessModal(true);
      }
      
      setCurrentEditingItem(null);
      setEditState(null);
      clearSelectionAndResetState();
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelModal(true);
      setPendingAction(() => clearSelectionAndResetState);
    } else {
      clearSelectionAndResetState();
    }
  };

  const handleModalConfirm = () => {
    setShowCancelModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleModalCancel = () => {
    setShowCancelModal(false);
    setPendingAction(null);
  };

  const handleButtonChange = (buttonValue, checked) => {
    setFormData(prev => ({
      ...prev,
      buttons: checked 
        ? [...prev.buttons, buttonValue]
        : prev.buttons.filter(b => b !== buttonValue)
    }));
  };

  const getChildMenus = (parentId) => {
    return menuItems.filter(item => item.parent === parentId);
  };

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderMenuItem = (item) => {
    const hasChildren = getChildMenus(item.id).length > 0;
    const isSelected = selectedMenuItem?.id === item.id;
    const isExpanded = expandedItems[item.id];
    const children = getChildMenus(item.id);
    
    return (
      <div key={item.id} style={{ marginBottom: '0.25rem' }}>
        <div 
          className="tree-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(item.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                padding: '0.5rem',
                fontSize: '0.75rem',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {!hasChildren && <div style={{ width: '24px', flexShrink: 0 }}></div>}
          
          <div
            className="tree-item-content"
            onClick={(e) => handleItemClick(e, item)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
              background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              border: isSelected ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <svg 
              style={{ width: '16px', height: '16px', color: '#eab308', flexShrink: 0 }} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
            
            <span style={{ 
              fontSize: '0.875rem', 
              color: item.temp ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.9)',
              fontStyle: item.temp ? 'italic' : 'normal',
              userSelect: 'none',
              whiteSpace: 'nowrap'
            }}>
              {item.name}
            </span>
            
            {item.temp && (
              <div style={{
                width: '16px',
                height: '16px',
                background: '#3b82f6',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '700',
                flexShrink: 0
              }}>
                +
              </div>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div style={{ marginLeft: '1.5rem', marginTop: '0.25rem' }}>
            {children.map(child => renderMenuItem(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <MonitoringLayout>
      <SuccessModal
        isOpen={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />

      <ConfirmModal
        isOpen={showCancelModal}
        title="수정 중인 사항이 있습니다"
        message="저장하지 않은 변경사항이 있습니다. 작업을 취소하시겠습니까?"
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      <ConfirmModal
        isOpen={showSaveConfirmModal}
        title="저장 확인"
        message="변경사항을 저장하시겠습니까?"
        onConfirm={executeSubmit}
        onCancel={() => setShowSaveConfirmModal(false)}
      />

      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        title="삭제 확인"
        message="선택한 메뉴를 삭제하시겠습니까?"
        onConfirm={executeDelete}
        onCancel={() => setShowDeleteConfirmModal(false)}
      />

      <div style={{ padding: '1rem' }}>
        <style>{`
          .menu-card {
            background: rgba(42, 48, 70, 0.7);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }
          .menu-btn {
            padding: 0.5rem 1rem;
            border-radius: 6px;
            border: none;
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.3s;
          }
          .menu-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .menu-input {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.05);
            color: #fff;
            font-size: 0.875rem;
            transition: all 0.3s;
          }
          .menu-input:focus {
            outline: none;
            border: 1px solid rgba(99, 102, 241, 0.5);
            background: rgba(255, 255, 255, 0.1);
          }
          .menu-input:read-only {
            background: rgba(255, 255, 255, 0.02);
            cursor: not-allowed;
          }
          .menu-input::placeholder {
            color: rgba(255, 255, 255, 0.3);
          }
        `}</style>

        <div style={{ 
          background: 'rgba(42, 48, 70, 0.6)', 
          padding: '0.75rem 1rem', 
          borderRadius: '6px', 
          marginBottom: '1rem', 
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🗂️</span>
            <span style={{ fontSize: '1.125rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.95)' }}>
              메뉴 관리
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}>
            <button 
              onClick={handleExpandAll}
              style={{
                padding: '0.375rem 0.75rem',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '6px',
                color: 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              전체 펼치기
            </button>
            <button 
              onClick={handleCollapseAll}
              style={{
                padding: '0.375rem 0.75rem',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '6px',
                color: 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              전체 접기
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '1rem' }}>
          <div className="menu-card">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.95)' }}>
                메뉴 트리
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handleAddMenu}
                  className="menu-btn"
                  style={{ background: '#10b981', color: '#fff' }}
                >
                  추가
                </button>
                <button 
                  onClick={handleRemoveMenu}
                  disabled={!selectedMenuItem}
                  className="menu-btn"
                  style={{ background: '#ef4444', color: '#fff' }}
                >
                  삭제
                </button>
                <button 
                  onClick={handleReset}
                  className="menu-btn"
                  style={{ background: '#6b7280', color: '#fff' }}
                >
                  초기화
                </button>
              </div>
            </div>

            <div 
              className="tree-container"
              onClick={handleTreeClick}
              style={{ minHeight: '400px' }}
            >
              {menuItems
                .filter(item => item.parent === "0")
                .map(item => renderMenuItem(item))
              }
            </div>
          </div>

          <div className="menu-card">
            <div style={{ 
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.95)' }}>
                메뉴 상세 정보
              </h2>
            </div>
            
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                    메뉴명 *
                  </label>
                  <input 
                    type="text" 
                    value={formData.menuName}
                    onChange={(e) => setFormData(prev => ({ ...prev, menuName: e.target.value }))}
                    className="menu-input"
                    placeholder="메뉴명을 입력하세요"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                    정렬 순서 *
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.menuOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, menuOrder: e.target.value }))}
                    className="menu-input"
                    placeholder="1" 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                    URL
                  </label>
                  <input 
                    type="text" 
                    value={formData.menuUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, menuUrl: e.target.value }))}
                    className="menu-input"
                    placeholder="/path/to/page" 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                    메뉴 설명
                  </label>
                  <input 
                    type="text" 
                    value={formData.menuDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, menuDescription: e.target.value }))}
                    className="menu-input"
                    placeholder="메뉴에 대한 설명을 입력하세요" 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                      버튼 권한
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {['등록', '수정', '삭제', '조회'].map(button => (
                        <label key={button} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={formData.buttons.includes(button)}
                            onChange={(e) => handleButtonChange(button, e.target.checked)}
                            style={{ 
                              width: '16px', 
                              height: '16px',
                              accentColor: '#6366f1',
                              cursor: 'pointer'
                            }}
                          />
                          <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>{button}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                      상태
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        style={{ 
                          width: '16px', 
                          height: '16px',
                          accentColor: '#6366f1',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>활성화</span>
                    </label>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: '0.5rem', 
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="menu-btn"
                    style={{ background: '#6b7280', color: '#fff' }}
                  >
                    취소
                  </button>
                  <button 
                    type="button"
                    onClick={handleSubmit} 
                    className="menu-btn"
                    style={{ background: '#6366f1', color: '#fff' }}
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MonitoringLayout>
  );
}

export default Menu;