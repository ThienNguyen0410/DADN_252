import { useState } from 'react'
import '../login.css'

type FamilyMember = {
  id: number
  name: string
  relation: string
  imageUrl: string
}

const RELATIONS = ['Son', 'Daughter', 'Wife', 'Husband', 'Father', 'Mother', 'Grandfather', 'Grandmother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Cousin', 'Friend']

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [newMember, setNewMember] = useState({ name: '', relation: RELATIONS[0], imageUrl: '' })
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Ready')

  const addFamilyMember = () => {
    if (!newMember.name.trim() || !newMember.imageUrl.trim()) {
      setError('Vui lòng điền đầy đủ thông tin thành viên')
      return
    }

    const member: FamilyMember = {
      id: Date.now(),
      name: newMember.name,
      relation: newMember.relation,
      imageUrl: newMember.imageUrl,
    }

    setFamilyMembers([...familyMembers, member])
    setNewMember({ name: '', relation: RELATIONS[0], imageUrl: '' })
    setError('')
  }

  const removeFamilyMember = (id: number) => {
    setFamilyMembers(familyMembers.filter((member) => member.id !== id))
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    if (!username.trim() || !password.trim() || !confirmPassword.trim() || !avatarUrl.trim()) {
      setError('Vui lòng điền đầy đủ thông tin cá nhân')
      setStatus('Input required')
      return
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp')
      setStatus('Validation error')
      return
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      setStatus('Validation error')
      return
    }

    setStatus('Creating account...')

    try {
      const res = await fetch('api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          avatarUrl,
          familyMembers,
        }),
      })

      const data = await res.json()
      if (data.status !== 'success') {
        throw new Error(data.message || 'Registration failed')
      }

      setStatus('Account created successfully')
      setError('')
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (err) {
      console.error('Register error:', err)
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại')
      setStatus('Registration failed')
    }
  }

  return (
    <main className="iot-login-page">
      <div className="iot-grid" aria-hidden="true" />
      <div className="iot-glow iot-glow-left" aria-hidden="true" />
      <div className="iot-glow iot-glow-right" aria-hidden="true" />

      <section className="iot-register-shell">
        <aside className="iot-panel intro-panel">
          <p className="panel-kicker">USER REGISTRATION</p>
          <h1>Create Account</h1>
          <p className="panel-copy">
            Tạo tài khoản để truy cập vào hệ thống quản lý thiết bị IoT. Đăng ký hình ảnh khuông mặt để nhận diện và
            quản lý các thành viên trong gia đình.
          </p>

          <ul className="feature-list">
            <li>
              <span className="feature-dot" />
              Face recognition registration
            </li>
            <li>
              <span className="feature-dot" />
              Family member management
            </li>
            <li>
              <span className="feature-dot" />
              Secure account protection
            </li>
          </ul>

          <div className="signal-strip" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        </aside>

        <form className="iot-panel form-panel register-form" onSubmit={handleSubmit}>
          <div className="form-head">
            <p>Create New Account</p>
            <h2>Registration</h2>
          </div>

          {/* Personal Information */}
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>

            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (min 6 chars)"
              autoComplete="new-password"
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              autoComplete="new-password"
            />

            <label htmlFor="avatarUrl">Face Image URL</label>
            <input
              id="avatarUrl"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/your-face.jpg"
              autoComplete="off"
            />
          </div>

          {/* Family Members */}
          <div className="form-section">
            <h3 className="section-title">Family Members ({familyMembers.length})</h3>

            <label htmlFor="memberName">Member Name</label>
            <input
              id="memberName"
              type="text"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              placeholder="Enter name"
            />

            <label htmlFor="memberRelation">Relation</label>
            <select
              id="memberRelation"
              value={newMember.relation}
              onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
              className="form-select"
            >
              {RELATIONS.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>

            <label htmlFor="memberImageUrl">Member Image URL</label>
            <input
              id="memberImageUrl"
              type="url"
              value={newMember.imageUrl}
              onChange={(e) => setNewMember({ ...newMember, imageUrl: e.target.value })}
              placeholder="https://example.com/member-face.jpg"
            />

            <button type="button" className="add-member-btn" onClick={addFamilyMember}>
              + Add Family Member
            </button>
          </div>

          {/* Family Members List */}
          {familyMembers.length > 0 && (
            <div className="family-list">
              <h4 className="list-title">Added Members</h4>
              <ul className="members-list">
                {familyMembers.map((member) => (
                  <li key={member.id} className="member-item">
                    <div className="member-info">
                      <span className="member-name">{member.name}</span>
                      <span className="member-relation">{member.relation}</span>
                    </div>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeFamilyMember(member.id)}
                      title="Remove member"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="status-row">
            <span className="status-led" aria-hidden="true" />
            <p>{status}</p>
          </div>

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit" className="login-btn register-btn">
            Create Account
          </button>

          <p className="login-link">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </section>
    </main>
  )
}

export default Register
