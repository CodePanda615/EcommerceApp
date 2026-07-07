export default function StatCard({
  icon: Icon,
  label,
  value,
  color = "navy",
}) {
  const colorClasses = {
    navy: "bg-navy-50 border-navy-200 text-navy-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
    green: "bg-green-50 border-green-200 text-green-900",
    red: "bg-red-50 border-red-200 text-red-900",
    teal: "bg-teal-50 border-teal-200 text-teal-900",
  };

  const iconClasses = {
    navy: "text-navy-600",
    amber: "text-amber-600",
    green: "text-green-600",
    red: "text-red-600",
    teal: "text-teal-600",
  };

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <Icon size={40} className={`opacity-20 ${iconClasses[color]}`} />
      </div>
    </div>
  );
}
