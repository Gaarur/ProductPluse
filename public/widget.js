(function() {
  const script = document.currentScript;
  const companyId = script.getAttribute('data-company');
  const appUrl = script.src.split('/widget.js')[0];

  if (!companyId) {
    console.error('ProductPulse: data-company attribute is required on the script tag.');
    return;
  }

  // Create Styles
  const style = document.createElement('style');
  style.innerHTML = `
    #productpulse-widget-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #a855f7, #6366f1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      transition: transform 0.2s ease;
    }
    #productpulse-widget-btn:hover {
      transform: scale(1.05);
    }
    #productpulse-widget-container {
      position: fixed;
      bottom: 90px;
      right: 24px;
      width: 360px;
      height: 500px;
      background: #0a0a0a;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      box-shadow: 0 12px 24px rgba(0,0,0,0.3);
      z-index: 999998;
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: pp-fade-in 0.3s ease;
    }
    @keyframes pp-fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    #productpulse-header {
      padding: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      font-weight: bold;
      color: white;
      background: rgba(255,255,255,0.03);
    }
    #productpulse-feed {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }
    .pp-item {
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .pp-item:last-child { border: none; }
    .pp-title { font-weight: 600; color: white; font-size: 14px; margin-bottom: 4px; }
    .pp-content { color: #888; font-size: 13px; line-height: 1.4; }
    .pp-date { color: #555; font-size: 11px; margin-top: 4px; }
    #productpulse-footer {
      padding: 8px;
      text-align: center;
      font-size: 10px;
      color: #444;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    #productpulse-footer a { color: inherit; text-decoration: none; }
  `;
  document.head.appendChild(style);

  // Create Button
  const btn = document.createElement('div');
  btn.id = 'productpulse-widget-btn';
  btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>';
  document.body.appendChild(btn);

  // Create Container
  const container = document.createElement('div');
  container.id = 'productpulse-widget-container';
  container.innerHTML = `
    <div id="productpulse-header">What's New</div>
    <div id="productpulse-feed">Loading...</div>
    <div id="productpulse-footer">Powered by <a href="${appUrl}" target="_blank">ProductPulse AI</a></div>
  `;
  document.body.appendChild(container);

  let isOpen = false;
  let loaded = false;

  btn.onclick = () => {
    isOpen = !isOpen;
    container.style.display = isOpen ? 'flex' : 'none';
    if (isOpen && !loaded) {
      fetchEntries();
    }
  };

  async function fetchEntries() {
    try {
      const res = await fetch(\`\${appUrl}/api/changelog?companyId=\${companyId}&published=true\`);
      const data = await res.json();
      const feed = document.getElementById('productpulse-feed');
      
      if (data.changelogs && data.changelogs.length > 0) {
        feed.innerHTML = data.changelogs.slice(0, 5).map(item => `
          <div class="pp-item">
            <div class="pp-title">\${item.title}</div>
            <div class="pp-content">\${item.content.substring(0, 100)}\${item.content.length > 100 ? '...' : ''}</div>
            <div class="pp-date">\${new Date(item.createdAt).toLocaleDateString()}</div>
          </div>
        `).join('');
        loaded = true;
      } else {
        feed.innerHTML = '<div style="color: #666; text-align: center; margin-top: 40px;">No updates yet.</div>';
      }
    } catch (err) {
      document.getElementById('productpulse-feed').innerHTML = 'Failed to load updates.';
    }
  }
})();
