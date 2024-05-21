const dropdowns = document.querySelectorAll(".dropdown-container"),
  inputLanguageDropdown = document.querySelector("#input-language"),
  outputLanguageDropdown = document.querySelector("#output-language");

function populateDropdown(dropdown, options) {
  dropdown.querySelector("ul").innerHTML = "";
  options.forEach((option) => {
    const li = document.createElement("li");
    const title = option.name + " (" + option.native + ")";
    li.innerHTML = title;
    li.dataset.value = option.code;
    li.classList.add("option");
    dropdown.querySelector("ul").appendChild(li);
  });
}

populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    dropdown.classList.toggle("active");
  });

  dropdown.querySelectorAll(".option").forEach((item) => {
    item.addEventListener("click", (e) => {
      //remove active class from current dropdowns
      dropdown.querySelectorAll(".option").forEach((item) => {
        item.classList.remove("active");
      });
      item.classList.add("active");
      const selected = dropdown.querySelector(".selected");
      selected.innerHTML = item.innerHTML;
      selected.dataset.value = item.dataset.value;
      translate();
    });
  });
});
document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});

const swapBtn = document.querySelector(".swap-position"),
  inputLanguage = inputLanguageDropdown.querySelector(".selected"),
  outputLanguage = outputLanguageDropdown.querySelector(".selected"),
  inputTextElem = document.querySelector("#input-text"),
  outputTextElem = document.querySelector("#output-text");

swapBtn.addEventListener("click", (e) => {
  const temp = inputLanguage.innerHTML;
  inputLanguage.innerHTML = outputLanguage.innerHTML;
  outputLanguage.innerHTML = temp;

  const tempValue = inputLanguage.dataset.value;
  inputLanguage.dataset.value = outputLanguage.dataset.value;
  outputLanguage.dataset.value = tempValue;

  //swap text
  const tempInputText = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempInputText;

  translate();
});

function translate() {
const recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognition)();
recognition.lang = "en-US"; // English language code

recognition.onresult = function (event) {
  const result = event.results[0][0].transcript;
  document.getElementById("input-text").value = result;
  translateText(result);
};

recognition.onerror = function (event) {
  console.error("Speech recognition error detected: " + event.error);
};

document
  .getElementById("startListening")
  .addEventListener("click", function () {
    recognition.start();
  });

document
  .getElementById("input-language")
  .addEventListener("change", function () {
    const inputText = document.getElementById("input-text").value;
    translateText(inputText);
  });

  function translateText(text) {
    const targetLang = document.getElementById("output-language").querySelector(".selected").dataset.value;
    const inputLanguage = "en"; // English language code
  
    const inputText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${targetLang}&dt=t&q=${inputText}`;
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("output-text").innerText = data[0][0][0];
      })
      .catch((error) => {
        console.error("Translation error:", error);
      });
  }
}

  inputTextElem.addEventListener("input", (e) => {
    //limit input to 5000 characters
    if (inputTextElem.value.length > 5000) {
      inputTextElem.value = inputTextElem.value.slice(0, 5000);
    }
    translate();
  });
  
  
  // Function to speak the entered text
  function speakInputText() {
    const inputText = document.getElementById('input-text').value;
    if (inputText.trim() !== '') {
      const utterance = new SpeechSynthesisUtterance(inputText);
      speechSynthesis.speak(utterance);
    }
  }
  
  // Function to speak the translated text
  function speakOutputText() {
    const outputText = document.getElementById('output-text').value;
    const selectedLanguageCode = 'es'; // Replace this with the selected language code
    
    if (outputText.trim() !== '') {
      const utterance = new SpeechSynthesisUtterance(outputText);
      
      // Specify the language of the output text
      utterance.lang = selectedLanguageCode;
      
      speechSynthesis.speak(utterance);
    }
  }

 // Event listeners for the listen input and listen output buttons
document.getElementById('listen-input').addEventListener('click', speakInputText);
document.getElementById('listen-output').addEventListener('click', speakOutputText);

const darkModeCheckbox = document.getElementById("dark-mode-btn");

darkModeCheckbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

const inputChars = document.querySelector("#input-chars");

inputTextElem.addEventListener("input", (e) => {
  inputChars.innerHTML = inputTextElem.value.length;
});

document.addEventListener('DOMContentLoaded', function () {
  // Get references to the input text area and the Clear button
  const inputTextArea = document.getElementById('input-text');
  const clearInputButton = document.getElementById('clearInput');

  // Add click event listener to the Clear button
  clearInputButton.addEventListener('click', function () {
    // Clear the input text area
    inputTextArea.value = '';
  });
});