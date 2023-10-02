import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../../../constants/constant';
import io from 'socket.io-client';
import { getUserId } from '../../../api/api';
import { useNavigate, useSearchParams } from 'react-router-dom';


const Chat = () => {
    const navigate = useNavigate()
    const socket = io.connect(`${BASE_URL}`);
    const [messageList, setMessageList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState([]); // Store chat messages here
    const senderId = getUserId()
    // useEffect(() => {
    //     socket = io(BASE_URL);
    //   }, [BASE_URL]);
    const [searchParams] = useSearchParams()
    const receiverId = searchParams.get("id")
    // Sample users and messages (you can replace these with real data)
    const users = [
        {_id :"65190ce43c43d646eda35bd3",
        username :"user1",
        email :"user1@gmail.com",
        fullname:"user one"
        },
        {_id :"65190fad1b2db1aa51cfed75",
        username :"johndoe",
        email:"johndoe@example.com",
        fullname:"john doe"
        },
        {_id :"6519100b1b2db1aa51cfedd9",
        username :"techguru",
        email:"techguru123@gmail.com",
        fullname:"david tech"
        },
    ];
    
    useEffect(() => {
        socket.on('receive_message', (data) => {
            console.log(data)
        setMessageList([...messageList, data]);
        });
    }, [messageList]);
    const sendMessage = async () => {
        // if (message !== "") {
          let newMessageData = {
            sender:senderId,
            room:12,
            receiver:receiverId,
            text: message,
            time:
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes(),
          };
          // Emit the message to the server
          socket.emit("send_message", newMessageData);
          // Update the messageList immediately with the new message
          setMessageList((list) => [...list, newMessageData]);
          // Clear the input field
          setMessage("");
          // Join the chat room
        // }
    };
    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log("receive msg" , data)
          // Set the sender value to the logged-in user's ID if undefined
          setMessageList((list) => [...list, data]);
        });
        return () => {
          socket.off("receive_message");
        };
    }, [socket, senderId]);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        navigate(`/chat?id=${encodeURIComponent(user._id)}`);
        // Load chat messages for the selected user and set them using setMessages
        // You'll need to implement this part with your backend or data source
    };

  return (
    <div className="w-full h-screen flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-blue-500 p-4">
        <input
          type="text"
          placeholder="Search User"
          className="rounded-md bg-gray-100 py-2 px-3 w-full"
        />
        <p className="p-2">Chats</p>
        <div>
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`p-2 flex items-center gap-2 cursor-pointer ${
                selectedUser && selectedUser.id === user.id
                  ? 'bg-gray-200'
                  : ''
              }`}
            >
              <Avatar />
              <p>{user.fullname}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-grow bg-green-500 p-4">
        {selectedUser && (
          <div className="w-full">
            {/* Chat Header */}
            <div className="w-full flex items-center gap-2 bg-orange-400 h-12">
              <Avatar />
              <div className="flex flex-col">
                <span>{selectedUser.fullname}</span>
                <span className='text-gray-400 text-sm'>@{selectedUser.username}</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="mt-4">
              {messageList.map((message) => (
                <div key={message.id} className="flex items-start mb-4">
                  <Avatar />
                  <div className="bg-white rounded-lg p-2">
                    <p>{message.text}</p>
                    <span>{message.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                placeholder="Type your message..."
                className="rounded-md bg-gray-100 py-2 px-3 flex-grow"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
              >
                Send
            </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
