import React, { useState, useRef, useCallback } from 'react';
import Layout from '../../components/Layout';
import CreateTopicModal from './CreateTopicModal';
import './Chat-styles.css';

const Chat = () => {
  const [topics, setTopics] = useState([]);
  const [messages, setMessages] = useState({});
  const [currentTopic, setCurrentTopic] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const messageInputRef = useRef(null);

  const models = [
    { id: 'GPT-5', name: 'GPT-5', description: 'OpenAI의 최신 모델로 뛰어난 성능과 긴 컨텍스트를 제공합니다.', tag: '추천', bgColor: 'bg-pink-100', textColor: 'text-pink-600', icon: '5' },
    { id: 'Claude-Sonnet-4', name: 'Claude-Sonnet-4', description: 'Anthropic의 균형잡힌 모델로 창의적이고 안전한 대화를 제공합니다.', tag: '추천', bgColor: 'bg-orange-100', textColor: 'text-orange-600', icon: 'C' },
    { id: 'GPT-4o', name: 'GPT-4o', description: '빠르고 효율적인 멀티모달 모델입니다.', tag: '빠름', bgColor: 'bg-teal-100', textColor: 'text-teal-600', icon: '4o' },
    { id: 'Gemini-2.5-Pro', name: 'Gemini-2.5-Pro', description: 'Google의 고성능 모델로 복잡한 추론에 강합니다.', tag: '고성능', bgColor: 'bg-blue-100', textColor: 'text-blue-600', icon: 'G' }
  ];

  const styles = [
    { id: 'style1', name: '공손하고 정중한 스타일', description: '전문적이고 예의바른 대화', value: '공손하고 정중하게 존댓말로 답변해주세요.' },
    { id: 'style2', name: '친근하고 편안한 스타일', description: '친구같이 편하고 솔직한 대화', value: '솔직하고 털털한 반말로 친구처럼 편하게 대화해줘.' },
    { id: 'style3', name: '따뜻하고 감성적인 스타일', description: '부드럽고 감성적인 대화', value: '귀엽고 감성적인 말투로 따뜻하게 대화해주세요.' },
    { id: 'style4', name: '전문적이고 논리적인 스타일', description: '체계적이고 분석적인 대화', value: '전문적이고 논리적으로 체계적인 답변을 해주세요.' }
  ];

  // 날짜 포맷 함수
  const formatDate = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    
    // 일주일 이상이면 실제 날짜 표시
    return date.toLocaleDateString('ko-KR', {
      year: '2-digit',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 메시지 평가 처리
  const handleMessageRating = (messageIndex, rating) => {
    if (!currentTopic) return;
    
    setMessages(prev => ({
      ...prev,
      [currentTopic.id]: prev[currentTopic.id].map((message, index) => 
        index === messageIndex ? { ...message, rating } : message
      )
    }));

    console.log(`메시지 ${messageIndex} 만족도: ${rating}`);
  };

  // 새 대화 생성 (입력된 메시지가 있으면 자동 전송)
  const handleCreateTopic = (topicData) => {
    const newTopic = {
      ...topicData,
      createdAt: new Date()
    };
    
    setTopics(prev => [newTopic, ...prev]);
    setMessages(prev => ({ ...prev, [newTopic.id]: [] }));
    setCurrentTopic(newTopic);
    setShowCreateModal(false);

    // 입력된 메시지가 있으면 자동으로 전송
    if (messageInput.trim()) {
      setTimeout(() => {
        const userMessage = {
          role: 'user',
          text: messageInput.trim(),
          timestamp: new Date()
        };

        const aiResponse = {
          role: 'assistant',
          text: `안녕하세요! ${newTopic.model || 'AI'} 모델로 답변드립니다. (Temperature: ${newTopic.temperature}, Top-P: ${newTopic.topP})\n\n"${messageInput.trim()}"에 대한 답변을 준비중입니다. 실제로는 선택하신 대화 스타일에 맞춰 응답하게 됩니다.`,
          timestamp: new Date(),
          rating: null
        };

        setMessages(prev => ({
          ...prev,
          [newTopic.id]: [userMessage, aiResponse]
        }));

        setMessageInput('');
      }, 100);
    }
  };

  // 대화 선택
  const selectTopic = (topic) => {
    if (currentTopic?.id === topic.id) return;
    setCurrentTopic(topic);
  };

  // 모델 변경
  const changeModel = (modelName) => {
    if (currentTopic) {
      setCurrentTopic(prev => ({ ...prev, model: modelName }));
      setTopics(prev => prev.map(topic => 
        topic.id === currentTopic.id ? { ...topic, model: modelName } : topic
      ));
    }
    setShowModelModal(false);
  };

  // 스타일 변경
  const changeStyle = (styleValue) => {
    if (currentTopic) {
      setCurrentTopic(prev => ({ ...prev, style: styleValue }));
      setTopics(prev => prev.map(topic => 
        topic.id === currentTopic.id ? { ...topic, style: styleValue } : topic
      ));
    }
    setShowStyleModal(false);
  };

  // 메시지 전송 (대화가 없으면 새 대화 생성 모달 표시)
  const sendMessage = () => {
    if (!messageInput.trim()) return;
    
    // 현재 대화가 없으면 새 대화 생성 모달 표시
    if (!currentTopic) {
      setShowCreateModal(true);
      return;
    }

    const userMessage = {
      role: 'user',
      text: messageInput.trim(),
      timestamp: new Date()
    };

    const aiResponse = {
      role: 'assistant',
      text: `안녕하세요! ${currentTopic.model || 'AI'} 모델로 답변드립니다. (Temperature: ${currentTopic.temperature}, Top-P: ${currentTopic.topP})\n\n"${messageInput.trim()}"에 대한 답변을 준비중입니다. 실제로는 선택하신 대화 스타일에 맞춰 응답하게 됩니다.`,
      timestamp: new Date(),
      rating: null
    };

    setMessages(prev => ({
      ...prev,
      [currentTopic.id]: [...(prev[currentTopic.id] || []), userMessage, aiResponse]
    }));

    setMessageInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 입력창 포커스 시 대화 확인
  const handleInputFocus = () => {
    if (!currentTopic) {
      setShowCreateModal(true);
    }
  };
  
  const useSuggestedPrompt = () => {
    setMessageInput(currentTopic.prompt);
    messageInputRef.current?.focus();
  };

  // 만족도 평가 컴포넌트
  const MessageRating = ({ messageIndex, currentRating }) => {
    const ratings = [
      { value: '매우만족', label: '매우만족', emoji: '😊', color: '#22c55e' },
      { value: '만족', label: '만족', emoji: '🙂', color: '#3b82f6' },
      { value: '보통', label: '보통', emoji: '😐', color: '#f59e0b' },
      { value: '불만족', label: '불만족', emoji: '😕', color: '#f97316' },
      { value: '매우불만족', label: '매우불만족', emoji: '😞', color: '#ef4444' }
    ];

    // 평가가 완료된 경우
    if (currentRating) {
      const selectedRating = ratings.find(r => r.value === currentRating);
      return (
        <div className="message-rating-completed">
          <div className="rating-completed-content">
            <div className="rating-selected-item" style={{ color: selectedRating.color }}>
              <span className="rating-emoji-completed">{selectedRating.emoji}</span>
              <span className="rating-label-completed">{selectedRating.label}</span>
            </div>
            <div className="rating-check-mark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>평가완료</span>
            </div>
          </div>
        </div>
      );
    }

    // 평가 전 상태
    return (
      <div className="message-rating-inline">
        <span className="rating-title-inline">이 답변이 도움이 되었나요?</span>
        <div className="rating-options-inline">
          {ratings.map((rating) => (
            <label 
              key={rating.value}
              className="rating-option-inline"
              title={rating.label}
            >
              <input
                type="radio"
                name={`rating-${messageIndex}`}
                value={rating.value}
                onChange={() => handleMessageRating(messageIndex, rating.value)}
                className="rating-radio"
              />
              <div className="rating-item-content">
                <span className="rating-emoji-inline">{rating.emoji}</span>
                <span className="rating-label-inline">{rating.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout 
      title="Neo AI Portal"
      subtitle="AI 대화형 인터페이스 시스템"
      environment="Production"
      showNavigation={true}
    >
      <div className="page Chat">
        <div className="chat-container">
          
          {/* 왼쪽 사이드바 */}
          <div className="chat-sidebar">
            {/* 헤더 */}
            <div className="chat-sidebar-header">
              <div className="chat-sidebar-title">
                <h1 className="chat-title">AI Chat</h1>
              </div>
              
              {/* 새 대화 생성 버튼 */}
              <button 
                onClick={() => setShowCreateModal(true)}
                className="create-topic-btn"
              >
                새 대화 생성
              </button>
            </div>
            
            {/* 대화 목록 */}
            <div className="chat-topics-container">
              <div className="topics-wrapper">
                <div className="topics-header">최근 대화</div>
                <div className="topics-list scrollbar-hide">
                  {topics.map((topic) => (
                    <div 
                      key={topic.id}
                      onClick={() => selectTopic(topic)}
                      className={`topic-item ${currentTopic?.id === topic.id ? 'active' : ''}`}
                    >
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem'}}>
                        <div className="topic-name" style={{flex: 1, marginRight: '0.5rem'}}>{topic.name}</div>
                        <div style={{fontSize: '0.75rem', color: '#9ca3af', flexShrink: 0}}>
                          {formatDate(topic.createdAt)}
                        </div>
                      </div>
                      <div className="topic-model">{topic.model || 'No model'}</div>
                      <div className="topic-params">Temp: {topic.temperature}, Top-P: {topic.topP}</div>
                      <div className="topic-id">{topic.id}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 하단 설정 */}
            <div className="sidebar-footer">
              <button className="settings-btn">
                <svg style={{width: '1.25rem', height: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span style={{fontSize: '0.875rem'}}>설정</span>
              </button>
            </div>
          </div>

          {/* 메인 채팅 영역 */}
          <div className="chat-main">
            
            {/* 상단 헤더 */}
            <div className="chat-header">
              <div className="chat-header-left">
                <div className="chat-bot-icon">
                  <span className="chat-bot-icon-text">AI</span>
                </div>
                <div>
                  <div className="chat-bot-name">{currentTopic?.name || 'AI Assistant'}</div>
                  <div className="chat-bot-model">{currentTopic?.model || '모델을 선택하세요'}</div>
                </div>
              </div>
              
              <div className="chat-header-buttons">
                <button 
                  onClick={() => setShowModelModal(true)}
                  className="header-btn"
                >
                  모델 변경
                </button>
                <button 
                  onClick={() => setShowStyleModal(true)}
                  className="header-btn"
                >
                  스타일 변경
                </button>
              </div>
            </div>

            {/* 채팅 메시지 영역 */}
            <div className="chat-messages-container">
              {!currentTopic ? (
                /* 빈 상태 */
                <div className="empty-state">
                  <div className="empty-state-content">
                    <div className="empty-state-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l3.529-3.529A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                      </svg>
                    </div>
                    <h3 className="empty-state-title">새로운 대화를 시작해보세요</h3>
                    <p className="empty-state-text">AI와 함께 궁금한 것들을 대화해보세요.</p>
                  </div>
                </div>
              ) : (
                /* 메시지 목록 */
                <div className="messages-list scrollbar-hide">
                  <div className="messages-content">
                    {messages[currentTopic.id]?.map((message, index) => (
                      <div key={index} className="message-item">
                        {message.role === 'user' ? (
                          <>
                            <div className="message-avatar user-avatar">
                              <span className="user-avatar-text">U</span>
                            </div>
                            <div className="message-content">
                              <div className="message-sender">You</div>
                              <div className="message-text">{message.text}</div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="message-avatar ai-avatar">
                              <span className="ai-avatar-text">AI</span>
                            </div>
                            <div className="message-content">
                              <div className="message-sender">{currentTopic.model || 'AI'}</div>
                              <div className="message-text">{message.text}</div>
                              
                              {/* AI 메시지 아래에 만족도 평가 추가 */}
                              <MessageRating 
                                messageIndex={index}
                                currentRating={message.rating}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 메시지 입력 영역 */}
            <div className="chat-input-container">
              <div className="chat-input-wrapper">
                {/* 추천 프롬프트 */}
                {currentTopic?.prompt && !messages[currentTopic.id]?.length && (
                  <div className="suggested-prompt-container">
                    <button 
                      onClick={useSuggestedPrompt}
                      className="suggested-prompt-btn"
                    >
                      {currentTopic.prompt}
                    </button>
                  </div>
                )}
                
                <div className="input-row">
                  <div className="input-wrapper">
                    <textarea 
                      ref={messageInputRef}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      onFocus={handleInputFocus}
                      onClick={handleInputFocus}
                      placeholder="메시지를 입력하세요..."
                      className="message-input"
                      rows={1}
                      onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                      }}
                    />
                    <button 
                      onClick={sendMessage}
                      disabled={!messageInput.trim()}
                      className={`send-btn ${messageInput.trim() ? 'active' : 'inactive'}`}
                    >
                      <svg style={{width: '1.25rem', height: '1.25rem'}} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 분리된 컴포넌트들 */}
          <CreateTopicModal 
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onConfirm={handleCreateTopic}
          />

          {/* 모델 변경 모달 */}
          {showModelModal && (
            <div className="modal-overlay z-50" onClick={() => setShowModelModal(false)}>
              <div className="modal-container model-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <h3 className="modal-title">AI 모델 선택</h3>
                    <button onClick={() => setShowModelModal(false)} className="modal-close-btn">
                      <svg style={{width: '1.5rem', height: '1.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      onClick={() => changeModel(model.name)}
                    >
                      <div className={`model-icon ${model.bgColor}`}>
                        <span className={`${model.textColor} font-bold`}>{model.icon}</span>
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

          {/* 스타일 변경 모달 */}
          {showStyleModal && (
            <div className="modal-overlay z-50" onClick={() => setShowStyleModal(false)}>
              <div className="modal-container style-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <h3 className="modal-title">대화 스타일 선택</h3>
                    <button onClick={() => setShowStyleModal(false)} className="modal-close-btn">
                      <svg style={{width: '1.5rem', height: '1.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        onClick={() => changeStyle(style.value)}
                      >
                        <input 
                          type="radio" 
                          id={style.id}
                          name="chatStyle" 
                          value={style.value}
                          checked={currentTopic?.style === style.value}
                          readOnly
                          className="style-radio"
                        />
                        <label htmlFor={style.id} className="style-label">
                          <div className="style-name">{style.name}</div>
                          <div className="style-description">{style.description}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="modal-footer">
                  <div className="modal-footer-buttons">
                    <button onClick={() => setShowStyleModal(false)} className="modal-btn-cancel">
                      취소
                    </button>
                    <button onClick={() => setShowStyleModal(false)} className="modal-btn-primary">
                      적용
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Chat;