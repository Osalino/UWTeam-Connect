// import { useState } from "react";
// import { Plus } from "lucide-react";
//
// export default function Index() {
//   interface Announcement {
//     id: number;
//     title: string;
//     description: string;
//     isImportant?: boolean;
//   }
//
//   const [announcements, setAnnouncements] = useState<Announcement[]>([
//     {
//       id: 1,
//       title: "Practice Update",
//       description: "Thursday rehearsal moved to 7PM",
//       isImportant: true,
//     },
//     {
//       id: 2,
//       title: "Song Update",
//       description: "New song added for Sunday",
//     },
//   ]);
//
//   const dashboardStats = [
//     {
//       id: 1,
//       label: "Announcements",
//       value: announcements.length,
//     },
//     {
//       id: 2,
//       label: "Team Members",
//       value: 24,
//     },
//     {
//       id: 3,
//       label: "Upcoming Events",
//       value: 8,
//     },
//     {
//       id: 4,
//       label: "Songs in Library",
//       value: 156,
//     },
//   ];
//
//   return (
//     <section className="bg-white h-screen">
//       <section className="flex items-center justify-center p-2 border-b">
//         <h1 className="text-lg font-semibold">
//           Welcome Back !
//           <p className="font-light text-xs">
//             Manage your worship team effectively
//           </p>
//         </h1>
//
//         <div className="flex items-center ml-auto">
//           <button className="bg-black text-white text-xs font-semibold py-2 px-6 rounded-md shadow-lg flex items-center gap-2">
//             <Plus className="h-4 w-4" />
//             New Announcements
//           </button>
//         </div>
//       </section>
//
//       <section className="flex flex-wrap gap-4 py-5 p-3">
//         {dashboardStats.map((stat) => (
//           <div
//             key={stat.id}
//             className="w-[160px] rounded-lg border border-gray-200 bg-white p-9 shadow-sm"
//           >
//             <div className="mb-5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 text-gray-700">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//               >
//                 <path d="M12 3v10.55A4 4 0 1 0 14 17V8h4V3h-6z" />
//               </svg>
//             </div>
//
//             <div className="text-2xl font-medium leading-none text-gray-900">
//               {stat.value}
//             </div>
//             <div className="mt-2 text-sm text-gray-500">{stat.label}</div>
//           </div>
//         ))}
//       </section>
//
//       <section className="p-3">
//         <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//           Latest Announcements
//         </h2>
//
//         <div className="space-y-4">
//           {announcements.map((announcement) => (
//             <div
//               key={announcement.id}
//               className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
//             >
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {announcement.title}
//               </h3>
//               <p className="mt-1 text-sm text-gray-600">
//                 {announcement.description}
//                 {announcement.isImportant && (
//                   <span className="text-red-500 font-semibold ml-2">
//                     (Important)
//                   </span>
//                 )}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </section>
//   );
// }

import React from "react";
import ReactDOM from "react-dom/client";
import App from "../App.tsx";
import "../global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// export default function Index() {
//   return (
//     <div style={{ padding: "40px", fontSize: "32px", color: "black" }}>
//       Home Page
//     </div>
//   );
// }

// export default function Index() {
//   return <div>Home Page</div>;
// }