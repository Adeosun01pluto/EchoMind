import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../../constants/constant";

function ChatSidebar({setShowSidebar,showSidebar, allChatUsersId }) {
  // const users = [
  //   { id: 1, name: 'User 1' },
  //   { id: 2, name: 'User 2' },
  //   { id: 3, name: 'User 3' },
  //   // Add more users as needed
  // ];
  const [allChatUsers, setAllChatUsers] = useState([]);
  const getChatUsers = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/getusersinfobyids`, { userIds: allChatUsersId });
      setAllChatUsers(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching chat users:', error);
    }
  };
  useEffect(() => {
    if (allChatUsersId.length > 0 || showSidebar) {
      getChatUsers();
    }
  }, [showSidebar]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Users</h3>
      <ul className="flex flex-col gap-2">
        {allChatUsers.map((user) => (
          <Link to={`/chat/${user._id}`}
            key={user._id}
            onClick={() => setShowSidebar(!showSidebar)}
            className="cursor-pointer hover:bg-gray-200 p-2 rounded"
          >
            {user.username}
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default ChatSidebar;
