import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getUserId } from '../api/api';

function RequireAuth() {
    // const token = localStorage.getItem('token');
    const userId = getUserId()  
    const location = useLocation()
  return (
    userId ? <Outlet /> 
    : <Navigate to="/login" state={{from: location}} replace/>
)
}

export default RequireAuth