import React from "react";

const Sidebar = ({ isOpen, toggleSidebar, menuItems, activeLink }) => (
  <aside
    className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white p-5 rounded transition-transform duration-300 transform ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } lg:translate-x-0 lg:relative lg:fixed lg:block lg:h-auto z-20`}
  >
    <button
      onClick={toggleSidebar}
      className="absolute top-4 right-4 text-gray-300 hover:text-white lg:hidden"
    >
      &times;
    </button>
    <ul>
      {menuItems.map((item, index) => (
        <li key={index} className="mb-4">
          <a
            href={item.link}
            className={`block py-2 px-4 rounded ${
              activeLink === item.link
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-600 hover:text-white"
            }`}
          >
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  </aside>
);

export default Sidebar;
