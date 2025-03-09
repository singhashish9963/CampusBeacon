import React, { useState } from "react";
import ChatApp from "./ChatApp";

const channels = [
  { id: 1, name: "General Chat" },
  { id: 2, name: "Random" },
  { id: 3, name: "Tech Talk" },
  { id: 4, name: "MNNIT Announcements" },
  { id: 5, name: "Sports Chat" },
];

const ChatTestPage = () => {
  const [selectedChannel, setSelectedChannel] = useState(channels[0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white flex">
      {/* Sidebar with channels */}
      <aside className="w-1/4 bg-gray-900/50 p-6 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Channels</h2>
        <ul>
          {channels.map((channel) => (
            <li
              key={channel.id}
              className={`cursor-pointer p-2 rounded mb-2 ${
                selectedChannel.id === channel.id
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : "hover:bg-gray-800"
              }`}
              onClick={() => setSelectedChannel(channel)}
            >
              {channel.name}
            </li>
          ))}
        </ul>
      </aside>
      {/* Main Chat Area */}
      <main className="flex-1 p-6">
        <ChatApp channelId={selectedChannel.id} />
      </main>
    </div>
  );
};

export default ChatTestPage;
