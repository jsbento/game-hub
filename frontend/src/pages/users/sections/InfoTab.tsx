import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../types/State';

const InfoTab: React.FC = () => {
  const { user } = useSelector(( state: State ) => state );

  const [ changeUsername, setChangeUsername ] = useState<boolean>( false );

  const onSaveChanges = () => {
    console.log( 'Saving changes' );
  }

  return user ? (
    <div className="flex flex-col w-full p-2 ml-3">
      <div className="mb-4">
        <label className="font-bold text-xl" htmlFor={ changeUsername ? 'username' : undefined }>Username</label>
        { changeUsername ? (
          <input name="username" className="w-1/4 p-2 border-2 border-gray-300 rounded-md" type="text" value={user.username} />
        ) : (
          <p className="w-full py-2">{user.username}</p>
        ) }
        <p onClick={ () => setChangeUsername( !changeUsername ) } className="text-blue-500 cursor-pointer">Change username</p>
      </div>
      <div className="mb-4">
        <label className="font-bold text-xl">Email</label>
        <p className="w-full py-2">{user.email}</p>
      </div>
      <div className="mb-4 flex flex-col">
        <label className="font-bold text-xl" htmlFor="changePassword">Change Password</label>
        <input name="changePassword" className="w-1/4 p-2 border-2 border-gray-300 rounded-md my-1" type="password" />
      </div>
    </div>
  ) : null;
};

export default InfoTab;
