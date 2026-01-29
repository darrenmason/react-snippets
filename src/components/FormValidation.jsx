import { useState } from 'react'

export default function FormValidation() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    teamSize: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  const validate = (nextValues) => {
    const nextErrors = {}
    if (!nextValues.name.trim()) {
      nextErrors.name = 'Name is required'
    }
    if (!nextValues.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!nextValues.email.includes('@')) {
      nextErrors.email = 'Email must be valid'
    }
    if (!nextValues.teamSize) {
      nextErrors.teamSize = 'Select a team size'
    }
    return nextErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validate(values)
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      setStatus('Fix the highlighted fields')
      return
    }

    setIsSubmitting(true)
    setStatus('')
    await new Promise((resolve) => setTimeout(resolve, 900))
    setIsSubmitting(false)
    setStatus('Submitted successfully')
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="stack">
        <label>
          Name
          <input name="name" value={values.name} onChange={handleChange} />
        </label>
        {errors.name && <div className="muted">{errors.name}</div>}
      </div>
      <div className="stack">
        <label>
          Email
          <input name="email" value={values.email} onChange={handleChange} />
        </label>
        {errors.email && <div className="muted">{errors.email}</div>}
      </div>
      <div className="stack">
        <label>
          Team size
          <select
            name="teamSize"
            value={values.teamSize}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="1-5">1-5</option>
            <option value="6-20">6-20</option>
            <option value="20+">20+</option>
          </select>
        </label>
        {errors.teamSize && <div className="muted">{errors.teamSize}</div>}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {status && <div className="muted">{status}</div>}
    </form>
  )
}

