import React from 'react';
import { Wallet } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import './LandingHeader.css';

const LandingHeader = ({ onLoginSuccess }) => {
  return (
    <header className="landing-header">
      <div className="landing-logo">
        <div className="logo-icon-multi">
          <Wallet color="white" size={16} />
        </div>
        <span className="logo-text">Ekspenses</span>
      </div>
      
      <nav className="landing-nav">
        <a href="#help" className="nav-link">Help</a>
        <a href="#about" className="nav-link">About us</a>
        
        <div className="nav-separator">|</div>
        
        <div className="login-button-container">
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log('Login Success:', credentialResponse);
              onLoginSuccess(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            theme="outline"
            text="signin"
            shape="pill"
          />
        </div>
      </nav>
    </header>
  );
};

export default LandingHeader;
