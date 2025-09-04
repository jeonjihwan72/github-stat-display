// src/App.js

import React, { useState } from 'react';
import './App.css'; 

// 각 컴포넌트를 개별 파일에서 import 합니다.
import UserProfile from './UserProfile';
import LanguageChart from './LanguageChart'; // 방금 만든 파일을 import
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
        
        <section className="top-section">
          {/* 각 컴포넌트에 username을 props로 전달합니다. */}
          <UserProfile username={username} />
          <LanguageChart username={username} /> 
        </section>
        
        <section className="bottom-section">
          <CommitGraph username={username} />
        </section>

      </main>
    </div>
  );
}

export default App;