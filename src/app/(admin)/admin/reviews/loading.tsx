export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <div className="w-64 h-10 bg-gray-800 rounded-lg" />
          <div className="w-48 h-4 bg-gray-800 rounded" />
        </div>
        <div className="w-32 h-16 bg-gray-800 rounded-2xl" />
      </div>

      {/* Tabs & Search Skeleton */}
      <div className="bg-gray-900/50 h-64 rounded-[2rem] border border-gray-800 p-8 space-y-6">
        <div className="flex gap-4 border-b border-gray-800 pb-4">
          <div className="flex-1 h-8 bg-gray-800 rounded" />
          <div className="flex-1 h-8 bg-gray-800 rounded" />
        </div>
        <div className="w-full h-12 bg-gray-800 rounded-xl" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-800/50 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}