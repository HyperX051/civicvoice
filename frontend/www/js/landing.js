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
        <a href="#/" class="brand">
          ${icons.globe} CivicVoice
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
          <div class="app-preview-content">
            <div class="mock-sidebar">
              <div class="mock-nav-item active"></div>
              <div class="mock-nav-item"></div>
              <div class="mock-nav-item"></div>
            </div>
            <div class="mock-main">
              <div class="mock-card mock-hero-card"></div>
              <div class="mock-grid">
                <div class="mock-card"></div>
                <div class="mock-card"></div>
              </div>
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
      
      // Start rotating when user scrolls down
      // Initial state is rotateX(25deg) scale(0.9)
      const maxRotate = 25;
      const progress = Math.min(scrollY / (windowHeight * 0.8), 1);
      
      const currentRotate = maxRotate - (maxRotate * progress);
      const currentScale = 0.9 + (0.1 * progress);
      
      preview.style.transform = `rotateX(${currentRotate}deg) scale(${currentScale})`;
      
      // Enhance box shadow as it flattens out
      const shadowAlpha = 0.1 + (0.1 * progress);
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
