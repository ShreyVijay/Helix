import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { RiEmojiStickerLine, RiSendPlane2Fill } from 'react-icons/ri'
import { FaImages } from 'react-icons/fa6'
import { RxCross2 } from 'react-icons/rx'
import EmojiPicker from 'emoji-picker-react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import dp from '../assets/dp.webp'
import { serverUrl } from '../main'
import { setSelectedUser } from '../redux/userSlice'
import { setMessages } from '../redux/messageSlice'
import SenderMessage from './SenderMessage'
import ReceiverMessage from './ReceiverMessage'

function DetailRow({ label, value }) {
  if (!value) return null

  return (
    <div className="rounded-2xl border border-brand-border/70 bg-brand-bg/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-100">{value}</p>
    </div>
  )
}

function MessageArea() {
  const { selectedUser, userData, socket, onlineUsers } = useSelector((state) => state.user)
  const { messages } = useSelector((state) => state.message)
  const dispatch = useDispatch()
  const [showPicker, setShowPicker] = useState(false)
  const [input, setInput] = useState('')
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  const [sendError, setSendError] = useState('')
  const image = useRef()
  const isOnline = selectedUser && onlineUsers?.includes(selectedUser._id)

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
    setSendError('')
  }

  const clearImage = () => {
    setBackendImage(null)
    setFrontendImage(null)
    if (image.current) image.current.value = ''
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() && backendImage == null) return

    try {
      const formData = new FormData()
      formData.append('message', input.trim())
      if (backendImage) {
        formData.append('image', backendImage)
      }
      const result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData, {
        withCredentials: true,
      })
      dispatch(setMessages([...(messages || []), result.data]))
      setInput('')
      clearImage()
      setSendError('')
    } catch (error) {
      console.log(error)
      setSendError(error?.response?.data?.message || 'Message could not be sent. Please try again.')
    }
  }

  const onEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji)
    setShowPicker(false)
  }

  useEffect(() => {
    const handleNewMessage = (mess) => {
      dispatch(setMessages([...(messages || []), mess]))
    }

    socket?.on('newMessage', handleNewMessage)
    return () => socket?.off('newMessage', handleNewMessage)
  }, [socket, messages, dispatch])

  return (
    <main className={`relative h-full min-w-0 flex-1 bg-brand-bg ${selectedUser ? 'flex' : 'hidden'} lg:flex`}>
      {selectedUser ? (
        <div className="flex h-full min-w-0 flex-1 flex-col">
          <header className="flex h-[88px] flex-none items-center gap-4 border-b border-brand-border bg-brand-surface/72 px-4 shadow-soft backdrop-blur-xl sm:px-6">
            <button className="icon-button lg:hidden" type="button" title="Back" onClick={() => dispatch(setSelectedUser(null))}>
              <IoIosArrowRoundBack size={30} />
            </button>
            <img src={selectedUser?.image || dp} alt={selectedUser?.name || 'Selected user'} className="h-12 w-12 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold text-white">{selectedUser?.name || selectedUser?.userName || 'User'}</h1>
              <p className="text-sm text-brand-muted">{isOnline ? 'Online' : 'Offline'}</p>
            </div>
          </header>

          <section className="relative min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {showPicker && (
              <div className="absolute bottom-5 left-5 z-20 overflow-hidden rounded-2xl border border-brand-border shadow-soft">
                <EmojiPicker width={300} height={360} onEmojiClick={onEmojiClick} theme="dark" />
              </div>
            )}

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-28">
              {(messages || []).length > 0 ? (
                (messages || []).map((mess) =>
                  mess.sender === userData._id ? (
                    <SenderMessage key={mess._id || `${mess.createdAt}-${mess.message}`} image={mess.image} message={mess.message} createdAt={mess.createdAt} />
                  ) : (
                    <ReceiverMessage key={mess._id || `${mess.createdAt}-${mess.message}`} image={mess.image} message={mess.message} createdAt={mess.createdAt} />
                  ),
                )
              ) : (
                <div className="page-fade flex min-h-[52vh] flex-col items-center justify-center text-center">
                  <div className="brand-mark mb-4">H</div>
                  <h2 className="text-2xl font-bold text-white">Start the conversation</h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-brand-muted">Send a message or share an image when you are ready.</p>
                </div>
              )}
            </div>
          </section>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-brand-bg via-brand-bg/96 to-transparent px-4 pb-4 pt-12 sm:px-6">
            <div className="pointer-events-auto mx-auto w-full max-w-4xl">
              {frontendImage && (
                <div className="slide-up mb-3 inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-surface p-2 shadow-soft">
                  <img src={frontendImage} alt="Selected upload preview" className="h-16 w-16 rounded-xl object-cover" />
                  <button type="button" className="icon-button h-10 w-10" title="Remove image" onClick={clearImage}>
                    <RxCross2 size={20} />
                  </button>
                </div>
              )}
              {sendError && <p className="mb-3 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{sendError}</p>}
              <form className="glass-panel flex min-h-[68px] items-center gap-2 rounded-[24px] px-3 sm:gap-3 sm:px-4" onSubmit={handleSendMessage}>
                <button className="icon-button" type="button" title="Choose emoji" onClick={() => setShowPicker((prev) => !prev)}>
                  <RiEmojiStickerLine size={22} />
                </button>
                <input type="file" accept="image/*" ref={image} hidden onChange={handleImage} />
                <input
                  type="text"
                  className="h-12 min-w-0 flex-1 border-0 bg-transparent px-2 text-base text-white outline-none placeholder:text-brand-muted"
                  placeholder="Message"
                  onChange={(e) => {
                    setInput(e.target.value)
                    setSendError('')
                  }}
                  value={input}
                />
                <button className="icon-button" type="button" title="Upload image" onClick={() => image.current.click()}>
                  <FaImages size={20} />
                </button>
                <button
                  className="icon-button bg-brand-primary text-white hover:bg-brand-accent"
                  type="submit"
                  title="Send message"
                  disabled={!input.trim() && backendImage == null}
                >
                  <RiSendPlane2Fill size={21} />
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="page-fade hidden h-full flex-1 flex-col items-center justify-center px-8 text-center lg:flex">
          <div className="brand-mark mb-5">H</div>
          <h1 className="text-4xl font-bold text-white">Helix</h1>
          <p className="mt-3 max-w-md text-brand-muted">Choose a conversation to begin messaging.</p>
        </div>
      )}

      {selectedUser && (
        <aside className="hidden h-full w-[26%] min-w-[280px] max-w-[360px] border-l border-brand-border bg-brand-surface/50 p-4 xl:block">
          <div className="glass-panel flex h-full flex-col rounded-[24px] p-5">
            <div className="flex flex-col items-center border-b border-brand-border/70 pb-6 text-center">
              <img src={selectedUser?.image || dp} alt={selectedUser?.name || 'Profile'} className="h-28 w-28 rounded-[28px] object-cover shadow-glow" />
              <h2 className="mt-4 max-w-full truncate text-xl font-bold text-white">{selectedUser?.name || selectedUser?.userName || 'User'}</h2>
              <p className="mt-1 text-sm text-brand-muted">{isOnline ? 'Online' : 'Offline'}</p>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              <DetailRow label="Username" value={selectedUser?.userName} />
              <DetailRow label="Email" value={selectedUser?.email} />
            </div>
          </div>
        </aside>
      )}
    </main>
  )
}

export default MessageArea
