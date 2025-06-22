// src/pages/Home.jsx
import React from "react";
import TopBar from "../components/TopBar";
import Sidebar from "../components/SideBar";
import WhiteboardCard from "../components/BoardCard";

const Home = () => {
  const handleCreateSession = () => {
    console.log("Create Session Clicked");
  };

  const handleJoinSession = () => {
    console.log("Join Session Clicked");
  };

  const myBoards = [
    {
      title: "Math Sketch",
      description: "whiteboard 1",
      access: "Private",
    },
    {
      title: "Flowchart",
      description: "class work",
      access: "Public",
    },
  ];

  const collabBoards = [
    {
      title: "Team Planning",
      description: "group whiteboard",
      access: "Public",
    },
  ];

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar  />

        <div className="flex-1 p-6 overflow-y-auto space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-green-400">
              Your Whiteboards
            </h2>
            <div className="flex gap-6 flex-wrap">
              {myBoards.map((board, i) => (
                <WhiteboardCard
                  key={i}
                  title={board.title}
                  description={board.description}
                  access={board.access}
                  onOpen={() => console.log("Open", board.title)}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-green-400">
              Collaborative Whiteboards
            </h2>
            <div className="flex gap-6 flex-wrap">
              {collabBoards.map((board, i) => (
                <WhiteboardCard
                  key={i}
                  title={board.title}
                  description={board.description}
                  access={board.access}
                  onOpen={() => console.log("Open", board.title)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
