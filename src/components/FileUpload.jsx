import React, { useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Upload, X, Paperclip, CheckCircle, XCircle, Info } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FileUpload = ({show, onHide, onSuccess, onError}) => {
    
    //State 선언
    const [fileList, setFileList] = useState([]); // 저장된 파일 목록
    const [tempFileList, setTempFileList] = useState([]); // 임시 파일 목록 (저장 전)
    const fileInputRef = useRef(null);
    
    // 알림 모달 관련 state
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        variant: 'danger',
        icon: null
    });

    // 알림 표시 함수
    const showNotification = (title, message, variant = 'danger') => {
        const iconMap = {
            success: <CheckCircle size={48} className="text-success mb-3" />,
            danger: <XCircle size={48} className="text-danger mb-3" />,
            info: <Info size={48} className="text-info mb-3" />
        };
        
        setAlertConfig({
            title,
            message,
            variant,
            icon: iconMap[variant]
        });
        setShowAlertModal(true);
    };

    // 파일 형식 가져오기
    const getFileExtension = (filename) => {
        return filename.split('.').pop().toUpperCase();
    };

    // 파일 크기 포맷팅
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    //파일 선택 처리 함수 - 임시 목록에 추가
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
          const validTypes = [
              'image/jpeg'
            , 'image/png'
            , 'image/gif'
            , 'application/vnd.ms-excel'
            , 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            , 'application/vnd.ms-powerpoint'
            , 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            , 'application/msword'
            , 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            , 'application/haansofthwp'
            , 'application/x=hwp'
            , 'application/vnd.hancom.hwp'
            , 'application/x-hwpml'
            , 'application/pdf'
          ];
          
          if (!validTypes.includes(file.type) && !file.name.match(/\.(hwp|hwpx|pdf|xls|xlsx|ppt|pptx|doc|docx)$/i)) {
            showNotification('업로드 오류', '허용되지 않는 파일 형식입니다.', 'danger');
            return;
          }
          
          // 임시 목록에 추가
          const newFile = {
              file: file,
              name: file.name,
              size: file.size,
              type: file.type,
              extension: getFileExtension(file.name),
              remark: '',
              id: Date.now(),
              isTemp: true // 임시 파일 표시
          };
          
          setTempFileList(prev => [...prev, newFile]);
        }
        
        // input 초기화
        if(fileInputRef.current){
            fileInputRef.current.value = '';
        }
    }

    // 임시 파일 저장 (임시 → 저장됨)
    const handleSaveFiles = () => {
        if(tempFileList.length === 0){
            showNotification('저장 오류', '저장할 파일이 없습니다.', 'info');
            return;
        }
        
        // 임시 파일을 저장된 파일로 이동
        const savedFiles = tempFileList.map(file => ({
            ...file,
            isTemp: false
        }));
        
        setFileList(prev => [...prev, ...savedFiles]);
        setTempFileList([]); // 임시 목록 비우기
        
        showNotification('저장 완료', `${savedFiles.length}개의 파일이 저장되었습니다.`, 'success');
    };

    // 비고 수정
    const handleRemarkChange = (id, value, isTemp) => {
        if (isTemp) {
            setTempFileList(prev => prev.map(file => 
                file.id === id ? { ...file, remark: value } : file
            ));
        } else {
            setFileList(prev => prev.map(file => 
                file.id === id ? { ...file, remark: value } : file
            ));
        }
    };

    // 목록에서 파일 제거
    const handleRemoveFile = (id, isTemp) => {
        if (isTemp) {
            setTempFileList(prev => prev.filter(file => file.id !== id));
        } else {
            setFileList(prev => prev.filter(file => file.id !== id));
        }
    };

    // 모달 닫기
    const handleCloseFileModal = () => {
        setFileList([]);
        setTempFileList([]);
        onHide();
    }

    // 확인 버튼 (최종 제출)
    const handleConfirm = () => {
        // 임시 파일이 있으면 경고
        if(tempFileList.length > 0){
            showNotification('저장 필요', '저장되지 않은 파일이 있습니다. 먼저 저장 버튼을 눌러주세요.', 'danger');
            return;
        }
        
        if(fileList.length === 0){
            showNotification('파일 없음', '첨부할 파일을 선택해주세요.', 'info');
            return;
        }
        
        // 성공 알림 표시
        showNotification('업로드 완료', `${fileList.length}개의 파일이 성공적으로 업로드되었습니다.`, 'success');
        
        // onSuccess 콜백 호출 (부모 컴포넌트에 파일 전달)
        if(onSuccess){
            onSuccess(fileList);
        }

        // 알림 모달이 닫힌 후 파일 업로드 모달 닫기
        setTimeout(() => {
            setFileList([]);
            setTempFileList([]);
            onHide();
        }, 100);
    }

    return (
        <>
            <Modal 
                show={show} 
                onHide={handleCloseFileModal}
                centered
                backdrop="static"
                size="xl"
            >
            <Modal.Header closeButton style={{
                background: '#f8f9fa',
                borderBottom: '1px solid #dee2e6',
                padding: '1rem 1.5rem'
            }}>
                <Modal.Title style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#212529',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Upload size={20} />
                    파일 첨부
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body style={{
                padding: '1.5rem',
                background: '#ffffff'
            }}>
                {/* 숨겨진 파일 input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.hwpx"
                />

                {/* 파일 목록 테이블 - 항상 표시 */}
                <div style={{
                    border: '1px solid #2a3f5f',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <table style={{
                        width: '100%',
                        margin: 0,
                        fontSize: '0.875rem',
                        borderCollapse: 'collapse',
                        tableLayout: 'fixed'
                    }}>
                        <thead>
                            <tr style={{
                                backgroundColor: '#2a3f5f',
                                borderBottom: '2px solid #4a5f7f'
                            }}>
                                <th style={{
                                    width: '50px',
                                    textAlign: 'center',
                                    padding: '0.75rem 0.5rem',
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    fontSize: '0.875rem',
                                    borderRight: '1px solid #4a5f7f',
                                    backgroundColor: '#2a3f5f'
                                }}>No</th>
                                <th style={{
                                    width: '35%',
                                    padding: '0.75rem 0.5rem',
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    fontSize: '0.875rem',
                                    borderRight: '1px solid #4a5f7f',
                                    backgroundColor: '#2a3f5f'
                                }}>파일명</th>
                                <th style={{
                                    width: '100px',
                                    textAlign: 'center',
                                    padding: '0.75rem 0.5rem',
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    fontSize: '0.875rem',
                                    borderRight: '1px solid #4a5f7f',
                                    backgroundColor: '#2a3f5f'
                                }}>파일형식</th>
                                <th style={{
                                    width: '120px',
                                    textAlign: 'center',
                                    padding: '0.75rem 0.5rem',
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    fontSize: '0.875rem',
                                    borderRight: '1px solid #4a5f7f',
                                    backgroundColor: '#2a3f5f'
                                }}>파일크기</th>
                                <th style={{
                                    width: '30%',
                                    padding: '0.75rem 0.5rem',
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    fontSize: '0.875rem',
                                    borderRight: '1px solid #4a5f7f',
                                    backgroundColor: '#2a3f5f'
                                }}>비고</th>
                                <th style={{
                                    width: '60px',
                                    textAlign: 'center',
                                    padding: '0.75rem 0.5rem',
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    fontSize: '0.875rem',
                                    backgroundColor: '#2a3f5f'
                                }}>삭제</th>
                            </tr>
                        </thead>
                        <tbody style={{backgroundColor: '#ffffff'}}>
                            {fileList.length === 0 && tempFileList.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{
                                        textAlign: 'center',
                                        padding: '2rem',
                                        color: '#9ca3af',
                                        fontSize: '0.875rem',
                                        backgroundColor: '#ffffff'
                                    }}>
                                        첨부된 파일이 없습니다
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {/* 저장된 파일 표시 */}
                                    {fileList.map((file, index) => (
                                        <tr key={file.id} style={{
                                            borderBottom: '1px solid #e5e7eb',
                                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                                        }}>
                                            <td style={{
                                                textAlign: 'center',
                                                padding: '0.75rem 0.5rem',
                                                color: '#6b7280',
                                                fontWeight: '500'
                                            }}>{index + 1}</td>
                                            <td style={{
                                                padding: '0.75rem 0.5rem',
                                                color: '#1f2937',
                                                wordBreak: 'break-all'
                                            }}>{file.name}</td>
                                            <td style={{
                                                textAlign: 'center',
                                                padding: '0.75rem 0.5rem'
                                            }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '0.25rem 0.5rem',
                                                    backgroundColor: '#e0e7ff',
                                                    color: '#4f46e5',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600'
                                                }}>
                                                    {file.extension}
                                                </span>
                                            </td>
                                            <td style={{
                                                textAlign: 'center',
                                                padding: '0.75rem 0.5rem',
                                                color: '#6b7280'
                                            }}>{formatFileSize(file.size)}</td>
                                            <td style={{
                                                padding: '0.5rem'
                                            }}>
                                                <input
                                                    type="text"
                                                    value={file.remark}
                                                    onChange={(e) => handleRemarkChange(file.id, e.target.value, false)}
                                                    placeholder="비고 입력"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '4px',
                                                        fontSize: '0.875rem',
                                                        color: '#1f2937',
                                                        backgroundColor: '#ffffff'
                                                    }}
                                                />
                                            </td>
                                            <td style={{
                                                textAlign: 'center',
                                                padding: '0.5rem'
                                            }}>
                                                <button
                                                    onClick={() => handleRemoveFile(file.id, false)}
                                                    style={{
                                                        backgroundColor: '#fee2e2',
                                                        border: '1px solid #fecaca',
                                                        borderRadius: '4px',
                                                        width: '32px',
                                                        height: '32px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        color: '#dc2626',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#fecaca';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#fee2e2';
                                                    }}
                                                    title="삭제"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* 임시 파일 표시 (연한 노란색 배경) */}
                                    {tempFileList.map((file, index) => (
                                        <tr key={file.id} style={{
                                            borderBottom: '1px solid #e5e7eb',
                                            backgroundColor: '#fffbeb'
                                        }}>
                                            <td style={{
                                                textAlign: 'center',
                                                padding: '0.75rem 0.5rem',
                                                color: '#92400e',
                                                fontWeight: '500'
                                            }}>-</td>
                                            <td style={{
                                                padding: '0.75rem 0.5rem',
                                                color: '#92400e',
                                                wordBreak: 'break-all'
                                            }}>
                                                {file.name}
                                                <span style={{
                                                    marginLeft: '0.5rem',
                                                    fontSize: '0.75rem',
                                                    color: '#d97706',
                                                    fontWeight: '600'
                                                }}>(저장 필요)</span>
                                            </td>
                                            <td style={{
                                                textAlign: 'center',
                                                padding: '0.75rem 0.5rem'
                                            }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '0.25rem 0.5rem',
                                                    backgroundColor: '#fef3c7',
                                                    color: '#92400e',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600'
                                                }}>
                                                    {file.extension}
                                                </span>
                                            </td>
                                            <td style={{
                                                textAlign: 'center',
                                                padding: '0.75rem 0.5rem',
                                                color: '#92400e'
                                            }}>{formatFileSize(file.size)}</td>
                                            <td style={{
                                                padding: '0.5rem'
                                            }}>
                                                <input
                                                    type="text"
                                                    value={file.remark}
                                                    onChange={(e) => handleRemarkChange(file.id, e.target.value, true)}
                                                    placeholder="비고 입력"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        border: '1px solid #fbbf24',
                                                        borderRadius: '4px',
                                                        fontSize: '0.875rem',
                                                        color: '#92400e',
                                                        backgroundColor: '#fffbeb'
                                                    }}
                                                />
                                            </td>
                                            <td style={{
                                                textAlign: 'center',
                                                padding: '0.5rem'
                                            }}>
                                                <button
                                                    onClick={() => handleRemoveFile(file.id, true)}
                                                    style={{
                                                        backgroundColor: '#fee2e2',
                                                        border: '1px solid #fecaca',
                                                        borderRadius: '4px',
                                                        width: '32px',
                                                        height: '32px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        color: '#dc2626',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#fecaca';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#fee2e2';
                                                    }}
                                                    title="삭제"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            
            <Modal.Footer style={{
                background: '#f8f9fa',
                borderTop: '1px solid #dee2e6',
                padding: '1rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Button 
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        background: '#ffffff',
                        border: '1px solid #3b82f6',
                        color: '#3b82f6',
                        padding: '0.5rem 1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Paperclip size={16} />
                    파일 첨부
                </Button>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <Button 
                        onClick={handleCloseFileModal}
                        style={{
                            background: '#ffffff',
                            border: '1px solid #d1d5db',
                            color: '#374151',
                            padding: '0.5rem 1.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}
                    >
                        취소
                    </Button>
                    <Button 
                        onClick={handleSaveFiles}
                        disabled={tempFileList.length === 0}
                        style={{
                            background: tempFileList.length === 0 ? '#e5e7eb' : '#10b981',
                            border: 'none',
                            color: '#ffffff',
                            padding: '0.5rem 1.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: tempFileList.length === 0 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        저장 ({tempFileList.length})
                    </Button>
                    <Button 
                        onClick={handleConfirm}
                        disabled={fileList.length === 0}
                        style={{
                            background: fileList.length === 0 ? '#e5e7eb' : '#3b82f6',
                            border: 'none',
                            color: '#ffffff',
                            padding: '0.5rem 1.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: fileList.length === 0 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        확인 ({fileList.length})
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>

        {/* 알림 Modal */}
        <Modal 
            show={showAlertModal} 
            onHide={() => setShowAlertModal(false)}
            centered
            backdrop="static"
        >
            <Modal.Body 
                className="text-center p-4"
                style={{
                    background: 'linear-gradient(135deg, rgba(60, 65, 90, 0.98) 0%, rgba(75, 80, 110, 0.98) 100%)',
                    color: '#fff',
                    borderRadius: '12px',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                }}
            >
                {alertConfig.icon}
                <h5 className="fw-bold mb-3" style={{ color: '#fff' }}>{alertConfig.title}</h5>
                <p style={{ color: 'rgba(255, 255, 255, 0.85)' }} className="mb-4">
                    {alertConfig.message}
                </p>
                <Button 
                    onClick={() => setShowAlertModal(false)}
                    className="px-4 shadow-sm"
                    style={{ 
                        borderRadius: '8px',
                        background: alertConfig.variant === 'success' 
                            ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                            : alertConfig.variant === 'info'
                            ? 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
                            : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                        border: 'none',
                        fontWeight: '600'
                    }}
                >
                    확인
                </Button>
            </Modal.Body>
        </Modal>
        </>
    );
};

export default FileUpload;