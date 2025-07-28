document.addEventListener('DOMContentLoaded', () => {
    const consultForm = document.getElementById('consultForm');
    const outputDiv = document.getElementById('output');
    const loadingSpinner = document.getElementById('loadingSpinner'); // Assuming you have a loading spinner
    const errorMessageDiv = document.getElementById('errorMessage');

    // Make sure the API_URL matches your Replit backend URL
    // For local testing, it might be 'http://127.0.0.1:5000/consult'
    // For Replit, it will be the URL of your deployed backend, e.g., 'https://your-replit-name.replit.app/consult'
    const API_URL = 'https://bce241b3-5cf7-4975-ad16-7d14985e94d3-00-380eir4uynk8l.pike.replit.dev/consult'; // <<< IMPORTANT: UPDATE THIS WITH YOUR ACTUAL REPLIT BACKEND URL

    consultForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Clear previous output and error messages
        outputDiv.innerHTML = '';
        errorMessageDiv.innerHTML = '';
        loadingSpinner.style.display = 'block'; // Show spinner

        try {
            const formData = collectFormData(); // Collect all form data
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                displayOutput(data.output);
            } else {
                displayError(data.error || 'An unknown error occurred.');
            }

        } catch (error) {
            console.error('Error during consultation:', error);
            displayError('Failed to get a response. Please check your inputs and try again. ' + error.message);
        } finally {
            loadingSpinner.style.display = 'none'; // Hide spinner
        }
    });

    function collectFormData() {
        // Collect all existing and new form data
        return {
            name: document.getElementById('name').value,
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            weight: parseFloat(document.getElementById('weight').value),
            height: parseFloat(document.getElementById('height').value), // New field
            injury: document.getElementById('injury').value,
            painLevel: parseInt(document.getElementById('painLevel').value),
            occupation: document.getElementById('occupation').value,
            lifestyle: document.getElementById('lifestyle').value,
            activityLevel: document.getElementById('activityLevel').value,
            medicalHistory: document.getElementById('medicalHistory').value,
            constraints: document.getElementById('constraints').value // New field
        };
    }

    function displayOutput(htmlContent) {
        outputDiv.innerHTML = htmlContent;
        // You might want to scroll to the output for better UX
        outputDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function displayError(message) {
        errorMessageDiv.innerHTML = `<p class="error">${message}</p>`;
    }
});