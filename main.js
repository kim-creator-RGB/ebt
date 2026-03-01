(function(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links){
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Dropdown (desktop)
  const dd = document.querySelector('.dropdown');
  const btn = document.querySelector('.dropbtn');
  if (dd && btn){
    btn.addEventListener('click', () => {
      const open = dd.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
      if (!dd.contains(e.target)){
        dd.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Cookie banner (info only)
  const banner = document.getElementById('cookieBanner');
  const closeBtn = document.getElementById('cookieClose');
  const key = 'ebt_cookie_info_seen';

  try{
    const seen = localStorage.getItem(key);
    if (!seen && banner){ banner.style.display = 'block'; }
    if (closeBtn){
      closeBtn.addEventListener('click', () => {
        localStorage.setItem(key, '1');
        if (banner) banner.style.display = 'none';
      });
    }
  }catch(e){}
})();


function initBeforeAfter(){
  document.querySelectorAll('[data-ba]').forEach((wrap) => {
    const range = wrap.querySelector('input[type="range"]');
    const after = wrap.querySelector('.after');
    const handle = wrap.querySelector('.handle');
    if (!range || !after || !handle) return;

    const set = (val) => {
      after.style.width = val + '%';
      handle.style.left = 'calc(' + val + '% - 1px)';
      range.setAttribute('aria-valuenow', String(val));
    };

    set(parseInt(range.value || '50', 10));

    range.addEventListener('input', (e) => set(parseInt(e.target.value, 10)));
  });
}

function initSteps3(){
  document.querySelectorAll('[data-steps3]').forEach((wrap) => {
    const buttons = wrap.querySelectorAll('.tabs button');
    const imgs = wrap.querySelectorAll('.stage img');
    const cap = wrap.querySelector('.caption');
    const captions = (wrap.getAttribute('data-captions') || '').split('|');

    const activate = (idx) => {
      buttons.forEach((b,i)=> b.classList.toggle('active', i===idx));
      imgs.forEach((im,i)=> im.classList.toggle('active', i===idx));
      if (cap && captions[idx]) cap.textContent = captions[idx];
    };

    buttons.forEach((b,i)=> b.addEventListener('click', ()=> activate(i)));
    activate(0);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  try{ initBeforeAfter(); }catch(e){}
  try{ initSteps3(); }catch(e){}
});


function initLightbox(){
  const lb = document.getElementById('lightbox');
  if(!lb) return;

  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCap');
  const closeBtn = lb.querySelector('.lightbox-close');
  const prevBtn = lb.querySelector('.lightbox-prev');
  const nextBtn = lb.querySelector('.lightbox-next');

  let items = [];
  let idx = 0;

  const open = (group, startEl) => {
    items = Array.from(document.querySelectorAll('.lightbox-item[data-group="'+group+'"]'));
    idx = Math.max(0, items.indexOf(startEl));
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    render();
  };

  const close = () => {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };

  const render = () => {
    const el = items[idx];
    if(!el) return;
    img.src = el.getAttribute('href');
    img.alt = el.querySelector('img')?.alt || '';
    cap.textContent = el.getAttribute('data-caption') || '';
    prevBtn.style.display = items.length > 1 ? '' : 'none';
    nextBtn.style.display = items.length > 1 ? '' : 'none';
  };

  const prev = () => { idx = (idx - 1 + items.length) % items.length; render(); };
  const next = () => { idx = (idx + 1) % items.length; render(); };

  document.querySelectorAll('.lightbox-item').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      open(a.getAttribute('data-group'), a);
    });
  });

  closeBtn?.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if(e.target === lb) close(); });
  prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  document.addEventListener('keydown', (e) => {
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') prev();
    if(e.key === 'ArrowRight') next();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  try{ initLightbox(); }catch(e){}
});
