interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
}

export default function ProgressBar({ percentage, showLabel = true }: ProgressBarProps) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Profile Completion
          </span>
          <span className="text-sm font-bold text-blue-600">
            {safePercentage}%
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${safePercentage}%` }}
        >
          <div className="h-full w-full bg-white opacity-20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
