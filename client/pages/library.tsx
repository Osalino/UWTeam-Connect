// Song Library page - placeholder until the feature is built
import { Music } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="p-5 bg-gray-100 rounded-2xl inline-block mb-6">
        <Music className="h-10 w-10 text-gray-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Song Library</h1>
      <p className="text-gray-500 text-lg">We are currently working on this feature.</p>
    </div>
  );
}
