import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import dp from '../assets/dp.webp'

function formatTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function SenderMessage({ image, message, createdAt }) {
  const scroll = useRef()
  const { userData } = useSelector((state) => state.user)

  useEffect(() => {
    scroll?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message, image])

  const handleImageScroll = () => {
    scroll?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="message-enter flex items-start gap-3 self-end" ref={scroll}>
      <div className="flex max-w-[min(78vw,520px)] flex-col gap-2 rounded-[22px] rounded-tr-md bg-brand-primary px-4 py-3 text-white shadow-glow">
        {image && <img src={image} alt="Sent attachment" className="max-h-[280px] w-full max-w-[260px] rounded-2xl object-cover" onLoad={handleImageScroll} />}
        {message && <span className="whitespace-pre-wrap break-words text-[15px] leading-6">{message}</span>}
        {createdAt && <span className="self-end text-[11px] font-medium text-white/70">{formatTime(createdAt)}</span>}
      </div>
      <img src={userData?.image || dp} alt={userData?.name || 'You'} className="hidden h-9 w-9 rounded-2xl object-cover shadow-soft sm:block" />
    </div>
  )
}

export default SenderMessage
