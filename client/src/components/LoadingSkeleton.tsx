// Loading Skeleton Component for Stats
export function StatsLoading() {
  return (
    <div className="card max-w-4xl mx-auto bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-900 border-2 border-primary-200 dark:border-primary-800">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-3"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Shimmer effect for loading
export function Shimmer() {
  return (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
  );
}
