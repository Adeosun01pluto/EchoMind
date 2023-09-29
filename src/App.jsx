import './App.css'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import {Navigate, Route, Routes } from 'react-router-dom';
import Feeds from './pages/layout/feeds/Feeds';
import Navbar from './components/navbar/Navbar';
import Profile from './pages/profile/Profile';
import Followings from './pages/layout/followings/Followings';
import Orbits from './pages/layout/orbits/Orbits';
import SingleOrbit from './pages/layout/orbits/SingleOrbit';
import Questions from './pages/layout/questions/Questions';
import Gp from './pages/layout/gp/Gp';
import Practice from './pages/layout/practice/Practice';
import Faculty from './pages/layout/practice/Faculty';
import Courses from './pages/layout/practice/Courses';
import P_Screen from './pages/layout/practice/P_Screen';
import NotFound from './pages/layout/nofound/NotFound';
import Level from './pages/layout/practice/Level';
import { getUserId } from './api/api';
// import ChatArea from './pages/layout/Chat/ChatArea';
// import { getUserId } from './api/api';

// primary : #4f1179
// bg : #f2e4fb
// text : #060109
// secondary : #e3c5f7
// accent : #8a1dd3
// sx={{background:"#4f1179"}}
// sx={{color:"#4f1179"}}
// dark:text-[#f2e4fb] text-[#060109]
// dark:bg-[#171517] bg-[#f2e4fb]
// dark:bg-[#171517]


// dark mode
// text : #f2e4fb
// bg : #060109
// primary : #4f1179
// secondary : #150420 
// accent : #cd98f1 

function App() {
  const token = localStorage.getItem('token');
  const userId = getUserId()
  console.log(token , userId)
  return (
    <div className='w-full min-h-screen dark:text-[#f2e4fb] text-[#060109] dark:bg-[#060109] bg-[#f3f3f3] '>
      <Navbar/>
      <div className='pt-[80px] lg:pt-[60px]'>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={ token ?  <Feeds/> : <Navigate to="/login" />}  />
        <Route path="/profile/:userId" element={token ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/questions" element={token? <Questions /> : <Navigate to="/login" />} />
        <Route path="/followings" element={token ? <Followings /> : <Navigate to="/login" />} />
        <Route path="/orbits" element={token ? <Orbits /> : <Navigate to="/login" />} />
        <Route path="/orbit/:orbitId" element={<SingleOrbit />} />
        <Route path="/gp" element={<Gp />} />
        <Route path="/practice" element={<Practice />}>
          <Route path="" element={<Level />} />
          <Route path=":level" element={<Faculty />} />
          <Route path=":level/:faculty" element={<Courses />} />
          <Route path=":level/:faculty/:course" element={<P_Screen />} />
        </Route>
        {/* <Route path="/chat/:receiverId" element={<ChatArea/>}></Route> */}
        {/* <Route path="/chat/:receiverId" element={<ChatArea/>}></Route> */}
        <Route path="/*" element={<NotFound />} />

      </Routes>
      </div>
    </div>
  )
}

export default App
