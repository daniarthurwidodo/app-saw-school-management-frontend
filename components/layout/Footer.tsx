import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} School Management System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;