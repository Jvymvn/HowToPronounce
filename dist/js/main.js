//init speech synth api
const synth = window.speechSynthesis;

//DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');

//Init voices array
let voices = [];

const getVoices = () => {
    voices = synth.getVoices();

    //loop through voices and create an option for each
    voices.forEach(voice => {
        //Create option element
        const option = document.createElement('option');
        //Fill option element with voice and language
        option.textContent = voice.name + '(' + voice.lang + ')';

        //Set needed option attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        if (option.textContent === "Google US English(en-US)") {
            option.setAttribute('selected', 'selected');
        }
        voiceSelect.appendChild(option);
    });
}

getVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

//Speak

const speak = () => {
    //check if speaking
    if (synth.speaking) {
        console.error('Already pronouncing...');
        return;
    }
    if (textInput.value !== '') {
        //Get speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        //Speak end
        speakText.onend = e => {
            console.log('Done pronouncing...');
        }

        //Speak error
        speakText.onerror = e => {
            console.error('Something went wrong');
        }

        //Select voice
        const selectedVoice = voiceSelect.selectedOptions[0]
            .getAttribute('data-name');

        //Loop through voices
        voices.forEach(voice => {
            if (voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });

        //Speak
        synth.speak(speakText);
    }
};

//Event listeners

//Text form submit 
textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
});

//Voice select change
voiceSelect.addEventListener('change', e => speak());