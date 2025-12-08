// Robust listing page JS
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('listingGrid');
  const addCard = document.getElementById('addPropCard');
  const addPanel = document.getElementById('addPanel');
  const addClose = document.getElementById('addClose');
  const addCancel = document.getElementById('addCancel');
  const addForm = document.getElementById('addForm');
  const sortSelect = document.getElementById('sortSelect');
  const priceApply = document.getElementById('priceApply');
  const priceMin = document.getElementById('priceMin');
  const priceMax = document.getElementById('priceMax');
  const chips = Array.from(document.querySelectorAll('.chip'));
  const openMapBtn = document.getElementById('openMap');
  const mapModal = document.getElementById('mapModal');
  const mapClose = document.getElementById('mapClose');
  const mobileBurger = document.getElementById('mobileBurger');

  // mobile nav overlay
  if (mobileBurger) {
    mobileBurger.addEventListener('click', () => {
      const existing = document.getElementById('mobileNavOverlay');
      if (existing) { existing.remove(); return; }
      const overlay = document.createElement('div');
      overlay.id = 'mobileNavOverlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:1500;';
      overlay.innerHTML = `
        <div style="width:320px;max-width:86%;height:100%;margin-left:auto;background:linear-gradient(180deg, rgba(6,8,12,0.94), rgba(3,6,10,0.95));backdrop-filter:blur(16px);padding:28px;box-shadow:-30px 30px 80px rgba(0,0,0,0.6);">
          <button id="mobileNavClose" style="background:transparent;border:none;color:var(--muted);font-size:20px;margin-bottom:14px">✕</button>
          <nav style="display:flex;flex-direction:column;gap:10px">
            <a href="index.html">Home</a>
            <a href="listings.html">Listings</a>
            <a href="#services">Services</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      `;
      document.body.appendChild(overlay);
      overlay.querySelector('#mobileNavClose').addEventListener('click', () => overlay.remove());
    });
  }

  // panel open/close helpers
  const backdrop = document.createElement('div');
  backdrop.style.cssText = 'position:fixed;inset:0;z-index:1190;display:none';
  document.body.appendChild(backdrop);

  function openAddPanel() {
    addPanel.classList.add('open');
    addPanel.setAttribute('aria-hidden','false');
    backdrop.style.display = 'block';
    document.documentElement.style.overflow = 'hidden';
    setTimeout(()=> addPanel.querySelector('input,select,textarea')?.focus(), 120);
  }
  function closeAddPanel() {
    addPanel.classList.remove('open');
    addPanel.setAttribute('aria-hidden','true');
    backdrop.style.display = 'none';
    document.documentElement.style.overflow = '';
    addCard.focus();
  }

  addCard.addEventListener('click', openAddPanel);
  addCard.addEventListener('keydown', (e)=> { if (e.key==='Enter' || e.key===' ') openAddPanel(); });
  addClose?.addEventListener('click', closeAddPanel);
  addCancel?.addEventListener('click', closeAddPanel);
  backdrop.addEventListener('click', closeAddPanel);
  document.addEventListener('keydown', (e)=> { if (e.key === 'Escape') { closeAddPanel(); if (mapModal) closeMap(); const mobile = document.getElementById('mobileNavOverlay'); if (mobile) mobile.remove(); }});

  // create preview card when user submits the add form
  addForm?.addEventListener('submit', (e)=> {
    e.preventDefault();
    const title = addForm.title.value || 'New Listing';
    const price = parseFloat(addForm.price.value) || 0;
    const type = (addForm.type.value || '').toLowerCase();
    const location = addForm.location.value || '';
    const desc = addForm.desc.value || '';
    const newCard = document.createElement('article');
    newCard.className = 'listing-card';
    newCard.dataset.price = price;
    newCard.dataset.type = type || 'other';
    newCard.innerHTML = `
      <div class="listing-thumb" style="background-image:url('../images/thumb1.jpg')" aria-label="${title}">
        <div class="price-badge">₹${price ? price + ' Cr' : '—'}</div>
      </div>
      <div class="listing-body">
        <div class="listing-title">${title}</div>
        <div class="listing-meta muted">${location}</div>
        <div class="listing-desc muted">${desc}</div>
        <div class="listing-cta">
          <div class="prop-stats"><div class="prop-stat">—</div></div>
          <a class="link" href="#">View →</a>
        </div>
      </div>
    `;
    // append to grid and recenter add card
    grid.appendChild(newCard);
    addForm.reset();
    closeAddPanel();
    arrangeAddCard();
    toast('Listing added (preview).');
  });

  // small toast helper
  function toast(text) {
    const t = document.createElement('div');
    t.textContent = text;
    t.style.cssText = 'position:fixed;right:18px;bottom:86px;background:var(--accent);color:#001;padding:10px 14px;border-radius:12px;font-weight:800;box-shadow:0 12px 40px rgba(0,0,0,0.45);z-index:1300';
    document.body.appendChild(t);
    setTimeout(()=> t.remove(), 1800);
  }

  // Sorting logic
  function sortGrid(method) {
    // keep addCard out of sort items
    const items = Array.from(grid.querySelectorAll('.listing-card')).filter(n => n !== addCard);
    if (method === 'price-asc' || method === 'price-desc') {
      items.sort((a,b) => (parseFloat(a.dataset.price) || 0) - (parseFloat(b.dataset.price) || 0));
      if (method === 'price-desc') items.reverse();
    }
    // reattach items (we do not append addCard yet)
    items.forEach(i => grid.appendChild(i));
    arrangeAddCard();
  }
  sortSelect?.addEventListener('change', () => sortGrid(sortSelect.value));

  // filters: chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c=> c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      const cards = Array.from(grid.querySelectorAll('.listing-card')).filter(n=> n !== addCard);
      cards.forEach(card => {
        if (filter === '*' || card.dataset.type === filter) card.style.display = '';
        else card.style.display = 'none';
      });
      arrangeAddCard();
    });
  });

  // price quick filter
  priceApply?.addEventListener('click', () => {
    const min = parseFloat(priceMin.value) || 0;
    const max = parseFloat(priceMax.value) || Infinity;
    const cards = Array.from(grid.querySelectorAll('.listing-card')).filter(n=> n !== addCard);
    cards.forEach(card => {
      const p = parseFloat(card.dataset.price) || 0;
      card.style.display = (p >= min && p <= max) ? '' : 'none';
    });
    arrangeAddCard();
  });

  // place the add-card centered between visible cards
  function arrangeAddCard() {
    const cards = Array.from(grid.children).filter(n => n !== addCard && getComputedStyle(n).display !== 'none');
    // remove addCard to reinsert
    if (grid.contains(addCard)) grid.removeChild(addCard);
    if (cards.length === 0) {
      grid.appendChild(addCard);
      return;
    }
    // find middle index so addCard sits between two cards
    const mid = Math.floor(cards.length / 2);
    // insert after mid-1 (so visually between mid-1 and mid)
    if (mid <= 0) {
      grid.insertBefore(addCard, cards[0]);
    } else if (mid >= cards.length) {
      grid.appendChild(addCard);
    } else {
      grid.insertBefore(addCard, cards[mid]);
    }
    // On wide screens add-card spans 2 columns by CSS; on smaller screens it's normal block.
  }

  // initial arrange
  arrangeAddCard();

  // recalc on resize
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => arrangeAddCard(), 120);
  });

  // map modal open/close
  function openMap() {
    if (!mapModal) return;
    mapModal.classList.add('open');
    mapModal.setAttribute('aria-hidden','false');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeMap() {
    if (!mapModal) return;
    mapModal.classList.remove('open');
    mapModal.setAttribute('aria-hidden','true');
    document.documentElement.style.overflow = '';
  }
  openMapBtn?.addEventListener('click', openMap);
  mapClose?.addEventListener('click', closeMap);
  mapModal?.addEventListener('click', (e) => { if (e.target === mapModal) closeMap(); });

  // tiny helper to keep add card centered even after DOM changes
  const obs = new MutationObserver(() => arrangeAddCard());
  obs.observe(grid, { childList: true, subtree: false });

});
