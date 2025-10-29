import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

function GpuServerResources({ chartRefs }) {
  const navigate = useNavigate();
  const gpuSparkRef = useRef(null);
  const memSparkRef = useRef(null);
  const queueSparkRef = useRef(null);

  // 실시간 변하는 수치들
  const [gpuUsage, setGpuUsage] = useState(73);
  const [memoryUsed, setMemoryUsed] = useState(24.3);
  const [queueLength, setQueueLength] = useState(12);

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);

  useEffect(() => {
    const createSparkChart = (canvas, data, color = 'rgba(99, 102, 241, 0.8)') => {
      if (!canvas) return null;
      
      return new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
          labels: data.map((_, i) => i),
          datasets: [{
            data,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            borderColor: color,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
          animation: {
            duration: 750
          }
        }
      });
    };

    const charts = {};

    if (gpuSparkRef.current) {
      charts.gpuSpark = createSparkChart(
        gpuSparkRef.current,
        Array.from({ length: 20 }, () => rand(60, 90)),
        'rgba(239, 68, 68, 0.8)'
      );
    }
    
    if (memSparkRef.current) {
      charts.memSpark = createSparkChart(
        memSparkRef.current,
        Array.from({ length: 20 }, () => rand(20, 80)),
        'rgba(16, 185, 129, 0.8)'
      );
    }
    
    if (queueSparkRef.current) {
      charts.queueSpark = createSparkChart(
        queueSparkRef.current,
        Array.from({ length: 20 }, () => rand(0, 30)),
        'rgba(99, 102, 241, 0.8)'
      );
    }

    // chartRefs에 차트 인스턴스 저장
    if (chartRefs) {
      chartRefs.current = {
        ...chartRefs.current,
        gpuSpark: charts.gpuSpark,
        memSpark: charts.memSpark,
        queueSpark: charts.queueSpark
      };
    }

    // 실시간 데이터 업데이트 (1초마다)
    const updateInterval = setInterval(() => {
      // GPU 사용률 업데이트
      const newGpuUsage = rand(60, 90);
      setGpuUsage(newGpuUsage);
      
      if (charts.gpuSpark) {
        const currentData = charts.gpuSpark.data.datasets[0].data;
        currentData.shift();
        currentData.push(newGpuUsage);
        charts.gpuSpark.update('none');
      }

      // 메모리 사용 업데이트
      const newMemoryUsed = parseFloat(randFloat(20, 30));
      setMemoryUsed(newMemoryUsed);
      
      if (charts.memSpark) {
        const currentData = charts.memSpark.data.datasets[0].data;
        currentData.shift();
        currentData.push((newMemoryUsed / 32) * 100);
        charts.memSpark.update('none');
      }

      // 큐 대기 길이 업데이트
      const newQueueLength = rand(5, 25);
      setQueueLength(newQueueLength);
      
      if (charts.queueSpark) {
        const currentData = charts.queueSpark.data.datasets[0].data;
        currentData.shift();
        currentData.push(newQueueLength);
        charts.queueSpark.update('none');
      }
    }, 1000);

    return () => {
      clearInterval(updateInterval);
      Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
    };
  }, [chartRefs]);

  return (
    <div className="apm-card-bright" style={{ marginBottom: '1rem' }} onClick={() => navigate('/statserver')}>
      <div className="apm-card-title">🖥️ GPU / 서버 자원</div>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>GPU 사용률</div>
            <div style={{ 
              fontSize: '1.3rem', 
              fontWeight: '700',
              transition: 'all 0.3s ease'
            }}>
              {gpuUsage}%
            </div>
          </div>
          <div style={{ width: '120px', height: '40px' }}>
            <canvas ref={gpuSparkRef}></canvas>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>메모리 사용</div>
            <div style={{ 
              fontSize: '1.3rem', 
              fontWeight: '700',
              transition: 'all 0.3s ease'
            }}>
              {memoryUsed} / 32 GB
            </div>
          </div>
          <div style={{ width: '120px', height: '40px' }}>
            <canvas ref={memSparkRef}></canvas>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>큐 대기 길이</div>
            <div style={{ 
              fontSize: '1.3rem', 
              fontWeight: '700',
              transition: 'all 0.3s ease'
            }}>
              {queueLength}
            </div>
          </div>
          <div style={{ width: '120px', height: '40px' }}>
            <canvas ref={queueSparkRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GpuServerResources;