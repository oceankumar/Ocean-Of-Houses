// Smooth scrolling for all internal links on the page
const links = document.querySelectorAll('a[href^="#"]');

links.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); 

    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return; 

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

  (function(){
    var y = new Date().getFullYear();
    var s1 = document.getElementById('footerYear');
    var s2 = document.getElementById('footerYear2');
    if(s1) s1.textContent = y;
    if(s2) s2.textContent = y;
  })();


// Letter-by-letter hero heading reveal
document.addEventListener('DOMContentLoaded', () => {
  const heading = document.querySelector('.hero-heading');
  if (!heading) return;

  // avoid double-wrapping if script runs multiple times
  if (heading.dataset.split === 'done') return;
  heading.dataset.split = 'done';

  // Grab the raw HTML, preserve <br> tags
  const raw = heading.innerHTML.trim();

  // Helper: turn text into array of tokens preserving <br>
  // We'll split on characters but keep <br> as token
  const tokens = [];
  // RegExp: match <br> or single character (including spaces)
  const re = /<br\s*\/?>|[\s\S]/gi;
  let m;
  while ((m = re.exec(raw)) !== null) {
    tokens.push(m[0]);
  }

  // Build new HTML with spans
  const frag = document.createDocumentFragment();
  tokens.forEach((tok, i) => {
    if (/^<br/i.test(tok)) {
      // preserve line break
      const br = document.createElement('br');
      frag.appendChild(br);
      return;
    }
    const span = document.createElement('span');
    const char = tok === ' ' ? '\u00A0' : tok; // non-breaking space for spaces
    span.className = 'char' + (tok === ' ' ? ' space' : '');
    span.textContent = char;
    // compute stagger: smaller multiplier = tighter animation
    const delay = (i * 0.03); // 30ms per char
    // duration and easing tuned for cinematic feel
    span.style.animation = `charFadeUp 820ms cubic-bezier(.2,.9,.2,1) ${delay}s both`;
    frag.appendChild(span);
  });

  // Clear and append
  heading.innerHTML = '';
  heading.appendChild(frag);

  // Optional: slightly scale/soft-glow the heading parent briefly for punch
  // (kept subtle — remove if you don't want it)
  heading.animate(
    [
      { transform: 'scale(0.998)', filter: 'blur(0.6px)', opacity: 0.99 },
      { transform: 'scale(1)', filter: 'blur(0)', opacity: 1 }
    ],
    { duration: 520, easing: 'cubic-bezier(.2,.9,.2,1)', fill: 'forwards' }
  );
});
