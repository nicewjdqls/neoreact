export default function Datacollector_Back() {
  return (
    <div className="page Datacollector_Back">
      {/* Auto-converted from DataCollector_Back.html. Review and adjust event handlers/JS as needed. */}
      <><h1 className="text-3xl font-bold mb-6 text-gray-800">데이터 수집(학습 데이터 매핑)</h1>

  <div className="flex gap-6">

    {/* 왼쪽: DB 연결 정보 */}
    <div className="w-1/6">
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">DB 연결 정보</h2>
        <ul id="dbList" className="space-y-1 text-sm text-gray-700 max-h-96 overflow-y-auto">
          {/* 샘플 DB 연결 정보 삽입 */}
        </ul>
      </div>
    </div>

    {/* 오른쪽: 테이블/컬럼 선택, 학습 모델, 관계 매핑 */}
    <div className="flex-1 space-y-6">

      {/* DB 연결 버튼 */}
      <div className="flex justify-start mb-3">
        <button id="dbConnectBtn" className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">데이터베이스 연결</button>
      </div>

      {/* DB 연결 모달 */}
      <div id="dbModal" className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center hidden">
        <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">DB 연결 정보 입력</h2>
          <label className="text-sm font-medium text-gray-600">호스트</label>
          <input id="dbHost" type="text" placeholder="localhost" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-3 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          
          <label className="text-sm font-medium text-gray-600">포트</label>
          <input id="dbPort" type="text" placeholder="3306" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-3 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          
          <label className="text-sm font-medium text-gray-600">DB 이름</label>
          <input id="dbName" type="text" placeholder="test_db" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-3 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          
          <label className="text-sm font-medium text-gray-600">사용자</label>
          <input id="dbUser" type="text" placeholder="root" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-3 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          
          <label className="text-sm font-medium text-gray-600">비밀번호</label>
          <input id="dbPassword" type="password" placeholder="password" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-4 focus:outline-none focus:ring-1 focus:ring-indigo-500" />

          <div className="flex justify-end gap-3">
            <button id="cancelDbModal" className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">취소</button>
            <button id="saveDbModal" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">연결</button>
          </div>
        </div>
      </div>

      {/* 테이블 선택 / 컬럼 선택 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">원본 테이블</h2>
          <select id="sourceTable" className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option value="">-- 테이블 선택 --</option>
          </select>
          <div id="sourceCols" className="border border-gray-200 rounded-md p-2 max-h-48 overflow-y-auto bg-gray-50 mb-3"></div>
          <select id="sourceColumn" className="w-full border border-gray-300 rounded-lg px-3 py-2 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option value="">-- 원본 컬럼 선택 --</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">정답 테이블</h2>
          <select id="labelTable" className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option value="">-- 테이블 선택 --</option>
          </select>
          <div id="labelCols" className="border border-gray-200 rounded-md p-2 max-h-48 overflow-y-auto bg-gray-50 mb-3"></div>
          <select id="labelColumn" className="w-full border border-gray-300 rounded-lg px-3 py-2 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option value="">-- 정답 컬럼 선택 --</option>
          </select>
        </div>
      </div>

      {/* 학습 모델 */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">학습 모델 선택/입력</h2>
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">모델 이름 직접 입력</label>
            <input id="modelNameInput" type="text" placeholder="예: gpt-5-custom" 
                   className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">기존 모델 선택</label>
            <select id="modelNameSelect" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="">-- 선택 --</option>
              <option value="gpt-4">gpt-4</option>
              <option value="gpt-5">gpt-5</option>
              <option value="llama">llama</option>
            </select>
          </div>
        </div>
      </div>

      {/* 관계 매핑 */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">관계 매핑</h2>
        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-600">원본 관계 컬럼</label>
            <select id="relationSourceColumn" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="">-- 선택 --</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">정답 관계 컬럼</label>
            <select id="relationLabelColumn" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="">-- 선택 --</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <button id="mapBtn" className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">매핑 추가</button>
          <button id="trainBtn" className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">학습 데이터로 전송</button>
        </div>

      </div>

      {/* 하단: 매핑 결과 */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">매핑 결과</h2>
        <ul id="mapResultList" className="space-y-1 text-sm text-gray-700 max-h-48 overflow-y-auto">
          {/* 매핑 결과 샘플 */}
        </ul>
      </div>

    </div>

  </div></>
    </div>
  );
}
