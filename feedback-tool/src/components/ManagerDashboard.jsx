import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function ManagerDashboard() {
  const [team, setTeam] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [form, setForm] = useState({
    heading: '',
    strengths: '',
    improvements: '',
    rating: 0,
    comments: ''
  })

  const [feedbackStats, setFeedbackStats] = useState({})

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('employee_id, profiles:employee_id (id, name)')
      if (!error) setTeam(data)
    }

    const fetchFeedbackStats = async () => {
      const res = await supabase
        .from('feedbacks')
        .select('employee_id, acknowledged')

      if (!res.error) {
        const stats = {}
        res.data.forEach(fb => {
          if (!stats[fb.employee_id]) stats[fb.employee_id] = { total: 0, read: 0 }
          stats[fb.employee_id].total++
          if (fb.acknowledged) stats[fb.employee_id].read++
        })
        setFeedbackStats(stats)
      }
    }

    fetchTeam()
    fetchFeedbackStats()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const managerId = (await supabase.auth.getUser()).data.user.id

    const { error } = await supabase.from('feedbacks').insert({
      manager_id: managerId,
      employee_id: selectedEmployee,
      heading: form.heading,
      strengths: form.strengths,
      improvements: form.improvements,
      rating: form.rating,
      comments: form.comments
    })

    if (error) alert(error.message)
    else {
      alert('Feedback submitted!')
      setForm({
        heading: '',
        strengths: '',
        improvements: '',
        rating: 0,
        comments: ''
      })
    }
  }

  return (
    <div>
      <h2>Submit Feedback</h2>

      <select onChange={(e) => setSelectedEmployee(e.target.value)} value={selectedEmployee || ''}>
        <option value="">Select Employee</option>
        {team.map((t) => (
          <option key={t.employee_id} value={t.employee_id}>
            {t.profiles.name}
          </option>
        ))}
      </select>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Feedback Heading"
          value={form.heading}
          required
          onChange={(e) => setForm({ ...form, heading: e.target.value })}
        />
        <input
          placeholder="Strengths"
          value={form.strengths}
          required
          onChange={(e) => setForm({ ...form, strengths: e.target.value })}
        />
        <input
          placeholder="Areas to Improve"
          value={form.improvements}
          required
          onChange={(e) => setForm({ ...form, improvements: e.target.value })}
        />

        {/* Star Rating */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
          <label style={{ marginRight: '10px' }}>Rating:</label>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setForm({ ...form, rating: star })}
              style={{
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: form.rating >= star ? '#ffc107' : '#e4e5e9'
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Additional Comments"
          value={form.comments}
          onChange={(e) => setForm({ ...form, comments: e.target.value })}
        />

        <button type="submit">Submit</button>
      </form>

      <h3>Team Feedback Stats</h3>
      {team.map((t) => (
        <div key={t.employee_id}>
          <strong>{t.profiles.name}</strong><br />
          Total Feedback: {feedbackStats[t.employee_id]?.total || 0} <br />
          Acknowledged: {feedbackStats[t.employee_id]?.read || 0}
        </div>
      ))}
    </div>
  )
}
