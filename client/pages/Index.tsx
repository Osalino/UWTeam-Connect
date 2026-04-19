import { useNavigate } from "react-router-dom";
import { Calendar, Users, Bell } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600">
            Manage your worship team effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Dashboard</h3>
            <p className="text-sm text-gray-600 mt-1">View team stats</p>
          </button>

          <button
            onClick={() => navigate("/schedule")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
            <p className="text-sm text-gray-600 mt-1">Manage events</p>
          </button>

          <button
            onClick={() => navigate("/announcements")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
              <Bell className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
            <p className="text-sm text-gray-600 mt-1">Team updates</p>
          </button>

          <button
            onClick={() => navigate("/teammembers")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <div className="p-3 bg-orange-100 rounded-lg inline-block mb-4">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            <p className="text-sm text-gray-600 mt-1">Manage team</p>
          </button>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            UWTeam Connect
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your central hub for managing the Unshaken Worship Team.
          </p>
        </div>
      </div>
    </div>
  );
}