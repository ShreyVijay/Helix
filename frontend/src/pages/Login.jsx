import axios from 'axios'
import React, { useState } from 'react'
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { setSelectedUser, setUserData } from '../redux/userSlice'

function Login() {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email: email.trim(),
          password,
        },
        { withCredentials: true },
      )
      dispatch(setUserData(result.data))
      dispatch(setSelectedUser(null))
      navigate('/')
      setEmail('')
      setPassword('')
      setLoading(false)
      setErr('')
    } catch (error) {
      console.log(error)
      setLoading(false)
      setErr(error?.response?.data?.message || 'Login failed. Please try again.')
    }
  }

  return (
    <div className="page-fade flex min-h-[100vh] w-full bg-brand-bg text-white">
      <section className="hidden flex-1 flex-col justify-between border-r border-brand-border bg-brand-surface/50 p-10 lg:flex">
        <div className="flex items-center gap-3">
          <div className="brand-mark">H</div>
          <span className="text-xl font-bold">Helix</span>
        </div>
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold leading-tight">Welcome back to Helix</h1>
          <p className="mt-5 text-lg leading-8 text-brand-muted">Pick up your conversations in a focused, real-time workspace.</p>
        </div>
        <p className="text-sm text-brand-muted">Secure chat with live presence and image sharing.</p>
      </section>

      <section className="flex min-h-[100vh] flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <form className="glass-panel slide-up w-full max-w-md rounded-[28px] p-6 sm:p-8" onSubmit={handleLogin}>
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="brand-mark">H</div>
            <span className="text-xl font-bold">Helix</span>
          </div>
          <h2 className="text-3xl font-bold">Log in</h2>
          <p className="mt-2 text-sm text-brand-muted">Enter your account details to continue.</p>

          <div className="mt-8 flex flex-col gap-4">
            <label className="flex h-14 items-center gap-3 rounded-2xl border border-brand-border bg-brand-bg/70 px-4 text-brand-muted">
              <FiMail size={20} />
              <input
                type="email"
                placeholder="Email"
                className="h-full min-w-0 flex-1 border-0 bg-transparent text-white outline-none placeholder:text-brand-muted"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </label>

            <label className="flex h-14 items-center gap-3 rounded-2xl border border-brand-border bg-brand-bg/70 px-4 text-brand-muted">
              <FiLock size={20} />
              <input
                type={show ? 'text' : 'password'}
                placeholder="Password"
                className="h-full min-w-0 flex-1 border-0 bg-transparent text-white outline-none placeholder:text-brand-muted"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button type="button" className="text-brand-muted transition hover:text-white" title={show ? 'Hide password' : 'Show password'} onClick={() => setShow((prev) => !prev)}>
                {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </label>
          </div>

          {err && <p className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{err}</p>}

          <button
            className="mt-6 h-14 w-full rounded-2xl bg-brand-primary font-semibold text-white shadow-glow transition hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <p className="mt-6 text-center text-sm text-brand-muted">
            New to Helix?{' '}
            <button type="button" className="font-semibold text-white transition hover:text-brand-accent" onClick={() => navigate('/signup')}>
              Create an account
            </button>
          </p>
        </form>
      </section>
    </div>
  )
}

export default Login
