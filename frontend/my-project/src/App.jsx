import React, { useEffect } from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Navbar from './components/Navbar.jsx'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { axiosInstance } from './lib/axios.js'
import { useAuth } from './store/useAuth.js'
import {Loader} from 'lucide-react'
import { Toaster } from 'react-hot-toast'
const App = () => {
  const {authUser,checkAuth, isCheckingAuth}=useAuth();
  useEffect(()=>{
    checkAuth();
  },[checkAuth]); 
  console.log(authUser);
  if(!checkAuth && !authUser){
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }
  return (
    <div data-theme="halloween" >
      <Navbar/>
      <Routes>
            <Route path='/' element={authUser?<Homepage/> :<Navigate to="/login" />}/>
            <Route path='/signup' element={!authUser?<SignupPage/>: <Navigate to='/'/>}/>
            <Route path='/login' element={!authUser?<LoginPage/>: <Navigate to='/'/>}/>
            <Route path='/settings' element={<SettingsPage/>}/>
            <Route path='/profile' element={authUser?<ProfilePage/>:<Navigate to="/login" />}/>
      </Routes>

      <Toaster/>
    </div>

  )
}

export default App