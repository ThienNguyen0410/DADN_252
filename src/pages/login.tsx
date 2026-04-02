import { useState } from 'react'
import type { FormEvent } from 'react'
import '../login.css'


function Login() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [status, setStatus] = useState('Idle')

	const handleSubmit = async(event: any) => {
		event.preventDefault()

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
			window.location.href = '/'

		} catch (err) {
			console.error('Login error:', err)
			console.log("Username:", username, "Password:", password)
			setError('Login failed')
			setStatus('Authentication failed')
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

				<form className="iot-panel form-panel" onSubmit={handleSubmit}>
					<div className="form-head">
						<p>Secure Login</p>
						<h2>Control Center</h2>
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

					<label htmlFor="password">Password</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						placeholder="Enter secure key"
						autoComplete="current-password"
					/>

					<div className="status-row">
						<span className="status-led" aria-hidden="true" />
						<p>{status}</p>
					</div>

					{error ? <p className="error-text">{error}</p> : null}

					<button type="submit" className="login-btn">
						Authenticate Node
					</button>
				</form>
			</section>
		</main>
	)
}

export default Login
