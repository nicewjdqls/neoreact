import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

function TransactionHeatmap({ chartRef }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // 기존 차트 인스턴스 정리
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const heatData = [];
    for (let x = 0; x < 100; x++) {
      for (let y = 0; y < 20; y++) {
        if (Math.random() > 0.85) {
          heatData.push({ x, y });
        }
      }
    }

    const chart = new Chart(canvasRef.current.getContext('2d'), {
      type: 'scatter',
      data: {
        datasets: [{
          data: heatData,
          backgroundColor: heatData.map(() => {
            const rand = Math.random();
            if (rand > 0.95) return 'rgba(239, 68, 68, 0.9)';
            if (rand > 0.8) return 'rgba(251, 146, 60, 0.9)';
            if (rand > 0.5) return 'rgba(234, 179, 8, 0.9)';
            return 'rgba(34, 197, 94, 0.9)';
          }),
          pointRadius: 2,
          pointHoverRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // 애니메이션 비활성화로 성능 개선
        plugins: { 
          legend: { display: false }, 
          tooltip: { enabled: false } 
        },
        scales: {
          x: { 
            min: 0, 
            max: 100,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { 
              color: 'rgba(255, 255, 255, 0.5)', 
              font: { size: 9 }
            }
          },
          y: { 
            min: 0, 
            max: 12,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { 
              color: 'rgba(255, 255, 255, 0.5)' 
            }
          }
        },
        // 레이아웃 패딩 추가로 잘림 방지
        layout: {
          padding: {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
          }
        }
      }
    });

    chartInstanceRef.current = chart;

    // chartRef에 차트 인스턴스 저장
    if (chartRef) {
      chartRef.current = chart;
    }

    // cleanup 함수
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [chartRef]);

  return (
    <div 
      className="apm-card" 
      style={{ 
        marginBottom: '1rem',
        // 명확한 크기 지정으로 레이아웃 보호
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div 
        className="apm-card-title"
        style={{ flexShrink: 0 }}
      >
        Transaction Heatmap (T-Map)
      </div>
      <div 
        ref={containerRef}
        style={{ 
          height: '220px',
          width: '100%',
          position: 'relative',
          flexGrow: 1
        }}
      >
        <canvas 
          ref={canvasRef}
          style={{
            // canvas가 부모를 넘어가지 않도록
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      </div>
    </div>
  );
}

export default TransactionHeatmap;