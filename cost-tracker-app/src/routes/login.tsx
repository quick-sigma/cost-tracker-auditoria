import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { loginUser } from '../server/auth'
import { setSession } from '../lib/auth'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await loginUser({ data: { username, password } })
      if (res.error) {
        setError(res.error)
        return
      }
      setSession(res.token, res.user)
      navigate({ to: '/costs' })
    } catch {
      setError('Error inesperado al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="dot" />{' '}
          Cost Tracker
        </div>
        <div className="card">
          <h1>Iniciar sesión</h1>
          <p className="muted" style={{ marginTop: '-.25rem' }}>
            Bienvenido de nuevo.
          </p>
          {error && <div className="error">{error}</div>}
          <form onSubmit={onSubmit}>
            <label>
              Usuario{' '}
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
              />
            </label>
            <label>
              Contraseña{' '}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
        <p className="muted" style={{ textAlign: 'center' }}>
          No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
