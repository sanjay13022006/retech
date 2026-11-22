
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail } from 'lucide-react'

// Authorized Admin User IDs
const ADMIN_UIDS = [
  '2b1c868a-2af0-4b4a-a5b5-c22794195215',
  'af13f67f-b928-4abc-916f-ef123f901266'
]

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      // Sign in using Supabase Authentication
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        })

      if (loginError) {
        throw loginError
      }

      // Check whether the logged-in user is an authorized admin
      const loggedInUser = data.user

      if (!ADMIN_UIDS.includes(loggedInUser?.id)) {
        await supabase.auth.signOut()

        setError(
          'Access denied. This account is not authorized as a ReTech administrator.'
        )

        return
      }

      // Successful admin login
      navigate('/admin', { replace: true })

    } catch (error) {
      console.error('Admin login error:', error)

      setError(error.message || 'Unable to login. Please try again.')

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F5FA] flex items-center justify-center px-5">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-lg p-8">

        {/* Brand */}
        <h1 className="text-3xl font-extrabold text-[#211B2B]">
          retech<span className="text-purple-600">.</span>
        </h1>

        <p className="text-purple-600 text-xs font-bold mt-8 uppercase">
          Administration
        </p>

        <h2 className="text-2xl font-bold mt-2">
          Admin Login
        </h2>

        <p className="text-gray-500 text-sm mt-2">
          Sign in to manage your ReTech store.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm font-semibold">
              Email Address
            </label>

            <div className="flex items-center border rounded-xl px-3 mt-2">
              <Mail size={18} className="text-gray-400" />

              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin email"
                className="w-full p-3 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold">
              Password
            </label>

            <div className="flex items-center border rounded-xl px-3 mt-2">
              <LockKeyhole size={18} className="text-gray-400" />

              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 outline-none"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold disabled:opacity-60 transition"
          >
            {loading ? 'Signing in...' : 'Login to Dashboard'}
          </button>

        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Authorized ReTech administrators only.
        </p>

      </div>
    </div>
  )
}
