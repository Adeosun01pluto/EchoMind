import { Avatar } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { getUserId } from '../../../api/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../../../constants/constant';
import Conversation from './Conversation';
// import ChatBox from './ChatBox';


const Chat = () => {
    const navigate = useNavigate()
    const socket = useRef();
    const [messageList, setMessageList] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [message, setMessage] = useState([]); // Store chat messages here
    const senderId = getUserId()
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [chats, setChats] = useState([]);
    const [searchParams] = useSearchParams()
    const receiverId = searchParams.get("id")
    // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/chat/get_chat`, {
          headers: {
            "Authorization": localStorage.getItem('token'),
          },
        });
        setChats(response.data)
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [senderId]);
      // Connect to Socket.io
    useEffect(() => {
      socket.current = io(`ws://localhost:4001`);
      socket.current.emit("new-user-add", senderId);
      socket.current.on("get-users", (users) => {
        setOnlineUsers(users);
      });
      return () => {
        socket.current.on("disconnect", ()=>{
          console.log("dis" , socket.id)
        });
      };
    }, [senderId]);
    
    const sendMessage = async () => {
        // if (message !== "") {
          let newMessageData = {
            sender:senderId,
            receiverId,
            text: message,
            chatId:currentChat._id,
            time:
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes(),
          };
          // Emit the message to the server
          socket.current.emit("send-message", newMessageData);
          // Update the messageList immediately with the new message
          setMessageList((list) => [...list, newMessageData]);
          // Clear the input field
          setMessage("");
          try {
            await axios.post(`${BASE_URL}/message`, newMessageData , {
              headers: {
                "Authorization": localStorage.getItem('token'),
              },
            });
          } catch (error) {
            console.log(error)
          }
    };
    useEffect(() => {
      socket.current.on("receive-message", (data) => {
        setMessageList((list) => [...list, data]);
      }
      );
    }, []);

    const handleUserClick = (chat) => {
        setCurrentChat(chat);
        console.log(chat.members)
        const currentUser = chat.members.find((member) => member !== senderId);
        navigate(`/chat?id=${encodeURIComponent(currentUser)}`);
        // Load chat messages for the selected user and set them using setMessages
        // You'll need to implement this part with your backend or data source
    };
    const checkOnlineStatus = (chat) => {
      const chatMember = chat.members.find((member) => member !== senderId);
      const online = onlineUsers.find((user) => user.userId === chatMember);
      return online ? true : false;
    };
    const [messages, setMessages] = useState([]);
  // fetch messages               
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/message/${currentChat._id}`,
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        );
        // Filter out messages that are already in the state to avoid duplicates
        const newMessages = response.data.filter(
          (message) => !messages.some((m) => m._id === message._id)
        );
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      } catch (error) {
        console.log(error);
      }
    };
  
    if (currentChat !== null) fetchMessages();
  }, [currentChat]);

  const combinedMessage = [ ...messages,...messageList]
  
  return (
    <div className="w-full min-h-screen flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-blue-500 p-4">
        <input
          type="text"
          placeholder="Search User"
          className="rounded-md bg-gray-100 py-2 px-3 w-full"
        />
        <p className="p-2">Chats</p>
        <div>
          {chats.map((chat, idx) => (
             <div
             key={idx}
             onClick={() => handleUserClick(chat)}
             className={`p-2 flex items-center gap-2 cursor-pointer ${
               currentChat && currentChat.id === chat.id
                 ? 'bg-gray-200'
                 : ''
             }`}
             >
              <Conversation  online={checkOnlineStatus(chat)} currentUser={senderId} data={chat} />
             </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-grow bg-green-500 p-4">
        {/* <ChatBox /> */}
        {currentChat && (
          <div className="w-full">
            {/* Chat Header */}
            <div className="w-full flex items-center gap-2 bg-orange-400 h-12">
              <Avatar />
              <div className="flex flex-col">
                <span>{currentChat.fullname}</span>
                <span className='text-gray-400 text-sm'>@{currentChat.username}</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="mt-4">
              {combinedMessage.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 mb-4 ${
                    message.sender === senderId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <Avatar />
                  <div
                    className={`bg-white flex flex-col rounded-lg p-2 ${
                      message.sender === senderId ? 'bg-blue-200' : 'bg-gray-200'
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className='self-end'>{message.time}</span>
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
