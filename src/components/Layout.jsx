import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = ({ 
  children, 
  title,
  subtitle,
  environment = "Production",
  showNavigation = true 
}) => {
  return (
    <div className="min-vh-100" style={{ background: '#f8f9fa' }}>
      <div className="container-fluid px-4 py-3" style={{ maxWidth: '1400px' }}>
        <Header 
          title={title}
          subtitle={subtitle}
          environment={environment}
        />
        
        {showNavigation && <Navigation />}
        
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;