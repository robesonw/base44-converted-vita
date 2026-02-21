import React from 'react';

const UserNotRegisteredError: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Access Restricted</h1>
        <p>You are not registered to use this application.</p>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;