/* === RESUME ANCHOR NAVIGATION - FINAL VERSION === */
/* Add to Ghost Admin → Settings → Code Injection → Site Footer */
/* Updated to work with Ghost's auto-generated heading IDs */

document.addEventListener('DOMContentLoaded', function() {
  // Find navigation (check for both nav wrapper and plain ul)
  const resumeNav = document.querySelector('.resume-nav') || document.querySelector('a[href*="#professional-summary"]')?.closest('ul');

  if (!resumeNav) {
    console.log('Resume navigation not found');
    return;
  }

  // If we found a plain ul without nav wrapper, add the class for styling
  if (resumeNav.tagName === 'UL' && !resumeNav.classList.contains('resume-nav')) {
    const navWrapper = document.createElement('nav');
    navWrapper.className = 'resume-nav';
    navWrapper.setAttribute('aria-label', 'Resume sections');
    resumeNav.parentNode.insertBefore(navWrapper, resumeNav);
    navWrapper.appendChild(resumeNav);
  }

  // Get all H2 headings with IDs (Ghost auto-generates these)
  const sections = document.querySelectorAll('h2[id]');
  const navLinks = document.querySelectorAll('a[href^="#"]');

  if (sections.length === 0 || navLinks.length === 0) {
    console.log('Resume sections or links not found');
    return;
  }

  console.log(`Found ${sections.length} sections and ${navLinks.length} nav links`);

  // Active state highlighting on scroll
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.substring(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // Smooth scroll when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      const targetId = href.substring(1);
      const targetHeading = document.getElementById(targetId);

      if (targetHeading) {
        // Get nav height for offset
        const nav = document.querySelector('.resume-nav');
        const navHeight = nav ? nav.offsetHeight : 60;
        const targetPosition = targetHeading.offsetTop - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL
        history.pushState(null, null, href);
      }
    });
  });

  // Handle page load with hash
  if (window.location.hash) {
    setTimeout(() => {
      const targetId = window.location.hash.substring(1);
      const targetHeading = document.getElementById(targetId);

      if (targetHeading) {
        const nav = document.querySelector('.resume-nav');
        const navHeight = nav ? nav.offsetHeight : 60;
        const targetPosition = targetHeading.offsetTop - navHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    }, 100);
  }

  console.log('Resume navigation initialized successfully');
});