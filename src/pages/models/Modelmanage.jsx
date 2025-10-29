import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import MonitoringLayout from '../../components/MonitoringLayout';

function Modelmanage() {
  const [datasets] = useState([
    { id: 'ds1', name: '뉴스기사 데이터셋', size: '1.2GB', records: 15000 },
    { id: 'ds2', name: '영화 리뷰 데이터셋', size: '850MB', records: 12000 },
    { id: 'ds3', name: 'AI 질의응답 데이터셋', size: '2.1GB', records: 25000 }
  ]);
  
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [trainingStatus, setTrainingStatus] = useState('학습 상태: 대기 중');
  const [finalResults, setFinalResults] = useState('학습 완료 후 결과가 표시됩니다.');
  const [isTraining, setIsTraining] = useState(false);
  
  const [newModelName, setNewModelName] = useState('');
  const [existingModel, setExistingModel] = useState('');
  const [learningRate, setLearningRate] = useState(0.01);
  const [batchSize, setBatchSize] = useState(32);
  const [epochs, setEpochs] = useState(20);
  
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const trainingIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      if (trainingIntervalRef.current) {
        clearInterval(trainingIntervalRef.current);
      }
    };
  }, []);

  const handleDatasetSelect = (dataset) => {
    setSelectedDataset(dataset);
  };

  const handleStartTraining = () => {
    if (!selectedDataset) {
      alert('데이터셋을 선택하세요');
      return;
    }
    
    let modelName = newModelName.trim();
    if (!modelName) {
      if (!existingModel) {
        alert('모델을 입력하거나 선택하세요');
        return;
      }
      const modelOptions = {
        'model1': 'gpt-4',
        'model2': 'gpt-5',
        'model3': 'llama'
      };
      modelName = modelOptions[existingModel];
    }

    setIsTraining(true);
    setTrainingStatus(`학습 상태: ${modelName} 학습 중...`);
    setFinalResults('');

    const ctx = chartRef.current.getContext('2d');
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: `정확도 (LR:${learningRate})`,
            data: [],
            borderColor: 'rgb(34,197,94)',
            backgroundColor: 'rgba(34,197,94,0.2)',
            tension: 0.3,
            borderWidth: 2
          },
          {
            label: `손실 (LR:${learningRate})`,
            data: [],
            borderColor: 'rgb(239,68,68)',
            backgroundColor: 'rgba(239,68,68,0.2)',
            tension: 0.3,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'rgba(255, 255, 255, 0.9)',
              font: { size: 12 }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Epoch',
              color: 'rgba(255, 255, 255, 0.7)'
            },
            ticks: { color: 'rgba(255, 255, 255, 0.7)' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          y: {
            title: {
              display: true,
              text: 'Value',
              color: 'rgba(255, 255, 255, 0.7)'
            },
            min: 0,
            max: 1,
            ticks: { color: 'rgba(255, 255, 255, 0.7)' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });

    let currentEpoch = 0;
    let acc = 0.5 + Math.random() * 0.1;
    let loss = 0.5 + Math.random() * 0.1;
    
    trainingIntervalRef.current = setInterval(() => {
      if (currentEpoch >= epochs) {
        clearInterval(trainingIntervalRef.current);
        setIsTraining(false);
        setTrainingStatus(`학습 상태: ${modelName} 학습 완료! (LR:${learningRate}, Batch:${batchSize}, Epoch:${epochs})`);
        setFinalResults(`최종 정확도: ${(acc * 100).toFixed(2)}%\n최종 손실: ${loss.toFixed(4)}\n\n✓ 모델이 성공적으로 학습되었습니다.`);
      } else {
        currentEpoch++;
        const accIncrement = (0.9 - acc) * 0.3 * learningRate + (Math.random() * 0.01);
        const lossDecrement = (loss - 0.1) * 0.3 * learningRate + (Math.random() * 0.01);
        acc = Math.min(1, acc + accIncrement);
        loss = Math.max(0, loss - lossDecrement);

        chartInstanceRef.current.data.labels.push(`E${currentEpoch}`);
        chartInstanceRef.current.data.datasets[0].data.push(acc);
        chartInstanceRef.current.data.datasets[1].data.push(loss);
        chartInstanceRef.current.update();
      }
    }, 500);
  };

  return (
    <MonitoringLayout activeMenu="modelmanage" onMenuChange={() => {}}>
      <div style={{ background: '#1e2139', minHeight: '100vh', padding: '1.5rem' }}>
        <style>{`
          .model-card {
            background: linear-gradient(135deg, rgba(42, 48, 70, 0.9) 0%, rgba(54, 61, 90, 0.9) 100%);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }
          .model-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
            padding: 0.625rem 0.75rem;
            color: #fff;
            font-size: 0.875rem;
            transition: all 0.2s;
          }
          .model-input:hover {
            border-color: rgba(99, 102, 241, 0.5);
          }
          .model-input:focus {
            outline: none;
            border-color: rgba(99, 102, 241, 0.8);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          }
          .dataset-item {
            padding: 0.75rem;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.03);
          }
          .dataset-item:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(99, 102, 241, 0.4);
          }
          .dataset-item.active {
            background: rgba(99, 102, 241, 0.2);
            border-color: rgba(99, 102, 241, 0.6);
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
          }
        `}</style>

        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}>
          AI 학습 관리 화면
        </h1>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {/* 왼쪽: 데이터셋 목록 */}
          <div style={{ width: '25%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="model-card">
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '0.75rem', height: '0.75rem', background: '#6366f1', borderRadius: '50%', marginRight: '0.5rem' }}></div>
                데이터셋 목록
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', maxHeight: '24rem', overflowY: 'auto', margin: 0, padding: 0, listStyle: 'none' }}>
                {datasets.map((dataset) => (
                  <li
                    key={dataset.id}
                    className={`dataset-item ${selectedDataset?.id === dataset.id ? 'active' : ''}`}
                    onClick={() => handleDatasetSelect(dataset)}
                  >
                    <div style={{ fontWeight: '600', color: '#fff', marginBottom: '0.25rem' }}>
                      {dataset.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{dataset.size}</span>
                      <span>{dataset.records.toLocaleString()} records</span>
                    </div>
                  </li>
                ))}
              </ul>
              {selectedDataset && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem', 
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '0.5rem'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(99, 102, 241, 1)', fontWeight: '600', marginBottom: '0.25rem' }}>
                    선택된 데이터셋
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#fff', fontWeight: '600' }}>
                    {selectedDataset.name}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 학습 설정/모니터링 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 학습 모델 선택/입력 */}
            <div className="model-card">
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '0.75rem', height: '0.75rem', background: '#a855f7', borderRadius: '50%', marginRight: '0.5rem' }}></div>
                학습 모델 선택/입력
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', display: 'block', marginBottom: '0.5rem' }}>
                    신규 모델명 입력
                  </label>
                  <input
                    type="text"
                    placeholder="예: gpt-5-custom"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    className="model-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', display: 'block', marginBottom: '0.5rem' }}>
                    기존 모델 선택
                  </label>
                  <select
                    value={existingModel}
                    onChange={(e) => setExistingModel(e.target.value)}
                    className="model-input"
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="" style={{ background: '#2a3046', color: '#fff' }}>-- 선택 --</option>
                    <option value="model1" style={{ background: '#2a3046', color: '#fff' }}>gpt-4</option>
                    <option value="model2" style={{ background: '#2a3046', color: '#fff' }}>gpt-5</option>
                    <option value="model3" style={{ background: '#2a3046', color: '#fff' }}>llama</option>
                  </select>
                </div>
              </div>
              {(newModelName || existingModel) && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem', 
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '0.5rem'
                }}>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(168, 85, 247, 1)' }}>
                    선택된 모델: <span style={{ fontWeight: '600' }}>{newModelName || (existingModel === 'model1' ? 'gpt-4' : existingModel === 'model2' ? 'gpt-5' : existingModel === 'model3' ? 'llama' : '')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 학습 파라미터 */}
            <div className="model-card">
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '0.75rem', height: '0.75rem', background: '#3b82f6', borderRadius: '50%', marginRight: '0.5rem' }}></div>
                학습 파라미터
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', display: 'block', marginBottom: '0.5rem' }}>
                    Learning Rate
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={learningRate}
                    onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                    className="model-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', display: 'block', marginBottom: '0.5rem' }}>
                    Batch Size
                  </label>
                  <input
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(parseInt(e.target.value))}
                    className="model-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', display: 'block', marginBottom: '0.5rem' }}>
                    Epochs
                  </label>
                  <input
                    type="number"
                    value={epochs}
                    onChange={(e) => setEpochs(parseInt(e.target.value))}
                    className="model-input"
                  />
                </div>
              </div>
            </div>

            {/* 학습 시작 버튼 & 상태 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={handleStartTraining}
                disabled={isTraining}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.5rem',
                  background: isTraining 
                    ? 'rgba(107, 114, 128, 0.5)' 
                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: isTraining ? 'not-allowed' : 'pointer',
                  boxShadow: isTraining ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.2s',
                  opacity: isTraining ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isTraining) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isTraining) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
                  }
                }}
              >
                {isTraining ? (
                  <>
                    <div style={{ 
                      width: '1rem', 
                      height: '1rem', 
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    학습 진행 중...
                  </>
                ) : (
                  <>
                    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    학습 시작
                  </>
                )}
              </button>
              <div style={{ 
                fontSize: '0.875rem', 
                color: isTraining ? '#f59e0b' : '#22c55e',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{ 
                  width: '0.5rem', 
                  height: '0.5rem', 
                  background: isTraining ? '#f59e0b' : '#22c55e',
                  borderRadius: '50%',
                  animation: isTraining ? 'pulse 2s ease-in-out infinite' : 'none'
                }}></div>
                {trainingStatus}
              </div>
            </div>

            {/* 학습 그래프 */}
            <div className="model-card">
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '0.75rem', height: '0.75rem', background: '#22c55e', borderRadius: '50%', marginRight: '0.5rem' }}></div>
                학습 경사도
              </h2>
              <div style={{ height: '16rem', position: 'relative' }}>
                <canvas ref={chartRef}></canvas>
              </div>
            </div>

            {/* 학습 결과 수치 */}
            <div className="model-card">
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '0.75rem', height: '0.75rem', background: '#f59e0b', borderRadius: '50%', marginRight: '0.5rem' }}></div>
                최종 학습 결과
              </h2>
              <div style={{ 
                whiteSpace: 'pre-line', 
                color: 'rgba(255, 255, 255, 0.9)',
                padding: '1rem',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '0.5rem',
                minHeight: '6rem',
                fontSize: '0.875rem',
                lineHeight: '1.6'
              }}>
                {finalResults}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    </MonitoringLayout>
  );
}

export default Modelmanage;