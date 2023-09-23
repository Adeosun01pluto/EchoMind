import { Button, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import {  useQuery } from 'react-query';
import axios from 'axios';
import Orbit from "./Orbit";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import SideBar from "../../common/SideBar";
import { BASE_URL } from "../../../constants/constant";

function getRandomNumber() {
  return Math.floor(Math.random() * 36) + 1;
}
function getRandomHexColor() {
  // Generate random values for red, green, and blue channels
  const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  // Combine the channels to create a HEX color code
  const hexColor = `#${red}${green}${blue}`;
  return hexColor;
}

function Orbits() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(false);
  const [description, setDescription] = useState(false);
  const navigate = useNavigate()
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const fetchOrbits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/orbit/read_orbits`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  };
  const { data, isLoading, refetch} = useQuery('orbits', fetchOrbits);
  const handleCreateOrbit = async (e) => {
    e.preventDefault()
    try {
      const tempIconImage = getRandomNumber();
      const tempCoverImage = getRandomNumber();
      const orbitColor = getRandomHexColor();
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/orbit/create_orbit`, {name, description, tempIconImage, tempCoverImage, orbitColor},
      {
        headers: {
          Authorization: token,
        },
      });
      refetch()
      setOpen(false);
      setDescription("")
      setName("")
      navigate(`/orbit/${response.data?._id}`)
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  };

  if(isLoading)return (
    <div className="w-full items-center justify-center flex">
        <ThreeDots 
          height="80" 
          width="50" 
          radius="9"
          color="gray" 
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
          />
    </div>
  )
  return (
    <div className="w-full grid grid-cols-12 gap-4 mx-auto p-2 md:p-4">
      <div className='sm:col-span-4 md:col-span-3'>
        <SideBar />
      </div>
      <div className="col-span-12 sm:col-span-8 md:col-span-6 lg:col-span-5">
        <div className="">
          {/* Top Spaces */}
          <div className='w-[100%] p-2 dark:bg-[#171517] bg-[#f2e4fb] rounded-sm'>
              <p className='text-lg dark:text-[#f2e4fb] text-[#060109]'>Welcome to Spaces!</p>
              <span className='text-sm dark:text-[#f2e4fb] text-[#060109]'>Follow Space Lorem, ipsum dolor.</span>
              <div className='flex gap-2 pt-4 pb-3'>
                  <button onClick={handleClickOpen} className='p-1 px-2 text-sm font-semibold text-[white] bg-[#4f1179] rounded-full'>Create a Space</button>
                  <button className='p-1 px-2 text-sm text-[#4f1179] bg-[white] font-semibold border-2 rounded-full'>Discover a Space</button>
              </div>
          </div>
          {/*  */}
          <p className='text-lg py-8'>Discover Spaces!</p>
          {/* Space sections */}
          <div className='grid grid-cols-2 sm:grid-col-3 gap-3'>
          {data?.map((orbit, idx)=>(
            <Orbit orbit={orbit} key={idx}/>
          ))}

          </div>
        </div>
      </div>

      <div className='md:col-span-3 lg:col-span-4 bg-black'></div>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth={true}>
        <DialogTitle>
          <div>
            <p>Create an Orbit</p>
            <span className="text-sm font-light">Share your interests, curate content, host discussions, and more.</span>
          </div>
        </DialogTitle>
        <DialogContent sx={{height:350}}>
          <form  className='w-full h-full'>
            <div className="mb-4 flex flex-col gap-3 md:gap-5 h-[80%]">      
              <div className="flex flex-col">
                <label htmlFor="">Name *</label>
                <span className="text-gray-600 py-1 text-sm font-light">This can be changed in Space settings.</span>
                <TextField id="outlined-basic" value={name} onChange={(e)=>setName(e.target.value)} variant="outlined" />
              </div>
              <div className="flex flex-col">
                <label htmlFor=""> Brief description</label>
                <span className="text-gray-600 py-1 text-sm font-light">Include a few keywords to show people what to expect if they join.</span>
                <TextField id="outlined-basic" value={description} onChange={(e)=>setDescription(e.target.value)} variant="outlined" />
              </div>
            </div>
            <Button type="submit" onClick={handleCreateOrbit} variant="contained" color="primary" >Create Orbit</Button>
            {/* <Button onClick={handleClose}>X</Button> */}
          </form>

        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Orbits