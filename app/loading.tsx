export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass rounded-2xl p-12 animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    </div>
  );
}
