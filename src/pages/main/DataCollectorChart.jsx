import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

function DataCollectorChart({ chartRef }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const chart = new Chart(canvasRef.current.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Group A', 'Group B', 'Group C', 'Group D', 'Group E'],
        datasets: [{
          label: '수집 데이터 건수',
          data: [rand(150, 650), rand(250, 750), rand(200, 800), rand(100, 500), rand(150, 450)],
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(168, 85, 247, 0.8)'
          ],
          borderColor: [
            'rgba(99, 102, 241, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(168, 85, 247, 1)'
          ],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.7,
          categoryPercentage: 0.8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: false 
          },
          tooltip: {
            backgroundColor: 'rgba(30, 33, 52, 0.98)',
            padding: 16,
            titleColor: '#fff',
            bodyColor: 'rgba(255, 255, 255, 0.95)',
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            borderColor: 'rgba(99, 102, 241, 0.6)',
            borderWidth: 2,
            cornerRadius: 10,
            displayColors: true,
            boxPadding: 8,
            callbacks: {
              label: function(context) {
                return '수집량: ' + context.parsed.y.toLocaleString() + '건';
              }
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#fff',
            font: {
              size: 14,
              weight: 'bold'
            },
            formatter: function(value) {
              return value.toLocaleString();
            },
            offset: 4,
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowBlur: 4
          }
        },
        scales: {
          x: { 
            grid: { 
              display: false,
              drawBorder: false 
            },
            ticks: { 
              color: 'rgba(255, 255, 255, 0.8)', 
              font: { size: 12, weight: '600' },
              padding: 8
            }
          },
          y: { 
            beginAtZero: true,
            grace: '15%',
            grid: { 
              color: 'rgba(255, 255, 255, 0.08)', 
              drawBorder: false,
              lineWidth: 1
            },
            ticks: { 
              color: 'rgba(255, 255, 255, 0.6)', 
              font: { size: 11 },
              padding: 10,
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart',
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default') {
              delay = context.dataIndex * 150;
            }
            return delay;
          }
        }
      },
      plugins: [{
        id: 'customBarLabels',
        afterDatasetsDraw: function(chart) {
          const ctx = chart.ctx;
          const meta = chart.getDatasetMeta(0);
          
          const colors = [
            'rgba(99, 102, 241, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(168, 85, 247, 1)'
          ];
          
          ctx.save();
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;
          
          meta.data.forEach((bar, index) => {
            const data = chart.data.datasets[0].data[index];
            const x = bar.x;
            const y = bar.y;
            
            ctx.fillStyle = '#ffffff';
            ctx.fillText(data.toLocaleString(), x, y - 8);
          });
          
          ctx.restore();
        }
      }]
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
    <div className="apm-card" style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => navigate('/statdatacollector')}>
      <div className="apm-card-title">데이터 수집 현황</div>
      <div style={{ height: '250px' }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default DataCollectorChart;