import React from 'react'
import SideBar from '../components/SideBar'
import MessageArea from '../components/MessageArea'
import useMessages from '../customHooks/getMessages'


function Home() {
 useMessages()
  return (
    <div className='page-fade flex h-[100vh] w-full overflow-hidden bg-brand-bg'>
     <SideBar/>
     <MessageArea/>
    </div>
  )
}

export default Home
