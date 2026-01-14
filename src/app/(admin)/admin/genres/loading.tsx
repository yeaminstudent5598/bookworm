export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8 animate-pulse">
      <div className="space-y-3">
        <div className="w-48 h-10 bg-gray-800 rounded-lg" />
        <div className="w-72 h-4 bg-gray-800 rounded" />
      </div>
      {/* Form Skeleton */}
      <div className="h-20 bg-gray-900/50 rounded-3xl border border-gray-800" />
      {/* Table Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-900/50 rounded-2xl border border-gray-800" />
        ))}
      </div>
    </div>
  );
}