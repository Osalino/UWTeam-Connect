// Import React hooks and routing
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, User } from "lucide-react"; // Icons from lucide library

export default function Login() {
  // Component state management
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login/signup mode
  const [username, setUsername] = useState("");  // Username input field
  const [password, setPassword] = useState("");  // Password input field
  const [role, setRole] = useState<"leader" | "member">("member");  // Selected role
  const [error, setError] = useState("");        // Error message to display
  const navigate = useNavigate();                // React Router navigation hook

  /**
   * Handle login/signup form submission
   * Validates input, sends request to backend, stores token, and redirects
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();  // Prevent default form submission (page reload)
    setError("");        // Clear any previous error messages

    // Client-side validation before sending to server
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    // Check username length (must be 3+ characters for backend validation)
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    // Check password length (must be 6+ characters for backend validation)
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      // Determine which API endpoint to call based on login/signup mode
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

      // Send POST request to backend API
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // Tell server we're sending JSON
        },
        body: JSON.stringify({
          username,
          password,
          role,  // Only used for signup, ignored during login
        }),
      });

      // Parse the JSON response from the server
      let data: { message?: string; user?: { id: number; username: string; role: string }; token?: string };
      try {
        data = await response.json();
      } catch {
        throw new Error("Server is not responding. Please try again later.");
      }

      // If server returned an error status, throw an error
      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // SUCCESS! Store user data and JWT token in browser's localStorage
      // This persists even after browser refresh
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // Redirect user to the home page
      navigate("/");
    } catch (err) {
      // Display error message to the user
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">UW</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            UWTeam Connect
          </h1>
          <p className="text-gray-500 text-sm">Unshaken Worship Team Portal</p>
        </div>

        {/* Toggle Login/Signup */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              isLogin
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              !isLogin
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter your username"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login As
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole("leader")}
                className={`flex-1 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  role === "leader"
                    ? "bg-black text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Crown size={18} />
                Team Leader
              </button>
              <button
                type="button"
                onClick={() => setRole("member")}
                className={`flex-1 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  role === "member"
                    ? "bg-black text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <User size={18} />
                Team Member
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition mt-6"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>

          {/* Forgot Password */}
          {isLogin && (
            <div className="text-center mt-4">
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Forgot your password?
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
