import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// 1. 언어별로 고유한 색상을 지정하는 객체를 만듭니다.
//    필요한 언어를 여기에 추가할 수 있습니다.
const LANGUAGE_COLORS = {
  JavaScript: { background: 'rgba(241, 224, 90, 0.7)', border: 'rgba(241, 224, 90, 1)' },
  HTML: { background: 'rgba(227, 76, 38, 0.7)', border: 'rgba(227, 76, 38, 1)' },
  CSS: { background: 'rgba(86, 61, 124, 0.7)', border: 'rgba(86, 61, 124, 1)' },
  Python: { background: 'rgba(55, 118, 171, 0.7)', border: 'rgba(55, 118, 171, 1)' },
  Java: { background: 'rgba(176, 114, 25, 0.7)', border: 'rgba(176, 114, 25, 1)' },
  TypeScript: { background: 'rgba(49, 120, 198, 0.7)', border: 'rgba(49, 120, 198, 1)' },
  Shell: { background: 'rgba(137, 224, 81, 0.7)', border: 'rgba(137, 224, 81, 1)' },
  Vue: { background: 'rgba(65, 184, 131, 0.7)', border: 'rgba(65, 184, 131, 1)' },
  Verilog: { background: 'rgba(188, 198, 255, 0.7)', border: 'rgba(188, 198, 255, 1)' },
  Ruby: { background: 'rgba(204, 29, 1, 0.7)', border: 'rgba(204, 29, 1, 1)'},
};

// 2. 목록에 없는 언어를 위해 무작위 색상을 생성하는 헬퍼 함수를 만듭니다.
function getRandomColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return {
    background: `rgba(${r}, ${g}, ${b}, 0.7)`,
    border: `rgba(${r}, ${g}, ${b}, 1)`,
  };
}


function LanguageChart({ username }) {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    async function fetchData() {
      setLoading(true);
      try {
        const result = await getLanguageStats(username);
        setStats(result);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [username]);

  const sortedStats = Object.entries(stats).sort(([, a], [, b]) => b - a);

  // 3. API 데이터 기반으로 색상 배열을 동적으로 생성합니다.
  const backgroundColors = [];
  const borderColors = [];
  const colorMap = { ...LANGUAGE_COLORS };

  sortedStats.forEach(([language]) => {
    if (!colorMap[language]) {
      // 미리 정의된 색상이 없으면 무작위 색상을 생성하여 추가
      colorMap[language] = getRandomColor();
    }
    backgroundColors.push(colorMap[language].background);
    borderColors.push(colorMap[language].border);
  });

  const chartData = {
    labels: sortedStats.map(data => data[0]),
    datasets: [
      {
        label: 'Bytes of Code',
        data: sortedStats.map(data => data[1]),
        // 4. 고정된 색상 배열 대신 동적으로 생성된 배열을 사용합니다.
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  if (loading) {
    return <div><p>언어 데이터 불러오는 중...</p></div>;
  }
  
  return (
    // 1. 최상위 div가 flex 속성을 이용해 높이를 100% 채우도록 스타일 추가
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* 제목이 줄어들지 않도록 설정 */}
      <h3 style={{ flexShrink: 0, textAlign: 'center' }}>Language Stats</h3> 
      {sortedStats.length > 0 ? (
        // 2. 차트를 감싸는 div가 남은 공간을 모두 차지하도록 설정
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <Pie data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p style={{ textAlign: 'center', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          언어 데이터를 찾을 수 없습니다.
        </p>
      )}
    </div>
  );
}

// (getLanguageStats 함수는 기존과 동일)
async function getLanguageStats(username) {
    const repoResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    if (!repoResponse.ok) {
        throw new Error(`GitHub API Error: ${repoResponse.status}`);
    }
    const repos = await repoResponse.json();
    let languageStats = {};
    for (const repo of repos) {
        if (repo.fork) continue;
        const langResponse = await fetch(repo.languages_url);
        if (langResponse.ok) {
            const languages = await langResponse.json();
            for (const lang in languages) {
                if (languageStats[lang]) {
                    languageStats[lang] += languages[lang];
                } else {
                    languageStats[lang] = languages[lang];
                }
            }
        }
    }
    return languageStats;
}

export default LanguageChart;
