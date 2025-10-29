import React from 'react';

function DataFlowMonitoring({ nodes }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return '#22c55e';
      case 'warning': return '#eab308';
      case 'error': return '#ef4444';
      default: return '#22c55e';
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.95) 0%, rgba(54, 61, 90, 0.95) 100%)', 
      padding: '2rem',
      borderRadius: '12px',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '300px',
      marginBottom: '1.5rem',
      border: '1px solid rgba(99, 102, 241, 0.4)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}></div>

      <div style={{ 
        textAlign: 'center', 
        marginBottom: '3rem',
        position: 'relative',
        zIndex: 2
      }}>
        <h2 style={{ 
          color: '#fff', 
          fontSize: '1.5rem', 
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>
          실시간 시스템 흐름 모니터링
        </h2>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.6)', 
          fontSize: '0.9rem' 
        }}>
          System Data Flow Monitoring
        </p>
      </div>

      <div style={{ 
        position: 'relative', 
        height: '160px',
        margin: '0 auto',
        maxWidth: '1000px'
      }}>
        <svg style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          pointerEvents: 'none'
        }}>
          {nodes.slice(0, -1).map((node, i) => {
            const nextNode = nodes[i + 1];
            return (
              <line
                key={`line-${node.id}`}
                x1={node.x + 40}
                y1="80"
                x2={nextNode.x - 40}
                y2="80"
                stroke="rgba(99, 102, 241, 0.3)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            );
          })}
        </svg>

        {nodes.map(node => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${node.x - 40}px`,
              top: '20px',
              width: '80px',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${getStatusColor(node.status)}dd 0%, ${getStatusColor(node.status)} 100%)`,
              border: `3px solid ${getStatusColor(node.status)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              boxShadow: `0 0 30px ${getStatusColor(node.status)}60, 0 4px 15px rgba(0,0,0,0.3)`,
              position: 'relative',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = `0 0 40px ${getStatusColor(node.status)}80, 0 6px 20px rgba(0,0,0,0.4)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = `0 0 30px ${getStatusColor(node.status)}60, 0 4px 15px rgba(0,0,0,0.3)`;
            }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `2px solid ${getStatusColor(node.status)}`,
                animation: 'pulse 2s ease-out infinite',
                opacity: 0
              }}></div>
              
              <div style={{ 
                fontSize: '1.4rem', 
                fontWeight: '700', 
                color: '#fff',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {Math.round(node.value)}
              </div>
              <div style={{ 
                fontSize: '0.65rem', 
                color: '#fff',
                opacity: 0.9,
                fontWeight: '600'
              }}>
                {node.status === 'good' ? '정상' : node.status === 'warning' ? '경고' : '위험'}
              </div>
            </div>

            <div style={{
              marginTop: '0.75rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
              {node.name}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        marginTop: '2.5rem',
        position: 'relative',
        zIndex: 2
      }}>
        {[
          { status: 'good', label: '정상 (0-50)', color: '#22c55e' },
          { status: 'warning', label: '경고 (50-80)', color: '#eab308' },
          { status: 'error', label: '위험 (80-100)', color: '#ef4444' }
        ].map(item => (
          <div key={item.status} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: item.color,
              boxShadow: `0 0 10px ${item.color}80`
            }}></div>
            <span style={{
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '500'
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DataFlowMonitoring;