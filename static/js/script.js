document.addEventListener('DOMContentLoaded', function() {
    const i2iButton = document.getElementById('i2i-button');
    const textButton = document.getElementById('text-button');
    const uploadBlock = document.querySelector('.input-image');
    const promptInput = document.querySelector('.prompt-input');
    const drawButton = document.querySelector('.draw-button');
    const resultImage = document.querySelector('.result-image');

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

        fetch('http://121.66.193.134:40205/api/execute_workflow', {
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

    // Initialize with text mode active
    toggleMode(false);
});

console.log('script.js loaded');
