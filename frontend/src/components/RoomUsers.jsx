import { useNavigate } from "react-router-dom";

const RoomUsers = ({ roomData }) => {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/home");
  };

  const owner = roomData?.owner || "Unknown Owner";
  const allowedUsers = roomData?.allowedUsers || [];

  return (
    <div className="cursor-default w-60 bg-gray-800 p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg mb-4 text-white">In Room</h3>
        <p className="text-blue-400 font-semibold mb-2">Owner: {owner}</p>

        {allowedUsers.length > 0 ? (
          <div>
            <p className="text-gray-300 mb-1">👥 Allowed Users:</p>
            <ul className="space-y-1 ml-2 text-green-300 text-sm list-disc">
              {allowedUsers.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No additional users</p>
        )}
      </div>

      <button onClick={handleExit} className="mt-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
         Exit Room
      </button>
    </div>
  );
};

export default RoomUsers;
