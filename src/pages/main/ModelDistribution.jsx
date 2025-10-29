import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

function ModelDistribution({ chartRef }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['GPT-4', 'GPT-5', 'Llama', 'Claude', 'Gemini', 'PaLM'],
        datasets: [{ 
          data: [35, 22, 18, 12, 8, 5],
          backgroundColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(251, 146, 60, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(139, 92, 246, 1)'
          ],
          borderWidth: 4,
          borderColor: 'rgba(42, 48, 70, 1)',
          spacing: 3,
          offset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: { 
          legend: { 
            display: false
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(30, 33, 52, 0.95)',
            padding: 12,
            titleColor: '#fff',
            bodyColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(99, 102, 241, 0.5)',
            borderWidth: 2,
            displayColors: true,
            boxPadding: 6,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const requests = Math.floor((context.parsed / 100) * 10000);
                return [
                  context.label + ': ' + context.parsed + '%',
                  '요청 수: ' + requests.toLocaleString() + '건'
                ];
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: 'easeInOutQuart'
        },
        transitions: {
          active: {
            animation: {
              duration: 400
            }
          }
        }
      },
      plugins: [{
        id: 'doughnutLabels',
        afterDraw: function(chart) {
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;
          const centerX = (chartArea.left + chartArea.right) / 2;
          const centerY = (chartArea.top + chartArea.bottom) / 2;
          
          const meta = chart.getDatasetMeta(0);
          const data = chart.data.datasets[0].data;
          const labels = chart.data.labels;
          
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          meta.data.forEach((element, index) => {
            const midAngle = element.startAngle + (element.endAngle - element.startAngle) / 2;
            
            const radius = (element.outerRadius + element.innerRadius) / 2;
            const x = centerX + Math.cos(midAngle) * radius;
            const y = centerY + Math.sin(midAngle) * radius;
            
            const percentage = data[index];
            
            ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 3;
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(labels[index], x, y - 12);
            
            ctx.font = 'bold 24px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(percentage + '%', x, y + 8);
            
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
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
    <div className="apm-card" style={{ marginBottom: '1rem' }} onClick={() => navigate('/statsllmmodel')}>
      <div className="apm-card-title">
        <span>모델별 요청 분포</span>
      </div>
      <div className="donut-3d-container" style={{ 
        position: 'relative', 
        height: '320px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{ position: 'relative', width: '280px', height: '280px' }}>
          <canvas ref={canvasRef} className="donut-3d-canvas" style={{ 
            width: '100%', 
            height: '100%'
          }}></canvas>
        </div>
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '0.75rem',
        marginTop: '1rem'
      }}>
        {[
          { name: 'GPT-4', color: 'rgba(239, 68, 68, 1)' },
          { name: 'GPT-5', color: 'rgba(251, 146, 60, 1)' },
          { name: 'Llama', color: 'rgba(245, 158, 11, 1)' },
          { name: 'Claude', color: 'rgba(16, 185, 129, 1)' },
          { name: 'Gemini', color: 'rgba(59, 130, 246, 1)' },
          { name: 'PaLM', color: 'rgba(139, 92, 246, 1)' }
        ].map((model) => (
          <div key={model.name} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${model.color.replace('1)', '0.3)')}`
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: model.color,
              flexShrink: 0,
              boxShadow: `0 0 8px ${model.color.replace('1)', '0.6)')}`
            }}></div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              {model.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModelDistribution;