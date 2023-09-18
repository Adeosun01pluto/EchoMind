import { Avatar, Badge, Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tab, Tabs, Tooltip } from '@mui/material';
import { useState } from 'react';
import { AiOutlineHome, AiOutlineLogout} from 'react-icons/ai'
import { BsPeopleFill } from 'react-icons/bs';
import { Link, useNavigate,  } from 'react-router-dom';
import { GrNotification } from 'react-icons/gr'
import { BiMessageEdit } from 'react-icons/bi'
import { GiMoonOrbit } from 'react-icons/gi'
import { FiSettings } from 'react-icons/fi'
import "./Navbar.css"
import { RiCalculatorFill, RiChat1Fill, RiTodoFill } from 'react-icons/ri';
import { BASE_URL } from '../../constants/constant';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { fetchPosts } from '../../api/post/post';
import { fetchQuestions } from '../../api/question/question';
import { getUserId } from '../../api/api';
const Navbar = () => {
  const navigate = useNavigate()
  // const location = useLocation();
  const userId = getUserId()
  const handleLogout = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    // Redirect to the login page (you can customize the URL)
    navigate("/login")
  };
  const menuList = [
    {
      to: '/',
      icon: <AiOutlineHome color='' size={22} />,
      label: 'Home',
    },
    {
      to: '/orbits',
      icon: <GiMoonOrbit color='' size={22} />,
      label: 'Orbit',
    },
    {
      to: '/followings',
      icon: <BsPeopleFill color='' size={22} />,
      label: 'Followings',
    },
    {
      to: '/questions',
      icon: <BiMessageEdit color='' size={22} />,
      label: 'Question',
    },
    {
      to: '/practice',
      icon:<RiTodoFill size={22} />,
      label: 'Practice',
    },
  ];
  const [anchorEl, setAnchorEl] =useState(null);
  const openAccountSetting = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAccountSetting = () => {
    setAnchorEl(null);
  };
  const [activeLink, setActiveLink] = useState(null);
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
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
  const { refetch:refetchQuestion} = useQuery('questions', fetchQuestions);
  const {refetch} = useQuery('posts', fetchPosts);

  const createQuestionMutation = useMutation((newQuestion) =>
  axios.post(`${BASE_URL}/question/add_question`, {question: newQuestion}, {
    headers: {
      "Authorization": localStorage.getItem('token'),
    },
  })
  )
  const handleCreateQuestion = async () => {
    try {
      await createQuestionMutation.mutateAsync(question);
      refetchQuestion()
      setOpen(false)
      setQuestion("")
      // if (location.pathname === '/questions') {
      //   console.log("first")
      // } else {
      //   navigate('/questions');
      // }
    } catch (error) {
      console.error(error);
    }
  };
  const createPostMutation = useMutation((newPost) =>
  axios.post(`${BASE_URL}/create_post`, newPost, {
    headers: {
      "Authorization": localStorage.getItem('token'),
    },
  })
  );
  const handleCreatePost = async () => {
    try {
      // Use the createPostMutation to create a new post
      await createPostMutation.mutateAsync(content);
      // Refetch the list of posts after creating a new one
      refetch()
      // if (location.pathname === '/') {
      //   console.log("first")
      // } else {
      //   navigate('/');
      // }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <nav className="w-full min-h-16 bg-gray-50 p-2">
      <div className='container mx-auto flex justify-between items-center'>
      <Link to="/" className='text-3x text-emerald-900 font-extrabold'>Demo</Link>
            {/* Desktop Nav Menu */}
            <ul className='items-center bg-white rounded-xl navMenu'>
            {menuList.map((menuItem, index) => (
              <Link
                key={menuItem.to}
                to={menuItem.to}
                onClick={() => handleLinkClick(menuItem.to)}
                className={`flex flex-col hover:bg-emerald-600 items-center text-emerald-900 ${
                  activeLink === menuItem.to ? 'bg-emerald-600' : ''
                } ${
                  index === 0
                    ? 'rounded-tl-xl rounded-bl-xl'
                    : index === menuList.length - 1
                    ? 'rounded-tr-xl rounded-br-xl'
                    : ''
                } px-3 py-1`}
              >
                {menuItem.icon}
                <span className='text-emerald-900 text-sm'>{menuItem.label}</span>
              </Link>
            ))}
            </ul>
            <div className='navMenu gap-1 items-center'>
              <button onClick={handleClickOpen} className='bg-emerald-700 px-2 py-1 text-sm text-white rounded-full'>Add Question</button>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ }}
                  aria-controls={openAccountSetting ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openAccountSetting ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                </IconButton>
              </Tooltip>
            </div>

            {/* Mobile Nav menu */}
            <div className='items-center gap-3 mobileNavMenu'>
              <button onClick={handleClickOpen} className='bg-emerald-700 px-2 py-1 text-sm text-white rounded-full'>+</button>
              <div className='gap-1 mobileNavMenu flex items-center'>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ }}
                    aria-controls={openAccountSetting ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openAccountSetting ? 'true' : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                  </IconButton>
                </Tooltip>
              </div>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openAccountSetting}
                onClose={handleCloseAccountSetting}
                onClick={handleCloseAccountSetting}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={()=>navigate(`/profile/${userId}`)}>
                  <Avatar /> Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={()=>navigate('/chats')}>
                  <ListItemIcon>
                    <RiChat1Fill size={20} />
                  </ListItemIcon>
                  Chat
                </MenuItem>
                <MenuItem onClick={()=>navigate("/practice")}>
                  <ListItemIcon>
                    <RiCalculatorFill size={20} />
                  </ListItemIcon>
                  Practice
                </MenuItem>
                <MenuItem onClick={()=>navigate('/gp')}>
                  <ListItemIcon>
                    <RiCalculatorFill size={20} />
                  </ListItemIcon>
                  Calculator
                </MenuItem>
                <MenuItem onClick={handleCloseAccountSetting}>
                  <ListItemIcon>
                    <FiSettings size={20} />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <AiOutlineLogout size={20} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
      </div>

      {/*  */}
      <ul className='w-[100%] mobileNavMenu items-center justify-between'>
              <Link to="/" className='p-1 sm:p-3 border-gray-200 flex items-center justify-center flex-1'><AiOutlineHome size={26} color="#046307"/></Link>
              <Link to="/orbits" className='p-1 sm:p-3 border-gray-200 flex items-center justify-center flex-1'><GiMoonOrbit size={26} color="#046307"/></Link>
              <Link to="/followings" className='p-1 sm:p-3 border-gray-200 flex items-center justify-center flex-1'><BsPeopleFill size={26} color="#046307"/></Link>
              <Link to="/questions" className='p-1 sm:p-3 border-gray-200 flex items-center justify-center flex-1'><BiMessageEdit size={26} color="#046307"/></Link>
              <Link to="/notifications" className='p-1 sm:p-3 border-gray-200 flex items-center justify-center flex-1'>
                <Badge badgeContent={0} color="error">
                  <GrNotification size={22} /> {/* Display the GrNotification icon */}
                </Badge>
              </Link>
        </ul>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth={true}>
        <DialogTitle>
          <div className="flex justify-between border-b-2 border-gray-300">
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Add Question" />
              <Tab label="Create Post" />
            </Tabs>
          </div>
        </DialogTitle>
        <DialogContent sx={{height:400}}>
          {tabValue === 0 ? (
            <div className='w-full h-full'>
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
            </div>
          ) : (
            <div className='w-full h-full'>
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
              <Button type="submit" variant="contained" onClick={handleCreatePost} color="primary">
                Create Post
              </Button>
              <Button onClick={handleClose}>X</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
