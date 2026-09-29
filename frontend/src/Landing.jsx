import LandingHeader from './LandingHeader';
import Hero from './Hero';
import Features from './Component';
import MobileAppSection from './MobileAppSection';
import Steps from './Steps';
import Reviews from './Reviews';
import { useNavigate } from 'react-router-dom';

const Landing = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleLogin = (credentialResponse) => {
    onLoginSuccess(credentialResponse);
    navigate('/dashboard');
  };

  return (
    <div>
      <LandingHeader onLoginSuccess={handleLogin} />
      <div style={{ paddingTop: '80px' }}>
        <Hero />
        <Features />
        <MobileAppSection />
        <Steps />
        <Reviews />
      </div>
    </div>
  );
};

export default Landing;
