import React, { useState } from 'react';
import Sidebar from './Sidebar';

const MonitoringLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      background: '#1e2139', 
      color: '#fff',
      overflow: 'hidden'
    }}>
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        background: '#1e2139',
        position: 'relative'
      }}>
        {children}
      </div>
    </div>
  );
};

export default MonitoringLayout;