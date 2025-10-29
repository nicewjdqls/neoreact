import React from 'react';
import { useNavigate } from 'react-router-dom';

function AiNodeStatus({ aiNodes }) {
  const navigate = useNavigate();

  return (
    <div className="apm-card-bright" style={{ marginBottom: '1rem' }} onClick={() => navigate('/statnode')}>
      <div className="apm-card-title">🔧 AI 노드 상태</div>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {aiNodes.map(node => (
          <div 
            key={node.id} 
            style={{
              padding: '0.75rem',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${node.status === 'running' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                AI-node-{node.id}
                <span style={{ 
                  fontSize: '0.7rem', 
                  marginLeft: '0.5rem',
                  color: node.status === 'running' ? '#22c55e' : '#ef4444'
                }}>
                  {node.status === 'running' ? '●' : '⚠'}
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                CPU {node.cpu}% · GPU {node.gpu}% · MEM {node.mem}GB
              </div>
            </div>
            <button 
              style={{
                padding: '0.4rem 0.8rem',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              SSH
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AiNodeStatus;