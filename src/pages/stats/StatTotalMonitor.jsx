import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, RefreshCw, Calendar, Clock } from 'lucide-react';
import MonitoringLayout from '../../components/MonitoringLayout';

// 커스텀 DateTime 피커 컴포넌트 (다크 테마)
function CustomDateTimePicker({ value, onChange, placeholder, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDateTime, setTempDateTime] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: new Date().getMinutes()
  });
  
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setTempDateTime({
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes()
      });
    }
  }, [value]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const formatTime = (date) => {
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${hour}:${minute}`;
  };

  const generateCalendar = () => {
    const firstDay = new Date(tempDateTime.year, tempDateTime.month, 1);
    const lastDay = new Date(tempDateTime.year, tempDateTime.month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate);
    }
    return days;
  };

  const handleDateSelect = (date) => {
    setTempDateTime(prev => ({
      ...prev,
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    }));
  };

  const handleConfirm = () => {
    const newDateTime = new Date(tempDateTime.year, tempDateTime.month, tempDateTime.day, tempDateTime.hour, tempDateTime.minute);
    const formattedValue = newDateTime.toISOString().slice(0, 16);
    onChange(formattedValue);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const displayValue = value ? 
    `${formatDate(new Date(value))} ${formatTime(new Date(value))}` : 
    '';

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={inputRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.625rem 0.875rem',
          fontSize: '0.875rem',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '0.75rem',
          cursor: 'pointer',
          background: 'rgba(42, 48, 70, 0.6)',
          color: displayValue ? '#fff' : 'rgba(255, 255, 255, 0.5)',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
      >
        <Calendar size={16} style={{ marginRight: '0.5rem', color: '#6366f1' }} />
        <span>{displayValue || placeholder}</span>
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef} 
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            left: 0,
            minWidth: '650px',
            background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.98) 0%, rgba(54, 61, 90, 0.98) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
            zIndex: 50
          }}
        >
          <div style={{ display: 'flex' }}>
            {/* 캘린더 섹션 */}
            <div style={{ width: '350px', padding: '1rem', borderRight: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center' }}>
                  <Calendar size={16} style={{ marginRight: '0.25rem' }} />
                  날짜 선택
                </h4>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setTempDateTime(prev => ({ 
                    ...prev, 
                    month: prev.month - 1 < 0 ? 11 : prev.month - 1, 
                    year: prev.month - 1 < 0 ? prev.year - 1 : prev.year 
                  }))}
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  &#8249;
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    value={tempDateTime.year}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#fff',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none'
                    }}
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                      <option key={year} value={year} style={{ background: '#2a3046' }}>{year}년</option>
                    ))}
                  </select>
                  <select
                    value={tempDateTime.month}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#fff',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none'
                    }}
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index} style={{ background: '#2a3046' }}>{month}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setTempDateTime(prev => ({ 
                    ...prev, 
                    month: prev.month + 1 > 11 ? 0 : prev.month + 1, 
                    year: prev.month + 1 > 11 ? prev.year + 1 : prev.year 
                  }))}
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  &#8250;
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
                {weekDays.map(day => (
                  <div key={day} style={{ height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)' }}>
                    {day}
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
                {generateCalendar().map((date, index) => {
                  const isCurrentMonth = date.getMonth() === tempDateTime.month;
                  const isSelected = date.getDate() === tempDateTime.day && 
                                   date.getMonth() === tempDateTime.month && 
                                   date.getFullYear() === tempDateTime.year;
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDateSelect(date)}
                      style={{
                        height: '2rem',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        color: !isCurrentMonth
                          ? 'rgba(255, 255, 255, 0.2)'
                          : isSelected
                          ? '#fff'
                          : isToday
                          ? '#6366f1'
                          : 'rgba(255, 255, 255, 0.7)',
                        background: isSelected
                          ? '#6366f1'
                          : isToday
                          ? 'rgba(99, 102, 241, 0.2)'
                          : 'transparent',
                        fontWeight: isSelected || isToday ? '600' : '400'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = isToday ? 'rgba(99, 102, 241, 0.2)' : 'transparent';
                        }
                      }}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 시간 선택 섹션 */}
            <div style={{ width: '300px', padding: '1rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center' }}>
                  <Clock size={16} style={{ marginRight: '0.25rem' }} />
                  시간 선택
                </h4>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.75rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff' }}>
                  {formatDate(new Date(tempDateTime.year, tempDateTime.month, tempDateTime.day))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '0.5rem' }}>시</label>
                  <select
                    value={tempDateTime.hour}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, hour: parseInt(e.target.value) }))}
                    style={{
                      width: '4rem',
                      textAlign: 'center',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '0.75rem',
                      padding: '0.5rem',
                      background: 'rgba(42, 48, 70, 0.6)',
                      color: '#fff',
                      outline: 'none'
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i} style={{ background: '#2a3046' }}>{String(i).padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>

                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.3)', marginTop: '1.5rem' }}>:</div>

                <div style={{ textAlign: 'center' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '0.5rem' }}>분</label>
                  <select
                    value={tempDateTime.minute}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, minute: parseInt(e.target.value) }))}
                    style={{
                      width: '4rem',
                      textAlign: 'center',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '0.75rem',
                      padding: '0.5rem',
                      background: 'rgba(42, 48, 70, 0.6)',
                      color: '#fff',
                      outline: 'none'
                    }}
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i} style={{ background: '#2a3046' }}>{String(i).padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleConfirm}
                  style={{
                    width: '100%',
                    padding: '0.625rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#fff',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  확인
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    width: '100%',
                    padding: '0.625rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.7)',
                    background: 'transparent',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 알림 모달 컴포넌트 (다크 테마)
function AlertModal({ show, onClose, config }) {
  if (!show) return null;

  const getButtonStyle = () => {
    switch (config.variant) {
      case 'success':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'info':
        return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      default:
        return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 80
    }} onClick={onClose}>
      <div 
        style={{
          width: '400px',
          maxWidth: '90%',
          background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.98) 0%, rgba(54, 61, 90, 0.98) 100%)',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          {config.icon}
          <h5 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#fff' }}>{config.title}</h5>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{config.message}</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {config.showRetry && (
              <button 
                onClick={config.onRetry}
                style={{
                  padding: '0.75rem 1.5rem',
                  color: '#6366f1',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
                재시도
              </button>
            )}
            <button 
              onClick={onClose}
              style={{
                padding: '0.75rem 2rem',
                color: '#fff',
                borderRadius: '0.75rem',
                fontWeight: '600',
                background: getButtonStyle(),
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTotalMonitor() {
  const uniqId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  };

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null,
    showRetry: false,
    onRetry: null
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    serviceType: '',
    filterLevel: '',
    filterText: ''
  });

  const services = ['일반', '데이터수집', '학습모델', 'AI Chat', 'APIs', '설정', '모니터링'];
  const nodes = ['node01', 'node02', 'node03', 'node04', 'node05'];
  const urls = [
    'https://service1.example.com',
    'https://service2.example.com',
    'https://service3.example.com',
    'https://service4.example.com',
    'https://service5.example.com'
  ];
  const messages = [
    'Started inference',
    'Completed batch',
    'Error reading data',
    'Session timeout',
    'User disconnected',
    'GPU memory warning'
  ];
  const users = ['user01', 'user02', 'user03', 'user04', 'user05'];
  const ips = ['192.168.0.101', '192.168.0.102', '192.168.0.103', '192.168.0.104', '192.168.0.105'];

  const showNotification = (title, message, variant = 'danger', showRetry = false, onRetry = null) => {
    const iconMap = {
      success: <CheckCircle size={48} style={{ color: '#10b981', marginBottom: '1rem', margin: '0 auto' }} />,
      danger: <XCircle size={48} style={{ color: '#ef4444', marginBottom: '1rem', margin: '0 auto' }} />,
      warning: <AlertTriangle size={48} style={{ color: '#f59e0b', marginBottom: '1rem', margin: '0 auto' }} />,
      info: <Info size={48} style={{ color: '#3b82f6', marginBottom: '1rem', margin: '0 auto' }} />
    };
    
    setAlertConfig({
      title,
      message,
      variant,
      icon: iconMap[variant],
      showRetry,
      onRetry
    });
    setShowAlertModal(true);
  };

  const formatDateTime = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const validateFilters = () => {
    if (filters.startDate && filters.endDate) {
      const startDateTime = new Date(filters.startDate);
      const endDateTime = new Date(filters.endDate);
      
      if (startDateTime > endDateTime) {
        showNotification(
          '날짜 시간 범위 오류',
          '시작 일시는 종료 일시보다 이전이어야 합니다. 날짜와 시간을 다시 확인해주세요.',
          'danger'
        );
        return false;
      }

      const daysDiff = (endDateTime - startDateTime) / (1000 * 60 * 60 * 24);
      if (daysDiff > 30) {
        showNotification(
          '조회 기간 제한',
          '조회 기간은 30일을 초과할 수 없습니다. 기간을 줄여주세요.',
          'warning'
        );
        return false;
      }

      const now = new Date();
      if (startDateTime > now || endDateTime > now) {
        showNotification(
          '날짜 선택 오류',
          '미래 날짜는 선택할 수 없습니다.',
          'danger'
        );
        return false;
      }
    }
    return true;
  };

  const simulateServerError = () => {
    return Math.random() < 0.05;
  };

  const addLog = () => {
    const now = new Date();
    const newLog = {
      id: uniqId(),
      timestamp: formatDateTime(now),
      service: services[Math.floor(Math.random() * services.length)],
      level: ['INFO', 'WARN', 'ERROR'][Math.floor(Math.random() * 3)],
      message: messages[Math.floor(Math.random() * messages.length)],
      node: nodes[Math.floor(Math.random() * nodes.length)],
      userId: users[Math.floor(Math.random() * users.length)],
      clientIp: ips[Math.floor(Math.random() * ips.length)],
      url: urls[Math.floor(Math.random() * urls.length)],
      delay: Math.floor(Math.random() * 500),
      rawTime: now
    };

    setLogs(prev => {
      const updated = [newLog, ...prev];
      return updated.length > 1000 ? updated.slice(0, 1000) : updated;
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = async () => {
    if (!validateFilters()) {
      return;
    }

    setAutoScroll(false);
    setIsLoading(true);
    
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (simulateServerError()) {
            reject(new Error('서버 연결 오류'));
          } else {
            resolve();
          }
        }, 1000 + Math.random() * 1000);
      });

      let filtered = [...logs];

      if (filters.startDate) {
        const startTime = new Date(filters.startDate);
        filtered = filtered.filter(log => log.rawTime >= startTime);
      }

      if (filters.endDate) {
        const endTime = new Date(filters.endDate);
        const endOfDay = new Date(endTime);
        endOfDay.setHours(23, 59, 59, 999);
        filtered = filtered.filter(log => log.rawTime <= endOfDay);
      }

      if (filters.serviceType) {
        filtered = filtered.filter(log => log.service === filters.serviceType);
      }

      if (filters.filterLevel) {
        filtered = filtered.filter(log => log.level === filters.filterLevel);
      }

      if (filters.filterText) {
        const searchLower = filters.filterText.toLowerCase();
        filtered = filtered.filter(log => 
          log.message.toLowerCase().includes(searchLower) ||
          log.node.toLowerCase().includes(searchLower) ||
          log.url.toLowerCase().includes(searchLower) ||
          log.userId.toLowerCase().includes(searchLower) ||
          log.clientIp.toLowerCase().includes(searchLower)
        );
      }

      filtered.sort((a, b) => b.rawTime - a.rawTime);

      setFilteredLogs(filtered);
      
      setTimeout(() => {
        showNotification(
          '조회 완료',
          `총 ${filtered.length}건의 로그 데이터가 조회되었습니다.`,
          'success'
        );
      }, 100);

    } catch (error) {
      showNotification(
        '조회 오류',
        '데이터 조회 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.',
        'danger',
        true,
        () => {
          setShowAlertModal(false);
          setTimeout(() => {
            applyFilters();
          }, 500);
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelBadgeStyle = (level) => {
    switch (level) {
      case 'INFO': return { background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' };
      case 'WARN': return { background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' };
      case 'ERROR': return { background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' };
      default: return { background: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af', border: '1px solid rgba(156, 163, 175, 0.3)' };
    }
  };

  const isDateTimeRangeValid = () => {
    if (!filters.startDate || !filters.endDate) return true;
    const startDateTime = new Date(filters.startDate);
    const endDateTime = new Date(filters.endDate);
    return startDateTime <= endDateTime;
  };

  useEffect(() => {
    const interval = setInterval(addLog, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (autoScroll && logs.length > 0) {
      setFilteredLogs([...logs]);
    }
  }, [logs, autoScroll]);

  return (
    <MonitoringLayout>
      <AlertModal 
        show={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        config={alertConfig}
      />

      <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          {/* 페이지 헤더 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.6) 0%, rgba(54, 61, 90, 0.6) 100%)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', margin: 0 }}>토탈 실시간 로그 상세조회</h2>
          </div>

          {/* 필터 영역 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.6) 0%, rgba(54, 61, 90, 0.6) 100%)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'end', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {/* 시작일시 */}
              <div style={{ flex: '1 1 160px', minWidth: '160px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>시작일시</label>
                <CustomDateTimePicker
                  value={filters.startDate}
                  onChange={(value) => handleFilterChange('startDate', value)}
                  placeholder="시작일시 선택"
                />
              </div>

              {/* 종료일시 */}
              <div style={{ flex: '1 1 160px', minWidth: '160px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>종료일시</label>
                <CustomDateTimePicker
                  value={filters.endDate}
                  onChange={(value) => handleFilterChange('endDate', value)}
                  placeholder="종료일시 선택"
                />
              </div>

              {/* 서비스 구분 */}
              <div style={{ flex: '1 1 140px', minWidth: '140px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>서비스 구분</label>
                <select
                  value={filters.serviceType}
                  onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    fontSize: '0.875rem',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '0.75rem',
                    background: 'rgba(42, 48, 70, 0.6)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="">전체</option>
                  {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div style={{ flex: '1 1 120px', minWidth: '120px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>Level</label>
                <select
                  value={filters.filterLevel}
                  onChange={(e) => handleFilterChange('filterLevel', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    fontSize: '0.875rem',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '0.75rem',
                    background: 'rgba(42, 48, 70, 0.6)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="">전체</option>
                  <option value="INFO">INFO</option>
                  <option value="WARN">WARN</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </div>

              {/* 검색 */}
              <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>검색</label>
                <input
                  type="text"
                  placeholder="메시지, 노드, URL, 사용자ID, IP"
                  value={filters.filterText}
                  onChange={(e) => handleFilterChange('filterText', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    fontSize: '0.875rem',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '0.75rem',
                    background: 'rgba(42, 48, 70, 0.6)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              {/* 조회 버튼 */}
              <div>
                <button
                  onClick={applyFilters}
                  disabled={isLoading || !isDateTimeRangeValid()}
                  style={{
                    padding: '0.625rem 2rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#fff',
                    background: (isLoading || !isDateTimeRangeValid()) ? 'rgba(99, 102, 241, 0.5)' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: (isLoading || !isDateTimeRangeValid()) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && isDateTimeRangeValid()) e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && isDateTimeRangeValid()) e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {isLoading ? (
                    <>
                      <div style={{
                        width: '1rem',
                        height: '1rem',
                        border: '2px solid #fff',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: '0.5rem'
                      }} />
                      조회 중...
                    </>
                  ) : (
                    '조회'
                  )}
                </button>
              </div>
            </div>

            {/* 실시간 표시 체크박스 */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  style={{
                    width: '1rem',
                    height: '1rem',
                    accentColor: '#6366f1',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)' }}>실시간 표시</span>
              </label>
            </div>

            {!isDateTimeRangeValid() && (
              <div style={{ marginBottom: '0.75rem', fontSize: '0.875rem', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                <AlertTriangle size={16} style={{ marginRight: '0.25rem' }} />
                시작 일시는 종료 일시보다 이전이어야 합니다.
              </div>
            )}

            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              조회 기간은 최대 30일까지 선택 가능합니다.
            </div>
          </div>

          {/* 상태 표시 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              총 {filteredLogs.length}건의 로그 데이터가 조회되었습니다.
            </span>
            {autoScroll && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <div style={{ width: '0.75rem', height: '0.75rem' }}>
                  <div style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    border: '2px solid #10b981',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>실시간 모니터링 중</span>
              </div>
            )}
          </div>

          {/* 로그 테이블 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.6) 0%, rgba(54, 61, 90, 0.6) 100%)',
            borderRadius: '1.25rem',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            overflow: 'hidden'
          }}>
            <div style={{ height: '60vh', overflowY: 'auto' }}>
              {filteredLogs.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                    <tr style={{ background: 'rgba(30, 33, 57, 0.95)' }}>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)', whiteSpace: 'nowrap' }}>세션일시</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)', whiteSpace: 'nowrap' }}>서비스</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)', whiteSpace: 'nowrap' }}>Level</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)', whiteSpace: 'nowrap' }}>메시지</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)', whiteSpace: 'nowrap' }}>노드</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)', whiteSpace: 'nowrap' }}>사용자ID</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)', whiteSpace: 'nowrap' }}>클라이언트 IP</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)', whiteSpace: 'nowrap' }}>서비스 URL</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)', whiteSpace: 'nowrap' }}>처리시간(ms)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map(log => (
                      <tr 
                        key={log.id}
                        style={{
                          transition: 'all 0.2s',
                          borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>{log.service}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.625rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            ...getLevelBadgeStyle(log.level)
                          }}>
                            {log.level}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>{log.message}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>{log.node}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>{log.userId}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>{log.clientIp}</td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                          <a 
                            href={log.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                              color: '#6366f1',
                              textDecoration: 'underline',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#6366f1'}
                          >
                            {log.url}
                          </a>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#6366f1', whiteSpace: 'nowrap' }}>
                          {log.delay}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
                  <Info size={48} style={{ color: 'rgba(99, 102, 241, 0.5)', marginBottom: '1rem' }} />
                  <h5 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>데이터가 없습니다</h5>
                  <p style={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', lineHeight: '1.6' }}>
                    조회 조건을 설정하고 "조회" 버튼을 클릭하여<br />
                    데이터를 불러오세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </MonitoringLayout>
  );
}

export default StatTotalMonitor;