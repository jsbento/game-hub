import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../../types/State';
import { User } from '../../../types/Users';
import { setUser } from '../../../state/actions/Actions';

const InfoTab: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(( state: State ) => state );
  const updateUser = useCallback(( user: User ) => dispatch( setUser( user )), [ dispatch ]);

  const [ changeUsername, setChangeUsername ] = useState<boolean>( false );
  const [ newUsername, setNewUsername ] = useState<string>(( user && user.username ) || '' );
  const [ newPassword, setNewPassword ] = useState<string>( '' );
  const [ confirmPassword, setConfirmPassword ] = useState<string>( '' );
  const [ errors, setErrors ] = useState<{ [key: string]: string }>({});

  const checkChanges = (): boolean => {
    if ( changeUsername && newUsername !== user?.username ) return true;
    if ( newPassword.length > 0 && newPassword === confirmPassword ) return true;
    return false;
  }

  const onSaveChanges = async () => {
    if( !user ) {
      return;
    }

    if ( newPassword.length > 0 && newPassword !== confirmPassword ) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    const req: { [key: string]: string } = {
      id: user.id,
    }
    if ( changeUsername && newUsername !== user.username ) req.username = newUsername;
    if ( newPassword.length > 0 && newPassword === confirmPassword ) req.password = newPassword;

    const updated: User = await fetch( `http://localhost:8080/users/${ user!.id }`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( req ),
    })
    .then( res => res.json())
    .catch( err => console.log( err ));

    updateUser( updated );
  }

  return user ? (
    <div className="flex flex-col w-full p-2 ml-3">
      <div className="flex flex-col mb-4">
        <label className="font-bold text-xl" htmlFor={ changeUsername ? 'username' : undefined }>Username</label>
        { changeUsername ? (
          <input name="username" className="w-1/4 p-2 border-2 border-gray-300 rounded-md" type="text" value={ newUsername } />
        ) : (
          <p className="w-full py-2">{ newUsername }</p>
        ) }
        <p onClick={ () => setChangeUsername( !changeUsername ) } className="text-blue-500 cursor-pointer">Change username</p>
      </div>
      <div className="mb-4">
        <label className="font-bold text-xl">Email</label>
        <p className="w-full py-2">{user.email}</p>
      </div>
      <div className="mb-4 flex flex-col">
        <label className="font-bold text-xl" htmlFor="changePassword">Change Password</label>
        <input
          name="changePassword"
          className="w-1/4 p-2 border-2 border-gray-300 rounded-md my-1"
          type="password"
          autoComplete='new-password'
          onChange={ ( e ) => setNewPassword( e.target.value ) }
        />
        { newPassword.length > 0 &&
          <>
            <label className="font-bold text-xl" htmlFor="confirmPassword">Confirm Password</label>
            <input
              name="confirmPassword"
              className="w-1/4 p-2 border-2 border-gray-300 rounded-md my-1"
              type="password"
              autoComplete='new-password'
              onChange={ ( e ) => setConfirmPassword( e.target.value ) }
            />
            { errors.confirmPassword && <p className="text-red-500">{ errors.confirmPassword }</p> }
          </>
        }
      </div>
      <div className="mb-4 justify-center items-center">
        { checkChanges() && <button onClick={ onSaveChanges } className="px-4 py-2 bg-blue-500 text-white rounded-md">Save Changes</button> }
      </div>
    </div>
  ) : null;
};

export default InfoTab;
