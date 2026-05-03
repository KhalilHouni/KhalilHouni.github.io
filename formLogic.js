
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact__form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="loading">Sending...</span>';
    submitButton.disabled = true;

    // Get form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Construct pre-filled URL for Google Form
    const formId = "1FAIpQLSdCzw5-wZK7QtfhrnWwM7lnbBoBTbvD5yljJI_gvkguceaO-w"; 
    const baseUrl = `https://docs.google.com/forms/d/e/${formId}/viewform?`;
    const queryParams = new URLSearchParams({
      "entry.1389859628": name,
      "entry.905111126": email,
      "entry.1225568181": message,
    });
    const preFilledUrl = baseUrl + queryParams.toString();

    // Redirect user to pre-filled Google Form
    window.location.href = preFilledUrl;
  });
});

