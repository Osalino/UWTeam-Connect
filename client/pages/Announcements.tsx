import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Announcement {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [newAnnouncementCategory, setNewAnnouncementCategory] = useState<string>("General");

  async function fetchAnnouncements() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("/api/announcements", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch announcements:", response.status, response.statusText);
        return;
      }

      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  }

  async function addAnnouncement() {
    if (!title.trim() || !description.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          category: newAnnouncementCategory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add announcement");
      }

      setTitle("");
      setDescription("");
      setNewAnnouncementCategory("General");
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  }

  async function deleteAnnouncement(id: number) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const body = await response.text();
        console.error("Delete failed:", response.status, body);
        throw new Error("Failed to delete announcement");
      }
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await addAnnouncement();
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements =
    selectedCategory === "All"
      ? announcements
      : announcements.filter((a) => a.category === selectedCategory);

  const categories = ["All", "Important", "General", "Reminder", "Urgent"];

  return (
    <div className="bg-white h-screen">
      <div className="flex items-center justify-center p-2 border-b">
        <h1 className="text-2xl font-semibold">
          Announcements
          <p className="font-light text-xs">
            View and Manage team announcements
          </p>
        </h1>
      </div>

      <div className="flex gap-2 m-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-lg px-4 py-2 ${
              selectedCategory === category
                ? "bg-black text-white"
                : "border border-gray-300 text-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <section className="flex flex-col gap-4 p-4">
        <div className="border rounded-lg p-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Add New Announcement</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <input
              type="text"
              placeholder="Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <div className="flex gap-2">
              <select
                value={newAnnouncementCategory}
                onChange={(e) => setNewAnnouncementCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              >
                <option value="General">General</option>
                <option value="Important">Important</option>
                <option value="Reminder">Reminder</option>
                <option value="Urgent">Urgent</option>
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-blue-600"
              >
                <Plus className="h-4 w-4" />
                Add Announcement
              </button>
            </div>
          </form>
        </div>

        <div className="border-t-2 border-gray-300 my-4"></div>

        <h2 className="text-xl font-semibold mb-4">All Announcements</h2>

        {filteredAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">{announcement.title}</h2>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                  {announcement.category}
                </span>
                <button
                  onClick={() => deleteAnnouncement(announcement.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete announcement"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Posted by {announcement.author} • {announcement.date}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              {announcement.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
