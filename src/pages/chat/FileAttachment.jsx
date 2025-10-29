import React from 'react';
import './FileAttachment.css';

const FileAttachment = ({ onFileSelect, selectedFiles, setSelectedFiles }) => {
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const fileData = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        file: file
      }));
      
      setSelectedFiles(prev => [...prev, ...fileData]);
      if (onFileSelect) {
        onFileSelect(fileData);
      }
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      // URL 메모리 해제
      if (prev[index]?.url) {
        URL.revokeObjectURL(prev[index].url);
      }
      return newFiles;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return '🖼️';
    } else if (type.startsWith('video/')) {
      return '🎬';
    } else if (type.startsWith('audio/')) {
      return '🎵';
    } else if (type.includes('pdf')) {
      return '📄';
    } else if (type.includes('word') || type.includes('document')) {
      return '📝';
    } else if (type.includes('excel') || type.includes('spreadsheet')) {
      return '📊';
    } else if (type.includes('zip') || type.includes('rar')) {
      return '📦';
    } else if (type.includes('text')) {
      return '📄';
    } else {
      return '📎';
    }
  };

  return (
    <>
      {/* 파일 미리보기 영역 - input-wrapper 위에 absolute로 표시 */}
      {selectedFiles && selectedFiles.length > 0 && (
        <div className="claude-files-preview-container">
          <div className="claude-files-preview">
            {selectedFiles.map((file, index) => (
              <div key={index} className="claude-file-card">
                {file.type.startsWith('image/') ? (
                  <div className="claude-file-thumbnail">
                    <img src={file.url} alt={file.name} />
                  </div>
                ) : (
                  <div className="claude-file-icon-wrapper">
                    <span className="claude-file-icon">{getFileIcon(file.type)}</span>
                  </div>
                )}
                <div className="claude-file-details">
                  <div className="claude-file-name" title={file.name}>
                    {file.name}
                  </div>
                  <div className="claude-file-size">
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <button 
                  className="claude-file-remove"
                  onClick={() => removeFile(index)}
                  type="button"
                  title="제거"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 파일 첨부 버튼 */}
      <button 
        className="file-attach-btn"
        onClick={() => document.getElementById('file-input-attach').click()}
        title="파일 첨부"
        type="button"
      >
        📎
      </button>
      
      <input 
        id="file-input-attach"
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </>
  );
};

export default FileAttachment;