
import type { CalculationResult } from '../lib/calculator';

interface ResultsTableProps {
  data: CalculationResult['spaces'];
}

export function ResultsTable({ data }: ResultsTableProps) {
  // Group by category
  const groups = data.reduce((acc, space) => {
    if (!acc[space.category]) acc[space.category] = [];
    acc[space.category].push(space);
    return acc;
  }, {} as Record<string, typeof data>);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Space Name</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Units</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Area (㎡)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Object.entries(groups).map(([category, spaces]) => (
            <>
              {spaces.map((space, idx) => (
                <tr key={`${category}-${space.name}`} className="hover:bg-gray-50 transition-colors">
                  {idx === 0 ? (
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50/50" 
                      rowSpan={spaces.length}
                    >
                      {category}
                    </td>
                  ) : null}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{space.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{space.units}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {space.area.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
