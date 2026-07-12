/* ============================================================
   TURN CITY — shared app logic
   data.js 의 window.TURN_DATA 를 읽어 렌더링
   ============================================================ */
(function () {
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- 데이터 접근 ---------------- */
  const DB = () => window.TURN_DATA || { news: [], guides: { groups: [] } };
  const T = window.TURN = {};

  T.news = () => (DB().news || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  T.newsById = (id) => (DB().news || []).find((n) => n.id === id);

  // 가이드 leaf 페이지 평탄화 (이전/다음 계산용)
  T.guideFlat = () => {
    const out = [];
    (((DB().guides) || {}).groups || []).forEach((g) =>
      (g.items || []).forEach((it) => {
        if (it.items) it.items.forEach((c) => out.push({ ...c, group: g.title, parent: it.title }));
        else out.push({ ...it, group: g.title, parent: null });
      })
    );
    return out;
  };
  T.guideById = (id) => T.guideFlat().find((p) => p.id === id);

  /* ---------------- 유틸 ---------------- */
  const esc = (s = '') =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // 인라인 마크다운: **굵게** *기울임* `코드` ~~취소~~ [링크](url)
  T.inline = function (text) {
    let s = esc(text);
    const codes = [];
    s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a class="inline" href="${u}" target="_blank" rel="noopener">${t}</a>`);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
    s = s.replace(/~~([^~]+)~~/g, '<s>$1</s>');
    s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code class="ic">${codes[+i]}</code>`);
    return s;
  };
  const slug = (s) => String(s).toLowerCase().replace(/[^\w가-힣]+/g, '-').replace(/^-+|-+$/g, '');

  /* ---------------- 블록 렌더러 (GitBook 급) ---------------- */
  const HI = {
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l9 16H3z"/><path d="M12 9v5M12 17h.01"/></svg>',
    danger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16h.01"/></svg>',
  };
  const COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';

  function renderBlock(b) {
    switch (b.type) {
      case 'heading': {
        const lv = b.level === 3 ? 3 : 2;
        const id = b.id || slug(b.text);
        return `<h${lv} id="${id}" data-toc="${lv}" data-title="${esc(b.text)}">${esc(b.text)}<a class="anchor" href="#${id}">#</a></h${lv}>`;
      }
      case 'paragraph':
        return `<p>${T.inline(b.text)}</p>`;
      case 'hint': {
        const st = ['info', 'success', 'warning', 'danger'].includes(b.style) ? b.style : 'info';
        return `<div class="hint ${st}"><span class="hi">${HI[st]}</span><div>${T.inline(b.text)}</div></div>`;
      }
      case 'code':
        return `<div class="codeblock"><div class="cb-head"><span class="cb-title">${esc(b.title || b.lang || 'code')}</span>
          <button class="cb-copy" data-copy>${COPY}복사</button></div>
          <pre><code>${esc(b.code)}</code></pre></div>`;
      case 'table': {
        const head = (b.headers || []).map((h) => `<th>${T.inline(h)}</th>`).join('');
        const rows = (b.rows || []).map((r) => `<tr>${r.map((c) => `<td>${T.inline(c)}</td>`).join('')}</tr>`).join('');
        return `<div class="tbl-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
      }
      case 'tabs': {
        const heads = (b.tabs || []).map((t, i) => `<button data-tab="${i}" class="${i === 0 ? 'on' : ''}">${esc(t.label)}</button>`).join('');
        const panes = (b.tabs || []).map((t, i) => `<div class="tab-pane ${i === 0 ? 'on' : ''}" data-pane="${i}">${T.inline(t.content).replace(/\n/g, '<br>')}</div>`).join('');
        return `<div class="tabs"><div class="tab-heads">${heads}</div><div class="tab-body">${panes}</div></div>`;
      }
      case 'expandable':
        return `<details class="exp"><summary><svg class="ex-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6"/></svg>${esc(b.title)}</summary><div class="ex-body">${T.inline(b.content).replace(/\n/g, '<br>')}</div></details>`;
      case 'cards': {
        const cards = (b.cards || []).map((c) => `<a class="link-card" href="${c.href || '#'}">${c.icon ? `<div class="lc-ic">${esc(c.icon)}</div>` : ''}<div class="lc-t">${esc(c.title)}</div>${c.desc ? `<div class="lc-d">${esc(c.desc)}</div>` : ''}</a>`).join('');
        return `<div class="card-grid">${cards}</div>`;
      }
      case 'quote':
        return `<blockquote>${T.inline(b.text)}</blockquote>`;
      case 'image':
        return `<figure class="img"><img src="${b.src}" alt="${esc(b.caption || '')}" loading="lazy">${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`;
      case 'list': {
        if (b.style === 'task') {
          return `<ul class="tasks">${(b.items || []).map((i) => `<li class="${i.done ? 'done' : ''}">${T.inline(i.text || i)}</li>`).join('')}</ul>`;
        }
        const tag = b.style === 'ordered' ? 'ol' : 'ul';
        return `<${tag}>${(b.items || []).map((i) => `<li>${T.inline(typeof i === 'string' ? i : i.text)}</li>`).join('')}</${tag}>`;
      }
      case 'embed': {
        let src = b.url || '';
        const yt = src.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
        if (yt) src = `https://www.youtube.com/embed/${yt[1]}`;
        return `<div class="embed"><iframe src="${src}" allowfullscreen loading="lazy"></iframe></div>`;
      }
      case 'steps':
        return `<ol class="steps">${(b.items || []).map((s) => `<li><div class="st-t">${esc(s.title)}</div>${s.desc ? `<div class="st-d">${T.inline(s.desc)}</div>` : ''}</li>`).join('')}</ol>`;
      case 'tier': {
        const benefits = (b.benefits || []).map((x) => `<li>${T.inline(x)}</li>`).join('');
        return `<div class="tier"><div class="tier-head"><div class="tier-name" style="color:${b.color || '#3d8bff'}">${esc(b.name)}</div><div class="tier-sub">${esc(b.sub || '')}</div></div><ul>${benefits}</ul></div>`;
      }
      case 'divider':
        return `<hr>`;
      default:
        return '';
    }
  }
  T.renderBlocks = (blocks) => `<div class="blocks">${(blocks || []).map(renderBlock).join('')}</div>`;

  /* ---------------- 블록 상호작용 (탭/복사) ---------------- */
  T.bindBlocks = function (root) {
    root = root || document;
    root.querySelectorAll('.tabs').forEach((tabs) => {
      tabs.querySelectorAll('[data-tab]').forEach((btn) =>
        btn.addEventListener('click', () => {
          const i = btn.dataset.tab;
          tabs.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b === btn));
          tabs.querySelectorAll('[data-pane]').forEach((p) => p.classList.toggle('on', p.dataset.pane === i));
        })
      );
    });
    root.querySelectorAll('[data-copy]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const code = btn.closest('.codeblock').querySelector('code').textContent;
        navigator.clipboard?.writeText(code);
        const o = btn.innerHTML; btn.textContent = '복사됨';
        setTimeout(() => (btn.innerHTML = o), 1200);
      })
    );
  };

  /* ---------------- 목차(TOC) 생성 + 스크롤 스파이 ---------------- */
  T.buildTOC = function (contentEl, tocEl) {
    if (!tocEl) return;
    const hs = contentEl.querySelectorAll('h2[data-toc],h3[data-toc]');
    if (!hs.length) { tocEl.style.display = 'none'; return; }
    tocEl.innerHTML = `<div class="t">이 페이지</div>` +
      [...hs].map((h) => `<a href="#${h.id}" class="${h.dataset.toc === '3' ? 'lvl3' : ''}">${h.dataset.title}</a>`).join('');
    const links = tocEl.querySelectorAll('a');
    const spy = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-90px 0px -70% 0px' });
    hs.forEach((h) => spy.observe(h));
  };

  /* ---------------- 헤더 ---------------- */
  function initHeader() {
    const hdr = document.querySelector('header');
    if (!hdr) return;
    if (hdr.classList.contains('solid')) return; // 내부 페이지: 항상 solid
    const on = () => hdr.classList.toggle('scrolled', window.scrollY > 24);
    on(); window.addEventListener('scroll', on, { passive: true });
  }

  /* ---------------- 교차 리빌 ---------------- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal:not(.in)');
    if (RM) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
  }

  /* ---------------- Lenis 부드러운 스크롤 ---------------- */
  function initLenis() {
    if (RM) return;
    const start = () => {
      if (!window.Lenis) return;
      const lenis = new window.Lenis({ duration: 1.05, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.6 });
      window.__lenis = lenis;
      function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      // 앵커 클릭 → 부드럽게 이동
      document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href').slice(1);
        const tgt = id && document.getElementById(id);
        if (tgt) { e.preventDefault(); lenis.scrollTo(tgt, { offset: -88 }); history.replaceState(null, '', '#' + id); }
      });
    };
    if (window.Lenis) start();
    else {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
      s.onload = start; s.onerror = () => {}; // 실패해도 네이티브 스크롤로 동작
      document.head.appendChild(s);
    }
  }

  /* ---------------- 공용 푸터 주입 ---------------- */
  const FOOTER = `<div class="wrap">
    <div class="socials">
      <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5 31 31 0 0 0 .7 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.3 12 31 31 0 0 0 23 7.5ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z"/></svg></a>
      <a href="#" aria-label="Discord"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4A19 19 0 0 0 15.6 3l-.3.5a17 17 0 0 1 4.2 1.3 15.6 15.6 0 0 0-13-.2 17 17 0 0 1 4.2-1.4L10.4 3A19 19 0 0 0 3.7 4.4C1.2 8.3.5 12.1.8 15.8A19 19 0 0 0 6.6 18l.6-1.1c-.6-.2-1.3-.5-1.9-.9l.5-.3a13.5 13.5 0 0 0 11.4 0l.5.3c-.6.4-1.3.7-1.9.9L17 18a19 19 0 0 0 5.8-2.2c.4-4.3-.7-8-3.5-11.4ZM9 13.6c-.9 0-1.7-.9-1.7-1.9S8 9.8 9 9.8s1.7.9 1.7 1.9-.8 1.9-1.7 1.9Zm6 0c-.9 0-1.7-.9-1.7-1.9S14 9.8 15 9.8s1.7.9 1.7 1.9-.8 1.9-1.7 1.9Z"/></svg></a>
      <a href="#" aria-label="문서"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h11l5 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M14 4v5h5M8 13h8M8 17h5"/></svg></a>
    </div>
    <div class="foot-links"><a href="#">개인정보 처리방침</a><span class="div"></span><a href="#">서비스 이용약관</a></div>
    <div class="biz">상호 인찬컴퍼니<span class="sep">|</span>대표 홍순유<span class="sep">|</span>사업자등록번호 544-33-01773<br>주소 경기도 광주시</div>
    <div class="copy">© 2026 TURN CITY. All rights reserved.</div>
  </div>`;
  function initFooter() {
    const f = document.querySelector('footer[data-auto]');
    if (f) f.innerHTML = FOOTER;
  }

  /* ---------------- 백엔드 연동 (선택) ---------------- */
  // config.js 에서 window.TURN_API_BASE 를 설정하면 서버에서 콘텐츠를 읽어옵니다.
  T.apiBase = function () {
    return (window.TURN_API_BASE || (window.localStorage && localStorage.getItem('turncity_api_base')) || '').replace(/\/+$/, '');
  };
  let dataReady = false; const readyQ = [];
  T.ready = function (fn) { if (dataReady) fn(); else readyQ.push(fn); };
  function flushReady() { dataReady = true; readyQ.splice(0).forEach((fn) => { try { fn(); } catch (e) { console.error(e); } }); }
  function bootData(done) {
    const base = T.apiBase();
    if (!base) { done(); return; }
    const local = window.TURN_DATA;
    fetch(base + '/api/data', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const news = (d && d.news) || [];
        const groups = (d && d.guides && d.guides.groups) || [];
        // 서버가 완전히 비어 있으면 로컬 data.js 유지 (빈 화면 방지)
        if (!news.length && !groups.length) return;
        window.TURN_DATA = {
          news: news.length ? news : ((local && local.news) || []),
          guides: groups.length ? { groups } : ((local && local.guides) || { groups: [] })
        };
      })
      .catch(() => { /* 실패 시 로컬 data.js 유지 */ })
      .finally(done);
  }

  /* ---------------- init ---------------- */
  function init() {
    initHeader(); initFooter();
    bootData(function () { flushReady(); initReveal(); initLenis(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
