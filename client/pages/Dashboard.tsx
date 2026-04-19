export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome to your dashboard. This is a placeholder page that you can customize.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Metric {i}
            </h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">1,234</p>
            <p className="text-sm text-gray-600">Update this page with real data</p>
          </div>
        ))}
      </div>
    </div>
  );
}
