const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const apiKey = "Xs0EXbcbpgxB2ueRsAhnweYs96hPNrueTOXNzzYp";
const weatherApiKey = "23e05a7ea147f7645052bf0de2fd3fa3";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
let responses;

// Load responses from JSON file
fetch('responses.json')
    .then(response => response.json())
    .then(data => {
        responses = data.responses;
        // Display a welcome message with the default bot's picture
        appendBotResponse(getRandomResponse(responses.hello), 'clippyspace.jpg');
    })
    .catch(error => console.error("Error loading responses:", error));

    function sendMessage() {
        const message = userInput.value;
        appendMessage('user', message);
    
        // Call a function to process the user's message and generate a response
        processUserMessage(message);
    
        // Clear the user input bar
        userInput.value = '';
    
        // Scroll the chat container to the bottom immediately
        scrollChatToBottom();
    }
    

function appendMessage(sender, message) {
    // Create a container div for the entire message
    const messageContainer = document.createElement('div');

    if (sender === 'user') {
        // If the sender is the user, create an image element for the user's picture
        const userImageElement = document.createElement('img');
        userImageElement.src = 'userpic.jpg'; // Use the same user picture for every user message
        userImageElement.alt = 'User';
        userImageElement.className = 'user-image';

        // Append the user image to the message container
        messageContainer.appendChild(userImageElement);
    }

    // Create a div for the message text
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;

    // Append the message text to the message container
    messageContainer.appendChild(messageDiv);

    // Set the appropriate class for styling
    messageContainer.className = sender === 'user' ? 'user-response' : 'bot-response';

    // Append the entire message container to the chat container
    chatContainer.appendChild(messageContainer);

    // Apply additional styling for the speech bubble effect
    if (sender === 'user') {
        messageContainer.style.position = 'relative';
        messageContainer.style.borderRadius = '12px';
        messageContainer.style.backgroundColor = '#4CAF50';
        messageContainer.style.color = 'white';
        messageContainer.style.marginBottom = '12px';
        messageContainer.style.padding = '10px';
        messageContainer.style.display = 'inline-block';
    }

// Scroll the chat container to the bottom immediately
    scrollChatToBottom();
}

function appendBotResponse(response, botImage) {
    // Create an image element for the bot's picture
    const botImageElement = document.createElement('img');
    botImageElement.src = botImage;
    botImageElement.alt = 'Bot';
    botImageElement.className = 'bot-image';

    // Create a div to contain the image and the response
    const responseDiv = document.createElement('div');
    responseDiv.className = 'bot-response';

    // Append the image and the response to the chat container
    responseDiv.appendChild(botImageElement);
    responseDiv.innerHTML += `<span>${response}</span>`;
    chatContainer.appendChild(responseDiv);

    // Scroll the chat container to the bottom after appending the bot's response
    scrollChatToBottom();
}
function scrollChatToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
function processUserMessage(message) {
    // Convert the user's message to lowercase and remove spaces and punctuation
    const cleanedUserMessage = message.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '');

    if (cleanedUserMessage.startsWith("calculate")) {
        const expression = cleanedUserMessage.replace("calculate", "").trim();
        const result = calculateMathExpression(expression);
        appendBotResponse(`The result is: ${result}`, 'clippyspace.jpg');
   
    } else if (cleanedUserMessage === "help") {
        // Trigger a random question
        suggestRandomQuestion();
    } else {
        // Find a case-insensitive match in responses
        const matchedResponse = findCaseInsensitiveMatch(cleanedUserMessage);

        if (matchedResponse) {
            appendBotResponse(responses[matchedResponse], 'clippyspace.jpg');
        } else if (cleanedUserMessage.includes("weather")) {
            // Check if the message includes the word "weather" and extract the location
            let location = '';
            if (cleanedUserMessage.includes("in")) {
                location = cleanedUserMessage.split("in")[1].trim();
            } else if (message.toLowerCase().startsWith("what's the weather like in")) {
                location = message.split("in")[1].trim();
            }

            if (location) {
                getWeatherInfo(location);
            } else {
                appendBotResponse('Please provide a location for the weather information.', 'clippyspace.jpg');
            }
        } else if (cleanedUserMessage.includes("youtube")) {
            // If the user mentions YouTube, extract the search query
            const queryIndex = cleanedUserMessage.indexOf("youtube") + "youtube".length;
            const searchQuery = message.substring(queryIndex).trim();

            if (searchQuery) {
                searchRandomYouTubeVideo(searchQuery);
            } else {
                appendBotResponse('Sorry, I need a search query to find a random YouTube video.', 'clippyspace.jpg');
            }
        } else if (cleanedUserMessage.includes("picture")) {
            // Open picoftheday.html in a new tab
            window.open('../picoftheday.html', '_blank');

            // Provide a response in the chat
            appendBotResponse('Your picture of the day is in another tab.', 'clippyspace.jpg');
        } else {
            fetch(`https://api.le-systeme-solaire.net/rest/bodies/${cleanedUserMessage}?api_key=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    const info = `Name: ${data.englishName}, Diameter: ${data.meanRadius} km, Mass: ${data.mass.massValue} x 10^${data.mass.massExponent} kg`;
                    appendBotResponse(info, 'clippyspace.jpg');
                })
                .catch(error => {
                    console.error('Error fetching data from NASA API:', error);
                    appendBotResponse('Sorry, I did not understand, <br> I am not a very smart bot. <br> Try again please or say help', 'clippyspace.jpg');
                });
        }
    }
}

function findCaseInsensitiveMatch(userMessage) {
    // Iterate through stored responses to find a case-insensitive match
    return Object.keys(responses).find(response => {
        const cleanedResponse = response.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '');
        return cleanedResponse === userMessage;
    });
}


function suggestRandomQuestion() {
    // Get the keys (questions) from the responses JSON
    const questions = Object.keys(responses);

    // Select a random question
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    // Extract the question part before ":"
    const extractedQuestion = randomQuestion.split(":")[0].trim();

    // Append the extracted question to the chat container
    appendBotResponse(`Try: "${extractedQuestion}"`, 'clippyspace.jpg');
}


function getRandomResponse(responses) {
    if (Array.isArray(responses)) {
        const index = Math.floor(Math.random() * responses.length);
        return responses[index];
    } else if (typeof responses === 'object') {
        const keys = Object.keys(responses);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return responses[randomKey];
    } else {
        return responses || "Hello! How can I assist you with your solar system exploration today?";
    }
}

function getWeatherInfo(location) {
    fetch(`${weatherApiUrl}${location}&appid=${weatherApiKey}`)
        .then(response => response.json())
        .then(data => {
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            const weatherInfo = `Weather in ${location}: ${weatherDescription}, Temperature: ${temperature}°C`;
            appendBotResponse(weatherInfo, 'clippyspace.jpg');
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            appendBotResponse('Sorry, an error occurred while fetching weather information.', 'clippyspace.jpg');
        });
}

function fetchPictureOfTheDay() {
    // Open picoftheday.html in a new tab
    window.open('../picoftheday.html', '_blank');
}

function searchRandomYouTubeVideo(query) {
    // Create a YouTube search URL with the given query
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

    // Open the search URL in a new tab or window
    window.open(searchUrl, '_blank');

    // Provide a response in the chat
    appendBotResponse(`Searching for a random YouTube video on '${query}'. Please check your browser for results.`, 'clippyspace.jpg');
}

function calculateMathExpression(expression) {
    try {
        // Utiliser une expression régulière pour extraire les nombres et l'opérateur
        const match = expression.match(/([-]?\d+(\.\d+)?)\s*([-+*/])\s*([-]?\d+(\.\d+)?)/);

        if (match) {
            // Extraire les valeurs correspondantes
            const a = parseFloat(match[1]);
            const operator = match[3];
            const b = parseFloat(match[4]);

            // Vérifier si a et b sont des nombres valides
            if (!isNaN(a) && !isNaN(b)) {
                // Effectuer l'opération en fonction de l'opérateur
                let result;
                switch (operator) {
                    case '+':
                        result = a + b;
                        break;
                    case '-':
                        result = a - b;
                        break;
                    case '*':
                        result = a * b;
                        break;
                    case '/':
                        result = a / b;
                        break;
                    default:
                        return "Opérateur invalide";
                }

                return result;
            } else {
                return "Nombres invalides dans l'expression";
            }
        } else {
            return "Format d'expression invalide";
        }
    } catch (error) {
        console.error('Erreur lors de l\'évaluation de l\'expression mathématique :', error);
        return "Erreur lors de l'évaluation de l'expression";
    }
}
