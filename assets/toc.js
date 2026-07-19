/* AXIS 학습 세션 — 슬라이드 사이드 목차
 * .wrap 안의 h2가 2개 이상인 모듈 페이지에서만 동작. 스타일은 <style> 주입으로 자체 포함.
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var wrap = document.querySelector('.wrap');
    if (!wrap) return;
    var h2s = Array.prototype.slice.call(wrap.querySelectorAll('h2'));
    if (h2s.length < 2) h2s = Array.prototype.slice.call(wrap.querySelectorAll('h3'));
    if (h2s.length < 2) return;

    injectStyles();

    h2s.forEach(function (h2, i) {
      if (!h2.id) h2.id = 'sec-' + (i + 1);
    });

    var toggle = document.createElement('button');
    toggle.id = 'toc-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', '목차 열기');
    toggle.textContent = '☰';

    var panel = document.createElement('aside');
    panel.id = 'toc-panel';

    var label = document.createElement('div');
    label.className = 'toc-label';
    label.textContent = '이 모듈의 목차';
    panel.appendChild(label);

    var list = document.createElement('nav');
    list.className = 'toc-list';
    panel.appendChild(list);

    h2s.forEach(function (h2) {
      var a = document.createElement('a');
      a.className = 'toc-item';
      a.href = '#' + h2.id;

      var numEl = h2.querySelector('.num');
      var title = h2.textContent;
      if (numEl) {
        title = h2.textContent.slice(numEl.textContent.length);
        var numSpan = document.createElement('span');
        numSpan.className = 'num';
        numSpan.textContent = numEl.textContent;
        a.appendChild(numSpan);
      }
      a.appendChild(document.createTextNode(title.trim()));

      a.addEventListener('click', function (e) {
        e.preventDefault();
        h2.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closePanel();
      });

      list.appendChild(a);
    });

    var pager = wrap.querySelector('.pager');
    if (pager) {
      if (!pager.id) pager.id = 'pager-nav';
      var pa = document.createElement('a');
      pa.className = 'toc-item toc-pager';
      pa.href = '#' + pager.id;
      pa.textContent = '↓ 이전/다음 모듈';
      pa.addEventListener('click', function (e) {
        e.preventDefault();
        pager.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closePanel();
      });
      list.appendChild(pa);
    }

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    function openPanel() {
      panel.classList.add('open');
      toggle.textContent = '✕';
      toggle.setAttribute('aria-label', '목차 닫기');
    }
    function closePanel() {
      panel.classList.remove('open');
      toggle.textContent = '☰';
      toggle.setAttribute('aria-label', '목차 열기');
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (panel.classList.contains('open')) closePanel(); else openPanel();
    });

    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('open')) return;
      if (panel.contains(e.target)) return;
      closePanel();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });

    var activeId = null;
    function setActive(id) {
      if (id === activeId) return;
      activeId = id;
      list.querySelectorAll('a.toc-item').forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-10% 0px -80% 0px', threshold: 0 });
    h2s.forEach(function (h2) { observer.observe(h2); });
  });

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = [
      '#toc-toggle {',
      '  position: fixed; right: 1.5rem; bottom: 1.5rem; z-index: 50;',
      '  width: 52px; height: 52px; border-radius: 50%;',
      '  display: flex; align-items: center; justify-content: center;',
      '  background: rgba(255,255,255,0.95); border: 1.5px solid rgba(235,58,62,0.45);',
      '  box-shadow: 0 4px 14px rgba(42,50,61,0.15);',
      '  color: var(--text); font-size: 1.3rem; cursor: pointer;',
      '  transition: border-color 0.2s ease;',
      '}',
      '#toc-toggle:hover { border-color: var(--accent); }',
      '#toc-panel {',
      '  position: fixed; top: 0; right: 0; height: 100vh; width: 280px;',
      '  background: rgba(255,255,255,0.98); backdrop-filter: blur(10px);',
      '  box-shadow: -6px 0 24px rgba(42,50,61,0.10);',
      '  border-left: 1px solid var(--card-border);',
      '  padding: 4rem 1.2rem 2rem; overflow-y: auto; z-index: 49;',
      '  transform: translateX(100%); transition: transform 0.3s ease;',
      '}',
      '#toc-panel.open { transform: translateX(0); }',
      '.toc-label {',
      '  font-size: 0.78rem; color: var(--text-dim); letter-spacing: 0.08em;',
      '  margin-bottom: 0.8rem; text-transform: uppercase;',
      '}',
      '.toc-list { display: flex; flex-direction: column; }',
      '.toc-item {',
      '  padding: 0.55rem 0.8rem; border-radius: 8px;',
      '  color: var(--text); text-decoration: none; font-size: 0.92rem;',
      '  transition: background 0.2s ease;',
      '}',
      '.toc-item:hover { background: var(--bg-soft); }',
      '.toc-item .num { color: var(--accent); margin-right: 0.4rem; }',
      '.toc-item.active { background: rgba(235,58,62,0.08); color: var(--heading); font-weight: 700; }',
      '.toc-pager { margin-top: 0.8rem; border-top: 1px solid var(--card-border); padding-top: 0.9rem; color: var(--text-dim); }',
      '@media (max-width: 768px) {',
      '  #toc-panel { width: min(280px, 85vw); }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }
})();
