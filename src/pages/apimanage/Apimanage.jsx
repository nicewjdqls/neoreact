import React, { useState, useEffect } from 'react';
import MonitoringLayout from '../../components/MonitoringLayout';
import ApiResultSidebar from './components/ApiResultSidebar';
import ModelSelector from './components/ModelSelector';
import ModelInfo from './components/ModelInfo';
import ApiTestForm from './components/ApiTestForm';
import modelData from './utils/modelData';
import apiHelpers from './utils/apiHelpers';
import codeGenerator from './utils/codeGenerator';
import './Apimanage-styles.css';

const Apimanage = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [apiParams, setApiParams] = useState('');
  const [apiResult, setApiResult] = useState('응답 결과가 여기에 표시됩니다');
  const [apiSampleCode, setApiSampleCode] = useState('API를 호출하면 샘플 코드가 생성됩니다');
  const [savedResults, setSavedResults] = useState([]);
  const [lastApiResult, setLastApiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const results = apiHelpers.loadApiResults();
    setSavedResults(results);
  }, []);

  const handleModelSelect = (modelId) => {
    const model = modelData.MODEL_LIST.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
      setApiEndpoint(model.endpoint);
      setApiParams(JSON.stringify(modelData.getModelSampleParams(model), null, 2));
    } else {
      setSelectedModel(null);
      setApiEndpoint('');
      setApiParams('');
    }
  };

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

    setTimeout(() => {
      const mockResponse = apiHelpers.generateMockResponse(selectedModel, params);
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
      setApiSampleCode(codeGenerator.generateSampleCode(apiEndpoint, params));
      setIsLoading(false);
    }, 1000);
  };

  const handleSaveConfig = () => {
    if (!lastApiResult) {
      alert("먼저 API를 호출해주세요.");
      return;
    }

    const results = apiHelpers.saveApiResult(lastApiResult);
    setSavedResults(results);
    alert("API 호출 결과가 저장되었습니다!");
  };

  const handleDeleteResult = (index) => {
    if (window.confirm('이 결과를 삭제하시겠습니까?')) {
      const results = apiHelpers.deleteApiResult(index);
      setSavedResults(results);
    }
  };

  const handleLoadResult = (result) => {
    setSelectedModel(result.model);
    setApiEndpoint(result.endpoint);
    setApiParams(JSON.stringify(result.params, null, 2));
    setApiResult(JSON.stringify(result.response, null, 2));
    setApiSampleCode(codeGenerator.generateSampleCode(result.endpoint, result.params));
    setLastApiResult(result);
  };

  return (
    <MonitoringLayout activeMenu="apimanage" onMenuChange={() => {}}>
      <div style={{ background: '#1e2139', minHeight: '100vh', padding: '1.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}>
          API 관리 및 테스트
        </h1>

        <div className="apimanage-container">
          <ApiResultSidebar 
            savedResults={savedResults}
            onLoadResult={handleLoadResult}
            onDeleteResult={handleDeleteResult}
          />

          <main className="apimanage-main">
            <ModelSelector 
              models={modelData.MODEL_LIST}
              selectedModel={selectedModel}
              onModelSelect={handleModelSelect}
            />

            <ModelInfo selectedModel={selectedModel} />

            <ApiTestForm 
              endpoint={apiEndpoint}
              params={apiParams}
              isLoading={isLoading}
              apiResult={apiResult}
              sampleCode={apiSampleCode}
              onSubmit={handleApiCall}
              onSave={handleSaveConfig}
              onEndpointChange={setApiEndpoint}
              onParamsChange={setApiParams}
            />
          </main>
        </div>
      </div>
    </MonitoringLayout>
  );
};

export default Apimanage;