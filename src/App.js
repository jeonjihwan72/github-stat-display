import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'; // 1. useState와 useEffect를 import 합니다.

function App() {
  // 2. API로부터 받아온 데이터를 저장할 state를 만듭니다. 초기값은 빈 객체입니다.
  const [stats, setStats] = useState({});
  // 3. 데이터 로딩 상태를 관리할 state를 만듭니다.
  const [loading, setLoading] = useState(true);

  // 4. 컴포넌트가 처음 렌더링될 때만 비동기 함수를 실행하도록 useEffect 훅을 사용합니다.
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getLanguageStats('jeonjihwan72');
        setStats(result); // 5. API 호출 결과를 state에 저장합니다.
      } catch (error) {
        console.error("API 호출 중 에러가 발생했습니다.", error);
      } finally {
        setLoading(false); // 6. 로딩 상태를 false로 변경합니다.
      }
    }
    
    fetchData();
  }, []); // 의존성 배열(dependency array)이 비어있으므로, 컴포넌트가 마운트될 때 한 번만 실행됩니다.

  // 7. 로딩 중일 때와 데이터가 준비되었을 때 다른 화면을 보여줍니다.
  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <p>GitHub 통계를 불러오는 중...</p>
        </header>
      </div>
    );
  }

  // 8. 데이터가 준비되면, state의 stats 객체를 화면에 렌더링합니다.
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          GitHub Language Stats for jeonjihwan72
          <ul>
            {/* Object.entries를 사용해 객체의 모든 키-값 쌍을 순회합니다. */}
            {Object.entries(stats).map(([language, bytes]) => (
              <li key={language}>
                {language}: {bytes} bytes
              </li>
            ))}
          </ul>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// 이 함수는 App 컴포넌트 외부에 그대로 두어도 괜찮습니다.
// async function getLanguageStats(...)
async function getLanguageStats(username) {
  // 1. 사용자의 모든 저장소 가져오기
  const repoResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  const repos = await repoResponse.json();

  let languageStats = {};

  // 2. 각 저장소의 언어 데이터 가져와서 합산
  for (const repo of repos) {
    if (repo.fork) continue; // 포크한 저장소는 제외

    const langResponse = await fetch(repo.languages_url);
    const languages = await langResponse.json();

    for (const lang in languages) {
      if (languageStats[lang]) {
        languageStats[lang] += languages[lang];
      } else {
        languageStats[lang] = languages[lang];
      }
    }
  }
  return languageStats;
}

export default App;