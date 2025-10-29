import React from 'react';
import { useNavigate } from 'react-router-dom';

function AlarmEvents({ alarmEvents }) {
  const navigate = useNavigate();

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'INFO': return 'bg-blue-100 text-blue-800';
      case 'WARN': return 'bg-yellow-100 text-yellow-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'DELAY': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 알람 요약 상태 계산
  const alarmSummary = {
    total: alarmEvents.length,
    error: alarmEvents.filter(e => e.level === 'ERROR').length,
    warn: alarmEvents.filter(e => e.level === 'WARN').length,
    info: alarmEvents.filter(e => e.level === 'INFO').length,
    delay: alarmEvents.filter(e => e.level === 'DELAY').length
  };

  return (
    <div className="apm-card-bright" style={{ marginBottom: '1rem' }} onClick={() => navigate('/statalarm')}>
      <div className="apm-card-title">
        <div>
          <span>🔔 알림 & 이벤트</span>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '400', marginTop: '0.25rem' }}>
            실시간 알림 모니터링
          </p>
        </div>
      </div>
      
      {/* 알람 요약 */}
      <div style={{ 
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '6px',
        marginBottom: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '0.75rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>전체</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>{alarmSummary.total}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>오류</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ef4444' }}>{alarmSummary.error}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>경고</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#eab308' }}>{alarmSummary.warn}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>지연</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#06b6d4' }}>{alarmSummary.delay}</div>
          </div>
        </div>
      </div>

      {/* 최근 알람 이벤트 목록 */}
      <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
        {alarmEvents.length > 0 ? (
          alarmEvents.slice(0, 10).map((event, index) => (
            <div 
              key={event.id} 
              style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                borderRadius: '6px',
                background: index === 0 ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${
                  event.level === 'ERROR' ? 'rgba(239, 68, 68, 0.4)' : 
                  event.level === 'WARN' ? 'rgba(234, 179, 8, 0.4)' : 
                  event.level === 'DELAY' ? 'rgba(6, 182, 212, 0.4)' :
                  'rgba(59, 130, 246, 0.4)'
                }`,
                transition: 'all 0.3s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <span className={`alarm-badge ${getLevelBadgeClass(event.level)}`}>
                  {event.level}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  {event.timestamp.split(' ')[1]}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.4rem', fontWeight: '500' }}>
                {event.message}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                <span>📍 {event.node}</span>
                <span>🔹 {event.service}</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.85rem'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
            <div>현재 이상 없음</div>
          </div>
        )}
      </div>
      
      {alarmEvents.length > 0 && (
        <div style={{ 
          marginTop: '1rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'rgba(99, 102, 241, 0.9)',
            fontWeight: '600'
          }}>
            클릭하여 전체 이벤트 보기 →
          </div>
        </div>
      )}
    </div>
  );
}

export default AlarmEvents;