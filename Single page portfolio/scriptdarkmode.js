// Function to toggle dark mode
function toggleDarkMode() {
    // Toggle dark mode by changing CSS variables
    document.documentElement.classList.toggle('dark-mode');
  }

  // Function to check current time and toggle dark mode accordingly
  function autoToggleDarkMode() {
    const currentHour = new Date().getHours();
    // Set the start and end hours for dark mode (e.g., 8 PM to 6 AM)
    const startHour = 20;
    const endHour = 6;

    // Check if the current hour is within the dark mode range
    const isDarkMode = currentHour >= startHour || currentHour < endHour;

    // Toggle dark mode based on the time of day
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }

  // Add event listener to call autoToggleDarkMode on page load
  document.addEventListener('DOMContentLoaded', function() {
    autoToggleDarkMode();
  });


   // JavaScript for toggling dark mode and updating SVG colors

// Function to toggle dark mode
function toggleDarkMode() {
    // Toggle dark mode by changing CSS variables
    document.documentElement.classList.toggle('dark-mode');
  }
  
  // Add event listener to the dark mode toggle button
  document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Add click event listener to the dark mode toggle button
    darkModeToggle.addEventListener('click', function() {
      // Toggle dark mode
      toggleDarkMode();
    });
  });

  
  //form
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact__form');
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission
      
      // Get form data
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Construct pre-filled URL for Google Form
      const formId = '1FAIpQLSdCzw5-wZK7QtfhrnWwM7lnbBoBTbvD5yljJI_gvkguceaO-w'; // Replace with your Google Form ID
      const baseUrl = `https://docs.google.com/forms/d/e/${formId}/viewform?`;
      const queryParams = new URLSearchParams({
        'entry.1389859628': name,
        'entry.905111126': email,
        'entry.1225568181': message
      });
      const preFilledUrl = baseUrl + queryParams.toString();
      
      // Redirect user to pre-filled Google Form
      window.location.href = preFilledUrl;
    });
  });
  

  //https://docs.google.com/forms/d/e/1FAIpQLSdCzw5-wZK7QtfhrnWwM7lnbBoBTbvD5yljJI_gvkguceaO-w/viewform?usp=sf_link
//https://docs.google.com/forms/d/e/1FAIpQLSdCzw5-wZK7QtfhrnWwM7lnbBoBTbvD5yljJI_gvkguceaO-w/viewform?usp=pp_url&entry.1389859628=NAME&entry.905111126=EMAIL&entry.1225568181=MESSAGE