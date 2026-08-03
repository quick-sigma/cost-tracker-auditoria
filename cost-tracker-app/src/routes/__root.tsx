import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Cost Tracker',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
        <style>{`
          :root {
            --bg: #0b0e14;
            --card: #141822;
            --card-2: #1b2130;
            --border: #262e3f;
            --text: #e8ecf4;
            --muted: #8b93a7;
            --accent: #6c7cff;
            --accent-2: #38e1b6;
            --green: #34d399;
            --red: #f87171;
            --amber: #f59e0b;
          }
          * { box-sizing: border-box; }
          html, body { margin: 0; }
          body {
            font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            background:
              radial-gradient(1100px 500px at 85% -10%, rgba(108,124,255,.16), transparent 60%),
              radial-gradient(800px 400px at -10% 110%, rgba(56,225,182,.10), transparent 60%),
              var(--bg);
            color: var(--text);
            min-height: 100vh;
            line-height: 1.5;
          }
          main { max-width: 960px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
          h1, h2, h3 { margin: 0 0 .5rem; letter-spacing: -.02em; }
          h1 { font-size: 1.6rem; }
          .muted { color: var(--muted); font-size: .88rem; }

          .card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 1.25rem;
            margin-bottom: 1rem;
            box-shadow: 0 8px 24px rgba(0,0,0,.25);
          }
          .card h3 { font-size: 1rem; margin-bottom: 1rem; }

          form { display: flex; flex-direction: column; gap: .8rem; }
          label { font-size: .82rem; font-weight: 600; color: var(--muted); display: flex; flex-direction: column; gap: .3rem; }
          input, select {
            width: 100%;
            padding: .65rem .8rem;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: var(--card-2);
            color: var(--text);
            font-size: .95rem;
            font-family: inherit;
          }
          input:focus, select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(108,124,255,.25); }
          input::placeholder { color: #5a6275; }

          button {
            padding: .65rem 1rem;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            font-size: .92rem;
            font-family: inherit;
            background: linear-gradient(135deg, var(--accent), #8b5cf6);
            color: #fff;
            transition: opacity .15s, transform .05s;
          }
          button:hover { opacity: .9; }
          button:active { transform: translateY(1px); }
          button:disabled { opacity: .5; cursor: not-allowed; }
          button.secondary { background: var(--card-2); color: var(--text); border: 1px solid var(--border); }
          button.danger { background: rgba(232,72,77,.18); color: var(--red); border: 1px solid rgba(248,113,113,.35); }
          button.small { padding: .35rem .7rem; font-size: .8rem; border-radius: 8px; }

          .row { display: flex; justify-content: space-between; align-items: center; gap: .5rem; }
          .error {
            background: rgba(248,113,113,.12);
            color: var(--red);
            padding: .65rem .9rem;
            border-radius: 10px;
            font-size: .88rem;
            margin-bottom: 1rem;
            border: 1px solid rgba(248,113,113,.3);
          }

          .tag {
            background: rgba(108,124,255,.16);
            color: #a5b4fc;
            border-radius: 6px;
            padding: .1rem .5rem;
            font-size: .72rem;
            font-weight: 600;
            white-space: nowrap;
          }
          .tag.ingreso { background: rgba(52,211,153,.16); color: var(--green); }
          .tag.egreso { background: rgba(248,113,113,.16); color: var(--red); }
          a { color: var(--accent); text-decoration: none; }
          a:hover { text-decoration: underline; }

          /* Auth */
          .auth-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
          .auth-card { width: 100%; max-width: 400px; }
          .auth-logo { display: flex; align-items: center; gap: .6rem; font-weight: 800; font-size: 1.15rem; margin-bottom: 1.25rem; }
          .auth-logo .dot { width: 26px; height: 26px; border-radius: 8px; background: linear-gradient(135deg, var(--accent), var(--accent-2)); }

          /* Stats */
          .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.25rem; }
          .stat .val { font-size: 1.35rem; font-weight: 700; letter-spacing: -.02em; }
          .stat .val.pos { color: var(--green); }
          .stat .val.neg { color: var(--red); }
          .stat .lbl { color: var(--muted); font-size: .8rem; }

          /* Dashboard */
          .dashboard { display: grid; grid-template-columns: 1.55fr 1fr; gap: 1.25rem; align-items: start; }
          .toggle { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; }
          .toggle button { background: var(--card-2); border: 1px solid var(--border); color: var(--muted); }
          .toggle button.active-ingreso { background: rgba(52,211,153,.16); color: var(--green); border-color: rgba(52,211,153,.4); }
          .toggle button.active-egreso { background: rgba(248,113,113,.16); color: var(--red); border-color: rgba(248,113,113,.4); }

          .expense { display: flex; justify-content: space-between; align-items: center; gap: .75rem; padding: .7rem 0; border-bottom: 1px solid var(--border); }
          .expense:last-child { border-bottom: none; }
          .expense .amount.pos { color: var(--green); font-weight: 700; }
          .expense .amount.neg { color: var(--red); font-weight: 700; }

          .donut-wrap { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
          .donut-wrap svg { width: 100%; max-width: 210px; }
          .legend { width: 100%; display: flex; flex-direction: column; gap: .45rem; }
          .legend .item { display: flex; align-items: center; gap: .5rem; font-size: .85rem; }
          .legend .swatch { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
          .legend .item .lbl { flex: 1; color: var(--muted); }
          .legend .item .pct { color: var(--muted); font-size: .78rem; }
          .legend .item .amt { font-weight: 600; }

          .chip { display: inline-flex; align-items: center; gap: .35rem; background: var(--card-2); border: 1px solid var(--border); border-radius: 999px; padding: .3rem .7rem; font-size: .78rem; color: var(--muted); }
          .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
          .brand { display: flex; align-items: center; gap: .6rem; font-weight: 800; font-size: 1.1rem; }
          .brand .dot { width: 24px; height: 24px; border-radius: 7px; background: linear-gradient(135deg, var(--accent), var(--accent-2)); }

          .landing-hero { text-align: center; padding: 3rem 1rem; }
          .landing-hero h1 { font-size: 2.4rem; }
          .landing-hero .grad { background: linear-gradient(90deg, var(--accent), var(--accent-2)); -webkit-background-clip: text; background-clip: text; color: transparent; }

          @media (max-width: 760px) {
            .stats { grid-template-columns: 1fr; }
            .dashboard { grid-template-columns: 1fr; }
          }
        `}</style>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
