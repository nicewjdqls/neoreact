import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ModelListModal from './ModelListModal';
import Modelmanage from './Modelmanage';

function ModelmanageWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    // location.state가 있으면 (직접 접근 또는 선택 완료) 모달 표시하지 않음
    if (location.state?.selectedModel) {
      setSelectedModel(location.state.selectedModel);
      setShowModal(false);
    } else {
      // state가 없으면 모달 먼저 표시
      setShowModal(true);
    }
  }, [location.state]);

  const handleModalClose = () => {
    // 모달을 닫으면 메인 페이지로 이동
    navigate('/main1');
  };

  const handleSelectModel = (model) => {
    // 선택한 모델 정보를 저장하고 모달 닫기
    setSelectedModel(model);
    setShowModal(false);
  };

  // 모달이 표시되어야 하는 경우
  if (showModal) {
    return (
      <ModelListModal
        show={showModal}
        onClose={handleModalClose}
        onSelectModel={handleSelectModel}
      />
    );
  }

  // 선택된 경우 Modelmanage 표시 (신규 생성 또는 기존 선택 모두 처리)
  return <Modelmanage selectedModel={selectedModel} />;
}

export default ModelmanageWrapper;