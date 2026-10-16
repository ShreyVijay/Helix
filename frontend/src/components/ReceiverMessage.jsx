import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import dp from '../assets/dp.webp'

function formatTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function ReceiverMessage({ image, message, createdAt }) {
  const scroll = useRef()
  const { selectedUser } = useSelector((state) => state.user)

  useEffect(() => {
    scroll?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message, image])

  const handleImageScroll = () => {
    scroll?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="message-enter flex items-start gap-3 self-start" ref={scroll}>
      <img src={selectedUser?.image || dp} alt={selectedUser?.name || 'Sender'} className="hidden h-9 w-9 rounded-2xl object-cover shadow-soft sm:block" />
      <div className="flex max-w-[min(78vw,520px)] flex-col gap-2 rounded-[22px] rounded-tl-md border border-brand-border bg-brand-surface px-4 py-3 text-slate-100 shadow-soft">
        {image && <img src={image} alt="Received attachment" className="max-h-[280px] w-full max-w-[260px] rounded-2xl object-cover" onLoad={handleImageScroll} />}
        {message && <span className="whitespace-pre-wrap break-words text-[15px] leading-6">{message}</span>}
        {createdAt && <span className="self-start text-[11px] font-medium text-brand-muted">{formatTime(createdAt)}</span>}
      </div>
    </div>
  )
}

export default ReceiverMessage
