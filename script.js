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
