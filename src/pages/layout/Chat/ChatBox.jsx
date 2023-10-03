import { Avatar } from "@mui/material"
import { getUserId } from "../../../api/api"
import { useState } from "react";

function ChatBox({currentChat, combinedMessage }) {
  // const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const senderId = getUserId()
  const handleChange = (e)=> {
    setNewMessage(e.target.value)
  }
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
  return (
    <div>
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
                value={newMessage}
                onChange={handleChange}
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
  )
}

export default ChatBox