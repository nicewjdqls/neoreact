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
              
              {/* 헤더 */}
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

              {/* 요일 헤더 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
                {weekDays.map(day => (
                  <div key={day} style={{ height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)' }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* 캘린더 그리드 */}
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

              {/* 선택된 날짜 표시 */}
              <div style={{ textAlign: 'center', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.75rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff' }}>
                  {formatDate(new Date(tempDateTime.year, tempDateTime.month, tempDateTime.day))}
                </div>
              </div>

              {/* 시간 분 선택 */}
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

              {/* 확인/취소 버튼 */}
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

// Modal 컴포넌트
function AlertModal({ show, onHide, title, message, variant, icon, showRetry, onRetry }) {
  if (!show) return null;

  const getButtonStyle = () => {
    switch (variant) {
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
    }} onClick={onHide}>
      <div 
        style={{
          width: '400px',
          background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.98) 0%, rgba(54, 61, 90, 0.98) 100%)',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          {icon}
          <h5 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#fff' }}>{title}</h5>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{message}</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {showRetry && (
              <button 
                onClick={onRetry}
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
              onClick={onHide}
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

function StatSLLMModel() {
  const [filters, setFilters] = useState({
    startDateTime: '',
    endDateTime: '',
    interval: 'minute'
  });
  const [aggregatedData, setAggregatedData] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null,
    showRetry: false
  });

  const models = ['모델A', '모델B', '모델C', '모델D'];

  const showNotification = (title, message, variant = 'danger', showRetry = false) => {
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
      showRetry
    });
    setShowAlertModal(true);
  };

  const formatDateTime = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const getTimeRange = (date, interval) => {
    const d = new Date(date);
    if (interval === 'minute') {
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0);
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 59);
      return [start, end];
    } else {
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 0, 0);
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 59, 59);
      return [start, end];
    }
  };

  const aggregateData = (interval, start, end) => {
    const map = {};
    requests.forEach(r => {
      if (start && r.time < start) return;
      if (end && r.time > end) return;
      const [rangeStart, rangeEnd] = getTimeRange(r.time, interval);
      const key = formatDateTime(rangeStart) + '~' + formatDateTime(rangeEnd);
      if (!map[key]) map[key] = {};
      if (!map[key][r.model]) map[key][r.model] = [];
      map[key][r.model].push(r.responseTime);
    });

    const times = Object.keys(map).sort();
    const data = [];
    times.forEach(t => {
      models.forEach(m => {
        const arr = map[t][m] || [];
        const [startStr, endStr] = t.split('~');
        data.push({
          id: `${t}-${m}`,
          startTime: startStr,
          endTime: endStr,
          model: m,
          count: arr.length,
          avg: arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : 0
        });
      });
    });
    return data;
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateFilters = () => {
    if (filters.startDateTime && filters.endDateTime) {
      const startDateTime = new Date(filters.startDateTime);
      const endDateTime = new Date(filters.endDateTime);
      
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
    return Math.random() < 0.1;
  };

  const handleSearch = async () => {
    if (!validateFilters()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (simulateServerError()) {
            reject(new Error('서버 연결 오류'));
          } else {
            resolve();
          }
        }, 1000 + Math.random() * 2000);
      });

      const startDateTime = filters.startDateTime ? new Date(filters.startDateTime) : null;
      const endDateTime = filters.endDateTime ? new Date(filters.endDateTime) : null;
      const data = aggregateData(filters.interval, startDateTime, endDateTime);
      
      setAggregatedData(data);

      const hasData = data.some(item => item.count > 0);
      if (hasData) {
        showNotification(
          '조회 완료',
          `총 ${data.filter(item => item.count > 0).length}개의 데이터를 조회했습니다.`,
          'success'
        );
      }
    } catch (error) {
      showNotification(
        '조회 오류',
        '데이터 조회 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.',
        'danger',
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setShowAlertModal(false);
    setTimeout(() => {
      handleSearch();
    }, 500);
  };

  useEffect(() => {
    const initialRequests = [];
    for (let i = 0; i < 20; i++) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - Math.floor(Math.random() * 120));
      const model = models[Math.floor(Math.random() * models.length)];
      const responseTime = Math.floor(Math.random() * 500 + 50);
      initialRequests.push({ time: now, model, responseTime });
    }
    setRequests(initialRequests);
  }, []);

  useEffect(() => {
    if (requests.length > 0) {
      const startDateTime = filters.startDateTime ? new Date(filters.startDateTime) : null;
      const endDateTime = filters.endDateTime ? new Date(filters.endDateTime) : null;
      const data = aggregateData(filters.interval, startDateTime, endDateTime);
      setAggregatedData(data);
    }
  }, [requests]);

  const getGroupedData = () => {
    const grouped = [];
    let i = 0;
    
    while (i < aggregatedData.length) {
      const row = aggregatedData[i];
      let rowspan = 1;
      for (let j = i + 1; j < aggregatedData.length; j++) {
        if (aggregatedData[j].startTime === row.startTime && aggregatedData[j].endTime === row.endTime) {
          rowspan++;
        } else {
          break;
        }
      }
      
      const group = {
        startTime: row.startTime,
        endTime: row.endTime,
        rowspan: rowspan,
        models: aggregatedData.slice(i, i + rowspan)
      };
      grouped.push(group);
      i += rowspan;
    }
    
    return grouped;
  };

  const groupedData = getGroupedData();

  const isDateTimeRangeValid = () => {
    if (!filters.startDateTime || !filters.endDateTime) return true;
    const startDateTime = new Date(filters.startDateTime);
    const endDateTime = new Date(filters.endDateTime);
    return startDateTime <= endDateTime;
  };

  return (
    <MonitoringLayout>
      <AlertModal
        show={showAlertModal}
        onHide={() => setShowAlertModal(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        variant={alertConfig.variant}
        icon={alertConfig.icon}
        showRetry={alertConfig.showRetry}
        onRetry={handleRetry}
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', margin: 0 }}>모델별 요청 분포 상세조회</h2>
          </div>

          {/* 검색 조건 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.6) 0%, rgba(54, 61, 90, 0.6) 100%)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
              {/* 시작 일시 */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>시작 일시</label>
                <CustomDateTimePicker
                  value={filters.startDateTime}
                  onChange={(value) => handleFilterChange('startDateTime', value)}
                  placeholder="시작 일시 선택"
                />
              </div>

              {/* 종료 일시 */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>종료 일시</label>
                <CustomDateTimePicker
                  value={filters.endDateTime}
                  onChange={(value) => handleFilterChange('endDateTime', value)}
                  placeholder="종료 일시 선택"
                />
              </div>

              {/* 집계 단위 */}
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>집계 단위</label>
                <select
                  value={filters.interval}
                  onChange={(e) => handleFilterChange('interval', e.target.value)}
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
                  <option value="minute">분 단위</option>
                  <option value="hour">시간 단위</option>
                </select>
              </div>

              {/* 조회 버튼 */}
              <div>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  style={{
                    padding: '0.625rem 2rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#fff',
                    background: isLoading ? 'rgba(99, 102, 241, 0.5)' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) e.currentTarget.style.transform = 'translateY(0)';
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
            
            {!isDateTimeRangeValid() && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                <AlertTriangle size={16} style={{ marginRight: '0.25rem' }} />
                시작 일시는 종료 일시보다 이전이어야 합니다.
              </div>
            )}
            
            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              조회 기간은 최대 7일까지 선택 가능합니다.
            </div>
          </div>

          {/* 집계 테이블 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.6) 0%, rgba(54, 61, 90, 0.6) 100%)',
            borderRadius: '1.25rem',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            overflow: 'hidden'
          }}>
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {aggregatedData.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                    <tr style={{ background: 'rgba(30, 33, 57, 0.95)' }}>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>시작일시</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>종료일시</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>모델</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>요청수</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>평균 응답시간(ms)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedData.map((group, groupIndex) => 
                      group.models.map((model, modelIndex) => (
                        <tr 
                          key={model.id}
                          style={{
                            transition: 'all 0.2s',
                            borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {modelIndex === 0 && (
                            <>
                              <td 
                                style={{ 
                                  padding: '0.75rem', 
                                  textAlign: 'center', 
                                  fontSize: '0.875rem', 
                                  fontWeight: '600', 
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  borderRight: '1px solid rgba(99, 102, 241, 0.2)'
                                }} 
                                rowSpan={group.rowspan}
                              >
                                {model.startTime}
                              </td>
                              <td 
                                style={{ 
                                  padding: '0.75rem', 
                                  textAlign: 'center', 
                                  fontSize: '0.875rem', 
                                  fontWeight: '600', 
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  borderRight: '1px solid rgba(99, 102, 241, 0.2)'
                                }} 
                                rowSpan={group.rowspan}
                              >
                                {model.endTime}
                              </td>
                            </>
                          )}
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              background: 'rgba(99, 102, 241, 0.2)',
                              color: '#a5b4fc',
                              borderRadius: '9999px'
                            }}>
                              {model.model}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#6366f1' }}>
                            {model.count}
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                            {model.avg}
                          </td>
                        </tr>
                      ))
                    )}
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

export default StatSLLMModel;