type StatCardProps = {
  title: string;
  value: number;
  type: string;
};
function StatCard({ title, value, type }: StatCardProps) {

  const displayValue =
    type === 'percentage' ? `${(value * 100).toFixed(2)}%` : value.toLocaleString('en-US');

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-xl p-8 text-center">
      <div className="text-xl font-extrabold text-blue-700 mb-3 tracking-wide">{title}</div>
      <div className="text-3xl font-semibold text-gray-900">{displayValue}</div>
    </div>
  );
}

export default StatCard;
