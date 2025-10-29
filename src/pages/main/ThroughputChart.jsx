import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

function ThroughputChart({ chartRef }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const chartConfig = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          display: true, 
          position: 'top', 
          labels: { color: 'rgba(255, 255, 255, 0.8)' } 
        }
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

    const chart = new Chart(canvasRef.current.getContext('2d'), {
      type: 'line',
      data: {
        labels: Array.from({ length: 30 }, (_, i) => i - 29),
        datasets: [
          {
            label: '요청(초)',
            data: Array.from({ length: 30 }, () => rand(50, 500)),
            borderWidth: 2,
            tension: 0.3,
            borderColor: 'rgba(99,102,241,0.9)',
            backgroundColor: 'rgba(99,102,241,0.08)',
            fill: true,
            pointRadius: 0
          },
          {
            label: 'p90 ms',
            data: Array.from({ length: 30 }, () => rand(30, 1200)),
            borderWidth: 2,
            tension: 0.3,
            borderColor: 'rgba(16,185,129,0.9)',
            backgroundColor: 'rgba(16,185,129,0.06)',
            fill: true,
            pointRadius: 0
          }
        ]
      },
      options: chartConfig
    });

    // chartRef에 차트 인스턴스 저장
    if (chartRef) {
      chartRef.current = chart;
    }

    return () => {
      chart.destroy();
    };
  }, [chartRef]);

  return (
    <div className="apm-card" style={{ marginBottom: '1rem' }} onClick={() => navigate('/statapis')}>
      <div className="apm-card-title">
        <span>모델 처리량 & 지연</span>
      </div>
      <div style={{ height: '250px' }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default ThroughputChart;