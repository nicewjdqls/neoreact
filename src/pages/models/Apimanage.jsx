import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

function Apimanage() {
  // State 관리
  const [selectedModel, setSelectedModel] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [apiParams, setApiParams] = useState('');
  const [apiResult, setApiResult] = useState('응답 결과가 여기에 표시됩니다');
  const [apiSampleCode, setApiSampleCode] = useState('API를 호출하면 샘플 코드가 생성됩니다');
  const [savedResults, setSavedResults] = useState([]);
  const [lastApiResult, setLastApiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 샘플 모델 데이터
  const mockModels = [
    { 
      id: "m1", 
      name: "텍스트 분류 모델", 
      version: "v1.0", 
      created: "2025-09-01",
      description: "문서 분류 및 감정 분석을 위한 모델",
      endpoint: "/api/v1/text-classifier"
    },
    { 
      id: "m2", 
      name: "챗봇 모델", 
      version: "v2.1", 
      created: "2025-08-25",
      description: "대화형 AI 챗봇 모델",
      endpoint: "/api/v1/chatbot"
    },
    { 
      id: "m3", 
      name: "추천 시스템 모델", 
      version: "v0.9", 
      created: "2025-08-15",
      description: "사용자 맞춤 추천 시스템",
      endpoint: "/api/v1/recommender"
    },
    {
      id: "m4",
      name: "이미지 분류 모델",
      version: "v1.5",
      created: "2025-09-10",
      description: "이미지 객체 인식 및 분류 모델",
      endpoint: "/api/v1/image-classifier"
    },
    {
      id: "m5",
      name: "번역 모델",
      version: "v3.2",
      created: "2025-09-05",
      description: "다국어 실시간 번역 모델",
      endpoint: "/api/v1/translator"
    },
    {
      id: "m6",
      name: "요약 모델",
      version: "v2.0",
      created: "2025-08-30",
      description: "텍스트 자동 요약 모델",
      endpoint: "/api/v1/summarizer"
    }
  ];

  // localStorage에서 저장된 결과 로드
  useEffect(() => {
    loadSavedResults();
  }, []);

  // 저장된 결과 로드
  const loadSavedResults = () => {
    const results = JSON.parse(localStorage.getItem("apiResults") || "[]");
    setSavedResults(results);
  };

  // 모델 선택 핸들러
  const handleModelSelect = (modelId) => {
    const model = mockModels.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
      setApiEndpoint(model.endpoint);
      setApiParams(JSON.stringify(getSampleParams(model), null, 2));
    } else {
      setSelectedModel(null);
      setApiEndpoint('');
      setApiParams('');
    }
  };

  // 모델별 샘플 파라미터 생성
  const getSampleParams = (model) => {
    const baseParams = {
      model_id: model.id,
      timestamp: new Date().toISOString()
    };

    switch(model.id) {
      case "m1":
        return {
          ...baseParams,
          text: "이 영화는 정말 재미있었습니다.",
          task: "sentiment_analysis"
        };
      case "m2":
        return {
          ...baseParams,
          message: "안녕하세요, 도움이 필요합니다.",
          context: "customer_support"
        };
      case "m3":
        return {
          ...baseParams,
          user_id: "user123",
          item_categories: ["electronics", "books"],
          count: 5
        };
      case "m4":
        return {
          ...baseParams,
          image_url: "https://example.com/image.jpg",
          confidence_threshold: 0.8
        };
      case "m5":
        return {
          ...baseParams,
          text: "Hello, how are you today?",
          source_lang: "en",
          target_lang: "ko"
        };
      case "m6":
        return {
          ...baseParams,
          text: "긴 텍스트 내용을 여기에 입력하세요. 이 모델은 입력된 텍스트를 분석하여 핵심 내용을 요약해줍니다.",
          max_length: 150
        };
      default:
        return {
          ...baseParams,
          input: "예시 입력 데이터"
        };
    }
  };

  // Mock 응답 생성
  const generateMockResponse = (model, params) => {
    const baseResponse = {
      success: true,
      model_id: model.id,
      model_version: model.version,
      timestamp: new Date().toISOString(),
      processing_time_ms: Math.floor(Math.random() * 500) + 100
    };

    switch(model.id) {
      case "m1":
        return {
          ...baseResponse,
          classification: {
            sentiment: "positive",
            confidence: 0.87,
            categories: ["entertainment", "positive_review"]
          },
          input_text: params.text || params.input
        };
      case "m2":
        return {
          ...baseResponse,
          response: "안녕하세요! 무엇을 도와드릴까요?",
          intent: "greeting",
          confidence: 0.95,
          suggested_actions: ["help_request", "product_inquiry"]
        };
      case "m3":
        return {
          ...baseResponse,
          recommendations: [
            { item_id: "item001", score: 0.92, category: "electronics" },
            { item_id: "item045", score: 0.88, category: "books" },
            { item_id: "item123", score: 0.84, category: "electronics" }
          ],
          user_profile: {
            preferences: params.item_categories || ["general"],
            interaction_count: 47
          }
        };
      case "m4":
        return {
          ...baseResponse,
          detections: [
            { class: "cat", confidence: 0.94, bbox: [10, 20, 150, 200] },
            { class: "person", confidence: 0.87, bbox: [200, 50, 300, 400] }
          ],
          image_info: {
            width: 640,
            height: 480,
            format: "jpeg"
          }
        };
      case "m5":
        return {
          ...baseResponse,
          translated_text: "안녕하세요, 오늘 어떻게 지내세요?",
          source_language: params.source_lang || "en",
          target_language: params.target_lang || "ko",
          confidence: 0.96
        };
      case "m6":
        return {
          ...baseResponse,
          summary: "입력된 텍스트의 핵심 내용을 요약한 결과입니다.",
          original_length: params.text?.length || 0,
          summary_length: 25,
          compression_ratio: 0.75
        };
      default:
        return {
          ...baseResponse,
          result: "처리 완료",
          data: params
        };
    }
  };

  // 샘플 코드 생성
  const generateSampleCode = (endpoint, params) => {
    return `// JavaScript fetch 예제
const response = await fetch('${endpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${JSON.stringify(params, null, 4)})
});

const data = await response.json();
console.log(data);

// curl 예제
/*
curl -X POST "${endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '${JSON.stringify(params)}'
*/`;
  };

  // API 호출 핸들러
  const handleApiCall = async (e) => {
    e.preventDefault();
    
    if (!selectedModel) {
      alert("먼저 모델을 선택해주세요.");
      return;
    }

    let params;
    try {
      params = JSON.parse(apiParams || "{}");
    } catch(err) {
      alert("JSON 형식이 올바르지 않습니다.");
      return;
    }

    setIsLoading(true);
    setApiResult("API 호출 중...");
    setApiSampleCode("코드 생성 중...");

    // API 호출 시뮬레이션
    setTimeout(() => {
      const mockResponse = generateMockResponse(selectedModel, params);
      const result = {
        model: selectedModel,
        endpoint: apiEndpoint,
        params: params,
        response: mockResponse,
        timestamp: new Date().toISOString(),
        success: true
      };

      setLastApiResult(result);
      setApiResult(JSON.stringify(mockResponse, null, 2));
      setApiSampleCode(generateSampleCode(apiEndpoint, params));
      setIsLoading(false);
    }, 1000);
  };

  // 설정 저장 핸들러
  const handleSaveConfig = () => {
    if (!lastApiResult) {
      alert("먼저 API를 호출해주세요.");
      return;
    }

    const results = JSON.parse(localStorage.getItem("apiResults") || "[]");
    results.push(lastApiResult);
    localStorage.setItem("apiResults", JSON.stringify(results));
    
    loadSavedResults();
    alert("API 호출 결과가 저장되었습니다!");
  };

  // 저장된 결과 삭제
  const deleteResult = (index) => {
    if (window.confirm('이 결과를 삭제하시겠습니까?')) {
      const results = [...savedResults];
      results.splice(index, 1);
      localStorage.setItem("apiResults", JSON.stringify(results));
      setSavedResults(results);
    }
  };

  // 저장된 결과를 폼에 로드
  const loadResultToForm = (result) => {
    setSelectedModel(result.model);
    setApiEndpoint(result.endpoint);
    setApiParams(JSON.stringify(result.params, null, 2));
    setApiResult(JSON.stringify(result.response, null, 2));
    setApiSampleCode(generateSampleCode(result.endpoint, result.params));
    setLastApiResult(result);
  };

  return (
    <Layout 
      title="Neo AI Portal"
      subtitle="API 관리 및 테스트 시스템"
      environment="Production"
      showNavigation={true}
    >
      <div className="flex h-[calc(100vh-200px)]">
        {/* 왼쪽 사이드바: API 호출 결과 */}
        <aside className="w-80 bg-white border-r border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">API 호출 결과</h2>
                <p className="text-sm text-gray-600">저장된 호출 기록</p>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {savedResults.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">아직 저장된 API 호출 결과가 없습니다</p>
                </div>
              ) : (
                savedResults.slice().reverse().map((result, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => loadResultToForm(result)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-bold ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                            {result.success ? '✓' : '✗'}
                          </span>
                          <h3 className="font-medium text-gray-900 text-sm">{result.model.name}</h3>
                        </div>
                        <div className="text-xs text-gray-600 font-mono mb-2">{result.endpoint}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(result.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <button 
                        className="text-red-600 hover:text-red-800 text-xs p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteResult(savedResults.length - 1 - index);
                        }}
                      >
                        삭제
                      </button>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">클릭하여 상세 정보를 불러오기</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 p-6 space-y-6 max-h-full overflow-y-auto">
          {/* 모델 선택 섹션 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">사용 가능한 AI 모델</h2>
                <p className="text-sm text-gray-600">테스트할 모델을 선택하세요</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">모델 선택</label>
              <select 
                value={selectedModel?.id || ''}
                onChange={(e) => handleModelSelect(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- 모델을 선택하세요 --</option>
                {mockModels.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.version})
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* 선택된 모델 정보 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">선택된 모델 정보</h2>
                <p className="text-sm text-gray-600">선택한 모델의 상세 정보</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {selectedModel ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">모델명</span>
                      <div className="text-gray-900">{selectedModel.name}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">버전</span>
                      <div className="text-gray-900">{selectedModel.version}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">생성일</span>
                      <div className="text-gray-900">{selectedModel.created}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">모델 ID</span>
                      <div className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">{selectedModel.id}</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">설명</span>
                    <div className="text-gray-900">{selectedModel.description}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">권장 엔드포인트</span>
                    <div className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">{selectedModel.endpoint}</div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">모델을 선택하세요.</p>
              )}
            </div>
          </section>

          {/* API 호출 테스트 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">API 호출 테스트</h2>
                <p className="text-sm text-gray-600">모델 API를 테스트하고 결과를 확인하세요</p>
              </div>
            </div>
            
            <form onSubmit={handleApiCall} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">엔드포인트</label>
                <input 
                  type="text" 
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="/api/v1/predict"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">요청 파라미터 (JSON)</label>
                <textarea 
                  rows={6}
                  value={apiParams}
                  onChange={(e) => setApiParams(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder='{"input": "예시 데이터", "model": "selected_model"}'
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                    isLoading 
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isLoading ? 'API 호출 중...' : 'API 호출'}
                </button>
                <button 
                  type="button" 
                  onClick={handleSaveConfig}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  설정 저장
                </button>
              </div>
            </form>

            {/* 실시간 응답 결과 */}
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">응답 결과</h3>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 max-h-64 overflow-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{apiResult}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">샘플 코드 (JavaScript fetch)</h3>
                <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-auto">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">{apiSampleCode}</pre>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}

export default Apimanage;