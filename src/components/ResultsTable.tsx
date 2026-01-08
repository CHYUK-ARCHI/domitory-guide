import type { CalculationResult } from '../lib/calculator';
import type { ReferenceItem } from '../lib/referenceData';

interface ResultsTableProps {
  data: CalculationResult['spaces'];
  referenceData?: ReferenceItem[];
}

export function ResultsTable({ data, referenceData = [] }: ResultsTableProps) {
  // Group by category
  const groups = data.reduce((acc, space) => {
    if (!acc[space.category]) acc[space.category] = [];
    acc[space.category].push(space);
    return acc;
  }, {} as Record<string, typeof data>);

  // Mapping for Calculated Name -> Reference Items (sum them up)
  const REF_MAPPING: Record<string, string[]> = {
    '스터디라운지': ['층별 스터디룸 및 휴게라운지', '로비 및 라운지'],
    '공유주방': ['층별 미니주방'],
    '공동세탁실': ['공동세탁실 및 건조실'],
    '체력단련실': ['체력단련실'], // Direct match now
    '짐·택배 통합보관실': ['택배보관실', '프린터실', '기도실'],
    '행정라운지': ['관리행정공간 (소계)'],
    '경비실': [], // Assume part of admin or separate? Left empty, means 0 ref.
    '당직실': [],
    '근로자휴게실': [],
    '사감실(남)': [],
    '사감실(여)': [], 
    // Since we mapped the big "관리행정공간 (소계)" to "행정라운지" primarily, 
    // the TOTAL for the category will align if we consider all these as part of that reference block
    // or if the reference 250 covers all these. 
    // The user said "Manage space total just 250". 
  };

  // Helper to find reference area
  const getRefArea = (category: string, name: string) => {
    // 1. Check explicit mapping
    const mapping = REF_MAPPING[name];
    if (mapping) {
      return mapping.reduce((sum, refName) => {
        const item = referenceData.find(r => r.name === refName);
        return sum + (item ? item.area : 0);
      }, 0);
    }
    
    // 2. Default: exact match
    const found = referenceData.find(r => r.category === category && r.name === name);
    return found ? found.area : 0;
  };

  // Calculate Grand Totals
  let totalCalc = 0;
  let totalRef = 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">구분</th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">세부시설</th>
            <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">개소/실</th>
            <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-indigo-700 uppercase tracking-wider bg-indigo-50/50">계획면적</th>
            <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">현상안</th>
            <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">증감</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Object.entries(groups).map(([category, spaces]) => {
            // Calculate totals for this category
            const catCalcSum = spaces.reduce((sum, s) => sum + s.area, 0);
            const catRefSum = spaces.reduce((sum, s) => sum + getRefArea(category, s.name), 0);
            const catDiff = catCalcSum - catRefSum;
            const hasCatRef = catRefSum > 0;

            // Accumulate to Grand Total
            totalCalc += catCalcSum;
            totalRef += catRefSum;

            return (
              <>
                {spaces.map((space, idx) => {
                  const refArea = getRefArea(category, space.name);
                  const diff = space.area - refArea;
                  const hasRef = refArea > 0;

                  return (
                    <tr key={`${category}-${space.name}`} className="hover:bg-gray-50 transition-colors">
                      {idx === 0 ? (
                        <td 
                          className="px-3 py-4 whitespace-nowrap text-xs font-medium text-gray-900 bg-gray-50/50" 
                          rowSpan={spaces.length + 1} // +1 for subtotal row
                        >
                          {category}
                        </td>
                      ) : null}
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{space.name}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{space.units.toLocaleString()}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-bold text-indigo-700 text-right bg-indigo-50/30">
                        {space.area.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-400 text-right">
                        {hasRef ? refArea.toLocaleString() : '-'}
                      </td>
                      <td className={`px-3 py-4 whitespace-nowrap text-sm font-medium text-right ${
                        !hasRef ? 'text-gray-300' : diff > 0 ? 'text-blue-600' : diff < 0 ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {hasRef ? (diff > 0 ? `+${diff.toLocaleString(undefined, { maximumFractionDigits: 1 })}` : diff.toLocaleString(undefined, { maximumFractionDigits: 1 })) : '-'}
                      </td>
                    </tr>
                  );
                })}
                {/* Subtotal Row */}
                <tr className="bg-gray-100 font-bold border-t-2 border-gray-200">
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-700 text-right">
                    {category === '공용공간' ? '소계 (E/V홀, 복도, 계단실, 공용 화장실, 기계실 등)' : '소계'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500 text-right">-</td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-indigo-800 text-right bg-indigo-100/50">
                    {catCalcSum.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600 text-right">
                    {hasCatRef ? catRefSum.toLocaleString() : '-'}
                  </td>
                  <td className={`px-3 py-3 whitespace-nowrap text-xs text-right ${
                    !hasCatRef ? 'text-gray-400' : catDiff > 0 ? 'text-blue-700' : catDiff < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                     {hasCatRef ? (catDiff > 0 ? `+${catDiff.toLocaleString(undefined, { maximumFractionDigits: 1 })}` : catDiff.toLocaleString(undefined, { maximumFractionDigits: 1 })) : '-'}
                  </td>
                </tr>
              </>
            );
          })}
          
          {/* Grand Total Row */}
          <tr className="bg-gray-800 text-white font-bold border-t-4 border-gray-600">
            <td className="px-3 py-4 whitespace-nowrap text-sm text-center" colSpan={3}>총 계 (연면적)</td>
            <td className="px-3 py-4 whitespace-nowrap text-sm text-right bg-indigo-900/50">
              {totalCalc.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </td>
            <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-300">
              {totalRef.toLocaleString()}
            </td>
            <td className={`px-3 py-4 whitespace-nowrap text-sm text-right ${
              (totalCalc - totalRef) > 0 ? 'text-blue-300' : (totalCalc - totalRef) < 0 ? 'text-red-300' : 'text-gray-400'
            }`}>
              {(totalCalc - totalRef) > 0 ? `+${(totalCalc - totalRef).toLocaleString(undefined, { maximumFractionDigits: 1 })}` : (totalCalc - totalRef).toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
