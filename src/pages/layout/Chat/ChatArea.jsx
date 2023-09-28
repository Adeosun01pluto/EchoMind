import  { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi'; // Example icon for the sidebar toggle
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
// import { getUserId, getUserInfo } from '../../api/auth';
import ChatSidebar from './ChatSideBar';
import { BASE_URL } from '../../../constants/constant';
import { getUserId, getUserProfile } from '../../../api/api';

const ChatArea = () => {
  const { receiverId } = useParams(); // Get the receiverId from the URL parameter
  const [fetchedMessages, setFetchedMessages] = useState([]); // State for fetched messages
  const socket = io.connect(`${BASE_URL}`);
  const senderId = getUserId()

  const [message, setMessage] = useState('');
  const [allChatUsersId, setAllChatUsersId] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const getChatUsersId = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/chatusers/${senderId}`);
      setAllChatUsersId(response.data);
    } catch (error) {
      console.error('Error fetching chat users:', error);
    }
  };
  useEffect(() => {
    getChatUsersId(); // Fetch chat users
  }, []);
  const getMessages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get/${senderId}/${receiverId}`);
      setFetchedMessages(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  const sendMessage = async () => {
    const {username} = await getUserProfile(senderId)
    const {username :receiverUsername} = await getUserProfile(receiverId)
    // if (message !== "") {
      const newMessageData = {
        room: 12,
        sender:senderId,
        receiver:receiverId,
        receiverUsername,
        senderUsername: username,
        message: message,
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
      socket.emit("join_room", 12);
    // }
  };
  const [showSidebar, setShowSidebar] = useState(false);
  useEffect(() => {
    getMessages(); // Fetch messages from backend
  }, [receiverId]);
  
  useEffect(() => {
    socket.on("receive_message", (data) => {
      // Set the sender value to the logged-in user's ID if undefined
      setMessageList((list) => [...list, data]);
    });
    socket.emit("join_room", 12)
    return () => {
      socket.off("receive_message");
    };
  }, [socket, senderId]);
  /////////////////////////////
  const combinedMessages = [...fetchedMessages, ...messageList];
  console.log(combinedMessages)
  return (
    <div className="min-h-screen bg-gray-100 relative flex pt-[110px] md:pt-[70px]">
    {/* Sidebar (visible on larger screens) */}
    <div className={`bg-white absolute h-full p-4 ${showSidebar ? 'w-[70%]' : ' w-[] hidden md:block'}`}>
      <ChatSidebar showSidebar={showSidebar} allChatUsersId={allChatUsersId} setShowSidebar={setShowSidebar}/>
    </div>

    {/* Chat content */}
    <div className="flex-1 p-1 md:p-4">
      {/* Chat header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Chat with User</h2>
        <button
          className="md:hidden text-gray-500"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <FiMenu size={24} />
        </button>
      </div>
      {/* Chat messages */}
      <div className="mb-4">
        <ul className='flex flex-col gap-2'>
          { combinedMessages.map((messageContent, idx) => {
            return(
              <div
                className={`message ${senderId === messageContent.sender ? 'self-end p-2 rounded-lg bg-emerald-500 max-w-[70%] text-white' : 'bg-gray-300 p-2 rounded-lg max-w-[70%]'}`}
                key={idx}
                >
                <div>
                  {/* <span className={`${senderId === messageContent.sender ? 'text-right' : 'other'}`}>{senderId === messageContent.sender ? 'you' : 'other'}</span> */}
                  <div className="message-content">
                    {messageContent.text && <p>{messageContent.text}</p>}
                    {messageContent.message && <p>{messageContent.message}</p>}
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.username}</p>
                  </div>
                </div>
              </div>
              )
          })}
        </ul>
      </div>

      {/* Chat input */}
      <div className="flex">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2 mr-2"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  </div>
  );
};

export default ChatArea;
