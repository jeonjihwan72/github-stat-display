// src/App.js

import React, { useState } from 'react';
import './App.css'; 

// 각 컴포넌트를 개별 파일에서 import 합니다.
import UserProfile from './UserProfile';
import LanguageChart from './LanguageChart'; // 방금 만든 파일을 import
// 잔디는 다른 사이트의 이미지로 대체하여 사용
// import ContributionGraph from './ContributionGraph';
import CommitGraph from './CommitGraph';

function App() {
  const [username, setUsername] = useState('jeonjihwan72');
  const [inputValue, setInputValue] = useState('jeonjihwan72');

  const handleSearch = (e) => {
    e.preventDefault();
    setUsername(inputValue);
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        {/* 사이드바 내용 */}
      </aside>
      <main className="main-content">
        <header className="header">
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="GitHub 유저이름을 입력하세요"
            />
            <button type="submit">조회</button>
          </form>
        </header>
        
        <div className="content-grid">
          <div className="Profile">
            <UserProfile username={username} />
          </div>
          <div className="Language">
            <LanguageChart username={username} /> 
          </div>
          <div className="Grass">
            {/* 'Grass' 영역을 위해 ContributionGraph 컴포넌트를 추가합니다. */}
            <img src={`https://ghchart.rshah.org/${username}`} alt="GitHub chart" />
          </div>
          <div className="CommitTime">
            <CommitGraph username={username} />
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;