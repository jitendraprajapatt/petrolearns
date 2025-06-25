import { useState } from "react";
import {
  FaUsers,
  FaCog,
  FaFolderPlus,
  FaBook,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";

const menuItems = [
  { key: "user", label: "User Management", icon: <FaUsers /> },
  { key: "topics", label: "Topics Management", icon: <FaBook /> },
  { key: "create", label: "Subject Management", icon: <FaFolderPlus /> },
  { key: "notification", label: "Notification Management", icon: <IoIosNotifications /> },
  { key: "settings", label: "Settings", icon: <FaCog /> },
];

export default function Sidebar({ selected, setSelected }: any) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`h-screen border-r border-gray-300 bg-transparent text-gray-800 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h1 className="text-lg font-semibold">Admin Panel</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-black text-lg focus:outline-none"
        >
          {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
        </button>
      </div>

      {/* Menu */}
      <ul className="flex-1 mt-4 space-y-1">
        {menuItems.map((item) => (
          <li
            key={item.key}
            onClick={() => setSelected(item.key)}
            className={`flex items-center px-4 py-3 cursor-pointer transition rounded-md mx-2 ${
              selected === item.key
                ? "bg-gray-200 text-black"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && (
              <span className="ml-4 text-sm font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="p-4 text-xs text-gray-400">
        {!collapsed && <p>© 2025 PetroLearn</p>}
      </div>
    </div>
  );
}
