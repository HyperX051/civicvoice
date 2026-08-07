import { icons } from './icons.js';
import { auth } from './auth.js';

export function renderLandingPage(container, router) {
  // Update document title
  document.title = 'CivicVoice — Modern Civic Engagement';

  const isAuthenticated = auth.isAuthenticated();
  const dashboardPath = auth.hasRole('ADMIN', 'AUTHORITY') ? '/dashboard' : '/issues';

  // Build the HTML structure
  container.innerHTML = `
    <div class="landing-page">
      <nav class="landing-nav">
        <a href="#/" class="brand" style="display: flex; align-items: center; gap: 8px;">
          <img src="img/logo.png" style="width: 24px; height: 24px; border-radius: 6px;" alt="Logo" />
          CivicVoice
        </a>
        <div class="landing-nav-actions">
          ${isAuthenticated 
            ? `<a href="#${dashboardPath}" class="btn-nav btn-nav-primary">Go to Dashboard</a>`
            : `<a href="#/login" class="btn-nav btn-nav-login">Sign In</a>
               <a href="#/login" class="btn-nav btn-nav-primary">Report an Issue</a>`
          }
        </div>
      </nav>

      <section class="hero-section">
        <div class="hero-aura"></div>
        <div class="hero-content">
          <div class="hero-pill">
            ${icons.sparkles} The future of civic engagement
          </div>
          <h1 class="hero-title">
            Empower your city. <br/>
            <span>Report, track, resolve.</span>
          </h1>
          <p class="hero-subtitle">
            CivicVoice bridges the gap between citizens and authorities. Report local issues, track their progress in real-time, and build a better community together.
          </p>
          <div class="hero-actions">
            ${isAuthenticated
              ? `<a href="#${dashboardPath}" class="hero-btn primary">Open Dashboard</a>`
              : `<a href="#/register" class="hero-btn primary">Get Started Free</a>
                 <a href="#/login" class="hero-btn secondary">Sign In</a>`
            }
          </div>
        </div>
      </section>

      <section class="preview-section">
        <div class="app-preview-container" id="app-preview">
          <div class="app-preview-header">
            <div class="app-preview-dot red"></div>
            <div class="app-preview-dot yellow"></div>
            <div class="app-preview-dot green"></div>
          </div>
          <div class="app-preview-content" style="padding: 0; display: block; background: var(--bg-primary);">
            <div class="app-layout" style="position: relative; min-height: 600px; padding-top: 0; padding-left: 240px; transform-origin: top left; pointer-events: none;">
              <!-- Fake Sidebar -->
              <aside class="sidebar" style="position: absolute; top: 0; left: 0; height: 100%; border-right: 1px solid var(--border-subtle);">
                <div class="sidebar-header" style="padding: 24px; display: flex; align-items: center; gap: 12px;">
                  <div class="sidebar-logo" style="width:32px; height:32px; border-radius:8px;"><img src="img/logo.png" style="width: 100%; height: 100%; border-radius: 8px;" alt="Logo" /></div>
                  <span class="sidebar-brand">CivicVoice</span>
                </div>
                <nav class="sidebar-nav" style="padding: 0 16px;">
                  <div class="nav-item active" style="margin-bottom:8px;"><span style="margin-left:8px;">Dashboard</span></div>
                  <div class="nav-item" style="margin-bottom:8px;"><span style="margin-left:8px;">Manage Issues</span></div>
                  <div class="nav-item" style="margin-bottom:8px;"><span style="margin-left:8px;">Polls</span></div>
                </nav>
              </aside>
              <!-- Fake Main Content -->
              <main class="main-content" style="padding: 32px; min-height: 100%; width: 100%;">
                <header class="page-header" style="margin-bottom: 24px;">
                  <div>
                    <h1 class="page-title">Authority Dashboard</h1>
                    <p class="page-subtitle">Real-time overview of civic issues</p>
                  </div>
                </header>
                <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
                  <div class="stat-card" style="padding: 24px;">
                    <div class="stat-card-label" style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Total Issues</div>
                    <div class="stat-card-value" style="font-size: 28px; font-weight: 700;">1,248</div>
                  </div>
                  <div class="stat-card" style="padding: 24px;">
                    <div class="stat-card-label" style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Resolved</div>
                    <div class="stat-card-value" style="font-size: 28px; font-weight: 700;">892</div>
                  </div>
                  <div class="stat-card" style="padding: 24px;">
                    <div class="stat-card-label" style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">In Progress</div>
                    <div class="stat-card-value" style="font-size: 28px; font-weight: 700;">315</div>
                  </div>
                  <div class="stat-card" style="padding: 24px;">
                    <div class="stat-card-label" style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Open</div>
                    <div class="stat-card-value" style="font-size: 28px; font-weight: 700;">41</div>
                  </div>
                </div>
                <!-- Fake Chart Area -->
                <div class="panel" style="background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-subtle); padding: 24px; height: 280px; display: flex; flex-direction: column;">
                  <h2 class="panel-title" style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Resolution Trends</h2>
                  <div style="flex: 1; display: flex; align-items: flex-end; gap: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px;">
                    <div style="flex: 1; height: 40%; background: var(--bg-secondary); border-radius: 4px 4px 0 0; position: relative;">
                      <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 30%; background: var(--accent-brand); border-radius: 4px 4px 0 0;"></div>
                    </div>
                    <div style="flex: 1; height: 60%; background: var(--bg-secondary); border-radius: 4px 4px 0 0; position: relative;">
                      <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 50%; background: var(--accent-brand); border-radius: 4px 4px 0 0;"></div>
                    </div>
                    <div style="flex: 1; height: 80%; background: var(--bg-secondary); border-radius: 4px 4px 0 0; position: relative;">
                      <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 65%; background: var(--accent-brand); border-radius: 4px 4px 0 0;"></div>
                    </div>
                    <div style="flex: 1; height: 100%; background: var(--bg-secondary); border-radius: 4px 4px 0 0; position: relative;">
                      <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 85%; background: var(--accent-brand); border-radius: 4px 4px 0 0;"></div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </section>

      <section class="features-section">
        <div class="section-header">
          <h2>Everything you need.</h2>
          <p class="hero-subtitle" style="margin-bottom:0;">A complete toolkit for modern civic management.</p>
        </div>
        <div class="bento-grid">
          <div class="bento-card">
            <div class="bento-icon">${icons.map}</div>
            <h3>Interactive Mapping</h3>
            <p>Pinpoint issues precisely on the map. See what's happening in your neighborhood at a glance.</p>
          </div>
          <div class="bento-card">
            <div class="bento-icon">${icons.bell}</div>
            <h3>Real-time Updates</h3>
            <p>Get notified instantly when authorities review, assign, or resolve your reported issues.</p>
          </div>
          <div class="bento-card">
            <div class="bento-icon">${icons.chart}</div>
            <h3>Live Analytics</h3>
            <p>Authorities can track resolution rates, common issues, and community trends in real-time.</p>
          </div>
          <div class="bento-card wide">
            <div class="bento-icon">${icons.users}</div>
            <h3>Community Polling</h3>
            <p>Engage with local initiatives. Authorities can publish polls to gather citizen feedback on new projects, park renovations, or budget allocations.</p>
          </div>
          <div class="bento-card">
            <div class="bento-icon">${icons.shield}</div>
            <h3>Audit Trails</h3>
            <p>Complete transparency. Every action taken by authorities is logged and auditable.</p>
          </div>
        </div>
      </section>
    </div>
  `;

  // Attach 3D scroll effect
  const preview = document.getElementById('app-preview');
  if (preview) {
    const handleScroll = () => {
      // Calculate scroll progress
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate distance from vertical center of viewport
      const rect = preview.getBoundingClientRect();
      const elementCenter = rect.top + (rect.height / 2);
      const windowCenter = windowHeight / 2;
      
      // Distance from center (-1 to 1)
      // 0 means perfectly centered.
      // 1 means element is below center.
      // -1 means element is above center.
      // We clamp it between -1 and 1.
      let distanceFromCenter = (elementCenter - windowCenter) / (windowHeight / 2);
      distanceFromCenter = Math.max(-1, Math.min(1, distanceFromCenter));
      
      // We want absolute distance for the rotation (it tilts back symmetrically)
      const absDistance = Math.abs(distanceFromCenter);
      
      // Max rotation is 25deg. When centered, it's 0.
      const currentRotate = 25 * absDistance;
      // Scale is 1 when centered, 0.9 when far away.
      const currentScale = 1.0 - (0.1 * absDistance);
      
      preview.style.transform = `rotateX(${currentRotate}deg) scale(${currentScale})`;
      
      // Shadow is strongest when centered (flat)
      const shadowAlpha = 0.2 - (0.1 * absDistance);
      preview.style.boxShadow = `0 20px 60px rgba(0,0,0,${shadowAlpha}), 0 0 0 1px var(--border-subtle)`;
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial call
    handleScroll();

    // Clean up listener when navigating away
    const cleanup = () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', cleanup);
    };
    window.addEventListener('hashchange', cleanup);
  }
}
