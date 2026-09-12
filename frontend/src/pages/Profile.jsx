import React, { useRef, useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { IoCameraOutline } from 'react-icons/io5'
import { FiMail, FiSave, FiUser } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import dp from '../assets/dp.webp'
import { serverUrl } from '../main'
import { setUserData } from '../redux/userSlice'

function Profile() {
  const { userData } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState(userData?.name || '')
  const [frontendImage, setFrontendImage] = useState(userData?.image || dp)
  const [backendImage, setBackendImage] = useState(null)
  const [saving, setSaving] = useState(false)
  const image = useRef()

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      if (backendImage) {
        formData.append('image', backendImage)
      }
      const result = await axios.put(`${serverUrl}/api/user/profile`, formData, { withCredentials: true })
      setSaving(false)
      dispatch(setUserData(result.data))
      navigate('/')
    } catch (error) {
      console.log(error)
      setSaving(false)
    }
  }

  return (
    <div className="page-fade flex min-h-[100vh] w-full items-center justify-center bg-brand-bg px-4 py-8 text-white">
      <button className="icon-button fixed left-4 top-4 sm:left-6 sm:top-6" type="button" title="Back" onClick={() => navigate('/')}>
        <IoIosArrowRoundBack size={30} />
      </button>

      <form className="glass-panel slide-up flex w-full max-w-2xl flex-col items-center rounded-[28px] p-6 sm:p-8" onSubmit={handleProfile}>
        <div className="mb-7 flex items-center gap-3 self-start">
          <div className="brand-mark">H</div>
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-sm text-brand-muted">Update your display name and avatar.</p>
          </div>
        </div>

        <button
          type="button"
          className="group relative rounded-[34px] border border-brand-border bg-brand-surface p-2 shadow-glow"
          onClick={() => image.current.click()}
        >
          <span className="block h-40 w-40 overflow-hidden rounded-[28px] sm:h-48 sm:w-48">
            <img src={frontendImage} alt="Profile preview" className="h-full w-full object-cover" />
          </span>
          <span className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-border bg-brand-bg text-white shadow-soft transition group-hover:border-brand-accent">
            <IoCameraOutline size={24} />
          </span>
        </button>

        <input type="file" accept="image/*" ref={image} hidden onChange={handleImage} />

        <div className="mt-8 grid w-full gap-4">
          <label className="flex h-14 items-center gap-3 rounded-2xl border border-brand-border bg-brand-bg/70 px-4 text-brand-muted">
            <FiUser size={20} />
            <input
              type="text"
              placeholder="Display name"
              className="h-full min-w-0 flex-1 border-0 bg-transparent text-white outline-none placeholder:text-brand-muted"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </label>
          <label className="flex h-14 items-center gap-3 rounded-2xl border border-brand-border bg-brand-bg/70 px-4 text-brand-muted">
            <FiUser size={20} />
            <input type="text" readOnly className="h-full min-w-0 flex-1 border-0 bg-transparent text-slate-400 outline-none" value={userData?.userName || ''} />
          </label>
          <label className="flex h-14 items-center gap-3 rounded-2xl border border-brand-border bg-brand-bg/70 px-4 text-brand-muted">
            <FiMail size={20} />
            <input type="email" readOnly className="h-full min-w-0 flex-1 border-0 bg-transparent text-slate-400 outline-none" value={userData?.email || ''} />
          </label>
        </div>

        <button
          className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary font-semibold text-white shadow-glow transition hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-70 sm:w-[240px]"
          disabled={saving}
        >
          <FiSave size={20} />
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>
    </div>
  )
}

export default Profile
