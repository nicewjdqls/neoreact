import React from 'react';
import { useNavigate } from 'react-router-dom';

function KpiCards({ kpis }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
      <div className="kpi-card" onClick={() => navigate('/statsession')}>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.3rem' }}>활성 세션</div>
        <div style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '0.3rem' }}>{kpis.sessions}</div>
        <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '0.4rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.4rem' }}>동시 사용자</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.6)' }}>에러율</div>
          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ef4444' }}>{kpis.sessionError}%</div>
        </div>
      </div>
      
      <div className="kpi-card" onClick={() => navigate('/statresponse')}>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.3rem' }}>평균 응답시간 (p90)</div>
        <div style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '0.3rem' }}>{kpis.latency} ms</div>
        <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.5)' }}>지연 시간 추적</div>
      </div>
      
      <div className="kpi-card" onClick={() => navigate('/stattoken')}>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.3rem' }}>토큰 사용량 (오늘)</div>
        <div style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '0.3rem' }}>{kpis.tokens.toLocaleString()}</div>
        <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.5)' }}>총 토큰</div>
      </div>
      
      <div className="kpi-card" onClick={() => navigate('/statsatisfaction')}>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.3rem' }}>만족도 평가(오늘)</div>
        <div style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '0.3rem', color: '#22c55e' }}>{kpis.satisfaction}%</div>
        <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.5)' }}>평가 합산</div>
      </div>
      
      <div className="kpi-card" onClick={() => navigate('/statapis')}>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.3rem' }}>APIs 사용현황(오늘)</div>
        <div style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '0.3rem' }}>{kpis.apiSessions.toLocaleString()}</div>
        <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '0.4rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.4rem' }}>API호출</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.6)' }}>에러율</div>
          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ef4444' }}>{kpis.apiError}%</div>
        </div>
      </div>
    </div>
  );
}

export default KpiCards;