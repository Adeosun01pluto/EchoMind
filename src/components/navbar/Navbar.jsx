import { Avatar,  Button, Dialog, DialogContent,Divider, IconButton, ListItemIcon, Menu, MenuItem, Tab, Tabs, Tooltip, useMediaQuery } from '@mui/material';
import TextareaAutosize from 'react-textarea-autosize';
import { useEffect, useState } from 'react';
import { AiOutlineHome, AiOutlineLogout} from 'react-icons/ai'
import { BsCalculator, BsCloudMoonFill, BsFillSunFill, BsPeopleFill } from 'react-icons/bs';
import {  NavLink, useNavigate,  } from 'react-router-dom';
import { BiMessageEdit } from 'react-icons/bi'
import { GiMoonOrbit } from 'react-icons/gi'
import { FiSettings } from 'react-icons/fi'
import "../../App.css"
import { RiCalculatorFill, RiChat1Fill,} from 'react-icons/ri';
import { BASE_URL } from '../../constants/constant';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { fetchPosts } from '../../api/post/post';
import { fetchQuestions } from '../../api/question/question';
import { getUserId } from '../../api/api';
const Navbar = () => {
  const isLargeScreen = useMediaQuery('(min-width: 800px)'); // Define your breakpoint here
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
      icon: <AiOutlineHome color='white' size={18} />,
      label: 'Home',
    },
    {
      to: '/orbits',
      icon: <GiMoonOrbit color='white' size={18} />,
      label: 'Orbit',
    },
    {
      to: '/followings',
      icon: <BsPeopleFill color='white' size={18} />,
      label: 'Followings',
    },
    {
      to: '/questions',
      icon: <BiMessageEdit color='white' size={18} />,
      label: 'Question',
    },
    {
      to: '/gp',
      icon:<BsCalculator color='white' size={18} />,
      label: 'Gp',
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

  const createPostMutation = useMutation((content) =>
  axios.post(`${BASE_URL}/create_post`, content, {
    headers: {
      "Authorization": localStorage.getItem('token'),
    },
  })
  );

  const handleCreatePost = async () => {
    try {
      // Use the createPostMutation to create a new post
      const newQuestion = { content };
      await createPostMutation.mutateAsync(newQuestion);
      // Refetch the list of posts after creating a new one
      refetch()
      setOpen(false);
      setContent("")
    } catch (error) {
      console.error(error);
    }
  };

  const [theme, setTheme] = useState(null)
  useEffect(() => {
    if(window.matchMedia(("prefers-color-scheme : dark")).matches){
      const theme = localStorage.getItem('theme')
      setTheme(theme)
    }else{
      const theme = localStorage.getItem('theme')
      setTheme(theme)
    }
  }, [])
  useEffect(() => {
    if(theme === "dark"){
      document.documentElement.classList.add("dark")
    }
    if(theme === "light"){
      document.documentElement.classList.remove("dark")
    }
  }, [theme])
  const handleThemeSwitch = () =>{
    setTheme(theme === "dark"? localStorage.setItem('theme', "light") : localStorage.setItem('theme', "dark"))
    setTheme(theme === "dark"? "light" : "dark")
  }
  return (
    <nav className="w-full min-h-16 dark:bg-[#171517] bg-[white] fixed md:p-2">
      <div className='container mx-auto flex justify-between items-center'>
      <div className='text-2xl md:text-3xl dark:text-[#f2e4fb] text-[#060109] font-extrabold'>Demo</div>
            {/* Desktop Nav Menu */}
            <ul className='items-center bg-[#4f1179] rounded-xl navMenu'>
            {menuList.map((menuItem, index) => (
              <NavLink
                key={menuItem.to}
                to={menuItem.to}
                onClick={() => handleLinkClick(menuItem.to)}
                className={`flex flex-col items-center text-emerald-900 ${
                  activeLink === menuItem.to ? 'bg-[#8a1dd3]' : ''
                } ${
                  index === 0
                    ? 'rounded-tl-xl rounded-bl-xl'
                    : index === menuList.length - 1
                    ? 'rounded-tr-xl rounded-br-xl'
                    : ''
                } px-3 py-1`}
              >
                {menuItem.icon}
                <span className='text-white text-xs'>{menuItem.label}</span>
              </NavLink>
            ))}
            </ul>
            <div className='navMenu gap-1 items-center'>
              <button onClick={handleThemeSwitch} className=' '>
                {
                  theme === "dark" ?
                  <BsFillSunFill size={20} color="gold" />
                  :
                  <BsCloudMoonFill size={20} />
                }
              </button>
              <button onClick={handleClickOpen} className=' bg-[#4f1179] px-2 py-1 text-sm text-white rounded-full'>Add Question</button>
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
              <button onClick={handleThemeSwitch} className=' '>
                {
                  theme === "dark" ?
                  <BsFillSunFill size={20} color="gold" />
                  :
                  <BsCloudMoonFill size={20} />
                }
              </button>
              <button onClick={handleClickOpen} className='bg-[#4f1179] px-2 py-1 text-sm text-white rounded-full'>+</button>
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
              <NavLink to="/" className='p-1 border-gray-200 flex items-center justify-center flex-1'><AiOutlineHome size={26} color="#4f1179"/></NavLink>
              <NavLink to="/orbits" className='p-1 border-gray-200 flex items-center justify-center flex-1'><GiMoonOrbit size={26} color="#4f1179"/></NavLink>
              <NavLink to="/followings" className='p-1 border-gray-200 flex items-center justify-center flex-1'><BsPeopleFill size={26} color="#4f1179"/></NavLink>
              <NavLink to="/questions" className='p-1 border-gray-200 flex items-center justify-center flex-1'><BiMessageEdit size={26} color="#4f1179"/></NavLink>
              <NavLink to="/gp" className='p-1 border-gray-200 flex items-center justify-center flex-1'>
                <BsCalculator color='#4f1179' size={22} />
              </NavLink>
      </ul>

      {/* Dialog */}
      <Dialog open={open} sx={{color:"#060109", minHeight:400}} onClose={handleClose} maxWidth={isLargeScreen ? 'sm' : 'lg'} fullWidth={true}>
        <div className='w-full flex '>
          <button onClick={handleClose} className='px-2 py-1 font-bold'>X</button>
        </div>  
        <div>
          <div className="flex justify-between border-b-2 border-[#8a1dd3]">
            <Tabs value={tabValue}  onChange={(e, newValue) => setTabValue(newValue)} sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#4f1179 !important",
              },
            }}>
              <Tab label="Add Question" sx={{
                color: tabValue === 0 ? "#4f1179 !important" : "inherit",
                "&.Mui-selected": {
                  color: "#4f1179 !important",
                },
              }} />
              <Tab label="Create Post" sx={{
                color: tabValue === 0 ? "#4f1179 !important" : "inherit",
                "&.Mui-selected": {
                  color: "#4f1179 !important",
                },
              }} />
            </Tabs>
          </div>
        </div>
        <DialogContent sx={{minHeight:300}}>
          {tabValue === 0 ? (
            <div className='w-full h-full flex flex-col'>
              <div className="mb-4 flex flex-col min-h-[300px]">
                <label htmlFor="question" className="block text-gray-600 font-semibold mb-2">
                  Question
                </label>
                <TextareaAutosize 
                    required
                    type="text"
                    id="question"
                    placeholder="Start your question with 'What' 'how' etc"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="h-4 flex-grow p-2 rounded-md bg-white text-sm outline-none"
                    cacheMeasurements={true}
                    autoFocus
                    style={{ resize: 'none' }} // Add this line to hide the resize handle
                />
              </div>
              <Button type="submit" 
                sx={{
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
               variant="contained" onClick={handleCreateQuestion} color="primary">
                Add Question
              </Button>
              {/* <Button onClick={handleClose}>X</Button> */}
            </div>
          ) : (
            <div className='w-full h-full flex flex-col'>
              <div className="mb-4 flex flex-col min-h-[300px]">
                <TextareaAutosize 
                    required
                    id="content"
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
              {/* <Button onClick={handleClose}>X</Button> */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
