export default function Schedule() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Support</h1>
      <p className="text-gray-600 mb-8">
        Get help and support for any issues you encounter.
      </p>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            📧 Contact Support
          </h3>
          <p className="text-gray-600 mb-4">
            Reach out to our support team for assistance.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Send Message
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ❓ FAQ
          </h3>
          <p className="text-gray-600">
            Check out our frequently asked questions for quick answers.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            📚 Documentation
          </h3>
          <p className="text-gray-600">
            Read our comprehensive documentation for detailed information.
          </p>
        </div>
      </div>
    </div>
  );
}
