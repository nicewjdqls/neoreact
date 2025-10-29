import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

function RequestViewer({ kpis, requestParticles, particleStats }) {
  const inputSparklineRef = useRef(null);
  const completedSparklineRef = useRef(null);
  const request3DRef = useRef(null);
  const inputChartRef = useRef(null);
  const completedChartRef = useRef(null);
  
  const [inputHistory, setInputHistory] = useState(Array(20).fill(0));
  const [completedHistory, setCompletedHistory] = useState(Array(20).fill(0));

  // 실시간 데이터 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setInputHistory(prev => {
        const newData = [...prev.slice(1), parseFloat(kpis.requestViewer) || 0];
        return newData;
      });
      
      setCompletedHistory(prev => {
        const newData = [...prev.slice(1), parseFloat(kpis.completed || kpis.requestViewer) || 0];
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [kpis.requestViewer, kpis.completed]);

  // Input Requests Sparkline
  useEffect(() => {
    if (!inputSparklineRef.current) return;

    const ctx = inputSparklineRef.current.getContext('2d');
    
    if (inputChartRef.current) {
      inputChartRef.current.destroy();
    }

    inputChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array(20).fill(''),
        datasets: [{
          data: inputHistory,
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { display: false },
          y: { 
            display: false,
            beginAtZero: true
          }
        },
        animation: {
          duration: 300
        }
      }
    });

    return () => {
      if (inputChartRef.current) {
        inputChartRef.current.destroy();
      }
    };
  }, [inputHistory]);

  // Completed Sparkline
  useEffect(() => {
    if (!completedSparklineRef.current) return;

    const ctx = completedSparklineRef.current.getContext('2d');
    
    if (completedChartRef.current) {
      completedChartRef.current.destroy();
    }

    completedChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array(20).fill(''),
        datasets: [{
          data: completedHistory,
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { display: false },
          y: { 
            display: false,
            beginAtZero: true
          }
        },
        animation: {
          duration: 300
        }
      }
    });

    return () => {
      if (completedChartRef.current) {
        completedChartRef.current.destroy();
      }
    };
  }, [completedHistory]);

  useEffect(() => {
    const init3DViewer = () => {
      if (!window.THREE || !request3DRef.current) return;
      
      const THREE = window.THREE;
      const container = request3DRef.current;
      
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      const scene = new THREE.Scene();
      scene.background = null;
      
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
      
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      let animationId;
      
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      
      animate();
      
      return () => {
        if (animationId) cancelAnimationFrame(animationId);
        if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
      };
    };
    
    if (!window.THREE) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
        init3DViewer();
      };
      document.head.appendChild(script);
    } else {
      init3DViewer();
    }
  }, []);

  // 변화량 계산
  const inputChange = inputHistory.length >= 2 
    ? inputHistory[inputHistory.length - 1] - inputHistory[inputHistory.length - 2]
    : 0;
  const completedChange = completedHistory.length >= 2
    ? completedHistory[completedHistory.length - 1] - completedHistory[completedHistory.length - 2]
    : 0;

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.95) 0%, rgba(54, 61, 90, 0.95) 100%)', 
      padding: '1.5rem', 
      borderRadius: '8px', 
      marginBottom: '1rem', 
      border: '1px solid rgba(99, 102, 241, 0.4)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      position: 'relative',
      overflow: 'hidden'
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
      
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 220px', gap: '2rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {/* 왼쪽: Input Requests */}
        <div style={{
          background: 'rgba(30, 35, 52, 0.6)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem', fontWeight: '600' }}>
            Input Requests
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: '700', color: '#fff' }}>
              {kpis.requestViewer}
            </div>
            <div style={{ 
              fontSize: '0.85rem', 
              fontWeight: '600',
              color: inputChange >= 0 ? '#22c55e' : '#ef4444'
            }}>
              {inputChange >= 0 ? '↑' : '↓'} {Math.abs(inputChange).toFixed(1)}
            </div>
          </div>
          <div style={{ height: '50px', position: 'relative' }}>
            <canvas ref={inputSparklineRef}></canvas>
          </div>
        </div>

        {/* 중앙: TPS 파이프라인 */}
        <div style={{ position: 'relative', height: '120px', overflow: 'visible' }}>
          <div ref={request3DRef} style={{ width: '100%', height: '100%', borderRadius: '8px' }}></div>
          
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '90px',
            pointerEvents: 'none',
            zIndex: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {(() => {
              const tpsValue = kpis.realTimeTPS;
              const total = particleStats.success + particleStats.warning + particleStats.error;
              const successPercent = total > 0 ? (particleStats.success / total) * 100 : 33.33;
              const warningPercent = total > 0 ? (particleStats.warning / total) * 100 : 33.33;
              const errorPercent = total > 0 ? (particleStats.error / total) * 100 : 33.34;
              
              const minTPS = 30;
              const maxTPS = 65;
              const minWidth = 120;
              const maxWidth = 280;
              const cylinderWidth = Math.max(minWidth, Math.min(maxWidth, 
                minWidth + ((tpsValue - minTPS) / (maxTPS - minTPS)) * (maxWidth - minWidth)
              ));
              
              return (
                <>
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: `${cylinderWidth}px`,
                    height: '90px',
                    borderRadius: '45px',
                    overflow: 'hidden',
                    border: '3px solid rgba(99, 102, 241, 0.5)',
                    boxShadow: `0 0 30px rgba(99, 102, 241, 0.4), inset 0 0 20px rgba(99, 102, 241, 0.2)`,
                    transition: 'all 0.5s ease-out',
                    background: 'rgba(30, 35, 52, 0.3)'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '0',
                      top: '0',
                      width: `${successPercent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.7), rgba(34, 197, 94, 0.5))',
                      boxShadow: 'inset 0 0 20px rgba(34, 197, 94, 0.3)',
                      transition: 'all 0.8s ease-out'
                    }} />
                    
                    <div style={{
                      position: 'absolute',
                      left: `${successPercent}%`,
                      top: '0',
                      width: `${warningPercent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.7), rgba(245, 158, 11, 0.5))',
                      boxShadow: 'inset 0 0 20px rgba(245, 158, 11, 0.3)',
                      transition: 'all 0.8s ease-out'
                    }} />
                    
                    <div style={{
                      position: 'absolute',
                      left: `${successPercent + warningPercent}%`,
                      top: '0',
                      width: `${errorPercent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.7), rgba(239, 68, 68, 0.5))',
                      boxShadow: 'inset 0 0 20px rgba(239, 68, 68, 0.3)',
                      transition: 'all 0.8s ease-out'
                    }} />
                  </div>
                  
                  <div style={{
                    position: 'absolute',
                    left: `calc(50% - ${cylinderWidth / 2}px)`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '50px',
                    height: '96px',
                    borderRadius: '50%',
                    background: `radial-gradient(ellipse at center, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 70%)`,
                    border: '3px solid rgba(99, 102, 241, 0.6)',
                    borderRight: 'none',
                    boxShadow: `-5px 0 20px rgba(99, 102, 241, 0.5), inset -10px 0 20px rgba(99, 102, 241, 0.3)`,
                    transition: 'all 0.5s ease-out'
                  }} />
                  
                  <div style={{
                    position: 'absolute',
                    left: `calc(50% + ${cylinderWidth / 2}px)`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '50px',
                    height: '96px',
                    borderRadius: '50%',
                    background: `radial-gradient(ellipse at center, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 70%)`,
                    border: '3px solid rgba(99, 102, 241, 0.6)',
                    borderLeft: 'none',
                    boxShadow: `5px 0 20px rgba(99, 102, 241, 0.5), inset 10px 0 20px rgba(99, 102, 241, 0.3)`,
                    transition: 'all 0.5s ease-out'
                  }} />
                  
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    display: 'flex',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: '16px',
                    background: 'rgba(30, 35, 52, 0.8)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.5s ease-out',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <span style={{ color: 'rgba(34, 197, 94, 1)', textShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}>
                      ● {Math.round(successPercent)}%
                    </span>
                    <span style={{ color: 'rgba(245, 158, 11, 1)', textShadow: '0 0 10px rgba(245, 158, 11, 0.8)' }}>
                      ▲ {Math.round(warningPercent)}%
                    </span>
                    <span style={{ color: 'rgba(239, 68, 68, 1)', textShadow: '0 0 10px rgba(239, 68, 68, 0.8)' }}>
                      ✕ {Math.round(errorPercent)}%
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
          
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 10
          }}>
            {requestParticles.map(particle => {
              const fadeProgress = particle.progress < 0.05 ? particle.progress / 0.05 : 
                                 particle.progress > 0.95 ? (1 - particle.progress) / 0.05 : 1;
              
              let color;
              if (particle.type === 'success') {
                color = { main: '#22c55e', glow: 'rgba(34, 197, 94, 0.6)' };
              } else if (particle.type === 'warning') {
                color = { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)' };
              } else {
                color = { main: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)' };
              }
              
              // 곡선 경로 계산 (타입별로 다르게)
              const startAngle = particle.startAngle || 0;
              let yPos;
              
              if (particle.progress < 0.5) {
                // 왼쪽에서 게이트까지: 모두 동일하게 중앙으로
                const t = particle.progress / 0.5;
                yPos = 60 + startAngle * (1 - t * t);
              } else {
                // 게이트 통과 후: 타입별로 경로 분기
                const afterGateProgress = (particle.progress - 0.5) / 0.5; // 0→1
                
                if (particle.type === 'success') {
                  // 녹색: 중앙 유지
                  yPos = 60;
                } else if (particle.type === 'warning') {
                  // 주황: 위로 올라감
                  yPos = 60 - (afterGateProgress * 30);
                } else {
                  // 빨강: 아래로 내려감
                  yPos = 60 + (afterGateProgress * 30);
                }
              }
              
              const centerDist = Math.abs(particle.progress - 0.5);
              const isInGate = centerDist < 0.12;
              const bubbleIntensity = isInGate ? (0.12 - centerDist) / 0.12 : 0;
              
              // 경로 추적용 포인트 (최소한으로)
              const numSegments = 10;
              const segments = [];
              
              for (let i = 0; i < numSegments; i++) {
                const segProgress = Math.max(0, particle.progress - (i * 0.02));
                
                let segY;
                if (segProgress < 0.5) {
                  // 왼쪽에서 게이트까지
                  const t = segProgress / 0.5;
                  segY = 60 + startAngle * (1 - t * t);
                } else {
                  // 게이트 통과 후: 타입별로 경로 분기
                  const afterGateProgress = (segProgress - 0.5) / 0.5;
                  
                  if (particle.type === 'success') {
                    segY = 60;
                  } else if (particle.type === 'warning') {
                    segY = 60 - (afterGateProgress * 30);
                  } else {
                    segY = 60 + (afterGateProgress * 30);
                  }
                }
                
                // 색상 강도 계산: 게이트 통과 전 0, 통과 중 0→1, 통과 후 1 유지
                let colorIntensity;
                if (segProgress < 0.4) {
                  colorIntensity = 0; // 게이트 전: 하얀색
                } else if (segProgress < 0.6) {
                  colorIntensity = (segProgress - 0.4) / 0.2; // 게이트 통과 중: 0→1
                } else {
                  colorIntensity = 1; // 게이트 후: 색상 유지
                }
                
                segments.push({
                  x: segProgress * 100,
                  y: segY,
                  opacity: 1 - (i / numSegments),
                  colorIntensity: colorIntensity
                });
              }
              
              // 본체의 색상 강도
              let bodyColorIntensity;
              if (particle.progress < 0.4) {
                bodyColorIntensity = 0;
              } else if (particle.progress < 0.6) {
                bodyColorIntensity = (particle.progress - 0.4) / 0.2;
              } else {
                bodyColorIntensity = 1;
              }
              
              return (
                <div key={particle.id}>
                  {/* 게이트 통과 시 버블 효과 */}
                  {isInGate && (
                    <div style={{
                      position: 'absolute',
                      left: `${particle.progress * 100}%`,
                      top: `${yPos}px`,
                      width: `${particle.size * (3 + bubbleIntensity * 3)}px`,
                      height: `${particle.size * (3 + bubbleIntensity * 3)}px`,
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 30% 30%, ${color.glow.replace('0.6', String(bubbleIntensity * 0.3))}, transparent 70%)`,
                      opacity: bubbleIntensity * 0.5,
                      pointerEvents: 'none',
                      transform: 'translate(-50%, -50%)',
                      filter: 'blur(8px)',
                      zIndex: 5
                    }} />
                  )}
                  
                  {/* 경로를 따라가는 꼬리 세그먼트 (10개만) */}
                  {segments.map((seg, idx) => {
                    const segOpacity = seg.opacity * fadeProgress * particle.opacity;
                    const segSize = particle.size * (0.8 + seg.opacity * 0.8);
                    
                    // 색상 믹싱: 하얀색에서 type 색상으로
                    let segColor;
                    if (particle.type === 'success') {
                      segColor = {
                        r: 255 - (255 - 34) * seg.colorIntensity,
                        g: 255 - (255 - 197) * seg.colorIntensity,
                        b: 255 - (255 - 94) * seg.colorIntensity
                      };
                    } else if (particle.type === 'warning') {
                      segColor = {
                        r: 255 - (255 - 245) * seg.colorIntensity,
                        g: 255 - (255 - 158) * seg.colorIntensity,
                        b: 255 - (255 - 11) * seg.colorIntensity
                      };
                    } else {
                      segColor = {
                        r: 255 - (255 - 239) * seg.colorIntensity,
                        g: 255 - (255 - 68) * seg.colorIntensity,
                        b: 255 - (255 - 68) * seg.colorIntensity
                      };
                    }
                    
                    return (
                      <div key={`seg-${idx}`} style={{
                        position: 'absolute',
                        left: `${seg.x}%`,
                        top: `${seg.y}px`,
                        width: `${segSize * 2}px`,
                        height: `${segSize * 2}px`,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, 
                          rgba(${segColor.r}, ${segColor.g}, ${segColor.b}, ${segOpacity * 0.9}), 
                          rgba(${segColor.r}, ${segColor.g}, ${segColor.b}, ${segOpacity * 0.6}) 40%,
                          rgba(${segColor.r}, ${segColor.g}, ${segColor.b}, ${segOpacity * 0.3}) 70%,
                          transparent 100%)`,
                        opacity: segOpacity,
                        pointerEvents: 'none',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: `0 0 ${segSize}px rgba(${segColor.r}, ${segColor.g}, ${segColor.b}, ${segOpacity * 0.4})`,
                        willChange: 'transform',
                        zIndex: 2
                      }} />
                    );
                  })}
                  
                  {/* 파티클 본체 */}
                  <div style={{
                    position: 'absolute',
                    left: `${particle.progress * 100}%`,
                    top: `${yPos}px`,
                    width: `${particle.size * 1.3}px`,
                    height: `${particle.size * 1.3}px`,
                    borderRadius: '50%',
                    background: (() => {
                      if (particle.type === 'success') {
                        const r = 255 - (255 - 34) * bodyColorIntensity;
                        const g = 255 - (255 - 197) * bodyColorIntensity;
                        const b = 255 - (255 - 94) * bodyColorIntensity;
                        return `radial-gradient(circle at 30% 30%, rgb(${r}, ${g}, ${b}), rgba(${r}, ${g}, ${b}, 0.95))`;
                      } else if (particle.type === 'warning') {
                        const r = 255 - (255 - 245) * bodyColorIntensity;
                        const g = 255 - (255 - 158) * bodyColorIntensity;
                        const b = 255 - (255 - 11) * bodyColorIntensity;
                        return `radial-gradient(circle at 30% 30%, rgb(${r}, ${g}, ${b}), rgba(${r}, ${g}, ${b}, 0.95))`;
                      } else {
                        const r = 255 - (255 - 239) * bodyColorIntensity;
                        const g = 255 - (255 - 68) * bodyColorIntensity;
                        const b = 255 - (255 - 68) * bodyColorIntensity;
                        return `radial-gradient(circle at 30% 30%, rgb(${r}, ${g}, ${b}), rgba(${r}, ${g}, ${b}, 0.95))`;
                      }
                    })(),
                    boxShadow: `0 0 ${particle.size * 3}px rgba(255, 255, 255, 0.9), 0 0 ${particle.size * 6}px ${color.glow.replace('0.6', String(bodyColorIntensity * 0.6))}`,
                    opacity: fadeProgress * particle.opacity,
                    pointerEvents: 'none',
                    transform: 'translate(-50%, -50%)',
                    willChange: 'transform',
                    zIndex: 10
                  }} />
                </div>
              );
            })}
          </div>
          
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <div style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.1), transparent 70%)',
              filter: 'blur(15px)',
              animation: 'tpsBubble 2s ease-in-out infinite',
              zIndex: -1
            }} />
            
            <div style={{ 
              fontSize: '3.5rem', 
              fontWeight: '700',
              color: '#fff',
              textShadow: '0 0 20px rgba(99, 102, 241, 0.8), 0 0 40px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>{kpis.realTimeTPS}</div>
            <div style={{ 
              fontSize: '0.85rem', 
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              textShadow: '0 0 10px rgba(99, 102, 241, 0.6)',
              letterSpacing: '2px'
            }}>TPS</div>
          </div>
        </div>

        {/* 오른쪽: Completed */}
        <div style={{
          background: 'rgba(30, 35, 52, 0.6)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem', fontWeight: '600' }}>
            Completed
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: '700', color: '#fff' }}>
              {kpis.completed || kpis.requestViewer}
            </div>
            <div style={{ 
              fontSize: '0.85rem', 
              fontWeight: '600',
              color: completedChange >= 0 ? '#22c55e' : '#ef4444'
            }}>
              {completedChange >= 0 ? '↑' : '↓'} {Math.abs(completedChange).toFixed(1)}
            </div>
          </div>
          <div style={{ height: '50px', position: 'relative' }}>
            <canvas ref={completedSparklineRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestViewer;