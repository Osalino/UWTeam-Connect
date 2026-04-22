import { useState } from "react";
import { Plus, Heart, Search } from "lucide-react";

interface ScripturePost {
  id: number;
  author: string;
  date: string;
  reference: string;
  verse: string;
  reflection: string;
  theme: string;
  likes: number;
  liked: boolean;
}

const INITIAL_POSTS: ScripturePost[] = [
  {
    id: 1,
    author: "Pastor James",
    date: "April 20, 2026",
    reference: "Philippians 4:6–7",
    verse:
      "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    reflection:
      "As we prepare for Sunday's service, let this verse remind us to bring everything to God — our rehearsals, our nerves, and our gratitude.",
    theme: "Peace",
    likes: 8,
    liked: false,
  },
  {
    id: 2,
    author: "Sarah M.",
    date: "April 18, 2026",
    reference: "Psalm 96:1",
    verse: "Sing to the Lord a new song; sing to the Lord, all the earth.",
    reflection:
      "This is literally our calling. Every time we step on that stage, we are living out this scripture. Let's do it with all we have!",
    theme: "Worship",
    likes: 12,
    liked: false,
  },
  {
    id: 3,
    author: "David K.",
    date: "April 15, 2026",
    reference: "Isaiah 40:31",
    verse:
      "But those who hope in the Lord will renew their strength. They will soar on wings like eagles.",
    reflection:
      "For anyone feeling tired or stretched this season — hold on. God renews. He restores. Trust in Him.",
    theme: "Strength",
    likes: 6,
    liked: false,
  },
];

const THEMES = ["Peace", "Worship", "Strength", "Trust", "Courage", "Joy", "Faith", "Grace"];

interface AddPostModalProps {
  onClose: () => void;
  onAdd: (post: Omit<ScripturePost, "id" | "likes" | "liked">) => void;
  author: string;
}

function AddPostModal({ onClose, onAdd, author }: AddPostModalProps) {
  const [reference, setReference] = useState("");
  const [verse, setVerse] = useState("");
  const [reflection, setReflection] = useState("");
  const [theme, setTheme] = useState("Peace");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reference.trim() || !verse.trim()) {
      setError("Bible reference and verse text are required.");
      return;
    }
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    onAdd({ author, date: today, reference: reference.trim(), verse: verse.trim(), reflection: reflection.trim(), theme });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Post a Scripture</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bible Reference *</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. Philippians 4:6–7"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Verse Text *</label>
            <textarea
              value={verse}
              onChange={(e) => setVerse(e.target.value)}
              rows={3}
              placeholder="Type the scripture verse here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reflection / Message</label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={2}
              placeholder="Add a short encouragement or reflection..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {THEMES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              Post Scripture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ScriptureWall() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const authorName = user.username || "Anonymous";

  const [posts, setPosts] = useState<ScripturePost[]>(INITIAL_POSTS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  function toggleLike(id: number) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }

  function addPost(data: Omit<ScripturePost, "id" | "likes" | "liked">) {
    const newPost: ScripturePost = {
      ...data,
      id: Date.now(),
      likes: 0,
      liked: false,
    };
    setPosts((prev) => [newPost, ...prev]);
  }

  const filtered = posts.filter(
    (p) =>
      p.reference.toLowerCase().includes(search.toLowerCase()) ||
      p.verse.toLowerCase().includes(search.toLowerCase()) ||
      p.theme.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      {showModal && (
        <AddPostModal
          onClose={() => setShowModal(false)}
          onAdd={addPost}
          author={authorName}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Scripture Wall</h1>
          <p className="text-xs text-gray-400 font-light mt-0.5">
            Share and encourage one another with God's Word
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search scriptures..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black w-52"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            <Plus className="h-4 w-4" />
            Post Scripture
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto p-6 flex flex-col gap-5">
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-16">No scriptures found.</p>
        )}

        {filtered.map((post) => {
          const initials = post.author
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <div key={post.id} className="border border-gray-200 rounded-2xl p-5 shadow-sm bg-white">
              {/* Author row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                  <p className="text-xs text-gray-400">{post.date}</p>
                </div>
                <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
                  {post.theme}
                </span>
              </div>

              {/* Reference */}
              <p className="text-gray-900 text-sm font-semibold mb-2">{post.reference}</p>

              {/* Verse */}
              <p className="text-gray-700 text-sm leading-relaxed italic border-l-4 border-gray-300 pl-3 mb-3">
                "{post.verse}"
              </p>

              {/* Reflection */}
              {post.reflection && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.reflection}</p>
              )}

              {/* Like & Comment row */}
              <div className="flex items-center gap-5 pt-3 border-t border-gray-100">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-sm transition ${
                    post.liked ? "text-gray-900" : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${post.liked ? "fill-gray-900" : ""}`} />
                  <span>{post.likes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
