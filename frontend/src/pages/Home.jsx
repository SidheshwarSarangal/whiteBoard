import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import Sidebar from "../components/SideBar";
import WhiteboardCard from "../components/BoardCard";
import axios from "axios";

const Home = () => {
  const [myBoards, setMyBoards] = useState([]);
  const [collabBoards, setCollabBoards] = useState([]);

  const handleCreateSession = () => {
    console.log("Create Session Clicked");
  };

  const handleJoinSession = () => {
    console.log("Join Session Clicked");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    // 1. Fetch own boards
    axios
      .get(`https://whiteboard-svwy.onrender.com/api/rooms/getRoomsByOwner?owner=${user}`)
      .then((res) => setMyBoards(res.data))
      .catch((err) => console.error("Failed to fetch my boards", err));

    // 2. Fetch user's collab roomIds
    axios
      .get(`https://whiteboard-svwy.onrender.com/api/users/collabs/${user}`)
      .then(async (res) => {
        const roomIds = res.data.collabs || [];

        if (roomIds.length === 0) return;

        // 3. Fetch full room data for each roomId
        const responses = await Promise.all(
          roomIds.map((id) =>
            axios
              .get(`https://whiteboard-svwy.onrender.com/api/rooms/${id}`)
              .then((res) => res.data)
              .catch((err) => {
                console.error(`Error fetching room ${id}:`, err);
                return null;
              })
          )
        );

        // 4. Filter out failed requests
        const validRooms = responses.filter((room) => room !== null);
        setCollabBoards(validRooms);
      })
      .catch((err) => {
        console.error("Failed to fetch collab list", err);
      });
  }, []);

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onCreate={handleCreateSession} onJoin={handleJoinSession} />

        <div className="flex-1 p-6 overflow-y-auto space-y-8">
          {/* Your Whiteboards */}
          {myBoards.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">
                Your Whiteboards
              </h2>
              <div className="flex gap-6 flex-wrap">
                {myBoards.map((board, i) => (
                  <WhiteboardCard
                    key={i}
                    roomId={board.roomId}
                    title={board.name}
                    description={board.description || "No description"}
                    access={board.isPrivate ? "Private" : "Public"}
                    onOpen={() => {
                      window.location.href = `/room/${board.roomId}`;
                    }}
                    date={new Date(board.createdAt).toLocaleDateString()}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-lg">
              You have no whiteboards yet.
            </div>
          )}

          {/* Collaborative Whiteboards */}
          {collabBoards.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">
                Collaborative Whiteboards
              </h2>
              <div className="flex gap-6 flex-wrap">
                {collabBoards.map((board, i) => (
                  <WhiteboardCard
                    key={i}
                    roomId={board.roomId}
                    title={board.name}
                    description={board.description || "No description"}
                    access={board.isPrivate ? "Private" : "Public"}
                    onOpen={() => {
                      window.location.href = `/room/${board.roomId}`;
                    }}
                    date={new Date(board.createdAt).toLocaleDateString()}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-lg">
              You're not part of any collaborative boards yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
