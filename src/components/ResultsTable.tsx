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

  // Helper to find reference area
  const getRefArea = (category: string, name: string) => {
    // Try exact match first
    const found = referenceData.find(r => r.category === category && r.name === name);
    // Loose match if exact fail (optional, maybe just stick to exact for now)
    return found ? found.area : 0;
  };

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
          {Object.entries(groups).map(([category, spaces]) => (
            <>
              {spaces.map((space, idx) => {
                const refArea = getRefArea(category, space.name);
                const diff = space.area - refArea;
                // Only show diff if refArea exists (is non-zero) to avoid cluttering with full numbers against 0
                const hasRef = refArea > 0;

                return (
                  <tr key={`${category}-${space.name}`} className="hover:bg-gray-50 transition-colors">
                    {idx === 0 ? (
                      <td 
                        className="px-3 py-4 whitespace-nowrap text-xs font-medium text-gray-900 bg-gray-50/50" 
                        rowSpan={spaces.length}
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
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
