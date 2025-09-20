import React from 'react';
import Navigation from './Navigation';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header>
      <Navigation />
      {title && (
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="mt-4 mb-3">{title}</h1>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;