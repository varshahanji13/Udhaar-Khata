import React from 'react';

const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', width: '100%' }}>
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
