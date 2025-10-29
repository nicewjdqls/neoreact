import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

function MetricsCharts({ chartRefs }) {
  const tpsRef = useRef(null);
  const activeUsersRef = useRef(null);
  const avgResponseRef = useRef(null);

  useEffect(() => {
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const chartConfig = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: { 
          grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
          ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 9 } }
        },
        y: { 
          grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
          ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 9 } }
        }
      }
    };

    const charts = {};

    // TPS Chart
    if (tpsRef.current) {
      charts.tps = new Chart(tpsRef.current.getContext('2d'), {
        type: 'line',
        data: {
          labels: Array.from({ length: 30 }, (_, i) => `13:${String(56 + i).padStart(2, '0')}`),
          datasets: [{
            data: Array.from({ length: 30 }, () => rand(80, 120)),
            borderColor: 'rgba(34, 197, 94, 1)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 0
          }]
        },
        options: chartConfig
      });
    }

    // Active Users Chart
    if (activeUsersRef.current) {
      charts.activeUsers = new Chart(activeUsersRef.current.getContext('2d'), {
        type: 'line',
        data: {
          labels: Array.from({ length: 30 }, (_, i) => `13:${String(56 + i).padStart(2, '0')}`),
          datasets: [{
            data: Array.from({ length: 30 }, () => rand(50, 90)),
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 0
          }]
        },
        options: chartConfig
      });
    }

    // Average Response Chart
    if (avgResponseRef.current) {
      charts.avgResponse = new Chart(avgResponseRef.current.getContext('2d'), {
        type: 'line',
        data: {
          labels: Array.from({ length: 30 }, (_, i) => `13:${String(56 + i).padStart(2, '0')}`),
          datasets: [{
            data: Array.from({ length: 30 }, () => rand(200, 400)),
            borderColor: 'rgba(34, 197, 94, 1)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 0
          }]
        },
        options: chartConfig
      });
    }

    // chartRefs에 차트 인스턴스 저장
    if (chartRefs) {
      chartRefs.current = {
        ...chartRefs.current,
        tps: charts.tps,
        activeUsers: charts.activeUsers,
        avgResponse: charts.avgResponse
      };
    }

    return () => {
      Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
    };
  }, [chartRefs]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
      <div className="apm-card">
        <div className="apm-card-title">TPS</div>
        <div style={{ height: '100px' }}>
          <canvas ref={tpsRef}></canvas>
        </div>
      </div>

      <div className="apm-card">
        <div className="apm-card-title">Active Users</div>
        <div style={{ height: '100px' }}>
          <canvas ref={activeUsersRef}></canvas>
        </div>
      </div>

      <div className="apm-card">
        <div className="apm-card-title">Avg. Response Time</div>
        <div style={{ height: '100px' }}>
          <canvas ref={avgResponseRef}></canvas>
        </div>
      </div>
    </div>
  );
}

export default MetricsCharts;