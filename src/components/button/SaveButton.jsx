import React from 'react';
import { Save } from 'lucide-react';
import { Button, Spinner } from 'react-bootstrap';

const SaveButton = ({ onClick, disabled = false, isLoading = false, children = '저장' }) => {
  const buttonStyle = {
    padding: '0.625rem 1.25rem',
    fontSize: '0.9375rem',
    fontWeight: '600',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    opacity: disabled || isLoading ? 0.6 : 1,
    minWidth: '100px',
    justifyContent: 'center'
  };

  return (
    <Button 
      onClick={onClick}
      disabled={disabled || isLoading}
      style={buttonStyle}
    >
      {isLoading ? (
        <>
          <Spinner animation="border" size="sm" />
          저장중
        </>
      ) : (
        <>
          <Save size={16} />
          {children}
        </>
      )}
    </Button>
  );
};

export default SaveButton;