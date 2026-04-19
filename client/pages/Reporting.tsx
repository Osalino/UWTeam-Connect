export default function Reporting() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Reporting</h1>
      <p className="text-gray-600 mb-8">
        View and analyze your reports and analytics.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Report 1
          </h3>
          <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
            <p className="text-gray-700">Chart Placeholder</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Report 2
          </h3>
          <div className="h-40 bg-gradient-to-br from-purple-100 to-purple-200 rounded flex items-center justify-center">
            <p className="text-gray-700">Chart Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
