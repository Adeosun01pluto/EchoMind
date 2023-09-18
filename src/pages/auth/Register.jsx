// Register.js
import { useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../constants/constant';


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("hjsdad")
    try {
      const response = await registerMutation.mutateAsync(formData);
      if (response.data.message === 'User registered successfully') {
        // Registration successful, navigate to /home
        navigate("/login")
      }
    } catch (error) {
      setSuggestedUsername(error.response.data.suggestedUsername)
      setError(error.response.data.message); // Set error message from the API response
    }
  };
  return (
    <div className="w-[100%] md:w-[90%] pt-[110px] md:pt-[70px] mx-auto min-h-[110vh] flex justify-center items-center">
      <div className="w-[95%] md:w-[50%] py-8 min-h-[70vh] bg-white rounded-md flex flex-col shadow-lg items-center">
        <p className='md:text-3xl text-xl py-3 text-emerald-700 font-semibold'>Register</p>
        <form onSubmit={handleSubmit} className=" w-[95%] md:w-[55%] mt-5 mx-auto flex flex-col gap-2 md:gap-3">
          <div>
            {/* <label className="mb-2 text-md font-semibold">Full Name</label> */}
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
          <div className="">
            {/* <label className="mb-2 text-md font-semibold">email</label> */}
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
            />
          </div>
          <div className="">
            {/* <label className="mb-2 text-md font-semibold">username</label> */}
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="">
            {/* <label className="mb-2 text-md font-semibold">password</label> */}
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="">
            {/* <label className="mb-2 text-md font-semibold">Password</label> */}
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
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
            className="w-full bg-emerald-700 flex items-center justify-center gap-1 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none"
          >Register</button>
          <div className="flex justify-between w-[80%] mx-auto text-sm items-center">
            <span className="text-sm text-gray-700">Already have an account?</span>
            <Link to="/login" className="text-emerald-700">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );

};

export default Register;
