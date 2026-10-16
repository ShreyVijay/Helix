import React, { useEffect, useRef } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import useCurrentUser from './customHooks/getCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import Profile from './pages/Profile'
import useOtherUsers from './customHooks/getOtherUsers'
import {io} from "socket.io-client"
import { serverUrl } from './main'
import { setOnlineUsers, setSocket } from './redux/userSlice'

function App() {
  useCurrentUser()
  useOtherUsers()
  let {userData}=useSelector(state=>state.user)
  let dispatch=useDispatch()
  const socketRef = useRef(null)

  useEffect(()=>{
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
      dispatch(setSocket(null))
    }

    if(userData){
      const socketio=io(`${serverUrl}`,{
        query:{
          userId:userData?._id
        }
        })
        socketRef.current = socketio
        dispatch(setSocket(socketio))
        
        socketio.on("getOnlineUsers",(users)=>{
          dispatch(setOnlineUsers(users))
        })
        
        return ()=>socketio.close()
    }


  },[dispatch,userData])

  return (
    <Routes>
      <Route path='/login' element={!userData?<Login/>:<Navigate to="/"/>}/>
      <Route path='/signup' element={!userData?<SignUp/>:<Navigate to="/profile"/>}/>
      <Route path='/' element={userData?<Home/>:<Navigate to="/login"/>}/>
      <Route path='/profile' element={userData?<Profile/>:<Navigate to="/signup"/>}/>
    </Routes>
  )
}

export default App
