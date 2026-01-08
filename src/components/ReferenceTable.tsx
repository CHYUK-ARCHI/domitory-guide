import type { ReferenceItem } from '../lib/referenceData';

interface ReferenceTableProps {
  data: ReferenceItem[];
}

export function ReferenceTable({ data }: ReferenceTableProps) {
  // Group by category
  const groups = data.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof data>);

  // Calculate Grand Total
  const grandTotal = data.reduce((sum, item) => sum + item.area, 0);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">구분</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">세부시설</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">면적 (㎡)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Object.entries(groups).map(([category, items]) => {
            const subtotal = items.reduce((sum, item) => sum + item.area, 0);

            return (
              <>
                {items.map((item, idx) => (
                  <tr key={`${category}-${item.name}`} className="hover:bg-gray-50 transition-colors">
                    {idx === 0 ? (
                      <td 
                        className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900 bg-gray-50/50" 
                        rowSpan={items.length + 1}
                      >
                        {category}
                      </td>
                    ) : null}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {item.area > 0 ? item.area.toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
                {/* Subtotal */}
                <tr className="bg-gray-100 font-bold border-t border-gray-200 border-dashed">
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700 text-right">소계</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 text-right">
                    {subtotal.toLocaleString()}
                  </td>
                </tr>
              </>
            );
          })}
          
          {/* Grand Total */}
          <tr className="bg-gray-800 text-white font-bold border-t-4 border-gray-600">
            <td className="px-4 py-4 whitespace-nowrap text-sm text-center" colSpan={2}>합 계 (연면적)</td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
              {grandTotal.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
