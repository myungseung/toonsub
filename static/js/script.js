document.addEventListener('DOMContentLoaded', function() {
    const i2iButton = document.getElementById('i2i-button');
    const textButton = document.getElementById('text-button');
    const uploadBlock = document.querySelector('.input-image');
    const promptInput = document.querySelector('.prompt-input');
    const drawButton = document.querySelector('.draw-button');
    const resultImage = document.querySelector('.result-image');
    const statusBlock = document.querySelector('.status-block');
    const statusButton = document.querySelector('.status-button');
    const statusText = statusButton.querySelector('.status-text');

    function toggleMode(isI2iMode) {
        if (isI2iMode) {
            i2iButton.classList.add('switch-on');
            i2iButton.classList.remove('switch-off');
            textButton.classList.add('switch-off');
            textButton.classList.remove('switch-on');
            uploadBlock.style.display = 'flex'; // Show upload block
        } else {
            i2iButton.classList.add('switch-off');
            i2iButton.classList.remove('switch-on');
            textButton.classList.add('switch-on');
            textButton.classList.remove('switch-off');
            uploadBlock.style.display = 'none'; // Hide upload block
        }
    }

    i2iButton.addEventListener('click', function() {
        toggleMode(true);
    });

    textButton.addEventListener('click', function() {
        toggleMode(false);
    });

    drawButton.addEventListener('click', function() {
        drawButton.classList.add('loading'); // Add loading class
        const prompt = promptInput.value;
        const i2iMode = i2iButton.classList.contains('switch-on');

        fetch('https://6ca0-121-66-193-134.ngrok-free.app/api/execute_workflow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                denoise: 1,
                i2i_mode: i2iMode
            })
        })
        .then(response => {
            console.log('Response:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data:', data);
            if (data.base64_image) {
                const imageUrl = `data:image/png;base64,${data.base64_image.ui.images[0]}`;
                console.log(imageUrl)
                resultImage.style.backgroundImage = `url(${imageUrl})`;
                resultImage.style.backgroundSize = 'cover'; // Optional: to cover the entire element
                // window.open(imageUrl); // Optional: open the image in a new tab
            }
        })
        .catch(error => console.error('Error:', error))
        .finally(() => {
            drawButton.classList.remove('loading'); // Remove loading class
        });
    });

    function checkAPIStatus() {
        console.log('Checking API status...');
        fetch('https://6ca0-121-66-193-134.ngrok-free.app/api/test')
            .then(response => {
                console.log('API response status:', response.status);
                return response.status; // Change this to text() instead of json()
            })
            .then(status => {
                console.log('API response text:', status);
                try {
                    if (status === 200) {
                        console.log('API status is 200, setting to Connected');
                        statusBlock.classList.remove('disconnected');
                        statusText.textContent = 'Connected';
                    } else {
                        console.log('API status is not 200, setting to Disconnected');
                        statusBlock.classList.add('disconnected');
                        statusText.textContent = 'Disconnected';
                    }
                } catch (error) {
                    statusBlock.classList.add('disconnected');
                    statusText.textContent = 'Disconnected';
                }
            })
            .catch(error => {
                console.error('Error checking API status:', error);
                statusBlock.classList.add('disconnected');
                statusText.textContent = 'Disconnected';
            });
    }

    // Check API status every 10 minutes
    setInterval(checkAPIStatus, 600000);

    // Initial check when the page loads
    checkAPIStatus();

    // Initialize with text mode active
    toggleMode(false);
});

console.log('script.js loaded');
