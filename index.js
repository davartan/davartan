// Mobile menu toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('header .nav-links');

if (mobileToggle && navLinks) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (navLinks && !e.target.closest('header nav') && navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    if (mobileToggle) mobileToggle.classList.remove('active');
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Generate Table of Contents
function generateTableOfContents() {
  const toc = document.querySelector('.toc');
  if (!toc) return;

  const content = document.querySelector('.post-content');
  if (!content) return;

  const headings = content.querySelectorAll('h2, h3');
  if (headings.length === 0) {
    toc.style.display = 'none';
    return;
  }

  const tocList = document.createElement('ul');
  let currentH2 = null;

  headings.forEach((heading, index) => {
    // Generate ID if not present
    if (!heading.id) {
      heading.id = heading.textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + heading.id;
    a.textContent = heading.textContent;
    a.dataset.target = heading.id;

    li.appendChild(a);

    if (heading.tagName === 'H2') {
      tocList.appendChild(li);
      currentH2 = li;
    } else if (heading.tagName === 'H3' && currentH2) {
      let subList = currentH2.querySelector('ul');
      if (!subList) {
        subList = document.createElement('ul');
        currentH2.appendChild(subList);
      }
      subList.appendChild(li);
    }
  });

  toc.appendChild(tocList);
  
  // Add scroll spy functionality
  handleTOCScrollSpy(headings);
}

// Highlight active TOC item on scroll
function handleTOCScrollSpy(headings) {
  const tocLinks = document.querySelectorAll('.toc a');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(link => {
          if (link.dataset.target === entry.target.id) {
            tocLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-100px 0px -80% 0px'
  });

  headings.forEach(heading => observer.observe(heading));
}

// Run on page load
document.addEventListener('DOMContentLoaded', generateTableOfContents);
