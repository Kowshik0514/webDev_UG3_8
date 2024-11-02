function toggleProfilePopup() {
    const popup = document.getElementById("profile-popup");
    popup.classList.toggle("hidden");
}
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    targetElement.scrollIntoView({
      behavior: 'smooth'
    });

    setTimeout(() => {
      window.scrollBy(0, -50); 
    }, 300); 
  });
});

document.addEventListener("click", function(event) {
    const popup = document.getElementById("profile-popup");
    const profileIcon = document.querySelector(".profile-icon");

    if (!popup.contains(event.target) && !profileIcon.contains(event.target)) {
        popup.classList.add("hidden");
    }
});