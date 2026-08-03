import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main style={{ maxWidth: 760 }}>
      <div className="landing-hero">
        <div className="brand" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
          <span className="dot" />{' '}
          Cost Tracker
        </div>
        <h1>
          Controla tus <span className="grad">gastos</span> con claridad
        </h1>
        <p className="muted" style={{ maxWidth: 480, margin: '0 auto 1.75rem' }}>
          Registra ingresos y egresos, filtra por categoría y visualiza el desglose de
          tus costes en un gráfico.
        </p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link to="/login">
            <button>Iniciar sesión</button>
          </Link>
          <Link to="/register">
            <button className="secondary">Registrarse</button>
          </Link>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <p className="muted" style={{ margin: 0 }}>
          Demo: usuario <strong>admin</strong> / <strong>admin123</strong>
        </p>
      </div>
    </main>
  )
}
