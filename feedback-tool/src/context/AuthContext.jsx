import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
