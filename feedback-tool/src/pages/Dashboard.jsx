import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const getProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!error) {
        setProfile(data)
      }
    }

    if (user) getProfile()
  }, [user])

  if (!profile) return <p>Loading...</p>

  return profile.role === 'manager' ? <ManagerDashboard /> : <EmployeeDashboard />
}
