document.addEventListener("DOMContentLoaded", function () {
  // Initialisation de GSAP et ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Animation du titre "Junior Web Developer"
  const titleAbout = document.getElementById("title-about");
  if (titleAbout) {
    const text = titleAbout.innerText.trim();
    titleAbout.innerHTML = text
      .split("")
      .map(letter => `<span class="inline-block">${letter === " " ? "&nbsp;" : letter}</span>`)
      .join("");

    gsap.set("#title-about span", { perspective: 400 });

    gsap.timeline({ onComplete: startWaveLoop })
      .from("#title-about span", {
        duration: 1,
        opacity: 0,
        scale: 0,
        y: 80,
        rotationX: 200,
        transformOrigin: "0% 50% -50",
        ease: "back",
        stagger: 0.06,
      });

    function startWaveLoop() {
      document.querySelectorAll("#title-about span").forEach((letter, i) => {
        gsap.timeline({ delay: i * 0.08, repeat: -1, repeatDelay: 2.5 })
          .to(letter, { duration: 0.5, y: -20, ease: "sine.inOut" })
          .to(letter, { duration: 0.1, y: -20, ease: "none" })
          .to(letter, { duration: 1, y: 0, ease: "back.out(5)" });
      });
    }
  }

  // Gestion de la navigation
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => menu.classList.toggle('hidden'));
  }

  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('bg-gray-900/90', 'backdrop-blur-sm', 'shadow-lg', 'py-2');
        navbar.classList.remove('py-4');
      } else {
        navbar.classList.remove('bg-gray-900/90', 'backdrop-blur-sm', 'shadow-lg', 'py-2');
        navbar.classList.add('py-4');
      }
    });
  }

  // Navigation active au scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', function () {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-blue-400');
      const span = link.querySelector('span');
      if (span) span.classList.remove('w-full');
      if (link.getAttribute('href')?.substring(1) === current) {
        link.classList.add('text-blue-400');
        if (span) span.classList.add('w-full');
      }
    });
  });

  // Animation des compétences
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillFilters = document.querySelectorAll('.skill-filter');
    const skillCards = document.querySelectorAll('.skill-card');
    const skillsGrid = document.getElementById('skills-grid');

    gsap.set(skillCards, { opacity: 0, y: 50, scale: 0.8 });

    const tlInitialAppear = gsap.timeline({
      scrollTrigger: {
        trigger: "#skills",
        start: "top 70%",
        toggleActions: "play none none none"
      }
    });

    skillCards.forEach((card, index) => {
      tlInitialAppear.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        clearProps: "scale"
      }, index * 0.1);
    });

    let activeCategory = 'Toutes';
    let isAnimating = false;

    function filterSkills(category) {
      if (isAnimating || category === activeCategory) return;
      isAnimating = true;
      activeCategory = category;

      const cardsToShow = [];
      const cardsToHide = [];

      skillCards.forEach(card => {
        const shouldShow = category === 'Toutes' || card.classList.contains(category.toLowerCase());
        (shouldShow ? cardsToShow : cardsToHide).push(card);
      });

      const filterTimeline = gsap.timeline({ onComplete: () => { isAnimating = false; } });

      filterTimeline.to(skillCards, {
        scale: 0.8,
        opacity: 0.2,
        duration: 0.3,
        ease: "power2.out",
        stagger: { amount: 0.1, grid: "auto", from: "center" }
      });

      if (cardsToHide.length > 0) {
        filterTimeline.to(cardsToHide, {
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: "power2.in",
          stagger: 0.05,
          onComplete: () => cardsToHide.forEach(card => card.style.display = 'none')
        }, "-=0.1");
      }

      filterTimeline.add(() => {
        cardsToShow.forEach(card => {
          gsap.set(card, { clearProps: "all" });
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8) translateY(20px)';
        });
      });

      filterTimeline.to(cardsToShow, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: { amount: 0.2, grid: "auto", from: "center" }
      });

      filterTimeline.add(() => {
        setTimeout(() => {
          const newHeight = skillsGrid.scrollHeight;
          gsap.fromTo(skillsGrid,
            { height: skillsGrid.offsetHeight },
            {
              height: newHeight,
              duration: 0.4,
              ease: "power2.inOut",
              onComplete: () => skillsGrid.style.height = 'auto'
            }
          );
        }, 50);
      }, "-=0.3");
    }

    skillFilters.forEach(filter => {
      filter.addEventListener('click', function () {
        if (isAnimating) return;

        gsap.timeline()
          .to(this, { scale: 1.15, duration: 0.2, ease: "back.out(3)" })
          .to(this, { scale: 1, duration: 0.15, ease: "power2.out" }, "+=0.05");

        skillFilters.forEach(btn => {
          btn.classList.remove('active', 'bg-indigo-600');
          btn.classList.add('bg-gray-700');
        });
        this.classList.add('active', 'bg-indigo-600');
        this.classList.remove('bg-gray-700');

        filterSkills(this.textContent.trim());
      });
    });

    skillCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)", duration: 0.3, ease: "power2.out" });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", duration: 0.3, ease: "power2.out" });
      });
    });
  }

  // Carousel functionality for the projects section
  const projectSlider = document.getElementById("projectSlider");
  const prevButton = document.getElementById("prevProject");
  const nextButton = document.getElementById("nextProject");
  const projectSlides = document.querySelectorAll(".project-slide");
  const dotsContainer = document.querySelector(".carousel-dots-container");

  let currentIndex = 0;
  let visibleProjects = 3;

  function createDots() {
    dotsContainer.innerHTML = "";
    const totalDots = Math.ceil(projectSlides.length - visibleProjects + 1);
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("button");
      dot.classList.add("carousel-dot", "w-3", "h-3", "rounded-full", "bg-gray-500", "mx-1", "focus:outline-none");
      if (i === 0) dot.classList.add("bg-blue-500");
      dotsContainer.appendChild(dot);
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateCarousel();
      });
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("bg-blue-500", index === currentIndex);
      dot.classList.toggle("bg-gray-500", index !== currentIndex);
    });
  }

  function updateVisibleProjects() {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1280) {
      visibleProjects = 3;
    } else if (screenWidth >= 768) {
      visibleProjects = 2;
    } else {
      visibleProjects = 1;
    }
    createDots();
    updateCarousel();
  }

  function updateCarousel() {
    const slideWidth = projectSlides[0].offsetWidth;
    const offset = currentIndex * slideWidth;
    projectSlider.style.transform = `translateX(-${offset}px)`;

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= projectSlides.length - visibleProjects;

    updateDots();
  }

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex < projectSlides.length - visibleProjects) {
      currentIndex++;
      updateCarousel();
    }
  });

  window.addEventListener("resize", updateVisibleProjects);
  updateVisibleProjects();
});

// JavaScript for handling modal functionality
document.querySelectorAll('.project-image').forEach(image => {
  image.addEventListener('click', () => {
      const modal = document.getElementById('image-modal');
      const modalImage = document.getElementById('modal-image');
      modalImage.src = image.src;
      modal.classList.remove('hidden');
  });
});

document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('image-modal').classList.add('hidden');
});

document.getElementById('image-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
      e.currentTarget.classList.add('hidden');
  }
});