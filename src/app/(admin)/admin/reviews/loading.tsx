export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-3">
          <div className="w-64 h-10 bg-gray-800 rounded-lg" />
          <div className="w-48 h-4 bg-gray-800 rounded" />
        </div>
        <div className="w-32 h-16 bg-gray-800 rounded-2xl" />
      </div>
      <div className="h-20 bg-gray-900/50 rounded-[2rem] border border-gray-800" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-900/50 rounded-[1.5rem] border border-gray-800" />
        ))}
      </div>
    </div>
  );
}