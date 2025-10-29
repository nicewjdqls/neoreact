import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, RefreshCw, Calendar, Clock } from 'lucide-react';
import MonitoringLayout from '../../components/MonitoringLayout';

// 커스텀 DateTime 피커 컴포넌트
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
    <div className="relative">
      <div
        ref={inputRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-3 py-2 text-sm border rounded-lg cursor-pointer transition-all duration-200 ${className}`}
        style={{
          background: 'rgba(42, 48, 70, 0.6)',
          borderColor: 'rgba(139, 92, 246, 0.3)',
          color: 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <Calendar size={16} className="mr-2" style={{ color: 'rgba(139, 92, 246, 0.8)' }} />
        <span style={{ color: displayValue ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)' }}>
          {displayValue || placeholder}
        </span>
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef} 
          className="absolute top-full left-0 mt-1 border rounded-xl shadow-lg z-50"
          style={{ 
            minWidth: '650px',
            background: 'rgba(42, 48, 70, 0.98)',
            borderColor: 'rgba(139, 92, 246, 0.3)'
          }}
        >
          <div className="flex">
            <div className="p-4 border-r" style={{ width: '350px', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
              <div className="mb-3">
                <h4 className="text-sm font-medium flex items-center" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  <Calendar size={16} className="mr-1" />
                  날짜 선택
                </h4>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setTempDateTime(prev => ({ 
                    ...prev, 
                    month: prev.month - 1 < 0 ? 11 : prev.month - 1, 
                    year: prev.month - 1 < 0 ? prev.year - 1 : prev.year 
                  }))}
                  className="p-2 rounded flex items-center justify-center transition-colors"
                  style={{ 
                    width: '32px', 
                    height: '32px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    background: 'rgba(139, 92, 246, 0.1)'
                  }}
                >
                  &#8249;
                </button>
                <div className="flex space-x-2">
                  <select
                    value={tempDateTime.year}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    className="text-sm border-none font-medium"
                    style={{ 
                      background: 'transparent',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                      <option key={year} value={year} style={{ background: '#2a3046' }}>{year}년</option>
                    ))}
                  </select>
                  <select
                    value={tempDateTime.month}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                    className="text-sm border-none font-medium"
                    style={{ 
                      background: 'transparent',
                      color: 'rgba(255, 255, 255, 0.9)'
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
                  className="p-2 rounded flex items-center justify-center transition-colors"
                  style={{ 
                    width: '32px', 
                    height: '32px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    background: 'rgba(139, 92, 246, 0.1)'
                  }}
                >
                  &#8250;
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="h-8 flex items-center justify-center text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
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
                      className="h-8 w-full flex items-center justify-center text-sm rounded-lg transition-colors"
                      style={{
                        color: !isCurrentMonth 
                          ? 'rgba(255, 255, 255, 0.3)' 
                          : isSelected 
                          ? '#fff'
                          : isToday
                          ? 'rgba(139, 92, 246, 1)'
                          : 'rgba(255, 255, 255, 0.8)',
                        background: isSelected 
                          ? 'rgba(139, 92, 246, 0.8)' 
                          : isToday
                          ? 'rgba(139, 92, 246, 0.2)'
                          : 'transparent',
                        fontWeight: isSelected || isToday ? '600' : '400'
                      }}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4" style={{ width: '300px' }}>
              <div className="mb-3">
                <h4 className="text-sm font-medium flex items-center" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  <Clock size={16} className="mr-1" />
                  시간 선택
                </h4>
              </div>

              <div className="text-center mb-4 p-3 rounded-lg" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                <div className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  {formatDate(new Date(tempDateTime.year, tempDateTime.month, tempDateTime.day))}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="text-center">
                  <label className="block text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>시</label>
                  <select
                    value={tempDateTime.hour}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, hour: parseInt(e.target.value) }))}
                    className="w-16 text-center text-lg font-medium border rounded-lg py-2"
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i} style={{ background: '#2a3046' }}>{String(i).padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>

                <div className="text-2xl font-bold mt-6" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>:</div>

                <div className="text-center">
                  <label className="block text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>분</label>
                  <select
                    value={tempDateTime.minute}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, minute: parseInt(e.target.value) }))}
                    className="w-16 text-center text-lg font-medium border rounded-lg py-2"
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i} style={{ background: '#2a3046' }}>{String(i).padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full px-4 py-2 text-sm rounded-lg transition-colors font-medium"
                  style={{
                    color: '#fff',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(99, 102, 241, 0.9))'
                  }}
                >
                  확인
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full px-4 py-2 text-sm border rounded-lg transition-colors"
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    background: 'transparent'
                  }}
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

// 알림 모달 컴포넌트
function AlertModal({ show, onClose, config }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
      <div className="rounded-2xl shadow-lg p-6 max-w-md w-full mx-4" style={{ background: 'rgba(42, 48, 70, 0.98)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <div className="text-center">
          <div className="mb-4">
            {config.icon}
          </div>
          <h3 className="text-lg font-bold mb-3" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{config.title}</h3>
          <p className="mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{config.message}</p>
          
          <div className="flex gap-3 justify-center">
            {config.showRetry && (
              <button
                onClick={config.onRetry}
                className="px-4 py-2 text-sm font-medium border rounded-lg transition-colors flex items-center"
                style={{
                  color: 'rgba(139, 92, 246, 1)',
                  borderColor: 'rgba(139, 92, 246, 0.5)',
                  background: 'rgba(139, 92, 246, 0.1)'
                }}
              >
                <RefreshCw size={16} className="mr-2" />
                재시도
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{
                color: '#fff',
                background: config.variant === 'success' 
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : config.variant === 'warning'
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : config.variant === 'info'
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(99, 102, 241, 0.9))'
                  : 'linear-gradient(135deg, #ef4444, #dc2626)'
              }}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatSession() {
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
    level: '',
    searchText: ''
  });

  const services = ['일반', '데이터수집', '학습모델', 'AI Chat', 'APIs', '설정', '모니터링'];
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
    'Model update applied',
    'Session timeout',
    'Data pre-processing',
    'GPU memory warning',
    'User disconnected'
  ];

  const showNotification = (title, message, variant = 'danger', showRetry = false, onRetry = null) => {
    const iconMap = {
      success: <CheckCircle size={48} className="mb-3" style={{ color: '#10b981' }} />,
      danger: <XCircle size={48} className="mb-3" style={{ color: '#ef4444' }} />,
      warning: <AlertTriangle size={48} className="mb-3" style={{ color: '#f59e0b' }} />,
      info: <Info size={48} className="mb-3" style={{ color: '#8b5cf6' }} />
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
      if (daysDiff > 7) {
        showNotification(
          '조회 기간 제한',
          '조회 기간은 7일을 초과할 수 없습니다. 기간을 줄여주세요.',
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
      sessionId: 'sess-' + Math.floor(Math.random() * 100),
      service: services[Math.floor(Math.random() * services.length)],
      level: ['INFO', 'WARN', 'ERROR'][Math.floor(Math.random() * 3)],
      message: messages[Math.floor(Math.random() * messages.length)],
      url: urls[Math.floor(Math.random() * urls.length)],
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

      if (filters.level) {
        filtered = filtered.filter(log => log.level === filters.level);
      }

      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        filtered = filtered.filter(log => 
          log.message.toLowerCase().includes(searchLower) ||
          log.sessionId.toLowerCase().includes(searchLower)
        );
      }

      filtered.sort((a, b) => b.rawTime - a.rawTime);

      setFilteredLogs(filtered);
      
      setTimeout(() => {
        showNotification(
          '조회 완료',
          `총 ${filtered.length}건의 세션 로그가 조회되었습니다.`,
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

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'INFO': 
        return { background: 'rgba(59, 130, 246, 0.2)', color: 'rgba(147, 197, 253, 1)' };
      case 'WARN': 
        return { background: 'rgba(251, 191, 36, 0.2)', color: 'rgba(252, 211, 77, 1)' };
      case 'ERROR': 
        return { background: 'rgba(239, 68, 68, 0.2)', color: 'rgba(252, 165, 165, 1)' };
      default: 
        return { background: 'rgba(156, 163, 175, 0.2)', color: 'rgba(209, 213, 219, 1)' };
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

      <div style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            background: 'rgba(42, 48, 70, 0.6)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '0'
            }}>
              활성 세션 상세조회
            </h2>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(42, 48, 70, 0.6)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>시작일시</label>
              <CustomDateTimePicker
                value={filters.startDate}
                onChange={(value) => handleFilterChange('startDate', value)}
                placeholder="시작일시 선택"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>종료일시</label>
              <CustomDateTimePicker
                value={filters.endDate}
                onChange={(value) => handleFilterChange('endDate', value)}
                placeholder="종료일시 선택"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>서비스 구분</label>
              <select
                value={filters.serviceType}
                onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200"
                style={{
                  background: 'rgba(42, 48, 70, 0.6)',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <option value="">전체</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Level</label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200"
                style={{
                  background: 'rgba(42, 48, 70, 0.6)',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <option value="">전체</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <button
                onClick={applyFilters}
                disabled={isLoading}
                className="w-full px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                style={{
                  color: '#fff',
                  background: isLoading 
                    ? 'rgba(139, 92, 246, 0.5)' 
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(99, 102, 241, 0.9))',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    조회 중...
                  </div>
                ) : (
                  '조회'
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-end mb-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>메시지 검색</label>
              <input
                type="text"
                placeholder="메시지, 세션ID로 검색..."
                value={filters.searchText}
                onChange={(e) => handleFilterChange('searchText', e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200"
                style={{
                  background: 'rgba(42, 48, 70, 0.6)',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#8b5cf6' }}
                />
                <span className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>실시간 표시</span>
              </label>
            </div>
          </div>

          {!isDateTimeRangeValid() && (
            <div className="mt-3">
              <div className="text-sm flex items-center" style={{ color: '#ef4444' }}>
                <AlertTriangle size={14} className="mr-1" />
                시작 일시는 종료 일시보다 이전이어야 합니다.
              </div>
            </div>
          )}

          <div className="mt-3 text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            조회 기간은 최대 7일까지 선택 가능합니다.
          </div>
        </div>

        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            총 {filteredLogs.length}건의 세션 로그가 조회되었습니다.
          </span>
          {autoScroll && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border" style={{
              background: 'rgba(34, 197, 94, 0.1)',
              borderColor: 'rgba(34, 197, 94, 0.3)',
              color: 'rgba(134, 239, 172, 1)'
            }}>
              <div className="w-3 h-3">
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-t-transparent" style={{ borderColor: 'rgba(134, 239, 172, 1)' }}></div>
              </div>
              <span className="text-sm font-medium">실시간 모니터링 중</span>
            </div>
          )}
        </div>

        <div style={{ 
          background: 'rgba(42, 48, 70, 0.6)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{ height: '70vh', overflowY: 'auto' }}>
            {filteredLogs.length > 0 ? (
              <table className="w-full">
                <thead className="sticky top-0 z-10" style={{ background: 'rgba(30, 33, 57, 0.95)' }}>
                  <tr>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-b" style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 0.2)'
                    }}>세션일시</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-b" style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 0.2)'
                    }}>세션ID</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-b" style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 0.2)'
                    }}>서비스 구분</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-b" style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 0.2)'
                    }}>Level</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-b" style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 0.2)'
                    }}>메시지</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-b" style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 0.2)'
                    }}>서비스 URL</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => {
                    const levelStyle = getLevelBadgeClass(log.level);
                    return (
                      <tr key={log.id} className="border-b transition-colors" style={{ 
                        borderColor: 'rgba(139, 92, 246, 0.1)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="px-4 py-2 text-center text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{log.timestamp}</td>
                        <td className="px-4 py-2 text-center text-sm font-mono" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{log.sessionId}</td>
                        <td className="px-4 py-2 text-center text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{log.service}</td>
                        <td className="px-4 py-2 text-center">
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full" style={levelStyle}>
                            {log.level}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{log.message}</td>
                        <td className="px-4 py-2 text-center">
                          <a 
                            href={log.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm transition-colors"
                            style={{ color: 'rgba(139, 92, 246, 0.9)' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(167, 139, 250, 1)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(139, 92, 246, 0.9)'}
                          >
                            {log.url}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(139, 92, 246, 0.6)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>데이터가 없습니다</h3>
                <p className="text-center max-w-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  조회 조건을 설정하고 "조회" 버튼을 클릭하여<br/>
                  데이터를 불러오세요.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MonitoringLayout>
  );
}

export default StatSession;