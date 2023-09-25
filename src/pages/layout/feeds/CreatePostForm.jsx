// CreatePostForm.js
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
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
      <form onSubmit={handleCreatePost}>
        <div onClick={handleClickOpen} className=" border-2 border-gray-300 mx-auto shadow-lg bg-white rounded-sm p-2 py-6 md:p-3 mb-2">
          <div className="flex gap-2">
            <Avatar className='homeAvatar'/>
            <input type="text" className="rounded-full w-[100%] p-2 bg-gray-100 border-2 border-gray-400 text-sm outline-none " placeholder="What do you wanna ask or share?"/>
          </div>
        </div>
      </form>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth={true}>
        <DialogTitle>
          <div className="flex justify-between border-b-2 border-gray-300">
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Create Post" />
              <Tab label="Add Question" />
            </Tabs>
          </div>
        </DialogTitle>
        <DialogContent sx={{height:400}}>
          {tabValue === 1 ? (
            <form onSubmit={handleCreatePost} className='w-full h-full'>
              <div className="mb-4 flex flex-col h-[90%]">
                <label htmlFor="question" className="block text-gray-600 font-semibold mb-2">
                  Question
                </label>
                <textarea
                  id="question"
                  className="w-full p-2 flex-1 outline-none border-b-2 border-gray-300"
                  placeholder="Start your question with 'What' 'how' etc"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="contained" onClick={handleCreateQuestion} color="primary">
                Add Question
              </Button>
              <Button onClick={handleClose}>X</Button>
            </form>
          ) : (
            <form className='w-full h-full' onSubmit={handleCreatePost}>
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
              <Button type="submit" variant="contained" onSubmit={handleCreatePost} color="primary">
                Create Post
              </Button>
              <Button onClick={handleClose}>X</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default CreatePostForm;
