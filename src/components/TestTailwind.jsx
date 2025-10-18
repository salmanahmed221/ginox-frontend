import React from 'react';

const TestTailwind = () => {
  return (
    <div className="p-4 bg-blue-500 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-2">Tailwind Test</h1>
      <p className="text-sm">If you can see this styled, Tailwind is working!</p>
      <button className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded">
        Test Button
      </button>
    </div>
  );
};

export default TestTailwind; 