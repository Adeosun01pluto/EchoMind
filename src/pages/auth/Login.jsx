// Login.js
import { useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../constants/constant';
import { ThreeDots } from 'react-loader-spinner';
const Login = () => {
  const navigate = useNavigate(); // Initialize useHistory
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [error, setError ] = useState(null)

  const loginMutation = useMutation((formData) =>
    axios.post(`${BASE_URL}/auth/login`, formData)
  );
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"
  console.log(location)
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const response = await loginMutation.mutateAsync(formData);
      if (response.data.message === 'Login successful') {
        // Login successful, navigate to /home
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        setLoading(false)
        navigate('/');
        // Check if both token and userId are available
        if (localStorage.getItem('token') && localStorage.getItem('userId')) {
          // Navigate to feeds
          navigate(from ,  {replace: true});
        }
      }
    } catch (error) {
      setLoading(false)
      setError(error.response.data.message)
    }
  };
  return (
    <div className="w-[100%] md:w-[90%] py-6 mx-auto text-[#060109] flex justify-center">
      <div className=" w-[95%] md:w-[50%] py-8 dark:bg-[#171517] bg-[#f2e4fb] rounded-md flex flex-col shadow-lg items-center">
        <p className='md:text-3xl text-xl py-3 text-[#4f1179] font-semibold'>Welcome Back</p>
        <form onSubmit={handleSubmit} className="w-[95%] md:w-[65%] mt-5 mx-auto flex flex-col gap-4">
          <div className='flex flex-col gap-2'>
            <label className="text-[#4f1179] text-md font-semibold">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4f1179]"
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className="text-[#4f1179] text-md font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4f1179]"
            />
          </div>
          <div className="error text-red-500">{error}</div>
          <button
            type="submit"
            className="w-full bg-[#4f1179] text-white flex items-center justify-center gap-1 py-2 px-4 rounded-md hover:bg-[#4f1179] focus:outline-none"
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
          </span> : "Login" } </button>
          <div className="flex justify-between w-[80%] mx-auto text-sm items-center">
            <span className="text-sm text-gray-700">Do not have an account?</span>
            <Link to="/register" className="text-[#4f1179]">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );

};

export default Login;
