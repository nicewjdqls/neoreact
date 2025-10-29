import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MappingListModal from './MappingListModal';
import Datacollector from './Datacollector';

function DataCollectorWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState(null);

  useEffect(() => {
    // location.state가 있으면 (직접 접근 또는 선택 완료) 모달 표시하지 않음
    if (location.state?.selectedMapping) {
      setSelectedMapping(location.state.selectedMapping);
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

  const handleSelectMapping = (mapping) => {
    // 선택한 매핑 정보를 저장하고 모달 닫기
    setSelectedMapping(mapping);
    setShowModal(false);
  };

  // 모달이 표시되어야 하는 경우
  if (showModal) {
    return (
      <MappingListModal
        show={showModal}
        onClose={handleModalClose}
        onSelectMapping={handleSelectMapping}
      />
    );
  }

  // 선택된 경우 Datacollector 표시 (신규 생성 또는 기존 선택 모두 처리)
  return <Datacollector selectedMapping={selectedMapping} />;
}

export default DataCollectorWrapper;