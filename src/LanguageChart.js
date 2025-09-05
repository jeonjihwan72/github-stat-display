import React, { useState, useEffect } from 'react'; // React import 추가
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// 1. 컴포넌트가 App으로부터 username을 props로 받도록 수정합니다.
function LanguageChart({ username }) {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // username이 없으면 함수를 실행하지 않습니다.
    if (!username) return;

    async function fetchData() {
      setLoading(true); // 새로운 username으로 조회를 시작할 때 로딩 상태로 변경
      try {
        // 2. 하드코딩된 이름 대신 props로 받은 동적 username을 사용합니다.
        const result = await getLanguageStats(username);
        setStats(result);
      } catch (error) {
        console.error("API 호출 중 에러가 발생했습니다.", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  // 3. username이 변경될 때마다 이 useEffect가 다시 실행되도록 의존성 배열에 추가합니다.
  }, [username]);

  const sortedStats = Object.entries(stats).sort(([, a], [, b]) => b - a);

  const chartData = {
    labels: sortedStats.map(data => data[0]),
    datasets: [
      {
        label: 'Bytes of Code',
        data: sortedStats.map(data => data[1]),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)', 'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 범례를 우측으로 설정
  const chartOptions = {
    // 반응형 및 크기 유지를 위한 옵션
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: 'right', // 범례(항목 명) 위치를 오른쪽으로 설정
      },
    },
  };

  if (loading) {
    return <div><p>언어 데이터를 불러오는 중...</p></div>;
  }
  
  return (
    <div>
      <h3>Language Stats for {username}</h3>
      <div style={{ position: 'relative', width: '400px', height: '400px' }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

async function getLanguageStats(username) {
  const repoResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  if (!repoResponse.ok) { // API 요청 실패 시 에러 처리
    throw new Error(`GitHub API Error: ${repoResponse.status}`);
  }
  const repos = await repoResponse.json();
  let languageStats = {};
  for (const repo of repos) {
    if (repo.fork) continue;
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

export default LanguageChart;