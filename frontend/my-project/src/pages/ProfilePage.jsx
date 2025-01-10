import React from 'react'
import { useAuth } from '../store/useAuth.js'
const ProfilePage = () => {
  const {authUser}=useAuth();
  return (
    <div>ProfilePage</div>
  )
}

export default ProfilePage