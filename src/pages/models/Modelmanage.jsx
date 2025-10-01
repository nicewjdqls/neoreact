import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import Chart from 'chart.js/auto';

function Modelmanage() {
  // State 관리
  const [datasets] = useState([
    { id: 'ds1', name: '뉴스기사 데이터셋' },
    { id: 'ds2', name: '영화 리뷰 데이터셋' },
    { id: 'ds3', name: 'AI 질의응답 데이터셋' }
  ]);
  
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [trainingStatus, setTrainingStatus] = useState('학습 상태: 대기 중');
  const [finalResults, setFinalResults] = useState('학습 완료 후 결과가 표시됩니다.');
  const [isTraining, setIsTraining] = useState(false);
  
  // Form 입력값들
  const [newModelName, setNewModelName] = useState('');
  const [existingModel, setExistingModel] = useState('');
  const [learningRate, setLearningRate] = useState(0.01);
  const [batchSize, setBatchSize] = useState(32);
  const [epochs, setEpochs] = useState(20);
  
  // Chart 관련
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const trainingIntervalRef = useRef(null);

  // 컴포넌트 언마운트 시 정리
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

  // 데이터셋 선택 핸들러
  const handleDatasetSelect = (dataset) => {
    setSelectedDataset(dataset);
  };

  // 학습 시작 핸들러
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

    // Chart 초기화
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
            tension: 0.3
          },
          {
            label: `손실 (LR:${learningRate})`,
            data: [],
            borderColor: 'rgb(239,68,68)',
            backgroundColor: 'rgba(239,68,68,0.2)',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Epoch'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value'
            },
            min: 0,
            max: 1
          }
        }
      }
    });

    // 학습 시뮬레이션
    let currentEpoch = 0;
    let acc = 0.5 + Math.random() * 0.1;
    let loss = 0.5 + Math.random() * 0.1;
    
    trainingIntervalRef.current = setInterval(() => {
      if (currentEpoch >= epochs) {
        clearInterval(trainingIntervalRef.current);
        setIsTraining(false);
        setTrainingStatus(`학습 상태: ${modelName} 학습 완료! (LR:${learningRate}, Batch:${batchSize}, Epoch:${epochs})`);
        setFinalResults(`최종 정확도: ${(acc * 100).toFixed(2)}%\n최종 손실: ${loss.toFixed(4)}`);
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
    <Layout 
      title="Neo AI Portal"
      subtitle="AI 학습 모델 관리 및 훈련 시스템"
      environment="Production"
      showNavigation={true}
    >
      <div className="page Modelmanage">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">AI 학습 관리 화면</h1>

        <div className="flex gap-6">
          {/* 왼쪽: 데이터셋 목록 */}
          <div className="w-1/4 space-y-6">
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">데이터셋 목록</h2>
              <ul className="space-y-1 text-sm text-gray-700 max-h-96 overflow-y-auto">
                {datasets.map((dataset) => (
                  <li
                    key={dataset.id}
                    className={`cursor-pointer hover:bg-gray-100 p-2 rounded ${
                      selectedDataset?.id === dataset.id ? 'bg-indigo-100' : ''
                    }`}
                    onClick={() => handleDatasetSelect(dataset)}
                  >
                    {dataset.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 오른쪽: 학습 설정/모니터링 */}
          <div className="flex-1 space-y-6">
            {/* 학습 모델 선택/입력 */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">학습 모델 선택/입력</h2>
              <div className="grid lg:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">신규 모델명 입력</label>
                  <input
                    type="text"
                    placeholder="예: gpt-5-custom"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">기존 모델 선택</label>
                  <select
                    value={existingModel}
                    onChange={(e) => setExistingModel(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- 선택 --</option>
                    <option value="model1">gpt-4</option>
                    <option value="model2">gpt-5</option>
                    <option value="model3">llama</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 학습 파라미터 */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">학습 파라미터</h2>
              <div className="grid lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Learning Rate</label>
                  <input
                    type="number"
                    step="0.001"
                    value={learningRate}
                    onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Batch Size</label>
                  <input
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Epochs</label>
                  <input
                    type="number"
                    value={epochs}
                    onChange={(e) => setEpochs(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* 학습 시작 버튼 */}
            <div className="flex justify-start">
              <button
                onClick={handleStartTraining}
                disabled={isTraining}
                className={`px-5 py-2 rounded-lg shadow transition ${
                  isTraining
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isTraining ? '학습 진행 중...' : '학습 시작'}
              </button>
            </div>

            {/* 학습 상태 */}
            <div className="text-gray-700 font-medium mb-3">{trainingStatus}</div>

            {/* 학습 그래프 */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">학습 경사도</h2>
              <canvas ref={chartRef} className="w-full h-64"></canvas>
            </div>

            {/* 학습 결과 수치 */}
            <div className="bg-white rounded-xl shadow p-6 text-gray-700">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">최종 학습 결과</h2>
              <div className="whitespace-pre-line">{finalResults}</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Modelmanage;