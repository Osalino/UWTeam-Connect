import { useNavigate } from "react-router-dom";
import { Calendar, Users, Bell, Music } from "lucide-react";
import { useEffect, useState } from "react";

interface Announcement {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
}

export default function Index() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/announcements", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAnnouncements(data.slice(0, 3)); // Show only latest 3
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  }

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
            onClick={() => navigate("/library")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
              <Music className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Songs Library</h3>
            <p className="text-sm text-gray-600 mt-1">Browse set-lists</p>
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

        {/* Recent Announcements Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Announcements
            </h2>
            <button
              onClick={() => navigate("/announcements")}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>
          {announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">
                      {announcement.title}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {announcement.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {announcement.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Posted by {announcement.author} • {announcement.date}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No announcements yet
            </p>
          )}
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