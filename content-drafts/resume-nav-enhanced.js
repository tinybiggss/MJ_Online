/* === RESUME ANCHOR NAVIGATION - ENHANCED === */
/* Add to Ghost Admin → Settings → Code Injection → Site Footer */
/* This adds IDs to headings and enables anchor navigation */

document.addEventListener('DOMContentLoaded', function() {
  // Only run on resume page
  const resumeNav = document.querySelector('.resume-nav');
  if (!resumeNav) return;

  // Map navigation links to heading text patterns
  const sectionMap = {
    'summary': 'Professional Summary',
    'achievements': 'AI & Automation Achievements',
    'experience': 'Professional Experience',
    'skills': 'Technical Skills',
    'education': 'Education',
    'publications': 'Publications',
    'metrics': 'Key Metrics'
  };

  // Find all H2 headings and add IDs based on their text
  const headings = document.querySelectorAll('h2');
  headings.forEach(heading => {
    const headingText = heading.textContent.trim();

    // Match heading text to section IDs
    for (const [id, text] of Object.entries(sectionMap)) {
      if (headingText.includes(text)) {
        heading.id = id;
        console.log(`Added ID "${id}" to heading: ${headingText}`);
        break;
      }
    }
  });

  // Active state highlighting
  const sections = document.querySelectorAll('h2[id]');
  const navLinks = document.querySelectorAll('.resume-nav a');

  if (sections.length === 0 || navLinks.length === 0) {
    console.warn('Resume navigation: No sections or links found');
    return;
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

  // Smooth scroll to section when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetHeading = document.getElementById(targetId);

      if (targetHeading) {
        // Scroll to heading with offset for sticky nav
        const navHeight = resumeNav.offsetHeight;
        const targetPosition = targetHeading.offsetTop - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without triggering scroll
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });

  // Handle page load with hash
  if (window.location.hash) {
    setTimeout(() => {
      const targetId = window.location.hash.substring(1);
      const targetHeading = document.getElementById(targetId);

      if (targetHeading) {
        const navHeight = resumeNav.offsetHeight;
        const targetPosition = targetHeading.offsetTop - navHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    }, 100);
  }
});