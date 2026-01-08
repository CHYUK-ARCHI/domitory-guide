import { useState } from "react";
import { calculateArea, calculateResidents, type CalculationMode } from "./lib/calculator";
import { REFERENCE_DATA } from "./lib/referenceData";
import { SummaryCard } from "./components/SummaryCard";
import { ResultsTable } from "./components/ResultsTable";

function App() {
  const [residents, setResidents] = useState<number>(800);
  const [targetGrossArea, setTargetGrossArea] = useState<number>(10000);
  const [mode, setMode] = useState<CalculationMode>('Recommended');
  const [isReverseMode, setIsReverseMode] = useState(false);
  
  // Create a derived state for actual residents used in calculation
  // In Reverse Mode, this is calculated from targetGrossArea
  const effectiveResidents = isReverseMode 
    ? calculateResidents(targetGrossArea, mode)
    : residents;

  const result = calculateArea(effectiveResidents, mode);

  // Sync residents state when switching back from reverse mode (optional UX improvement)
  // But let's keep them independent inputs effectively.

  const handleResidentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0) {
      setResidents(val);
    }
  };

  const handleGrossAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0) {
      setTargetGrossArea(val);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg">
              S
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              기숙사 면적산정 프로그램
            </h1>
          </div>
          <div className="text-sm font-medium text-gray-500">
            TR2024-01 기준
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Controls Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10 ring-1 ring-gray-900/5">
          
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setIsReverseMode(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  !isReverseMode ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                인원 기준 산출
              </button>
              <button
                onClick={() => setIsReverseMode(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isReverseMode ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                연면적 기준 산출 (역산)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* Input Section */}
            <div className="space-y-2">
              <label htmlFor="input-main" className="block text-sm font-semibold text-gray-700">
                {isReverseMode ? '목표 연면적' : '수용 인원'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="input-main"
                  value={isReverseMode ? targetGrossArea : residents}
                  onChange={isReverseMode ? handleGrossAreaChange : handleResidentsChange}
                  min="0"
                  step={isReverseMode ? "100" : "10"}
                  className="block w-full rounded-xl border-gray-300 pl-4 pr-12 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all sm:text-lg bg-gray-50 focus:bg-white"
                  placeholder="숫자 입력..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <span className="text-gray-400 font-medium">
                    {isReverseMode ? '㎡' : '명'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium ml-1">
                {isReverseMode 
                  ? `가능 수용 인원: ${effectiveResidents}명` 
                  : '일반적인 범위: 100 - 1400명'}
              </p>
            </div>

            {/* Mode Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">산출 기준</label>
              <div className="flex rounded-xl bg-gray-100 p-1 shadow-inner">
                <button
                  onClick={() => setMode('Recommended')}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                    mode === 'Recommended'
                      ? 'bg-white text-indigo-700 shadow-md ring-1 ring-black/5'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  권장 (Recommended)
                  <span className="block text-[10px] font-normal opacity-70 mt-0.5">공용면적 35%</span>
                </button>
                <button
                  onClick={() => setMode('Basic')}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                    mode === 'Basic'
                      ? 'bg-white text-indigo-700 shadow-md ring-1 ring-black/5'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  기본 (Basic)
                  <span className="block text-[10px] font-normal opacity-70 mt-0.5">공용면적 29%</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* stats grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryCard 
            title="연면적 (Gross Area)" 
            value={`${result.grossArea.toLocaleString(undefined, { maximumFractionDigits: 1 })} ㎡`} 
            subValue="전체 바닥 면적 합계"
            color="indigo"
          />
          <SummaryCard 
            title="전용면적 (Net Area)" 
            value={`${result.netArea.toLocaleString(undefined, { maximumFractionDigits: 1 })} ㎡`} 
            subValue="실제 사용 공간 합계"
            color="blue"
          />
          <div className="relative group">
            <SummaryCard 
              title="공용면적 (Shared Area)" 
              value={`${result.sharedArea.toLocaleString(undefined, { maximumFractionDigits: 1 })} ㎡`} 
              subValue={`${mode === 'Recommended' ? '35%' : '29%'} 적용`}
              color="violet"
            />
            {/* Tooltip for Shared Area */}
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-20 pointer-events-none">
              <p className="font-bold mb-1">공용면적 포함 항목:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-gray-300">
                <li>E/V홀, 복도, 계단실</li>
                <li>공용 화장실</li>
                <li>기계실, 전기실</li>
                <li>기타 설비 공간 등</li>
              </ul>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
            </div>
          </div>
          <SummaryCard 
            title="1인당 면적" 
            value={`${result.areaPerPerson.toLocaleString(undefined, { maximumFractionDigits: 2 })} ㎡`}
            subValue="연면적 / 수용인원" 
            color="emerald"
          />
        </section>

        {/* Results Table & Reference Image */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">공간별 세부 면적 (Space Breakdown)</h2>
            <button 
                onClick={() => window.print()} 
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                리포트 출력
            </button>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Column: Calculation Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">산출된 면적 프로그램</h3>
              <ResultsTable data={result.spaces} referenceData={REFERENCE_DATA} />
            </div>

            {/* Right Column: Reference Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">현상계획안 면적표 (참고자료)</h3>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4">
                <img 
                  src="/area_table_reference.png" 
                  alt="Design Proposal Area Table" 
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-400">
          <p>기숙사 면적산정 프로그램 &copy; 2024</p>
          <a 
            href="/domitory-guide/TR2024-01_area_program_template.xlsx" 
            className="inline-block mt-2 text-indigo-400 hover:text-indigo-600 underline decoration-indigo-200 underline-offset-2 transition-colors"
          >
            참조 템플릿 다운로드 (Excel)
          </a>
        </div>
      </footer>

    </div>
  );
}

export default App;
