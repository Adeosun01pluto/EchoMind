// CreatePostForm.js
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Avatar, Button, Tab, Tabs } from '@mui/material';

const CreatePostForm = ({ onCreatePost, refetch, onCreateQuestion}) => {
  const [content, setContent] = useState('');
  const [question, setQuestion] = useState('');
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
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

  return (
    <div>
      <div>
        <div onClick={handleClickOpen} className=" border-2 border-gray-300 mx-auto shadow-lg bg-white rounded-sm p-2 py-6 md:p-3 mb-2">
          <div className="flex gap-2">
            <Avatar className='homeAvatar'/>
            <input type="text" className="rounded-full w-[100%] p-2 bg-gray-100 border-2 border-gray-400 text-sm outline-none " placeholder="What do you wanna ask or share?"/>
          </div>
        </div>
      </div>

      <Dialog open={open} sx={{color:"#060109", minHeight:400}} onClose={handleClose} maxWidth="lg" fullWidth={true}>
        <div className='w-full flex'>
          <button onClick={handleClose} className='px-2 py-1 font-bold'>X</button>
        </div>
        <div>
          <div className="flex justify-between border-b-2 border-[#8a1dd3]">
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Create Post" />
              <Tab label="Add Question" />
            </Tabs>
          </div>
        </div>
        <DialogContent sx={{height:300}}>
          {tabValue === 1 ? (
            <div className='w-full h-full flex flex-col'>
              <div className="mb-4 flex flex-col h-[90%]">
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
              <div className="mb-4 flex flex-col h-[90%]">
                <textarea
                  id="content"
                  className="w-full p-2 flex-1 outline-none border-b-2 border-gray-300"
                  placeholder="Say Something"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
