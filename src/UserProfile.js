// UserProfile.js (예시)
import React, { useState, useEffect } from 'react';

function UserProfile({ username }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [username]); // username이 바뀔 때마다 다시 호출

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <img src={user.avatar_url} alt={`${user.login}의 프로필 사진`} style={{width: '200px', borderRadius: '50%'}} />
      <h2>{user.name}</h2>
      <p>{user.login}</p>
    </div>
  );
}

export default UserProfile;