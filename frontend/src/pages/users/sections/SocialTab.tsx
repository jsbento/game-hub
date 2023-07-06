import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CategoryFriendRequest, FriendRequest } from '../../../types/Social';
import { State } from '../../../types/State';
import { User } from '../../../types/Users';

const SocialTab: React.FC = () => {
  const [ friendRequests, setFriendRequests ] = useState<CategoryFriendRequest | null>( null );
  const [ friends, setFriends ] = useState<User[] | null>( null );

  const { user, token } = useSelector(( state: State ) => state );

  useEffect(() => {
    if( !token ) {
      return;
    }

    const loadSocialReqs = async () => {
      const reqs = await fetch( 'http://localhost:8080/users/friends/invites', {
        headers: {
          'Content-Type': 'application/json',
          Token: token.token || '',
        },
        method: 'GET',
      })
      .then( res => res.json())
      .catch( err => console.log( err ));

      setFriendRequests( reqs );
    }

    loadSocialReqs();
  }, [])

  useEffect(() => {
    if( !user || user.friends.length === 0 ) {
      return;
    }

    const loadFriends = async () => {
      const friends: User[] = await fetch( `http://localhost:8080/users?${ new URLSearchParams({
        ids: user.friends.join( ',' ) || '',
      })}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      })
      .then( res => res.json())
      .catch( err => console.log( err ));

      setFriends( friends );
    }

    loadFriends();
  }, [])

  const goToProfile = ( userId: string ) => {
    console.log( 'Going to profile', userId )
  }

  return (
    <div className='flex flex-row w-full p-2'>
      <div className='w-1/2'>
        <div className='h-[325px]'>
          <h1 className='font-bold text-xl'>Incoming</h1>
          { friendRequests?.incoming.map(( req: FriendRequest, idx: number ) => (
            <div key={idx}>
              <p>{req.from}</p>
            </div>
          )) }
        </div>
        <div className='h-[325px]'>
          <h1 className='font-bold text-xl'>Outgoing</h1>
          { friendRequests?.outgoing.map(( req: FriendRequest, idx: number ) => (
            <div key={idx}>
              <p>{req.to}</p>
            </div>
          )) }
        </div>
      </div>
      <div className='w-1/2'>
        <h1 className='font-bold text-xl'>Friends</h1>
        { friends?.map(( friend: User, idx: number ) => (
          <div key={idx}>
            {/* Add feature such that clicking a profile here opens their respective profile page */}
            <p onClick={ () => goToProfile( friend.id ) }>
              {friend.username}
            </p>
          </div>
        )) }
      </div>
    </div>
  );
};

export default SocialTab;
