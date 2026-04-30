const StatsCard = ({ label, value, accent }) => {
  return (
    <div className="panel p-6">
      <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${accent}`}>
        {label}
      </div>
      <div className="mt-5 font-display text-5xl text-ink">{value}</div>
    </div>
  );
};

export default StatsCard;
