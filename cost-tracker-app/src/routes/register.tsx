import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { registerUser } from '../server/auth'
import { setSession } from '../lib/auth'

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      const res = await registerUser({ data: { username, password } })
      if (res.error) {
        setError(res.error)
        return
      }
      setSession(res.token, res.user)
      navigate({ to: '/costs' })
    } catch {
      setError('Error inesperado al registrarse')
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
          <h1>Crear cuenta</h1>
          <p className="muted" style={{ marginTop: '-.25rem' }}>
            Empieza a controlar tus finanzas.
          </p>
          {error && <div className="error">{error}</div>}
          <form onSubmit={onSubmit}>
            <label>
              Usuario{' '}
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre de usuario"
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
            <label>
              Confirmar contraseña{' '}
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Creando…' : 'Crear cuenta'}
            </button>
          </form>
        </div>
        <p className="muted" style={{ textAlign: 'center' }}>
          Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
