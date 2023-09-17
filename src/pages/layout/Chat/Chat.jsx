// Chat.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // You can use React Router for navigation
import socketIOClient from 'socket.io-client';
import axios from 'axios';

const Chat = () => {
  const { userId } = useParams(); // Get the user's ID from the URL
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const socket = socketIOClient('http://localhost:4001'); // Connect to the server

  useEffect(() => {
    // Fetch the list of chat users when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Fetch chat messages between the logged-in user (userId) and the selected user (recipientId)
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/messages/64fe3b997f1ab4b4ed539806/64ff3c108fd1e5765080a905`);
        // const response = await axios.get(`http://localhost:4001/messages/${userId}/${recipientId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    // Handle incoming messages from the server
    socket.on('message', (newMessage) => {
      // Update the messages state with the new message
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Implement logic to handle selecting a user and fetching their chat history
    // ...

    // Clean up the socket listener when the component unmounts
    return () => {
      socket.off('message');
    };
  }, [userId, socket]);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      // Emit the message to the server
      socket.emit('newMessage', {
        sender: "64fe3b997f1ab4b4ed539806",
        receiver: "64ff3c108fd1e5765080a905", // You should define recipientId when a user is selected
        text: message,
        time: new Date().toLocaleTimeString(),
      });

      // Clear the input field
      setMessage('');
    }
  };
  console.log(messages)

  return (
    <div className="flex h-screen">
      {/* Sidebar with the list of chat users */}
      <div className="w-1/4 bg-gray-200 p-4">
        {/* Display the list of users */}
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>

      {/* Chat area */}
      <div className="w-3/4 bg-white p-4">
        {/* Display chat messages */}
        <div className="mb-4">
          {messages.map((msg, index) => (
            <div key={index} className="border p-2 mb-2">
              {msg.text}
              <small className="block text-right text-gray-500">{msg.time}</small>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="flex">
          <input
            type="text"
            className="w-full p-2 border rounded-l"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-r"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
