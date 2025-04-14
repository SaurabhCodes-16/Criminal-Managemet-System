document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".glitch-button");
  
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        // Reset all buttons to inactive state
        buttons.forEach(btn => {
          btn.classList.remove("active");
          btn.classList.add("inactive");
        });
        
        // Add active class to clicked button
        button.classList.remove("inactive");
        button.classList.add("active");
      });
    });
  });
  