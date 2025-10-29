import React, { useState, useEffect } from 'react';
import './Chat-styles.css';

function generateRandomId(length = 20) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({length}, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

const AlertModal = ({ show, onHide, title, message, variant = 'danger' }) => {
  if (!show) return null;

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <div style={{width: '48px', height: '48px', color: '#22c55e', marginBottom: '12px', fontSize: '48px'}}>✓</div>;
      case 'info':
        return <div style={{width: '48px', height: '48px', color: '#3b82f6', marginBottom: '12px', fontSize: '48px'}}>ℹ</div>;
      default:
        return <div style={{width: '48px', height: '48px', color: '#ef4444', marginBottom: '12px', fontSize: '48px'}}>⚠</div>;
    }
  };

  const getButtonColor = () => {
    switch (variant) {
      case 'success':
        return 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
      case 'info':
        return 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)';
      default:
        return 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)';
    }
  };

  return (
    <div className="modal-overlay" style={{zIndex: 80}} onClick={onHide}>
      <div 
        className="modal-container" 
        style={{
          width: '400px',
          background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.98) 0%, rgba(54, 61, 90, 0.98) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{padding: '1.5rem', textAlign: 'center'}}>
          {getIcon()}
          <h5 style={{fontWeight: 'bold', marginBottom: '12px', fontSize: '1.125rem', color: '#fff'}}>{title}</h5>
          <p style={{color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem', fontSize: '0.875rem'}}>{message}</p>
          <button 
            onClick={onHide}
            style={{ 
              padding: '8px 16px',
              borderRadius: '12px',
              background: getButtonColor(),
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

const ConversationGeneration = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    topicName: '',
    model: '',
    temperature: '0.7',
    topP: '0.9',
    style: '공손하고 정중하게 존댓말로 답변해주세요.',
    useCustomStyle: false, // 커스텀 스타일 사용 여부
    globalInstruction: '', // 전체 대화 지침 (커스텀 스타일)
    prompts: [], // 시작 질문들 (배열)
    currentPrompt: '', // 현재 입력 중인 시작 질문
    customTemperature: '',
    customTopP: ''
  });
  const [topicKey, setTopicKey] = useState('');
  const [showModelModal, setShowModelModal] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger'
  });

  useEffect(() => {
    if (isOpen) {
      setTopicKey(generateRandomId());
    }
  }, [isOpen]);

  const showNotification = (title, message, variant = 'danger') => {
    setAlertConfig({ title, message, variant });
    setShowAlert(true);
  };

  const models = [
    { id: 'GPT-5', name: 'GPT-5', description: 'OpenAI의 최신 모델로 뛰어난 성능과 긴 컨텍스트를 제공합니다.', tag: '추천', bgColor: 'rgba(219, 39, 119, 0.2)', textColor: '#db2777', icon: '5' },
    { id: 'Claude-Sonnet-4', name: 'Claude-Sonnet-4', description: 'Anthropic의 균형잡힌 모델로 창의적이고 안전한 대화를 제공합니다.', tag: '추천', bgColor: 'rgba(249, 115, 22, 0.2)', textColor: '#f97316', icon: 'C' },
    { id: 'GPT-4o', name: 'GPT-4o', description: '빠르고 효율적인 멀티모달 모델입니다.', tag: '빠름', bgColor: 'rgba(13, 148, 136, 0.2)', textColor: '#0d9488', icon: '4o' },
    { id: 'Gemini-2.5-Pro', name: 'Gemini-2.5-Pro', description: 'Google의 고성능 모델로 복잡한 추론에 강합니다.', tag: '고성능', bgColor: 'rgba(59, 130, 246, 0.2)', textColor: '#3b82f6', icon: 'G' }
  ];

  const styles = [
    { id: 'style1', name: '공손하고 정중한 스타일', description: '전문적이고 예의바른 대화', value: '공손하고 정중하게 존댓말로 답변해주세요.' },
    { id: 'style2', name: '친근하고 편안한 스타일', description: '친구같이 편하고 솔직한 대화', value: '솔직하고 털털한 반말로 친구처럼 편하게 대화해줘.' },
    { id: 'style3', name: '따뜻하고 감성적인 스타일', description: '부드럽고 감성적인 대화', value: '귀엽고 감성적인 말투로 따뜻하게 대화해주세요.' },
    { id: 'style4', name: '전문적이고 논리적인 스타일', description: '체계적이고 분석적인 대화', value: '전문적이고 논리적으로 체계적인 답변을 해주세요.' }
  ];

  const validateForm = () => {
    if (!formData.topicName.trim()) {
      showNotification('입력 오류', '대화 주제를 입력해주세요.', 'danger');
      return false;
    }
    
    if (!formData.model) {
      showNotification('모델 선택 오류', 'AI 모델을 선택해주세요.', 'danger');
      return false;
    }

    if (formData.prompts.length === 0) {
      showNotification('입력 오류', '최소 1개 이상의 시작 질문을 추가해주세요.', 'danger');
      return false;
    }

    // 커스텀 스타일 선택 시 전체 대화 지침 입력 확인
    if (formData.useCustomStyle && !formData.globalInstruction.trim()) {
      showNotification('입력 오류', '전체 대화 지침을 입력해주세요.', 'danger');
      return false;
    }

    if (formData.temperature === 'custom') {
      const tempValue = parseFloat(formData.customTemperature);
      if (isNaN(tempValue) || tempValue < 0 || tempValue > 2) {
        showNotification('Temperature 오류', 'Temperature 값은 0.0 ~ 2.0 사이의 숫자를 입력해주세요.', 'danger');
        return false;
      }
    }

    if (formData.topP === 'custom') {
      const topPValue = parseFloat(formData.customTopP);
      if (isNaN(topPValue) || topPValue < 0 || topPValue > 1) {
        showNotification('Top-P 오류', 'Top-P 값은 0.0 ~ 1.0 사이의 숫자를 입력해주세요.', 'danger');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    let temperature = parseFloat(formData.temperature);
    if (formData.temperature === 'custom') {
      temperature = parseFloat(formData.customTemperature) || 0.7;
    }

    let topP = parseFloat(formData.topP);
    if (formData.topP === 'custom') {
      topP = parseFloat(formData.customTopP) || 0.9;
    }

    // 커스텀 스타일 사용 여부에 따라 스타일 값 결정
    const finalStyle = formData.useCustomStyle ? formData.globalInstruction : formData.style;

    onConfirm({
      id: topicKey,
      name: formData.topicName,
      model: formData.model,
      temperature,
      topP,
      style: finalStyle,
      prompts: formData.prompts,
      createdAt: new Date()
    });

    setFormData({
      topicName: '',
      model: '',
      temperature: '0.7',
      topP: '0.9',
      style: '공손하고 정중하게 존댓말로 답변해주세요.',
      useCustomStyle: false,
      globalInstruction: '',
      prompts: [],
      currentPrompt: '',
      customTemperature: '',
      customTopP: ''
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <AlertModal 
        show={showAlert}
        onHide={() => setShowAlert(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        variant={alertConfig.variant}
      />

      <div className="modal-overlay z-50" onClick={onClose}>
        <div className="modal-container create-topic-modal dark-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">새 대화 설정</h3>
          </div>
          
          <div className="modal-body create-modal-body">
            <div className="form-group">
              <label className="form-label">대화 주제 입력 <span style={{color: '#ef4444'}}>*</span></label>
              <input 
                type="text" 
                placeholder="예: Python 프로그래밍, 건강한 식습관, 여행 계획 등"
                className="form-input"
                value={formData.topicName}
                onChange={(e) => setFormData({...formData, topicName: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">AI 모델 <span style={{color: '#ef4444'}}>*</span></label>
              <div className="input-with-icon">
                <input 
                  type="text" 
                  placeholder="모델을 선택해주세요" 
                  readOnly
                  className="form-input readonly"
                  value={formData.model}
                  onClick={() => setShowModelModal(true)}
                />
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">창의성/다양성</label>
                <select 
                  className="form-select"
                  value={formData.temperature}
                  onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                >
                  <option value="0.1">정확한 답변 - Temp: 0.1</option>
                  <option value="0.3">일관적인 답변 - Temp: 0.3</option>
                  <option value="0.7">균형잡힌 대화 - Temp: 0.7</option>
                  <option value="0.9">창의적 답변 - Temp: 0.9</option>
                  <option value="1.0">매우 창의적 - Temp: 1.0</option>
                  <option value="custom">직접 입력</option>
                </select>
                {formData.temperature === 'custom' && (
                  <input 
                    type="number" 
                    min="0" 
                    max="2" 
                    step="0.1" 
                    placeholder="0.0 ~ 2.0"
                    className="form-input mt-2"
                    value={formData.customTemperature}
                    onChange={(e) => setFormData({...formData, customTemperature: e.target.value})}
                  />
                )}
              </div>
              <div className="form-group">
                <label className="form-label">응답 품질</label>
                <select 
                  className="form-select"
                  value={formData.topP}
                  onChange={(e) => setFormData({...formData, topP: e.target.value})}
                >
                  <option value="0.5">매우 집중적 - Top-P: 0.5</option>
                  <option value="0.7">집중적 답변 - Top-P: 0.7</option>
                  <option value="0.9">균형잡힌 품질 - Top-P: 0.9</option>
                  <option value="1.0">모든 가능성 고려 - Top-P: 1.0</option>
                  <option value="custom">직접 입력</option>
                </select>
                {formData.topP === 'custom' && (
                  <input 
                    type="number" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    placeholder="0.0 ~ 1.0"
                    className="form-input mt-2"
                    value={formData.customTopP}
                    onChange={(e) => setFormData({...formData, customTopP: e.target.value})}
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">대화 스타일</label>
              <div className="input-with-icon">
                <div 
                  className="form-input readonly"
                  onClick={() => setShowStyleModal(true)}
                  style={{
                    cursor: 'pointer',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    minHeight: '2.5rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {formData.useCustomStyle 
                    ? (formData.globalInstruction || '전체 대화 지침 (미입력)')
                    : (styles.find(s => s.value === formData.style)?.name || '스타일을 선택해주세요')
                  }
                </div>
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">시작 질문 <span style={{color: '#ef4444'}}>*</span></label>
              <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.75rem'}}>
                <input 
                  type="text" 
                  placeholder="예: 이 주제에 대해 초보자도 알기 쉽게 설명해줘"
                  className="form-input"
                  value={formData.currentPrompt}
                  onChange={(e) => setFormData({...formData, currentPrompt: e.target.value})}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && formData.currentPrompt.trim()) {
                      setFormData({
                        ...formData,
                        prompts: [...formData.prompts, formData.currentPrompt.trim()],
                        currentPrompt: ''
                      });
                    }
                  }}
                  style={{flex: 1}}
                />
                <button 
                  type="button"
                  onClick={() => {
                    if (formData.currentPrompt.trim()) {
                      setFormData({
                        ...formData,
                        prompts: [...formData.prompts, formData.currentPrompt.trim()],
                        currentPrompt: ''
                      });
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  추가
                </button>
              </div>
              {formData.prompts.length > 0 && (
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                  {formData.prompts.map((prompt, index) => (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '1rem',
                        fontSize: '0.875rem',
                        color: '#2c3e50'
                      }}
                    >
                      <span>{prompt}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            prompts: formData.prompts.filter((_, i) => i !== index)
                          });
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(239, 68, 68, 0.8)',
                          cursor: 'pointer',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.color = '#ef4444'}
                        onMouseOut={(e) => e.target.style.color = 'rgba(239, 68, 68, 0.8)'}
                      >
                        <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">대화 Key (자동생성)</label>
              <div className="key-display">
                {topicKey}
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <div className="modal-footer-buttons">
              <button onClick={onClose} className="modal-btn-cancel">
                취소
              </button>
              <button onClick={handleSubmit} className="modal-btn-primary">
                대화 생성
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModelModal && (
        <div className="modal-overlay z-70" onClick={() => setShowModelModal(false)}>
          <div className="modal-container model-modal dark-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h3 className="modal-title">AI 모델 선택</h3>
                <button onClick={() => setShowModelModal(false)} className="modal-close-btn">
                  <svg style={{width: '24px', height: '24px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="model-list">
              {models.map((model) => (
                <div 
                  key={model.id}
                  className="model-item"
                  onClick={() => {
                    setFormData({...formData, model: model.name});
                    setShowModelModal(false);
                  }}
                >
                  <div className="model-icon" style={{background: model.bgColor}}>
                    <span style={{color: model.textColor, fontWeight: 'bold'}}>{model.icon}</span>
                  </div>
                  <div className="model-content">
                    <h4 className="model-name">{model.name}</h4>
                    <p className="model-description">{model.description}</p>
                    <span className="model-tag">{model.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showStyleModal && (
        <div className="modal-overlay z-70" onClick={() => setShowStyleModal(false)}>
          <div className="modal-container style-modal dark-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h3 className="modal-title">대화 스타일 선택</h3>
                <button onClick={() => setShowStyleModal(false)} className="modal-close-btn">
                  <svg style={{width: '24px', height: '24px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="style-list">
                {styles.map((style) => (
                  <div 
                    key={style.id} 
                    className="style-item"
                    onClick={() => setFormData({...formData, style: style.value, useCustomStyle: false})}
                  >
                    <input 
                      type="radio" 
                      id={style.id}
                      name="chatStyle" 
                      value={style.value}
                      checked={!formData.useCustomStyle && formData.style === style.value}
                      onChange={() => setFormData({...formData, style: style.value, useCustomStyle: false})}
                      className="style-radio"
                    />
                    <label htmlFor={style.id} className="style-label">
                      <div className="style-name">{style.name}</div>
                      <div className="style-description">{style.description}</div>
                    </label>
                  </div>
                ))}

                {/* 전체 대화 지침 라디오 버튼 */}
                <div 
                  className="style-item"
                  onClick={() => setFormData({...formData, useCustomStyle: true})}
                >
                  <input 
                    type="radio" 
                    id="customStyle"
                    name="chatStyle" 
                    checked={formData.useCustomStyle}
                    onChange={() => setFormData({...formData, useCustomStyle: true})}
                    className="style-radio"
                  />
                  <label htmlFor="customStyle" className="style-label">
                    <div className="style-name">전체 대화 지침</div>
                    <div className="style-description">직접 입력</div>
                  </label>
                </div>
              </div>

              {/* 전체 대화 지침 텍스트 입력 - 항상 표시하되 활성화/비활성화 */}
              <div className="global-instruction-section" style={{ marginTop: '1rem' }}>
                <textarea 
                  placeholder="대화 전체에 적용할 지침을 입력하세요"
                  className={`form-input global-instruction-textarea ${!formData.useCustomStyle ? 'disabled' : ''}`}
                  value={formData.globalInstruction}
                  onChange={(e) => setFormData({...formData, globalInstruction: e.target.value})}
                  disabled={!formData.useCustomStyle}
                  rows={3}
                  style={{
                    resize: 'vertical',
                    minHeight: '4.5rem',
                    fontFamily: 'inherit',
                    lineHeight: '1.5'
                    
                  }}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <div className="modal-footer-buttons">
                <button onClick={() => setShowStyleModal(false)} className="modal-btn-cancel">
                  취소
                </button>
                <button 
                  onClick={() => {
                    // 전체 대화 지침이 선택되어 있는데 입력값이 없으면 경고
                    if (formData.useCustomStyle && !formData.globalInstruction.trim()) {
                      showNotification('입력 오류', '전체 대화 지침을 입력해주세요.', 'danger');
                      return;
                    }
                    setShowStyleModal(false);
                  }} 
                  className="modal-btn-primary"
                >
                  적용
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConversationGeneration;