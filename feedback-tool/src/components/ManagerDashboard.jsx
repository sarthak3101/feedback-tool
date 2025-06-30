import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function ManagerDashboard() {
  const [team, setTeam] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [form, setForm] = useState({ strengths: '', improvements: '', notes: '' })

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('employee_id, profiles:employee_id (id, name)')
      if (!error) {
        setTeam(data)
      }
    }
    fetchTeam()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const managerId = (await supabase.auth.getUser()).data.user.id

    const { error } = await supabase.from('feedbacks').insert({
      manager_id: managerId,
      employee_id: selectedEmployee,
      ...form,
    })

    if (error) alert(error.message)
    else alert('Feedback submitted!')
  }

  return (
    <div>
      <h2>Submit Feedback</h2>
      <select onChange={(e) => setSelectedEmployee(e.target.value)}>
        <option>Select Employee</option>
        {team.map((t) => (
          <option key={t.employee_id} value={t.employee_id}>
            {t.profiles.name}
          </option>
        ))}
      </select>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Strengths"
          onChange={(e) => setForm({ ...form, strengths: e.target.value })}
        />
        <input
          placeholder="Areas to Improve"
          onChange={(e) => setForm({ ...form, improvements: e.target.value })}
        />
        <textarea
          placeholder="Additional Notes"
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
