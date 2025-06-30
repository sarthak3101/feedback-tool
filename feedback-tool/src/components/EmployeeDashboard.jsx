import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('employee_id', user.id)
        .order('created_at', { ascending: false })

      if (!error) {
        setFeedbacks(data)
      }
    }

    if (user) fetchFeedback()
  }, [user])

  return (
    <div>
      <h2>Your Feedback</h2>
      {feedbacks.map((f) => (
        <div key={f.id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
          <p><strong>Strengths:</strong> {f.strengths}</p>
          <p><strong>Improvements:</strong> {f.improvements}</p>
          <p><strong>Notes:</strong> {f.notes}</p>
          <p><i>Received on {new Date(f.created_at).toLocaleString()}</i></p>
        </div>
      ))}
    </div>
  )
}
