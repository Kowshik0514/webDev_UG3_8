// homepage/script.js
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

const maxShootingStars = 30; // Limit to 5 shooting stars at a time
    let currentShootingStars = 0;

    function createShootingStar() {
      if (currentShootingStars >= maxShootingStars) return;

      const shootingStar = document.createElement("div");
      shootingStar.classList.add("shooting-star");
      shootingStar.style.left = Math.random() * window.innerWidth + "px";
      shootingStar.style.top = Math.random() * window.innerHeight * 0.5 + "px";

      document.body.appendChild(shootingStar);
      currentShootingStars++;

      // Remove the shooting star after animation and update count
      shootingStar.addEventListener("animationend", () => {
        shootingStar.remove();
        currentShootingStars--;
      });
    }
setInterval(createShootingStar, 300); // Adjust time for more or fewer stars
