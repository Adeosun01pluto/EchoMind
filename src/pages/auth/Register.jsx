// Register.js
import { useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../constants/constant';
import { ThreeDots } from 'react-loader-spinner';


const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(''); // Initialize error state
  const [suggestedUsername, setSuggestedUsername] = useState(''); // Initialize error state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // console.log(error)
  const registerMutation = useMutation((formData) =>
    axios.post(`${BASE_URL}/auth/register`, formData)
  );
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    // Generate the avatar using DiceBear
    const genderParam = formData.gender === 'female' ? 'female' : 'male';
    const avatarData = `https://avatars.dicebear.com/api/${genderParam}/${formData.username}.svg`;
    try {
      const response = await registerMutation.mutateAsync({
        ...formData,
        avatarData, // Include the avatar URL in the form data
      });
      if (response.data.message === 'User registered successfully') {
        // Registration successful, navigate to /login
        setLoading(false);
        navigate('/login');
      }
    } catch (error) {
      setLoading(false)
      setSuggestedUsername(error.response.data.suggestedUsername);
      setError(error.response.data.message); // Set error message from the API response
    }
  };
  
  return (
    <div className="w-[100%] md:w-[90%] mx-auto py-6 text-[#060109] flex justify-center">
      <div className="w-[95%] dark:bg-[#171517] bg-[#f2e4fb] md:w-[50%] py-8 rounded-md flex flex-col shadow-lg items-center">
        <p className='md:text-3xl text-xl text-[#4f1179] font-semibold'>Register</p>
        <form onSubmit={handleSubmit} className=" w-[95%] md:w-[65%] mt-2 mx-auto flex flex-col gap-2 md:gap-3">
          <div className='flex flex-col gap-2'>
            <label className="text-[#4f1179] text-md font-semibold">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f1179]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#4f1179] text-md font-semibold">Email</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f1179]"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#4f1179] text-md font-semibold">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f1179]"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#4f1179] text-md font-semibold">Gender</label>
            <select
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 bg-white focus:ring-[#4f1179]"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#4f1179] text-md font-semibold">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f1179]"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#4f1179] text-md font-semibold">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f1179]"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="text-red-500 text-sm text-center">{error} </div>
          {!suggestedUsername? null :
          <div className="text-green-500 text-sm text-center">try this {suggestedUsername} </div>
          }
          <button
            type="submit"
            className="w-full bg-[#4f1179] flex items-center justify-center gap-1 text-white py-2 px-4 rounded-md hover:bg-[#4f1179] focus:outline-none"
          >{loading ? <span className='flex items-center justify-center'>
            <ThreeDots 
            height="20" 
            width="20" 
            radius="9"
            color="white" 
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
            />
          </span> : "Login" }
        </button>
          <div className="flex justify-between w-[80%] mx-auto text-sm items-center">
            <span className="text-sm text-gray-700">Already have an account?</span>
            <Link to="/login" className="text-[#4f1179]">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );

};

export default Register;
