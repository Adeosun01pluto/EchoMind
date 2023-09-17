import { useParams } from "react-router-dom"
import { ThreeDots } from 'react-loader-spinner';
import { AiFillAccountBook, AiFillDelete, AiFillSecurityScan, AiOutlineFileImage, } from 'react-icons/ai'
import {  useMutation, useQuery } from 'react-query';
import axios from 'axios';
import {Avatar, Button, Dialog, DialogContent, DialogTitle, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { BsFillEmojiSmileFill, BsFillImageFill } from "react-icons/bs";
import O_Feed from "./O_Feed";
import { BASE_URL } from "../../../constants/constant";
import { getUserId } from "../../../api/api";
import O_Question from "./O_Question";
import { fetchO_Questions, followOrbit, unFollowOrbit } from "../../../api/orbit/orbit";


function SingleOrbit() {
    const {orbitId} = useParams()
    const { data: orbit, isLoading, refetch:refetchOrbit} = useQuery(['orbit', orbitId], ()=>fetchOrbit(orbitId));
    const [tabValue, setTabValue] = useState(0);
    const [dialogTabValue, setDialogTabValue] = useState(0);
    const userId= getUserId()
    const [content, setContent] = useState('');
    const [question, setQuestion] = useState('');
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const fetchOrbit = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:4001/orbit/get_orbit/${orbitId}`, {
            headers: {
              Authorization: token,
            },
          });
          return response.data;
        } catch (error) {
          console.log(error.message);
        }
    };
    const fetchOrbitPosts = async (orbitId) => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:4001/orbit/get_posts/${orbitId}`, {
            headers: {
              Authorization: token,
            },
          });
          return response.data;
        } catch (error) {
          console.log(error.message);
        }
    };
    const { data: orbitPosts, refetch, isLoading: postsLoading} = useQuery(['orbit_posts', orbitId], ()=>fetchOrbitPosts(orbitId), 
    {
      enabled:false
    }
    );
    const handleCreateOrbitPost =async (e) =>{
      e.preventDefault()
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://localhost:4001/orbit/create_post/${orbitId}`, {content},{
          headers: {
            Authorization: token,
          },
        });
        refetch()
        setContent("")
        setOpen(false)
        return response.data;
      } catch (error) {
        console.log(error.message);
      }
    }
    const [orbitName, setOrbitName] = useState(orbit?.name);
    const [orbitDescription, setOrbitDescription] = useState(orbit?.description);
    const [openSetting, setOpenSetting] = useState(false);
    const [iconImage, setIconImage] = useState(null);
    const [coverPhoto, setCoverPhoto] = useState(null);

    const handleSaveSetting = async ()=>{
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('orbitDescription', orbitDescription);
        formData.append('orbitName', orbitName);
        formData.append('images', coverPhoto); // Append the first image
        formData.append('images', iconImage);  // Append the second image
        const response = await axios.put(`http://localhost:4001/orbit/edit/${orbitId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
              Authorization: token,
            },
          }
        );
        refetch()
        setOpenSetting(false)
        return response.data;
      } catch (error) {
        console.log(error.message);
      }
    }
    const  openSettingHandler = () =>{
      setOpenSetting(true)
    }
    const handleCloseSetting = () => {
      setOpenSetting(false);
    };
    const handleNameChangeSetting = (event) => {
      setOrbitName(event.target.value);
    };
    const handleDescriptionChangeSetting = (event) => {
      setOrbitDescription(event.target.value);
    };
    const handleIconChange = (event) => {
      const selectedImage = event.target.files[0];
      setIconImage(selectedImage)
    };
    const handleCoverPhotoChange = (event) => {
      const selectedPhoto = event.target.files[0];
      setCoverPhoto(selectedPhoto)
    };
    const handleImageUpload = () =>{

    }
     // Update orbitName and orbitDescription when orbit data is available
    useEffect(() => {
      if (orbit) {
        setOrbitName(orbit?.name || "");
        setOrbitDescription(orbit?.description || "");
      }
    }, [orbit]);
    const { data: questions ,refetch:refetchQuestion} = useQuery('o_questions', ()=>fetchO_Questions(orbitId));
    const createQuestionMutation = useMutation(() =>
    axios.post(`${BASE_URL}/orbit/add_question/${orbitId}`, {question}, {
      headers: {
        "Authorization": localStorage.getItem('token'),
      },
    })
    )
    const handleCreateQuestion = async () => {
      try {
        await createQuestionMutation.mutateAsync();
        refetchQuestion()
        setOpen(false)
      } catch (error) {
        console.error(error);
      }
    };
    const handleFollow = async () => {
      try {
        await followOrbit(orbitId, refetchOrbit);
        // Update the liked status for the post
      } catch (error) {
        console.error(error);
      }
    };
    const handleUnFollow = async () => {
      try {
        await unFollowOrbit(orbitId, refetchOrbit);
        // Update the liked status for the post
      } catch (error) {
        console.error(error);
      }
    };
    console.log(orbit)
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
    <div className='bg-white w-[100%] min-h-[400vh]'>
    <div className={`w-[100%] md:pb-2 bg-[black] flex flex-col md:gap-12`}>
      <div className='w-[100%] relative bg-red-500 sm:w-[80%] h-[200px] md:h-[250px] mx-auto mb-6 md:mb-2'>
        <img className="w-full h-full object-cover" src={`http://localhost:4001/images/${orbit.coverPhoto}`} alt="" />
        <div className="absolute bottom-[-20px] bg-white left-6 w-[130px]  rounded-md h-[100px] md:h-[130px]">
          <img className="w-full rounded-xl h-full object-cover" src={`http://localhost:4001/images/${orbit.iconImage}`} alt="" />
        </div>
      </div>
      <div className='w-[100%] bg-emerald-600 sm:w-[80%] mx-auto flex flex-col gap-2 p-2 md:p-4'>
        <div className='text-lg md:text-2xl text-white w-[100%] flex gap-3 items-center justify-between'>
          <div className="flex gap-1 md:gap-3 cursor-pointer items-center">
            <span className="md:font-bold font-light text-xl md:text-3xl">{`${orbit?.name?.trim()}'s`} Orbit</span>
            {userId === orbit?.admin &&<AiFillDelete color="white" onClick={()=>{}}/>  }
          </div>
          {/* show only if the userId is the admin */}
          {userId === orbit?.admin ?
          (
            <>
            <div className="flex gap-2 md:gap-3 bg-transparent border-2 py-1 px-2 border-white rounded-full text-black p-1 sm:p-2 items-center">
            <span className="text-lg text-white ">Admin</span>
            <AiFillSecurityScan color="white" />
            </div> 
            </>
          ): null
          }
          
        </div>
        <div className='flex flex-col w-[100%]'>
          <div className="flex justify-between w-[100%] items-center">
            <p className="text-gray-100">{orbit?.followers?.length} Followers</p>
            <div className='flex items-center gap-3'>
              { orbit?.followers?.includes(userId)? 
                <button onClick={handleUnFollow} className='py-1 px-3 text-white border-white rounded-full bg-transparent border-2'>unfollow</button> :
                <button onClick={handleFollow} className='py-1 px-3 text-black bg-white text-white800 rounded-full border-2 border-white'>Follow</button>
              }
              {/* <button className=''>Invite</button> */}
            </div>
          </div>
          <p className="text-gray-100">description</p>
        </div>
      </div>
    </div>
    <div className='mx-auto p-1 sm:p-2 w-[100%] md:w-[85%] gap-2 md:gap-5 grid grid-cols-12'>
      <div className=" md:p-3 col-span-12 sm:col-span-8 w-[100%] min-h-[600px]">
      {/* Tabs */}
        <div className="flex justify-between border-b-2 border-gray-300">
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Posts" onClick={refetch} sx={{fontSize:12}} />
            <Tab label="About" sx={{fontSize:12}} />
            <Tab label="Questions" sx={{fontSize:12}} />
          </Tabs>
        </div>
        {userId === orbit?.admin ?
          <div className='w-[100%] my-2 flex justify-around h-[100px] gap-1 sm:gap-2 bg-gray-100 p-1 sm:p-2 rounded-md'>
            <div className='flex flex-col hover:bg-[#cececece] items-center rounded-md w-[100%] cursor-pointer justify-center'>
              <AiFillAccountBook size={30} color='gray' />
              <span className='text-xs sm:text-md text-gray-400'>Invite</span>
            </div>
            <div onClick={openSettingHandler} className='flex flex-col hover:bg-[#cececece] items-center rounded-md w-[100%] cursor-pointer justify-center'>
              <AiFillAccountBook size={30} color='gray' />
              <span className='text-xs sm:text-md text-gray-400'>Settings</span>
            </div>
            <div className='flex flex-col hover:bg-[#cececece] items-center rounded-md w-[100%] cursor-pointer justify-center'>
              <AiFillAccountBook size={30} color='gray' />
              <span className='text-xs sm:text-md text-gray-400'>People</span>
            </div>
            <div className='flex flex-col hover:bg-[#cececece] items-center rounded-md w-[100%] cursor-pointer justify-center'>
              <AiFillAccountBook size={30} color='gray' />
              <span className='text-xs sm:text-md text-gray-400'>Admin Log</span>
            </div>
          </div>
          : null
        }
        <div className='w-[100%] p-1 md:p-3 my-2 flex gap-1 md:gap-3 items-center justify-around h-[70px] bg-gray-100 rounded-md'>
          <Avatar size={30} />
          <input type="text" onClick={handleClickOpen}  placeholder={`Post in ${orbit?.name} Orbit`} className=' flex-1 rounded-full p-3 sm:p-2 text-sm border-none outline-none' />
          <button className="space-inboxBtn p-1 sm:p-2 rounded-full bg-emerald-700 text-white text-xs sm:text-sm" onClick={handleClickOpen}  >Inbox</button>
        </div> 
          {/* Render the selected tab content */}
          {/*  */}
          {tabValue === 1 ?  (
            <div>FOr about</div>
          ) : null }
          {tabValue === 0 ?  (      
            <div>
              {postsLoading ? 
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
              </div> :
              orbitPosts?.map((post, idx) => (
                <O_Feed key={idx} post={post} refetch={refetch}/>
              ))}
            </div>      
          ) : null }
          {tabValue === 2 ?  (
            <div className="bg-gray-50">
              {questions?.map((question, idx) => (
                <O_Question key={idx} question={question} orbitId={orbitId} refetchQuestion={refetchQuestion}/>
              ))}
            </div>
          ) : null }
      </div>
      <div className="bg-emerald-100 spaceYouMayLike col-span-4 w-[100%] min-h-[100vh] p-3">
        <div className="w-[100%] bg-white h-[80px]"></div>
        <div className="w-[100%] bg-white h-[600px] my-2"></div>
      </div>
    </div>
    {/* Create Post or question */}
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth={true}>
        <DialogTitle>
          <div className="flex justify-between border-b-2 border-gray-300">
            <Tabs value={dialogTabValue} onChange={(e, newValue) => setDialogTabValue(newValue)}>
              <Tab label="Add Question" />
              <Tab label="Create Post" />
            </Tabs>
          </div>
        </DialogTitle>
        <DialogContent sx={{height:400}}>
          {dialogTabValue === 0 ? (
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
              <Button type="submit" onClick={handleCreateQuestion} variant="contained" color="primary">
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
              <Button type="submit" variant="contained" onClick={handleCreateOrbitPost} color="primary">
                Create Post
              </Button>
              <Button onClick={handleClose}>X</Button>
            </div>
          )}
        </DialogContent>
    </Dialog>

    {/* Setting */}
    <Dialog open={openSetting} onClose={handleCloseSetting} fullWidth={true} maxWidth="sm" className="">
            <DialogTitle className='p-2 text-lg text-blue-500'>Orbit Setting</DialogTitle>
            <div className='w-full gap-2 flex'>
                <div className='w-[95%] mx-auto flex flex-col gap-3'>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="" className="text-lg">Name</label>
                      <input type="text" value={orbitName} onChange={handleNameChangeSetting} className="p-2 border-[1px] rounded-sm outline-gray-100 border-gray-100" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="" className="text-lg">Description</label>
                      <input type="text" value={orbitDescription} onChange={handleDescriptionChangeSetting} className="p-2 border-[1px] rounded-sm outline-gray-100 border-gray-100" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label>
                          <span className="text-lg">Icon</span>
                          <AiOutlineFileImage size={50} color="lightgreen" />
                          <input
                            type="file"
                            className="hideInput"
                            accept="image/*"
                            onChange={handleIconChange}
                          />
                        </label>
                      </div>
                      <div>
                        <label>
                          <span className="text-lg">Cover Photo</span>
                          <div className="bg-emerald-600 w-[350px] h-[90px]"></div>
                          <input
                            type="file"
                            className="hideInput"
                            accept="image/*"
                            onChange={handleCoverPhotoChange}
                          />
                        </label>
                      </div>
                    </div>
                </div>
            </div>
            <div className='flex justify-between items-center px-4 py-2'>
                <div className=' flex items-center gap-4'>
                    <label htmlFor="image-upload" className="image-upload-label">
                        <BsFillImageFill size={25} color="gray" />
                    </label>
                    <input type="file" multiple id="image-upload" onChange={handleImageUpload} className="w-[0px]" />
                    <BsFillEmojiSmileFill size={25} color='gray' />
                </div>
                <button onClick={handleSaveSetting} className='py-2 px-5 bg-emerald-700 text-white text-md rounded-lg'>Save</button>
            </div>
      </Dialog>
  </div>
  )
}

export default SingleOrbit