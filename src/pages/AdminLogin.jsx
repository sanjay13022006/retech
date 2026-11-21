
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail } from 'lucide-react'

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

    const adminEmail = 'sanjayravikumar.13@gmail.com'

    if (email.trim().toLowerCase() !== adminEmail) {
      setError('Access denied. Admin account only.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-[#F8F5FA] flex items-center justify-center px-5">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-lg p-8">

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

          <div>
            <label className="text-sm font-semibold">
              Email Address
            </label>

            <div className="flex items-center border rounded-xl px-3 mt-2">
              <Mail size={18} className="text-gray-400" />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin email"
                className="w-full p-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">
              Password
            </label>

            <div className="flex items-center border rounded-xl px-3 mt-2">
              <LockKeyhole size={18} className="text-gray-400" />

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Login to Dashboard'}
          </button>

        </form>

      </div>
    </div>
  )
}
