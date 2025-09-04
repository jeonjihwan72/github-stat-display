// src/CommitGraph.js

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js에 막대그래프에 필요한 요소들을 등록합니다.
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CommitGraph({ username }) {
  // 차트 데이터와 로딩 상태를 관리합니다.
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // username prop이 변경될 때마다 데이터를 새로 가져옵니다.
    if (!username) return;

    async function fetchCommitData() {
      setLoading(true);
      try {
        // GitHub Events API를 호출합니다. 한 페이지에 최대 100개의 이벤트를 가져옵니다.
        const res = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
        const events = await res.json();

        // 최근 30일의 날짜 배열을 생성하고, 커밋 수를 0으로 초기화합니다.
        const commitsByDate = {};
        for (let i = 0; i < 30; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateString = d.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식
          commitsByDate[dateString] = 0;
        }

        // API로 가져온 이벤트들 중 PushEvent만 필터링합니다.
        const pushEvents = events.filter(event => event.type === 'PushEvent');
        
        // 각 PushEvent를 순회하며 날짜별 커밋 수를 계산합니다.
        pushEvents.forEach(event => {
          const eventDate = event.created_at.split('T')[0];
          // 계산된 30일 범위 안에 있는 이벤트인지 확인합니다.
          if (commitsByDate.hasOwnProperty(eventDate)) {
            commitsByDate[eventDate] += event.payload.commits.length;
          }
        });

        // Chart.js 형식에 맞게 데이터를 가공합니다.
        // 날짜를 오름차순으로 정렬합니다.
        const sortedDates = Object.keys(commitsByDate).sort();
        
        const chartLabels = sortedDates.map(date => {
            // 'YYYY-MM-DD'에서 'MM-DD' 부분만 추출하여 라벨로 사용합니다.
            return date.substring(5);
        });
        const chartDatasetData = sortedDates.map(date => commitsByDate[date]);
        
        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: 'Daily Commits (Last 30 Days)',
              data: chartDatasetData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

      } catch (error) {
        console.error("커밋 데이터 조회 중 에러 발생:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCommitData();
  }, [username]); // username이 바뀔 때마다 useEffect가 다시 실행됩니다.

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return <div><p>커밋 기록을 불러오는 중...</p></div>;
  }
  
  // 데이터 로딩이 완료되면 차트를 렌더링합니다.
  return (
    <div>
      <h3>Recent Commits</h3>
      {chartData ? (
        <div style={{ position: 'relative', height: '250px' }}>
          <Bar 
            data={chartData} 
            options={{ 
              maintainAspectRatio: false, // 이 옵션으로 차트 높이를 조절할 수 있습니다.
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }} 
          />
        </div>
      ) : (
        <p>커밋 데이터를 불러오지 못했습니다.</p>
      )}
    </div>
  );
}

export default CommitGraph;