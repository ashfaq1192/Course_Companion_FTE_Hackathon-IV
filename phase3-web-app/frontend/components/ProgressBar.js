// components/ProgressBar.js
export default function ProgressBar({ percentage, height = "h-4", color = "bg-blue-600" }) {
  return (
    <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
      <div 
        className={`${height} ${color} rounded-full transition-all duration-500 ease-in-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}