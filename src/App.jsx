import './App.css'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import {Route, Routes } from 'react-router-dom';
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


function App() {
  // const token = localStorage.getItem('token');
  const userId = getUserId()
  return (
    <div className='w-full min-h-screen bg-[#e0e0e0] '>
      <Navbar/>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={userId ? <Feeds/> : <Login />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/followings" element={<Followings />} />
        <Route path="/orbits" element={<Orbits />} />
        <Route path="/orbit/:orbitId" element={<SingleOrbit />} />
        <Route path="/gp" element={<Gp />} />
        <Route path="/practice" element={<Practice />}>
          <Route path="" element={<Level />} />
          <Route path=":level" element={<Faculty />} />
          <Route path=":level/:faculty" element={<Courses />} />
          <Route path=":level/:faculty/:course" element={<P_Screen />} />
        </Route>
        {/* <Route path="/messages" element={<Chat/>}></Route> */}
        {/* <Route path="/chat/:receiverId" element={<ChatArea/>}></Route> */}
        <Route path="/*" element={<NotFound />} />

      </Routes>
    </div>
  )
}

export default App
