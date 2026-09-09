import { Link } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="nav">
        <div className="wrap">
          <Link to="/" className="wordmark">TalkNest</Link>
          <div className="nav-links">
            <Link to="/login" className="link-ghost">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Join</Link>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap">
          <div className="hero-copy rise-1">
            <span className="eyebrow">A social network you open on purpose</span>
            <h1>Nest with the people you actually choose.</h1>
            <p className="sub">
              Every follow on TalkNest is a request, accepted by a real person — not a counter
              that goes up. Post, comment, and message inside a circle you built on purpose, not
              one an algorithm assembled for you.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary">Join TalkNest</Link>
              <Link to="/login" className="btn btn-ghost-line">Sign in</Link>
            </div>
            <p className="hero-note">No public follower counts. No stranger's feed in your feed.</p>
          </div>

          <div className="nest-stage rise-2" aria-hidden="true">
            <svg viewBox="0 0 480 440" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" stroke="var(--accent)" strokeWidth="1.2">
                <ellipse cx="240" cy="220" rx="210" ry="170" transform="rotate(-8 240 220)" opacity="0.16"></ellipse>
                <ellipse cx="235" cy="215" rx="175" ry="140" transform="rotate(6 235 215)" opacity="0.22"></ellipse>
                <ellipse cx="245" cy="228" rx="140" ry="112" transform="rotate(-14 245 228)" opacity="0.3"></ellipse>
                <ellipse cx="232" cy="210" rx="108" ry="86" transform="rotate(11 232 210)" opacity="0.4"></ellipse>
                <ellipse cx="240" cy="220" rx="78" ry="60" transform="rotate(-5 240 220)" opacity="0.55" strokeWidth="1.6"></ellipse>
              </g>
            </svg>

            <div className="mock-card mock-post">
              <div className="mock-head">
                <div className="avatar">W</div>
                <div>
                  <div className="mock-name">wrenfield</div>
                  <div className="mock-meta">@wrenfield · 2h</div>
                </div>
              </div>
              <p className="mock-body">Finally caught the sunset from the roof. Golden hour hit different today.</p>
              <div className="mock-actions">
                <span className="mock-action">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 20s-7-4.35-9.5-8.8C.7 7.9 2.4 4 6 4c2 0 3.4 1.1 4 2.3C10.6 5.1 12 4 14 4c3.6 0 5.3 3.9 3.5 7.2C19 15.65 12 20 12 20z" />
                  </svg>
                  12
                </span>
                <span className="mock-action">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 5h16v11H8l-4 4V5z" />
                  </svg>
                  4
                </span>
              </div>
            </div>

            <div className="mock-card mock-follow">
              <p className="mock-follow-text"><b>@nova</b> wants to follow you.</p>
              <div className="mock-btn-row">
                <span className="btn btn-primary btn-sm">Accept</span>
                <span className="btn btn-ghost-line btn-sm">Decline</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="ways">
        <div className="wrap">
          <div className="section-head rise-3">
            <span className="eyebrow">Once you're in</span>
            <h2>Three ways a nest fills up.</h2>
          </div>

          <div className="ways-grid">
            <div className="way">
              <div className="way-mock">
                <div className="mock-head">
                  <div className="avatar">L</div>
                  <div>
                    <div className="mock-name">lior</div>
                    <div className="mock-meta">@lior · 40m</div>
                  </div>
                </div>
                <p className="mock-body" style={{ marginBottom: 0 }}>
                  Repainted the studio door. Third colour this year, no regrets.
                </p>
                <div className="heat-row">
                  <div className="heat-fill"><i></i></div>
                  <span className="heat-count">18 likes</span>
                </div>
              </div>
              <p className="way-caption">
                Share what's actually happening.
                <span>Posts, photos, and comment threads with people who already said yes to seeing them.</span>
              </p>
            </div>

            <div className="way">
              <div className="way-mock">
                <p className="mock-follow-text"><b>@juniper</b> wants to follow you.</p>
                <div className="mock-btn-row">
                  <span className="btn btn-primary btn-sm">Accept</span>
                  <span className="btn btn-ghost-line btn-sm">Decline</span>
                </div>
                <p className="mock-meta" style={{ marginTop: 14 }}>3 requests waiting</p>
              </div>
              <p className="way-caption">
                Only who you choose gets in.
                <span>Following is a request, not a click — your feed stays a room you invited people into.</span>
              </p>
            </div>

            <div className="way">
              <div className="way-mock">
                <div className="online-row">
                  <span className="online-dot"></span>
                  <span className="online-label">Priya · online</span>
                </div>
                <div className="chat-line"><div className="bubble them">Still on for Sunday?</div></div>
                <div className="chat-line me"><div className="bubble me">Wouldn't miss it. Bringing the good coffee.</div></div>
              </div>
              <p className="way-caption">
                Talk in real time.
                <span>Messages land the moment they're sent — no refresh, no waiting on a notification.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-ring" aria-hidden="true"></div>
        <div className="wrap">
          <span className="eyebrow">Your nest, your terms</span>
          <h2>Start building the corner that's actually yours.</h2>
          <p className="sub">It takes about a minute to set up — and every person in it is there because you let them in.</p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary">Join TalkNest</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-left">
            <Link to="/" className="wordmark">TalkNest</Link>
            <span className="foot-tagline">A social network you open on purpose.</span>
          </div>
          <div className="foot-links">
            <Link to="/login" className="link-ghost">Log in</Link>
            <Link to="/register" className="link-ghost">Join</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
