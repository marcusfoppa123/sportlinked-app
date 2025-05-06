import React from 'react';
import logo from '@/assets/SportsLinked in app.png';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  const [error, setError] = React.useState(false);

  return (
    <img 
      src={error ? '/sportlinked-logo.png' : logo}
      alt="SportsLinked Logo"
      className={className}
      style={{ 
        display: 'block',
        maxWidth: '100%',
        height: '48px',
        objectFit: 'contain'
      }}
      onError={() => {
        console.error("Logo failed to load");
        setError(true);
      }}
      onLoad={() => console.log("Logo loaded successfully")}
    />
  );
};

export default Logo; 