import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('employee')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      // Save role to profile table
      const userId = data.user.id
      await supabase.from('profiles').insert({ id: userId, role })

      alert('Signup successful! Please check your email to verify.')
      navigate('/login')
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
  )
}
