export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <div className="w-64 h-10 bg-gray-800 rounded-lg" />
          <div className="w-48 h-4 bg-gray-800 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-16 bg-gray-900/50 rounded-xl border border-gray-800" />
        <div className="h-16 bg-gray-900/50 rounded-xl border border-gray-800" />
      </div>
      <div className="h-96 bg-gray-900/50 rounded-[2rem] border border-gray-800" />
    </div>
  );
}