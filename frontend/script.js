
function changeImg(src_path){
    const imgEle = document.getElementById('actions');
    imgEle.src = src_path;
}

function SpeakBro(text){
    // Check if text is empty
    if (!text.trim()) {
        alert("Say Something");
        return;
    }

    // Create a SpeechSynthesisUtterance object
    const utterance = new SpeechSynthesisUtterance(text);

    // Optionally, configure voice and pitch
    utterance.pitch = 1; // Normal pitch
    utterance.rate = 1;  // Normal speed

    // Speak the text
    window.speechSynthesis.speak(utterance);
}

let user_inp = document.getElementById("search-box1");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;


function listen(){

    const recognition = new SpeechRecognition();
    // Configure recognition settings
    recognition.lang = 'en-US'; // Language
    recognition.interimResults = false; // Final results only
    recognition.maxAlternatives = 1; // Number of alternative transcriptions
    changeImg('logos/MiceAnime.gif');
    recognition.start();
    
    // When speech recognition results are available
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        user_inp.value = user_inp.value + " " + transcript; // Display recognized text
        console.log(transcript); // Log confidence level
        
    };

    // Handle errors
    recognition.onerror = (event) => {
        console.error("Error occurred in recognition: " + event.error);

    };

    // Reset button text when recognition ends
    recognition.onend = () => {
        changeImg('logos/Mice.png');
    };

    
} 


function newParagraph(text){
    changeImg('logos/robo.gif');
    const conversation = document.getElementById('scrollable-text');
    const paragraph = document.createElement("p");
    paragraph.classList.add("text-box");
    paragraph.textContent = text;
    conversation.appendChild(paragraph);
    conversation.scrollTop = conversation.scrollHeight;

}

async function fetch_response(){
    
    let user_inp = document.getElementById("search-box1");
    let text = `YOU: ${user_inp.value}`;
    newParagraph(text);
    //let txt_node = document.createTextNode(text);

    let response;
    try{
        const answer = await fetch(`http://127.0.0.1:8000/response/?prompt=${user_inp.value}`);
        let data = await answer.json();
        response = String(data.response).replaceAll("*", "");
        console.log(`AI BRO: ${response}`);
    }

    catch(error){
        console.log('something went wrong!');
        response = 'something went wrong!';
    }
    
    text = `AI BRO: ${response}`;
    newParagraph(text);

    SpeakBro(response);
    
    user_inp.value = '';
    
    
    
}
