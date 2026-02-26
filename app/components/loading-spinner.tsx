export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-2xl p-8 flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-zinc-200 dark:border-zinc-700 rounded-full"></div>
          {/* Spinning ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          {/* Inner pulse */}
          <div className="absolute inset-2 bg-blue-500/20 rounded-full animate-pulse"></div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Loading events...
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Please wait
          </p>
        </div>
      </div>
    </div>
  );
}
