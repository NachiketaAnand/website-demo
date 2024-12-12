// Listen for orientation changes
window.addEventListener("orientationchange", function() {
    checkOrientation();
});

// Function to check orientation
function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        // Portrait mode
        document.getElementById('landscape-warning').style.display = 'flex';
    } else {
        // Landscape mode
        document.getElementById('landscape-warning').style.display = 'none';
    }
}

// Initial check when the page loads
checkOrientation();

// Function to handle greeting
function showGreeting(name, clickedButton) {
    const greetingDiv = document.getElementById('greeting');
    
    // Check if the clicked name is Mishty
    if (name === "Mishty") {
        greetingDiv.textContent = `Hello ${name}, you are Gayyy!!`;
    } else {
        greetingDiv.textContent = `Hi ${name}!`;
    }

    // Hide the heading (h1) after a name is clicked
    const heading = document.querySelector('h1');
    heading.style.display = 'none';

    // Get all buttons
    const buttons = document.querySelectorAll('#buttons button');

    // Add animation to all buttons except the clicked one
    buttons.forEach((button) => {
        if (button !== clickedButton) {
            button.classList.add('moving-out');
        }
    });

    // Disable further clicks on all buttons
    buttons.forEach((button) => button.setAttribute('disabled', true));
}
