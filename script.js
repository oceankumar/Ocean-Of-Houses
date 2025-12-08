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
