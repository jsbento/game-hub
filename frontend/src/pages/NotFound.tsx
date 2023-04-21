import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex w-full mt-28 justify-center items-center">
      <div className="flex flex-row">
        <p className="font-bold text-6xl border-2 rounded-md bg-pink-500 px-3 text-white">
          404 Not Found
        </p>
        <p className="text-6xl mx-2">|</p>
        <p className="w-72 text-center py-3 font-semibold">
          {
            'The page you have requested seems to have not been implemented yet! :('
          }
        </p>
      </div>
    </div>
  );
};

export default NotFound;
