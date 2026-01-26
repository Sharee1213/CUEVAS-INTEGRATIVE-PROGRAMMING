document.addEventListener("DOMContentLoaded", () => {
  // 1. Elegant Staggered Entrance
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const appearanceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Find the index of the card among its siblings to delay it
        const index = Array.from(entry.target.parentNode.children).indexOf(
          entry.target,
        );

        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100);

        appearanceObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply entrance logic to cards and titles nah
  document
    .querySelectorAll(".driver-card, .stat-box, .section-title, .fact-card")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
      appearanceObserver.observe(el);
    });

  // 2. Smooth Scroll Logic
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
});

// 3. Profile Expansion Toggle
function expandProfile(button) {
  const card = button.closest(".driver-card");
  card.classList.toggle("expanded");

  if (card.classList.contains("expanded")) {
    button.textContent = "Close Profile";
    button.style.background =
      "linear-gradient(135deg, #cc0000 0%, #990000 100%)";
  } else {
    button.textContent = "View Profile";
    button.style.background =
      "linear-gradient(135deg, #0066cc 0%, #0099ff 100%)";
  }
}
// Update active nav link on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
});

// Expand profile functionality
function expandProfile(button) {
  const card = button.closest(".driver-card");
  card.classList.toggle("expanded");

  if (card.classList.contains("expanded")) {
    button.textContent = "Close Profile";
    button.style.background =
      "linear-gradient(135deg, #cc0000 0%, #990000 100%)";
  } else {
    button.textContent = "View Profile";
    button.style.background =
      "linear-gradient(135deg, #0066cc 0%, #0099ff 100%)";
  }
}

// Add animation on page load
window.addEventListener("load", () => {
  const driverCards = document.querySelectorAll(".driver-card");
  driverCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // Animate section titles on view
  observeElements();
});

// Intersection Observer for animations
function observeElements() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.1,
    },
  );

  document.querySelectorAll(".section-title").forEach((title) => {
    title.style.opacity = "0";
    title.style.transform = "translateY(20px)";
    title.style.transition = "all 0.6s ease";
    observer.observe(title);
  });
}

// Driver profile data (can be expanded)
const driverData = {
  albon: {
    name: "Alex Albon",
    nationality: "Thailand",
    points: 45,
    races: 15,
    podiums: 2,
    bio: "Skilled driver with exceptional racecraft and technical feedback. Alex brings valuable experience and consistent performance to Williams Racing.",
  },
  sargeant: {
    name: "Logan Sargeant",
    nationality: "USA",
    points: 12,
    races: 15,
    podiums: 0,
    bio: "Rising talent bringing fresh energy and determination to the team. Logan continues to develop and make his mark in Formula 1.",
  },
  sainz: {
    name: "Carlos Sainz Jr.",
    nationality: "Spain",
    points: 78,
    races: 15,
    podiums: 5,
    bio: "Experienced driver with championship pedigree and proven race wins. Carlos brings leadership and speed to Williams Racing.",
  },
  vowles: {
    name: "James Vowles",
    nationality: "UK",
    points: "N/A",
    experience: "20+ years",
    podiums: "N/A",
    bio: "Visionary leader steering Williams Racing towards championship contention. James oversees all technical and sporting aspects of the team.",
  },
};

// Interactive features for future enhancement
console.log("Williams Racing Website loaded successfully!");
console.log("Driver data ready for interactive features.");

// Initialize F1 speed indicators on page load
// Replace your existing window load animation with this:
window.addEventListener("load", () => {
  const cards = document.querySelectorAll(
    ".driver-card, .stat-box, .fact-card",
  );

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const appearanceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add a slight staggered delay based on index
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100);
        appearanceObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)";
    appearanceObserver.observe(card);
  });
});

// Log viewport statistics
console.log(`Viewport: ${window.innerWidth}x${window.innerHeight}`);
