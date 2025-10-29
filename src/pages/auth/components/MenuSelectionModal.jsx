import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronRight, Folder, File, Menu, Maximize2, Minimize2, Info } from 'lucide-react';

const MenuSelectionModal = ({ 
  show, 
  onHide, 
  onConfirm, 
  isLoading, 
  menuTree = [],
  selectedRoleKey,
  menuMap = {},
  currentUser = '게스트'
}) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedMenus, setSelectedMenus] = useState({}); // {key: {name, key, user, permissions}}

  useEffect(() => {
    if (show) {
      const expanded = {};
      const setExpanded = (nodes) => {
        nodes.forEach(node => {
          expanded[node.key] = true;
          if (node.children && node.children.length > 0) {
            setExpanded(node.children);
          }
        });
      };
      setExpanded(menuTree);
      setExpandedItems(expanded);
      
      // Initialize selected menus from current menuMap
      if (selectedRoleKey && menuMap[selectedRoleKey]) {
        const menusObj = {};
        menuMap[selectedRoleKey].forEach(menu => {
          menusObj[menu.key] = menu;
        });
        setSelectedMenus(menusObj);
      } else {
        setSelectedMenus({});
      }
    }
  }, [show, menuTree, selectedRoleKey, menuMap]);

  const toggleExpand = (nodeKey, event) => {
    event.stopPropagation();
    setExpandedItems(prev => ({
      ...prev,
      [nodeKey]: !prev[nodeKey]
    }));
  };

  // 자식 노드들의 키를 모두 가져오는 함수
  const getAllChildKeys = (node) => {
    let keys = [];
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        keys.push(child.key);
        keys = keys.concat(getAllChildKeys(child));
      });
    }
    return keys;
  };

  // 노드를 찾는 함수
  const findNode = (nodes, key) => {
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children && node.children.length > 0) {
        const found = findNode(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  // 모든 자식이 선택되었는지 확인
  const areAllChildrenSelected = (node) => {
    if (!node.children || node.children.length === 0) return false;
    
    const allChildKeys = getAllChildKeys(node);
    return allChildKeys.every(key => selectedMenus[key]);
  };

  // 메뉴 선택/해제 토글
  const toggleSelection = (nodeKey) => {
    const node = findNode(menuTree, nodeKey);
    if (!node) return;

    const hasChildren = node.children && node.children.length > 0;

    if (hasChildren) {
      // 폴더를 클릭한 경우
      const allChildKeys = getAllChildKeys(node);
      const allSelected = areAllChildrenSelected(node);

      setSelectedMenus(prev => {
        const newSelected = { ...prev };

        if (allSelected) {
          // 모두 선택된 상태 -> 모두 해제
          allChildKeys.forEach(key => {
            delete newSelected[key];
          });
        } else {
          // 일부만 선택되었거나 선택 안 됨 -> 모두 선택
          allChildKeys.forEach(key => {
            const childNode = findNode(menuTree, key);
            if (childNode && (!childNode.children || childNode.children.length === 0)) {
              // 리프 노드만 선택
              if (!newSelected[key]) {
                newSelected[key] = {
                  name: childNode.name,
                  key: childNode.key,
                  user: currentUser,
                  permissions: {
                    create: false,
                    update: false,
                    delete: false,
                    read: true
                  }
                };
              }
            }
          });
        }

        return newSelected;
      });
    } else {
      // 리프 노드를 클릭한 경우
      setSelectedMenus(prev => {
        const newSelected = { ...prev };
        
        if (newSelected[nodeKey]) {
          // 이미 선택됨 -> 해제
          delete newSelected[nodeKey];
        } else {
          // 선택 안 됨 -> 선택
          newSelected[nodeKey] = {
            name: node.name,
            key: node.key,
            user: currentUser,
            permissions: {
              create: false,
              update: false,
              delete: false,
              read: true
            }
          };
        }

        return newSelected;
      });
    }
  };

  // 권한 업데이트
  const updatePermission = (menuKey, permissionType, checked) => {
    setSelectedMenus(prev => {
      if (!prev[menuKey]) return prev;
      
      return {
        ...prev,
        [menuKey]: {
          ...prev[menuKey],
          permissions: {
            ...prev[menuKey].permissions,
            [permissionType]: checked
          }
        }
      };
    });
  };

  const expandAll = () => {
    const expanded = {};
    const setExpanded = (nodes) => {
      nodes.forEach(node => {
        expanded[node.key] = true;
        if (node.children && node.children.length > 0) {
          setExpanded(node.children);
        }
      });
    };
    setExpanded(menuTree);
    setExpandedItems(expanded);
  };

  const collapseAll = () => {
    setExpandedItems({});
  };

  const handleConfirm = () => {
    const selectedArray = Object.values(selectedMenus);
    console.log('모달에서 전달하는 선택된 메뉴 (권한 포함):', selectedArray);
    onConfirm(selectedArray);
  };

  const renderMenuTree = (nodes, level = 0) => {
    return nodes.map(node => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedItems[node.key];
      const isLeafNode = !hasChildren;
      const isChecked = isLeafNode ? selectedMenus[node.key] : areAllChildrenSelected(node);
      const isPartiallySelected = hasChildren && !isChecked && getAllChildKeys(node).some(key => selectedMenus[key]);

      return (
        <div key={node.key} style={{ width: '100%' }}>
          <div
            onClick={() => toggleSelection(node.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.875rem 1rem',
              paddingLeft: `${1 + level * 1.5}rem`,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: isChecked 
                ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)'
                : isPartiallySelected
                ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)'
                : 'transparent',
              borderLeft: isChecked ? '3px solid #6366f1' : isPartiallySelected ? '3px solid rgba(99, 102, 241, 0.5)' : '3px solid transparent',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (!isChecked && !isPartiallySelected) {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isChecked && !isPartiallySelected) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {/* Expand/Collapse Button */}
            {hasChildren && (
              <button
                onClick={(e) => toggleExpand(node.key, e)}
                style={{
                  marginRight: '0.625rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '0.375rem',
                  width: '1.75rem',
                  height: '1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                }}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}
            
            {/* Checkbox */}
            <div
              style={{
                marginRight: '0.75rem',
                marginLeft: hasChildren ? 0 : '2.375rem',
                width: '1.25rem',
                height: '1.25rem',
                borderRadius: '0.375rem',
                border: isChecked 
                  ? '2px solid #6366f1' 
                  : '2px solid rgba(255, 255, 255, 0.3)',
                background: isChecked 
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' 
                  : isPartiallySelected
                  ? 'rgba(99, 102, 241, 0.3)'
                  : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
            >
              {isChecked && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {isPartiallySelected && !isChecked && (
                <div style={{
                  width: '8px',
                  height: '2px',
                  background: '#6366f1',
                  borderRadius: '1px'
                }} />
              )}
            </div>
            
            {/* Icon */}
            <div
              style={{
                marginRight: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                borderRadius: '0.5rem',
                background: hasChildren 
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
                border: `1px solid ${hasChildren ? 'rgba(245, 158, 11, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                flexShrink: 0
              }}
            >
              {hasChildren ? (
                <Folder size={16} color="#f59e0b" />
              ) : (
                <File size={16} color="#6366f1" />
              )}
            </div>
            
            {/* Menu Name */}
            <span
              style={{
                fontSize: '0.9375rem',
                fontWeight: hasChildren ? '600' : '500',
                color: isChecked ? '#fff' : 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '-0.01em',
                flex: 1
              }}
            >
              {node.name}
            </span>

            {/* Permission checkboxes for leaf nodes */}
            {isLeafNode && selectedMenus[node.key] && (
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginLeft: '1rem',
                alignItems: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedMenus[node.key].permissions.create}
                    onChange={(e) => updatePermission(node.key, 'create', e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  등록
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedMenus[node.key].permissions.update}
                    onChange={(e) => updatePermission(node.key, 'update', e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  수정
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedMenus[node.key].permissions.delete}
                    onChange={(e) => updatePermission(node.key, 'delete', e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  삭제
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedMenus[node.key].permissions.read}
                    onChange={(e) => updatePermission(node.key, 'read', e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  조회
                </label>
              </div>
            )}

            {/* Badge for children count */}
            {hasChildren && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'rgba(245, 158, 11, 0.9)',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '0.375rem',
                  marginLeft: '0.5rem'
                }}
              >
                {node.children.length}
              </span>
            )}
          </div>
          
          {hasChildren && isExpanded && (
            <div style={{ width: '100%' }}>
              {renderMenuTree(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onHide();
        }
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 33, 57, 0.98) 0%, rgba(42, 48, 70, 0.98) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '1.25rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(99, 102, 241, 0.1)',
          width: '100%',
          maxWidth: '1100px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)'
              }}
            >
              <Menu size={20} color="white" />
            </div>
            <div>
              <h2 style={{ 
                margin: 0, 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#fff',
                letterSpacing: '-0.02em'
              }}>
                메뉴 선택 및 권한 설정
              </h2>
              <p style={{ 
                margin: '0.25rem 0 0 0', 
                fontSize: '0.875rem', 
                color: 'rgba(255, 255, 255, 0.6)' 
              }}>
                메뉴를 선택하고 각 메뉴의 권한을 설정하세요
              </p>
            </div>
          </div>
          
          {!isLoading && (
            <button
              onClick={onHide}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.625rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                e.currentTarget.style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Toolbar */}
        <div
          style={{
            padding: '1rem 1.5rem',
            background: 'rgba(0, 0, 0, 0.2)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.875rem',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '0.5rem'
            }}
          >
            <Info size={16} color="#a5b4fc" />
            <span style={{ fontSize: '0.875rem', color: '#a5b4fc', fontWeight: '500' }}>
              선택된 메뉴: <strong style={{ color: '#c7d2fe' }}>{Object.keys(selectedMenus).length}</strong>개
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={expandAll}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <Maximize2 size={14} />
              전체 펼치기
            </button>
            <button
              onClick={collapseAll}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <Minimize2 size={14} />
              전체 접기
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.5) 0%, rgba(54, 61, 90, 0.5) 100%)',
            position: 'relative'
          }}
        >
          {menuTree.length > 0 ? (
            renderMenuTree(menuTree)
          ) : (
            <div
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)'
              }}
            >
              <Menu size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                메뉴 데이터가 없습니다
              </p>
              <p style={{ fontSize: '0.875rem', margin: 0, opacity: 0.7 }}>
                표시할 메뉴가 없습니다
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderTop: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end'
          }}
        >
          <button
            onClick={onHide}
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.9375rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.625rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isLoading ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.9375rem',
              fontWeight: '600',
              color: '#fff',
              background: isLoading 
                ? 'rgba(99, 102, 241, 0.6)' 
                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: '0.625rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: isLoading ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
              }
            }}
          >
            {isLoading && (
              <div
                style={{
                  width: '1rem',
                  height: '1rem',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite'
                }}
              />
            )}
            {isLoading ? '설정중...' : '확인'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuSelectionModal;