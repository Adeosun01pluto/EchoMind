// CreatePostForm.js
import { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Button, Tab, Tabs, useMediaQuery } from '@mui/material';
import { getUserId, getUserProfile } from '../../../api/api';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../constants/constant';

const CreatePostForm = ({ onCreatePost, refetch, onCreateQuestion}) => {
  const [content, setContent] = useState('');
  const [question, setQuestion] = useState('');
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [profilePic, setProfilePic] = useState(null); // Initialize with an empty string
  const loggedInUserId = getUserId()
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    // Create a new post object with the title and content
    const newPost = { content };
    // Call the onCreatePost function passed from the parent component
    onCreatePost(newPost);
    // Clear the form inputs
    refetch()
    setContent('');
    setOpen(false);
  };
  const handleCreateQuestion = (e) => {
    e.preventDefault();
    // Create a new post object with the title and content
    const newQuestion = { question };
    // Call the onCreatePost function passed from the parent component
    onCreateQuestion(newQuestion);
    // Clear the form inputs
    refetch()
    setContent('');
    setOpen(false);
  };
  const isLargeScreen = useMediaQuery('(min-width: 800px)'); // Define your breakpoint here

  const getUserProfileHandler = async(loggedInUserId) =>{
    try {
      const res = await getUserProfile(loggedInUserId)
      setProfilePic(res) 
    } catch (error) {
      console.log(error)
    }
  }
   // Fetch and set the username when the component mounts
  useEffect(() => {
    getUserProfileHandler(loggedInUserId)
  }, [loggedInUserId]);
  return (
    <div>
      <div>
        <div onClick={handleClickOpen} className=" border-2 border-gray-300 mx-auto shadow-lg bg-white rounded-sm p-2 py-6 md:p-3 mb-2">
          <div className="flex gap-2">
            <Link to={`/profile/${loggedInUserId}`}> 
              <div className='w-10 h-10 rounded-full bg-black'>
                    {profilePic?.profileImage ? 
                    <img className="rounded-full w-full h-full object-cover" src={`${BASE_URL}/images/${profilePic?.profileImage}`} alt="" />
                    :
                    <img className="rounded-full w-full h-full object-cover" src={profilePic?.avatarData} alt />
                    }
              </div>
            </Link>
            <input type="text" className="rounded-md w-[100%] p-2 bg-gray-100 border-[1px] border-gray-400 text-sm outline-none " placeholder="What do you wanna ask or share?"/>
          </div>
        </div>
      </div>

      <Dialog open={open} sx={{color:"#060109", minHeight:400}} onClose={handleClose} maxWidth={isLargeScreen ? 'sm' : 'lg'} fullWidth={true}>
        <div className='w-full flex'>
          <button onClick={handleClose} className='px-2 py-1 font-bold'>X</button>
        </div>
        <div>
          <div className="flex justify-between border-b-2 border-[#8a1dd3]">
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#4f1179 !important",
              },
            }}>
              <Tab label="Create Post" sx={{
                color: tabValue === 0 ? "#4f1179 !important" : "inherit",
                "&.Mui-selected": {
                  color: "#4f1179 !important",
                },
              }} />
              <Tab label="Add Question" sx={{
                color: tabValue === 0 ? "#4f1179 !important" : "inherit",
                "&.Mui-selected": {
                  color: "#4f1179 !important",
                },
              }} />
            </Tabs>
          </div>
        </div>
        <DialogContent sx={{minHeight:300}}>
          {tabValue === 1 ? (
            <div className='w-full h-full flex flex-col'>
              <div className="mb-4 flex flex-col min-h-[300px]">
                <label htmlFor="question" className="block text-gray-600 font-semibold mb-2">
                  Question
                </label>
                <textarea
                  id="question"
                  className="w-full p-2 flex-1 outline-none"
                  placeholder="Start your question with 'What' 'how' etc"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" sx={{
                background:"#4f1179",
                  "&:hover": {
                    backgroundColor: "#4f1179 !important",
                    boxShadow: "none !important",
                  },
                  "&:active": {
                    boxShadow: "none !important",
                    backgroundColor: "#4f1179 !important",
                  },
                }}
                variant="contained" onClick={handleCreateQuestion}>
                Add Question
              </Button>
            </div>
          ) : (
            <div className='w-full h-full flex flex-col' >
              <div className="mb-4 flex flex-col min-h-[300px]">
                  <TextareaAutosize 
                    required
                    type="text"
                    placeholder="Say Something"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="h-4 flex-grow p-2 rounded-md bg-white text-sm outline-none"
                    cacheMeasurements={true}
                    autoFocus
                    style={{ resize: 'none' }} // Add this line to hide the resize handle
                  />

              </div>
              <Button type="submit" sx={{
                background:"#4f1179",
                  "&:hover": {
                    backgroundColor: "#4f1179 !important",
                    boxShadow: "none !important",
                  },
                  "&:active": {
                    boxShadow: "none !important",
                    backgroundColor: "#4f1179 !important",
                  },
                }}
               variant="contained" onClick={handleCreatePost}>
                Create Post 
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default CreatePostForm;
