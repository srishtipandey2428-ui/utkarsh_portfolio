document.addEventListener('DOMContentLoaded', () => {
  // 1. MOBILE MENU TOGGLE
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // 2. HEADER SCROLL EFFECT
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  if (header) {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
  }

  // 3. SET ACTIVE NAV LINK BASED ON CURRENT PATH
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  let activeSet = false;

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Check if the current pathname matches the link's href or if it's the home page
    if (currentPath.includes(href) && href !== 'index.html') {
      link.classList.add('active');
      activeSet = true;
    } else {
      link.classList.remove('active');
    }
  });

  // Default to index.html if no active is set
  if (!activeSet && navLinks.length > 0) {
    const homeLink = Array.from(navLinks).find(link => link.getAttribute('href') === 'index.html');
    if (homeLink) homeLink.classList.add('active');
  }

  // 4. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing once revealed
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. SKILLS PROGRESS BAR ANIMATION (Intersection Observer)
  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillsGrid.classList.add('animate-skills');
          
          // Animate each progress bar to its specific percentage
          const progressBars = skillsGrid.querySelectorAll('.skill-progress-bar');
          progressBars.forEach(bar => {
            const percent = bar.getAttribute('data-percent');
            bar.style.transform = `scaleX(${percent / 100})`;
          });
          
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    skillsObserver.observe(skillsGrid);
  }

  // 6. HERO SECTION TYPEWRITER EFFECT
  const typedTextSpan = document.querySelector('.typed-text');
  if (typedTextSpan) {
    const textArray = ["Student.", "Developer.", "Tech Enthusiast.", "Problem Solver."];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between words
    let textArrayIndex = 0;
    let charIndex = 0;

    const type = () => {
      if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        setTimeout(erase, newTextDelay);
      }
    };

    const erase = () => {
      if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 300);
      }
    };

    // Start typing effect on load
    setTimeout(type, newTextDelay - 1000);
  }

  // 7. CONTACT FORM VALIDATION & INTERACTIVE STATE
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const inputs = contactForm.querySelectorAll('.form-control');
    
    // Clean validation state on input focus/type
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          input.classList.remove('invalid');
          const errorMsg = input.parentElement.querySelector('.error-message');
          if (errorMsg) errorMsg.style.display = 'none';
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      inputs.forEach(input => {
        const errorMsg = input.parentElement.querySelector('.error-message');
        
        // 1. Required Check
        if (input.hasAttribute('required') && !input.value.trim()) {
          isValid = false;
          input.classList.add('invalid');
          if (errorMsg) {
            errorMsg.textContent = 'This field is required.';
            errorMsg.style.display = 'block';
          }
        }
        
        // 2. Email Pattern Check
        if (input.type === 'email' && input.value.trim()) {
          const emailPattern = /^[a-zA-Z0-0._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailPattern.test(input.value.trim())) {
            isValid = false;
            input.classList.add('invalid');
            if (errorMsg) {
              errorMsg.textContent = 'Please enter a valid email address.';
              errorMsg.style.display = 'block';
            }
          }
        }
      });

      if (isValid) {
        // Success Mockup Response
        const formContainer = contactForm.parentElement;
        
        // Create success element
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success-alert';
        successDiv.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <div>
            <strong>Thank you, ${document.getElementById('name').value}!</strong>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;">Your message has been sent successfully. Utkarsh will get back to you shortly.</p>
          </div>
        `;
        
        // Insert success alert at top of the form container
        formContainer.insertBefore(successDiv, contactForm);
        
        // Reset form
        contactForm.reset();
        
        // Optional: Remove alert after 8 seconds
        setTimeout(() => {
          successDiv.style.opacity = '0';
          successDiv.style.transition = 'opacity 0.5s ease';
          setTimeout(() => successDiv.remove(), 500);
        }, 8000);
      }
    });
  }
});
