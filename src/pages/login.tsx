import { useState } from 'react'
import '../login.css'


function Login() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [error, setError] = useState('')
	const [status, setStatus] = useState('Idle')
	const [isForgotMode, setIsForgotMode] = useState(false)

	const handleSubmit = async(event: any) => {
		event.preventDefault()
		setError('')

		if (!username.trim() || !password.trim()) {
			setError('Vui long nhap day du tai khoan va mat khau.')
			setStatus('Input required')
			return
		}

		setStatus('Authenticating...');

		try {
			const res = await fetch('api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});

			const data = await res.json();
			if (data.status != "success") {
				throw new Error('Invalid credentials')
			}

			setStatus('Secure tunnel established')
			localStorage.setItem("isLogin", JSON.stringify(true))
			localStorage.setItem("username", username)
			window.location.href = '/'

		} catch (err) {
			console.error('Login error:', err)
			console.log("Username:", username, "Password:", password)
			setError('Login failed')
			setStatus('Authentication failed')
		}
	}

	const handleForgotSubmit = async (event: any) => {
		event.preventDefault()
		setError('')

		if (!username.trim() || !newPassword.trim()) {
			setError('Vui long nhap username va mat khau moi.')
			setStatus('Input required')
			return
		}

		setStatus('Updating password...')

		try {
			const res = await fetch('api/put/login', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password: newPassword })
			})

			const data = await res.json()
			if (!res.ok || data.status !== 'success') {
				throw new Error(data?.message || 'Update failed')
			}

			setStatus('Password updated. Please login')
			setPassword('')
			setNewPassword('')
			setIsForgotMode(false)
		} catch (err) {
			console.error('Forgot password error:', err)
			setError('Khong the cap nhat mat khau. Vui long thu lai.')
			setStatus('Update failed')
		}
	}

	return (
		<main className="iot-login-page">
			<div className="iot-grid" aria-hidden="true" />
			<div className="iot-glow iot-glow-left" aria-hidden="true" />
			<div className="iot-glow iot-glow-right" aria-hidden="true" />

			<section className="iot-login-shell">
				<aside className="iot-panel intro-panel">
					<p className="panel-kicker">IOT NETWORK ACCESS</p>
					<h1>Node Gateway Authentication</h1>
					<p className="panel-copy">
						Ket noi vao trung tam dieu khien thiet bi. Theo doi tin hieu cam bien va kich hoat he thong
						theo thoi gian thuc.
					</p>

					<ul className="feature-list">
						<li>
							<span className="feature-dot" />
							End-to-end encrypted session
						</li>
						<li>
							<span className="feature-dot" />
							Real-time telemetry stream
						</li>
						<li>
							<span className="feature-dot" />
							Device cluster health monitor
						</li>
					</ul>

					<div className="signal-strip" aria-hidden="true">
						<span />
						<span />
						<span />
						<span />
					</div>
				</aside>

				<form className="iot-panel form-panel" onSubmit={isForgotMode ? handleForgotSubmit : handleSubmit}>
					<div className="form-head">
						<p>{isForgotMode ? 'Account Recovery' : 'Secure Login'}</p>
						<h2>{isForgotMode ? 'Reset Password' : 'Control Center'}</h2>
					</div>

					<label htmlFor="username">Username</label>
					<input
						id="username"
						type="text"
						value={username}
						onChange={(event) => setUsername(event.target.value)}
						placeholder="operator@iot"
						autoComplete="username"
					/>

					<label htmlFor="password">{isForgotMode ? 'New Password' : 'Password'}</label>
					<input
						id="password"
						type="password"
						value={isForgotMode ? newPassword : password}
						onChange={(event) => isForgotMode ? setNewPassword(event.target.value) : setPassword(event.target.value)}
						placeholder={isForgotMode ? 'Enter new password' : 'Enter secure key'}
						autoComplete={isForgotMode ? 'new-password' : 'current-password'}
					/>

					<div className="auth-actions">
						{!isForgotMode ? (
							<button
								type="button"
								className="forgot-btn"
								onClick={() => {
									setError('')
									setStatus('Password recovery mode')
									setIsForgotMode(true)
								}}
							>
								Forgot password?
							</button>
						) : (
							<button
								type="button"
								className="forgot-btn"
								onClick={() => {
									setError('')
									setStatus('Idle')
									setNewPassword('')
									setIsForgotMode(false)
								}}
							>
								Back to login
							</button>
						)}
					</div>

					<div className="status-row">
						<span className="status-led" aria-hidden="true" />
						<p>{status}</p>
					</div>

					{error ? <p className="error-text">{error}</p> : null}

					<button type="submit" className="login-btn">
						{isForgotMode ? 'Update Password' : 'Authenticate Node'}
					</button>

					{!isForgotMode ? (
						<p className="register-link">
							Don't have an account? <a href="/register">Register here</a>
						</p>
					) : null}
				</form>
			</section>
		</main>
	)
}

export default Login
