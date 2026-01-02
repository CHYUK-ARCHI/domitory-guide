import { useState, useEffect } from 'react';
import { calculateArea, type CalculationMode } from './lib/calculator';
import { SummaryCard } from './components/SummaryCard';
import { ResultsTable } from './components/ResultsTable';

function App() {
  const [residents, setResidents] = useState<number>(800);
  const [mode, setMode] = useState<CalculationMode>('Recommended');
  
  const [result, setResult] = useState(calculateArea(800, 'Recommended'));

  useEffect(() => {
    setResult(calculateArea(residents, mode));
  }, [residents, mode]);

  const handleResidentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0) {
      setResidents(val);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg">
              D
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Dormitory Area Calculator
            </h1>
          </div>
          <div className="text-sm font-medium text-gray-500">
            TR2024-01 Standard
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Controls Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10 ring-1 ring-gray-900/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* Residents Input */}
            <div className="space-y-2">
              <label htmlFor="residents" className="block text-sm font-semibold text-gray-700">
                Number of Residents
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="residents"
                  value={residents}
                  onChange={handleResidentsChange}
                  min="0"
                  step="10"
                  className="block w-full rounded-xl border-gray-300 pl-4 pr-12 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all sm:text-lg bg-gray-50 focus:bg-white"
                  placeholder="Enter number..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <span className="text-gray-400 font-medium">ppl</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium ml-1">
                Typical range: 100 - 1400
              </p>
            </div>

            {/* Mode Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Calculation Standard</label>
              <div className="flex rounded-xl bg-gray-100 p-1 shadow-inner">
                <button
                  onClick={() => setMode('Recommended')}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                    mode === 'Recommended'
                      ? 'bg-white text-indigo-700 shadow-md ring-1 ring-black/5'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  Recommended
                  <span className="block text-[10px] font-normal opacity-70 mt-0.5">35% Shared Area</span>
                </button>
                <button
                  onClick={() => setMode('Basic')}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                    mode === 'Basic'
                      ? 'bg-white text-indigo-700 shadow-md ring-1 ring-black/5'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  Basic
                  <span className="block text-[10px] font-normal opacity-70 mt-0.5">29% Shared Area</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* stats grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryCard 
            title="Total Gross Area" 
            value={`${result.grossArea.toLocaleString(undefined, { maximumFractionDigits: 1 })} ㎡`} 
            subValue="Total Floor Area"
            color="indigo"
          />
          <SummaryCard 
            title="Net Area" 
            value={`${result.netArea.toLocaleString(undefined, { maximumFractionDigits: 1 })} ㎡`} 
            subValue="Exclusive Use"
            color="blue"
          />
          <SummaryCard 
            title="Shared Area" 
            value={`${result.sharedArea.toLocaleString(undefined, { maximumFractionDigits: 1 })} ㎡`} 
            subValue={`${mode === 'Recommended' ? '35%' : '29%'} of Gross`}
            color="violet"
          />
          <SummaryCard 
            title="Area Per Person" 
            value={`${result.areaPerPerson.toLocaleString(undefined, { maximumFractionDigits: 2 })} ㎡`}
            subValue="Gross / Residents" 
            color="emerald"
          />
        </section>

        {/* Results Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Space Breakdown</h2>
            <button 
                onClick={() => window.print()} 
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Print Report
            </button>
          </div>
          <ResultsTable data={result.spaces} />
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-400">
          Dormitory Area Standard Calculator &copy; 2024
        </div>
      </footer>

    </div>
  );
}

export default App;
