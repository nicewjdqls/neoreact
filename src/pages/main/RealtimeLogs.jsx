import React from 'react';
import { useNavigate } from 'react-router-dom';

function RealtimeLogs({ logs, logLevel, setLogLevel }) {
  const navigate = useNavigate();

  const filteredLogs = logs.filter(log => 
    logLevel === 'ALL' || log.level === logLevel
  );

  return (
    <div className="apm-card-bright" onClick={() => navigate('/stattotalmonitor')}>
      <div className="apm-card-title">
        <div>
          <span>📋 실시간 로그</span>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '400', marginTop: '0.25rem' }}>
            최근 100개
          </p>
        </div>
        <select 
          value={logLevel}
          onChange={(e) => {
            e.stopPropagation();
            setLogLevel(e.target.value);
          }}
          style={{
            padding: '0.4rem 0.8rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <option>ALL</option>
          <option>ERROR</option>
          <option>WARN</option>
          <option>INFO</option>
        </select>
      </div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {filteredLogs.map(log => (
          <div key={log.id} style={{
            padding: '0.75rem',
            marginBottom: '0.5rem',
            borderRadius: '4px',
            background: log.level === 'ERROR' ? 'rgba(239, 68, 68, 0.15)' : 
                       log.level === 'WARN' ? 'rgba(245, 158, 11, 0.15)' : 
                       'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${
              log.level === 'ERROR' ? 'rgba(239, 68, 68, 0.4)' : 
              log.level === 'WARN' ? 'rgba(245, 158, 11, 0.4)' : 
              'rgba(255, 255, 255, 0.15)'
            }`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <div>
                <span style={{ 
                  fontWeight: '700',
                  marginRight: '0.5rem',
                  color: log.level === 'ERROR' ? '#ef4444' : 
                         log.level === 'WARN' ? '#f59e0b' : '#22c55e'
                }}>
                  {log.level}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  {log.time}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                {log.node}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem' }}>{log.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RealtimeLogs;