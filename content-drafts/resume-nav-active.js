/* === RESUME ANCHOR NAVIGATION ACTIVE STATE === */
/* Add to Ghost Admin → Settings → Code Injection → Site Footer */

document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.resume-nav a');

  if (sections.length === 0 || navLinks.length === 0) {
    return; // Not on resume page
  }

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
});