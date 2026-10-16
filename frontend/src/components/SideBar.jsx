import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosSearch } from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'
import { BiLogOutCircle } from 'react-icons/bi'
import { FiUser } from 'react-icons/fi'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import dp from '../assets/dp.webp'
import { serverUrl } from '../main'
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice'

function SideBar() {
  const { userData, otherUsers, selectedUser, onlineUsers, searchData } = useSelector((state) => state.user)
  const [input, setInput] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onlineSet = useMemo(() => new Set(onlineUsers || []), [onlineUsers])
  const onlineUsersList = (otherUsers || []).filter((user) => onlineSet.has(user._id))
  const visibleUsers = input.trim() ? searchData || [] : otherUsers || []

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      dispatch(setUserData(null))
      dispatch(setOtherUsers(null))
      dispatch(setSelectedUser(null))
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = useCallback(async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/search?query=${encodeURIComponent(input.trim())}`, {
        withCredentials: true,
      })
      dispatch(setSearchData(result.data))
    } catch (error) {
      console.log(error)
    }
  }, [input, dispatch])

  useEffect(() => {
    if (input.trim()) {
      handleSearch()
    } else {
      dispatch(setSearchData(null))
    }
  }, [dispatch, handleSearch, input])

  const openConversation = (user) => {
    dispatch(setSelectedUser(user))
    setInput('')
  }

  return (
    <aside
      className={`h-full w-full border-r border-brand-border/80 bg-brand-bg p-4 lg:flex lg:w-[28%] lg:min-w-[320px] lg:max-w-[380px] ${
        !selectedUser ? 'flex' : 'hidden'
      } flex-col`}
    >
      <div className="glass-panel flex h-full min-h-0 flex-col rounded-[24px] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="brand-mark">H</div>
            <div>
              <h1 className="text-xl font-bold text-white">Helix</h1>
              <p className="text-sm text-brand-muted">Signed in as {userData?.name || userData?.userName || 'user'}</p>
            </div>
          </div>
          <button className="icon-button" type="button" title="Edit profile" onClick={() => navigate('/profile')}>
            <FiUser size={20} />
          </button>
        </div>

        <label className="mt-5 flex h-12 items-center gap-3 rounded-2xl border border-brand-border bg-brand-bg/70 px-4 text-brand-muted shadow-inner">
          <IoIosSearch size={22} />
          <input
            type="text"
            placeholder="Search conversations"
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-white outline-none placeholder:text-brand-muted"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          {input && (
            <button type="button" className="text-brand-muted transition hover:text-white" onClick={() => setInput('')}>
              <RxCross2 size={20} />
            </button>
          )}
        </label>

        {onlineUsersList.length > 0 && !input.trim() && (
          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">Online</p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {onlineUsersList.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  className="relative h-14 w-14 flex-none overflow-hidden rounded-2xl border border-brand-border bg-brand-surface transition hover:border-brand-accent"
                  onClick={() => openConversation(user)}
                  title={user.name || user.userName}
                >
                  <img src={user.image || dp} alt={user.name || user.userName || 'User'} className="h-full w-full object-cover" />
                  <span className="absolute bottom-1.5 right-1.5 h-3 w-3 rounded-full border-2 border-brand-surface bg-emerald-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
            {input.trim() ? 'Search results' : 'Conversations'}
          </p>
          <div className="flex flex-col gap-2">
            {visibleUsers.map((user) => {
              const isOnline = onlineSet.has(user._id)
              const isActive = selectedUser?._id === user._id

              return (
                <button
                  key={user._id}
                  type="button"
                  className={`flex h-[72px] w-full items-center gap-3 rounded-2xl border px-3 text-left transition ${
                    isActive
                      ? 'border-brand-primary bg-brand-primary/18 shadow-glow'
                      : 'border-transparent bg-transparent hover:border-brand-border hover:bg-brand-surface/70'
                  }`}
                  onClick={() => openConversation(user)}
                >
                  <div className="relative h-12 w-12 flex-none overflow-hidden rounded-2xl bg-brand-surface">
                    <img src={user.image || dp} alt={user.name || user.userName || 'User'} className="h-full w-full object-cover" />
                    <span
                      className={`absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-brand-surface ${
                        isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-100">{user.name || user.userName}</p>
                    <p className="text-sm text-brand-muted">{isOnline ? 'Online' : 'Offline'}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-brand-border/70 pt-4">
          <button type="button" className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-brand-surface" onClick={() => navigate('/profile')}>
            <img src={userData?.image || dp} alt={userData?.name || 'Profile'} className="h-11 w-11 rounded-2xl object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{userData?.name || userData?.userName || 'Profile'}</p>
              <p className="truncate text-xs text-brand-muted">{userData?.email || userData?.userName}</p>
            </div>
          </button>
          <button className="icon-button" type="button" title="Log out" onClick={handleLogOut}>
            <BiLogOutCircle size={22} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default SideBar
