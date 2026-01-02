

interface SummaryCardProps {
  title: string;
  value: string;
  subValue?: string;
  color?: 'blue' | 'indigo' | 'emerald' | 'violet';
}

export function SummaryCard({ title, value, subValue, color = 'indigo' }: SummaryCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
  };

  return (
    <div className={`p-6 rounded-2xl border ${colorClasses[color]} shadow-sm hover:shadow-md transition-shadow`}>
      <h3 className="text-sm font-medium opacity-75 mb-1">{title}</h3>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      {subValue && (
        <p className="text-sm mt-2 opacity-80">{subValue}</p>
      )}
    </div>
  );
}
