import { Link } from 'react-router-dom';
export default function Index2() {
  return (
    <div className="page Index2">
      {/* Auto-converted from index2.html. Review and adjust event handlers/JS as needed. */}
      <>{/* Login Modal */}
  <div id="loginModal" className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-2">사용자 로그인</h2>
      <p className="text-sm muted mb-4">데모: 아이디 <code>admin</code> / 비밀번호 <code>admin</code></p>
      <form id="loginForm" className="space-y-4">
        <div>
          <label className="block text-sm mb-1">아이디</label>
          <input id="loginUser" type="text" className="w-full border rounded-lg px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">비밀번호</label>
          <input id="loginPass" type="password" className="w-full border rounded-lg px-3 py-2" required />
        </div>
        <div className="flex items-center gap-2">
          <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">로그인</button>
          <button type="button" id="guestBtn" className="px-4 py-2 border rounded-lg">게스트</button>
        </div>
        <p className="text-xs muted">실 운영 시에는 반드시 서버측 인증 연동</p>
      </form>
    </div>
  </div>

  {/* Dashboard */}
  <div id="dashboard" className="max-w-[1300px] mx-auto p-6 hidden">
    {/* Header */}
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 grid place-items-center text-white font-bold">AI</div>
        <div>
          <h1 className="text-2xl font-semibold">Neo AI Portal</h1>
          <p className="text-sm muted">실시간 모델 & 인프라 모니터링 · 서비스 상태 · 사용량</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-right">
          <div className="text-xs muted">환경</div>
          <div className="font-medium">Production</div>
        </div>
        <div className="text-sm text-right">
          <div className="text-xs muted">사용자</div>
          <div id="userName" className="font-medium">—</div>
        </div>
        <button id="logoutBtn" className="px-4 py-2 rounded-lg bg-rose-600 text-white">로그아웃</button>
      </div>
    </header>

    {/* 메뉴 바 */}
    <nav className="bg-slate-100 px-4 py-2 rounded-lg mb-4">
      <ul className="flex gap-6 text-sm font-medium">
        <li><Link to="/">모니터링</Link></li>
        <li><Link to="/datacollector">데이터 수집</Link></li>
        <li><Link to="/modelmanage">학습모델</Link></li>
        <li><Link to="/chat">AI Chat관리</Link></li>
        <li><Link to="/code">APIs</Link></li>
        <li><span className="cursor-pointer">설정</span></li>
      </ul>
    </nav>

    {/* KPI row */}
    <section className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs muted">활성 세션</div>
            <div id="kpi-sessions" className="text-2xl font-semibold">—</div>
            <div className="text-xs muted">동시 사용자 / 지난 1분</div>
          </div>
          <div className="text-right">
            <div className="text-xs muted">에러율</div>
            <div id="kpi-error" className="text-xl text-red-600 font-semibold">—</div>
          </div>
        </div>
      </div>
      <div className="card p-5">
        <div className="text-xs muted">평균 응답시간 (p90)</div>
        <div id="kpi-latency" className="text-2xl font-semibold my-2">— ms</div>
        <div className="text-xs muted">지연 시간 추적 (모델 + 네트워크)</div>
      </div>
      <div className="card p-5">
        <div className="text-xs muted">토큰 사용량 (오늘)</div>
        <div id="kpi-tokens" className="text-2xl font-semibold my-2">—</div>
        <div className="text-xs muted">총 토큰 / API 요청</div>
      </div>
      <div className="card p-5">
        <div className="text-xs muted">만족도 평가(오늘)</div>
        <div id="kpi-cost" className="text-2xl font-semibold my-2"></div>
        <div className="text-xs muted">만족도 평가 합산 (추정)</div>
      </div>
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs muted">APIs 사용현황(오늘)</div>
            <div id="api-sessions" className="text-2xl font-semibold  my-2">—</div>
            <div className="text-xs muted">총 API호출 현황</div>
          </div>
          <div className="text-right">
            <div className="text-xs muted">에러율</div>
            <div id="api-error" className="text-xl text-red-600 font-semibold">—</div>
          </div>
        </div>
      </div>
    </section>

    {/* Main grid */}
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <div className="card p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold">모델 처리량 & 지연</h2>
              <p className="text-sm muted">요청 수 · 성공/실패 비율 · p50/p90 응답시간</p>
            </div>
            <div className="text-sm muted text-right">
              <div>업데이트: <span id="chart-last-update">—</span></div>
            </div>
          </div>
          <div className="relative h-64">
            <canvas id="throughputChart"></canvas>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold">모델별 요청 분포</h2>
              <p className="text-sm muted">각 모델이 처리하는 요청 비율</p>
            </div>
            <div className="flex items-center gap-2">
              <select id="modelFilter" className="border rounded-md px-2 py-1 text-sm">
                <option value="all">모든 모델</option>
                <option value="gpt-4">gpt-4</option>
                <option value="gpt-5">gpt-5</option>
                <option value="llama">llama</option>
              </select>
            </div>
          </div>
          <div className="relative h-64">
            <canvas id="modelPie"></canvas>
          </div>
        </div>

        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-2">데이터 수집 현황</h2>
          <p className="text-sm muted mb-2">그룹별 수집된 데이터 건수</p>
          <div className="relative h-64">
            <canvas id="dataCollectorChart"></canvas>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold">실시간 로그 (최근 100개)</h2>
              <p className="text-sm muted">오류 / 경고 / 상태 변경</p>
            </div>
            <div className="text-sm muted">필터:
              <select id="logLevel" className="border rounded-md px-2 py-1 text-sm">
                <option>ALL</option><option>ERROR</option><option>WARN</option><option>INFO</option>
              </select>
            </div>
          </div>
          <div id="logBox" className="h-48 overflow-y-auto p-2 border rounded-md scrollbar-thin bg-slate-50"></div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card p-4">
          <h3 className="text-md font-semibold mb-2">GPU / 서버 자원</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm muted">GPU 사용률 (전체)</div>
                <div id="gpuUsage" className="text-lg font-medium">—%</div>
              </div>
              <div style={{ width: "120px" }}><canvas id="gpuSpark" height="40"></canvas></div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm muted">메모리 사용</div>
                <div id="memUsage" className="text-lg font-medium">— / — GB</div>
              </div>
              <div style={{ width: "120px" }}><canvas id="memSpark" height="40"></canvas></div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm muted">큐 대기 길이</div>
                <div id="queueLen" className="text-lg font-medium">—</div>
              </div>
              <div style={{ width: "120px" }}><canvas id="queueSpark" height="40"></canvas></div>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="text-md font-semibold mb-2">노드 상태</h3>
          <div id="nodes" className="space-y-2"></div>
        </div>

        <div className="card p-4">
          <h3 className="text-md font-semibold mb-2">알림 & 이벤트</h3>
          <div id="alerts" className="space-y-2 text-sm muted">현재 이상 없음</div>
        </div>
      </aside>
    </section>

    {/* Footer */}
    <footer className="mt-6 flex items-center justify-between">
      <div className="text-sm muted">데이터는 샘플이며 실제 운영과 연동하려면 API 또는 WebSocket 연결 필요</div>
      <div className="flex items-center gap-3">
        <button id="refreshBtn" className="px-4 py-2 rounded-lg bg-slate-100">강제 새로고침</button>
        <button id="pauseBtn" className="px-4 py-2 rounded-lg bg-rose-50 text-rose-600">알림 일시정지</button>
      </div>
    </footer>
  </div>

  {/* Script: demo data & charts */}</>
    </div>
  );
}
