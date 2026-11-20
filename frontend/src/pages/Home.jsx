import React from 'react'
import SideBar from '../components/SideBar'
import MessageArea from '../components/MessageArea'
import getMessage from '../customHooks/getMessages'


function Home() {
 getMessage()
  return (
    <div className='page-fade flex h-[100vh] w-full overflow-hidden bg-brand-bg'>
     <SideBar/>
     <MessageArea/>
    </div>
  )
}

export default Home
