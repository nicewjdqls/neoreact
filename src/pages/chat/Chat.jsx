import React, { useState, useRef } from 'react';
import MonitoringLayout from '../../components/MonitoringLayout';
import ConversationGeneration from './ConversationGeneration';
import MessageSatisfaction from './MessageSatisfaction';
import QuickReplyButtons from './QuickReplyButtons';
import FileAttachment from './FileAttachment';
import './Chat-styles.css';

// 알림 모달 컴포넌트
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

// 확인 모달 컴포넌트
const ConfirmModal = ({ show, onHide, onConfirm, title, message }) => {
  if (!show) return null;

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
          <div style={{width: '48px', height: '48px', color: '#f59e0b', marginBottom: '12px', fontSize: '48px', margin: '0 auto 12px'}}>⚠</div>
          <h5 style={{fontWeight: 'bold', marginBottom: '12px', fontSize: '1.125rem', color: '#fff'}}>{title}</h5>
          <p style={{color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem', fontSize: '0.875rem'}}>{message}</p>
          <div style={{display: 'flex', gap: '0.75rem', justifyContent: 'center'}}>
            <button 
              onClick={onHide}
              style={{ 
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              취소
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onHide();
              }}
              style={{ 
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
              }}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  const [topics, setTopics] = useState([]);
  const [messages, setMessages] = useState({});
  const [currentTopic, setCurrentTopic] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]); // 파일 state 추가
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTopicId, setDeleteTopicId] = useState(null);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger'
  });
  
  // 스타일 모달용 state
  const [tempStyleData, setTempStyleData] = useState({
    useCustomStyle: false,
    customStyle: '',
    selectedStyle: ''
  });
  
  const messageInputRef = useRef(null);

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
    return date.toLocaleDateString('ko-KR');
  };

  const handleMessageRating = (messageIndex, rating) => {
    if (!currentTopic) return;

    setMessages(prev => {
      const topicMessages = [...(prev[currentTopic.id] || [])];
      if (topicMessages[messageIndex]) {
        topicMessages[messageIndex] = {
          ...topicMessages[messageIndex],
          rating: rating
        };
      }
      return {
        ...prev,
        [currentTopic.id]: topicMessages
      };
    });
  };

  // 환영 메시지 생성 함수
  const createWelcomeMessage = () => {
    return {
      role: 'assistant',
      text: '안녕하세요! 👋\n\n무엇을 도와드릴까요? 아래 질문을 선택하시거나 대화창에 직접 입력해 주세요.',
      isWelcome: true // 환영 메시지 플래그
    };
  };

  const handleCreateTopic = (topicData) => {
    const newTopic = {
      ...topicData,
      useCustomStyle: topicData.style !== '공손하고 정중하게 존댓말로 답변해주세요.' &&
                     topicData.style !== '솔직하고 털털한 반말로 친구처럼 편하게 대화해줘.' &&
                     topicData.style !== '귀엽고 감성적인 말투로 따뜻하게 대화해주세요.' &&
                     topicData.style !== '전문적이고 논리적으로 체계적인 답변을 해주세요.'
    };
    
    setTopics(prev => [...prev, newTopic]);
    setCurrentTopic(newTopic);
    
    // 환영 메시지 추가
    const welcomeMessage = createWelcomeMessage();
    setMessages(prev => ({
      ...prev,
      [newTopic.id]: [welcomeMessage]
    }));
    
    setShowCreateModal(false);
    showNotification('성공', '새로운 대화가 생성되었습니다.', 'success');
  };

  // Topic 선택 핸들러 - 환영 메시지가 없으면 추가
  const handleTopicSelect = (topic) => {
    setCurrentTopic(topic);
    
    // 해당 topic의 메시지가 없거나 비어있으면 환영 메시지 추가
    setMessages(prev => {
      const topicMessages = prev[topic.id] || [];
      if (topicMessages.length === 0) {
        return {
          ...prev,
          [topic.id]: [createWelcomeMessage()]
        };
      }
      return prev;
    });
  };

  const changeModel = (modelName) => {
    if (!currentTopic) return;
    
    const updatedTopic = { ...currentTopic, model: modelName };
    setCurrentTopic(updatedTopic);
    setTopics(prev => prev.map(t => t.id === currentTopic.id ? updatedTopic : t));
    setShowModelModal(false);
    showNotification('성공', `AI 모델이 ${modelName}(으)로 변경되었습니다.`, 'success');
  };

  const changeStyle = (styleValue, isCustom = false) => {
    if (!currentTopic) return;
    
    const updatedTopic = { 
      ...currentTopic, 
      style: styleValue,
      useCustomStyle: isCustom
    };
    setCurrentTopic(updatedTopic);
    setTopics(prev => prev.map(t => t.id === currentTopic.id ? updatedTopic : t));
  };
  
  const openStyleModal = () => {
    if (!currentTopic) return;
    
    // 현재 토픽의 스타일 정보로 초기화
    const isCustom = currentTopic.useCustomStyle || !styles.find(s => s.value === currentTopic.style);
    setTempStyleData({
      useCustomStyle: isCustom,
      customStyle: isCustom ? currentTopic.style : '',
      selectedStyle: isCustom ? '' : currentTopic.style
    });
    setShowStyleModal(true);
  };
  
  const applyStyleChange = () => {
    if (tempStyleData.useCustomStyle && !tempStyleData.customStyle.trim()) {
      showNotification('입력 오류', '전체 대화 지침을 입력해주세요.', 'danger');
      return;
    }
    
    const finalStyle = tempStyleData.useCustomStyle ? tempStyleData.customStyle : tempStyleData.selectedStyle;
    changeStyle(finalStyle, tempStyleData.useCustomStyle);
    setShowStyleModal(false);
    
    const styleName = tempStyleData.useCustomStyle ? '커스텀 스타일' : styles.find(s => s.value === tempStyleData.selectedStyle)?.name;
    showNotification('성공', `대화 스타일이 "${styleName}"(으)로 변경되었습니다.`, 'success');
  };

  const deleteTopic = (topicId) => {
    setTopics(prev => prev.filter(t => t.id !== topicId));
    if (currentTopic?.id === topicId) {
      setCurrentTopic(null);
    }
    const newMessages = { ...messages };
    delete newMessages[topicId];
    setMessages(newMessages);
  };

  const confirmDelete = (topicId) => {
    setDeleteTopicId(topicId);
    setShowConfirm(true);
  };

  const sendMessage = () => {
    if ((!messageInput.trim() && selectedFiles.length === 0) || !currentTopic) return;

    const userMessage = { role: 'user', text: messageInput, files: [...selectedFiles] };
    const aiMessage = { 
      role: 'assistant', 
      text: `${messageInput}에 대한 응답입니다. (Temperature: ${currentTopic.temperature}, Top-P: ${currentTopic.topP}, Style: ${currentTopic.style})` 
    };

    setMessages(prev => ({
      ...prev,
      [currentTopic.id]: [...(prev[currentTopic.id] || []), userMessage, aiMessage]
    }));

    setMessageInput('');
    setSelectedFiles([]); // 파일 목록 초기화
    
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputFocus = () => {
    setTimeout(() => {
      if (messageInputRef.current) {
        const scrollContainer = messageInputRef.current.closest('.messages-list');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, 100);
  };

  const useSuggestedPrompt = () => {
    if (currentTopic?.prompt) {
      setMessageInput(currentTopic.prompt);
      setTimeout(() => {
        sendMessage();
      }, 100);
    }
  };

  // 대화 스타일을 사용자 친화적으로 표시
  const getStyleDisplayName = () => {
    if (!currentTopic) return '';
    
    if (currentTopic.useCustomStyle) {
      return currentTopic.style; // 커스텀 스타일은 전체 텍스트 표시
    }
    
    // 미리 정의된 스타일 찾기
    const foundStyle = styles.find(s => s.value === currentTopic.style);
    return foundStyle ? foundStyle.name : currentTopic.style;
  };

  return (
    <MonitoringLayout>
      <div className="dark-theme">
        <div className="page">
          <div className="Chat">
          <div className="chat-container">
            <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <div className="chat-sidebar-title">
                <h2 className="chat-title">대화 목록</h2>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="create-topic-btn"
              >
                + 새 대화 생성
              </button>
            </div>

            <div className="chat-topics-container">
              <div className="topics-wrapper">
                <div className="topics-header">최근 대화</div>
                <div className="topics-list scrollbar-hide">
                  {topics.map((topic) => (
                    <div 
                      key={topic.id}
                      className={`topic-item ${currentTopic?.id === topic.id ? 'active' : ''}`}
                      onClick={() => handleTopicSelect(topic)}
                    >
                      <div style={{flex: 1, minWidth: 0}}>
                        <div className="topic-name">{topic.name}</div>
                        <div className="topic-model">🤖 {topic.model}</div>
                        <div className="topic-params">
                          T: {topic.temperature} • P: {topic.topP}
                        </div>
                        <div className="topic-id">#{topic.id.substring(0, 8)}</div>
                      </div>
                      <button
                        className="delete-topic-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(topic.id);
                        }}
                      >
                        <svg style={{width: '1.25rem', height: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sidebar-footer">
              <button className="settings-btn">
                <svg style={{width: '1.25rem', height: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>설정</span>
              </button>
            </div>
          </div>

          <div className="chat-main">
            <div className="chat-header">
              {currentTopic ? (
                <>
                  <div className="chat-header-left">
                    <div className="chat-bot-icon">
                      <span className="chat-bot-icon-text">🤖</span>
                    </div>
                    <div>
                      <div className="chat-bot-name">{currentTopic.name}</div>
                      <div className="chat-bot-model">{currentTopic.model}</div>
                    </div>
                  </div>
                  <div className="chat-header-buttons">
                    <button 
                      className="header-btn"
                      onClick={() => setShowModelModal(true)}
                    >
                      모델 변경
                    </button>
                    <button 
                      className="header-btn"
                      onClick={openStyleModal}
                    >
                      스타일 변경
                    </button>
                  </div>
                </>
              ) : (
                <div className="chat-header-left">
                  <div className="chat-bot-name">대화를 선택해주세요</div>
                </div>
              )}
            </div>

            <div className="chat-messages-container">
              {!currentTopic ? (
                <div className="empty-state">
                  <div className="empty-state-content">
                    <div className="empty-state-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="empty-state-title">새로운 대화를 시작해보세요</h3>
                    <p className="empty-state-text">AI와 함께 궁금한 것들을 대화해보세요.</p>
                  </div>
                </div>
              ) : (
                <div className="messages-list scrollbar-hide">
                  <div className="messages-content">
                    {(messages[currentTopic.id] || []).map((message, index) => (
                      <React.Fragment key={index}>
                        <div className={`message-item ${message.role === 'user' ? 'user-message' : 'ai-message'}`}>
                          {message.role === 'user' ? (
                            <>
                              <div className="message-content">
                                <div className="message-sender">나</div>
                                <div className="message-text">{String(message.text)}</div>
                                {message.files && message.files.length > 0 && (
                                  <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem',
                                    marginTop: '0.5rem'
                                  }}>
                                    {message.files.map((file, idx) => (
                                      <div key={idx} style={{
                                        padding: '0.5rem 0.75rem',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        borderRadius: '0.5rem',
                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                        fontSize: '0.875rem',
                                        color: '#e0e7ff'
                                      }}>
                                        {file.type.startsWith('image/') ? (
                                          <img src={file.url} alt={file.name} style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '0.375rem' }} />
                                        ) : (
                                          <span>📎 {file.name}</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="message-avatar user-avatar">
                                <span className="user-avatar-text">👤</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="message-avatar ai-avatar">
                                <span className="ai-avatar-text">🤖</span>
                              </div>
                              <div className="message-content">
                                <div className="message-sender">{currentTopic.model || 'AI'}</div>
                                <div className="message-text" style={{ whiteSpace: 'pre-wrap' }}>{String(message.text)}</div>
                                
                                {/* 환영 메시지가 아닌 경우에만 만족도 평가 표시 */}
                                {!message.isWelcome && (
                                  <MessageSatisfaction 
                                    messageIndex={index}
                                    currentRating={message.rating}
                                    onRate={handleMessageRating}
                                  />
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        
                        {/* AI 메시지 아래에 QuickReplyButtons 표시 - 왼쪽 정렬 */}
                        {message.role === 'assistant' && currentTopic?.prompts?.length > 0 && (
                          <div style={{ marginBottom: '0.5rem', marginTop: '0.25rem', paddingLeft: '3.25rem' }}>
                            <QuickReplyButtons 
                              prompts={currentTopic.prompts}
                              onSelect={(prompt) => {
                                setMessageInput(prompt);
                                // 즉시 전송
                                const userMessage = { role: 'user', text: prompt };
                                const aiMessage = { 
                                  role: 'assistant', 
                                  text: `"${prompt}"에 대한 응답입니다. 여기에 실제 AI 응답이 들어갑니다.` 
                                };
                                
                                setMessages(prev => ({
                                  ...prev,
                                  [currentTopic.id]: [...(prev[currentTopic.id] || []), userMessage, aiMessage]
                                }));
                                setMessageInput('');
                              }}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input-container">
              <div className="chat-input-wrapper">
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
                    <FileAttachment 
                      onFileSelect={(files) => {
                        console.log('선택된 파일들:', files);
                      }}
                      selectedFiles={selectedFiles}
                      setSelectedFiles={setSelectedFiles}
                    />
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
                      disabled={!messageInput.trim() && selectedFiles.length === 0}
                      className={`send-btn ${(messageInput.trim() || selectedFiles.length > 0) ? 'active' : 'inactive'}`}
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

          <ConversationGeneration 
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onConfirm={handleCreateTopic}
          />

          {showModelModal && (
            <div className="modal-overlay z-50" onClick={() => setShowModelModal(false)}>
              <div className="modal-container model-modal dark-modal" onClick={(e) => e.stopPropagation()}>
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
            <div className="modal-overlay z-50" onClick={() => setShowStyleModal(false)}>
              <div className="modal-container style-modal dark-modal" onClick={(e) => e.stopPropagation()}>
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
                        onClick={() => setTempStyleData({useCustomStyle: false, customStyle: '', selectedStyle: style.value})}
                      >
                        <input 
                          type="radio" 
                          id={style.id}
                          name="chatStyle" 
                          value={style.value}
                          checked={!tempStyleData.useCustomStyle && tempStyleData.selectedStyle === style.value}
                          onChange={() => setTempStyleData({useCustomStyle: false, customStyle: '', selectedStyle: style.value})}
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
                      onClick={() => setTempStyleData(prev => ({...prev, useCustomStyle: true, selectedStyle: ''}))}
                    >
                      <input 
                        type="radio" 
                        id="customStyle"
                        name="chatStyle" 
                        checked={tempStyleData.useCustomStyle}
                        onChange={() => setTempStyleData(prev => ({...prev, useCustomStyle: true, selectedStyle: ''}))}
                        className="style-radio"
                      />
                      <label htmlFor="customStyle" className="style-label">
                        <div className="style-name">전체 대화 지침</div>
                        <div className="style-description">직접 입력</div>
                      </label>
                    </div>
                  </div>

                  {/* 전체 대화 지침 텍스트 입력 */}
                  <div className="global-instruction-section" style={{ marginTop: '1rem' }}>
                    <textarea 
                      placeholder="대화 전체에 적용할 지침을 입력하세요"
                      className={`form-input global-instruction-textarea ${!tempStyleData.useCustomStyle ? 'disabled' : ''}`}
                      value={tempStyleData.customStyle}
                      onChange={(e) => setTempStyleData(prev => ({...prev, customStyle: e.target.value}))}
                      disabled={!tempStyleData.useCustomStyle}
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
                    <button onClick={applyStyleChange} className="modal-btn-primary">
                      적용
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <AlertModal 
            show={showAlert}
            onHide={() => setShowAlert(false)}
            title={alertConfig.title}
            message={alertConfig.message}
            variant={alertConfig.variant}
          />

          <ConfirmModal 
            show={showConfirm}
            onHide={() => setShowConfirm(false)}
            onConfirm={() => deleteTopic(deleteTopicId)}
            title="대화 삭제"
            message="정말로 이 대화를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          />
        </div>
      </div>
    </div>
      </div>
    </MonitoringLayout>
  );
};

export default Chat;