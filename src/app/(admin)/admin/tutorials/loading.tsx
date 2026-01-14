export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 p-8 animate-pulse">
      <div className="space-y-3">
        <div className="w-64 h-10 bg-gray-800 rounded-lg" />
        <div className="w-96 h-4 bg-gray-800 rounded" />
      </div>
      {/* Form Skeleton */}
      <div className="h-64 bg-gray-900/50 rounded-2xl border border-gray-800" />
      {/* Table Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-gray-900/50 rounded-xl border border-gray-800" />
        ))}
      </div>
    </div>
  );
}