// UI functions: read and write the page, wire up buttons. Card picking lives in logic.js.

const $ = (id) => document.getElementById(id);

let topics = { fileNames: [], cardsByFile: {} };
let deck = [];
let cardIndex = 0;

loadTopics().then((loaded) => {
  topics = loaded;
  showTopicCheckboxes();
});

// Show one screen, hide the others
function showScreen(id) {
  for (const screen of ["setupScreen", "cardScreen", "doneScreen"]) {
    $(screen).hidden = screen !== id;
  }
}

function showTopicCheckboxes() {
  // Bring back the choices from last time
  const savedTopics = JSON.parse(localStorage.getItem("selectedTopics") || "[]");
  const savedCardsPerTopic = localStorage.getItem("cardsPerTopic");
  if (savedCardsPerTopic) {
    $("cardsPerTopic").value = savedCardsPerTopic;
  }

  // One checkbox per topic file, labeled with its name and card count
  $("topicList").innerHTML = "";
  for (const fileName of topics.fileNames) {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = fileName;
    checkbox.checked = savedTopics.includes(fileName);
    label.append(checkbox, topicName(fileName) + " (" + topics.cardsByFile[fileName].length + ")");
    $("topicList").appendChild(label);
  }
}

function showCard() {
  const card = deck[cardIndex];
  $("progressText").textContent = "Card " + (cardIndex + 1) + " of " + deck.length;
  $("topicText").textContent = card.topicName;
  $("questionText").textContent = card.question;
  $("answerText").textContent = card.answer;
  showAnswer(false);
}

// Answer + Next visible, or Reveal visible
function showAnswer(visible) {
  $("answerText").hidden = !visible;
  $("nextButton").hidden = !visible;
  $("revealButton").hidden = visible;
}

$("startButton").onclick = function () {
  const selectedTopics = [...document.querySelectorAll("#topicList input:checked")].map((box) => box.value);
  const cardsPerTopic = Number($("cardsPerTopic").value);

  // Remember the choices for next time
  localStorage.setItem("selectedTopics", JSON.stringify(selectedTopics));
  localStorage.setItem("cardsPerTopic", cardsPerTopic);

  deck = buildDeck(topics.cardsByFile, selectedTopics, cardsPerTopic);
  if (deck.length === 0) return;
  cardIndex = 0;
  showScreen("cardScreen");
  showCard();
};

$("revealButton").onclick = () => showAnswer(true);

$("nextButton").onclick = function () {
  cardIndex++;
  if (cardIndex < deck.length) {
    showCard();
  } else {
    showScreen("doneScreen");
  }
};

$("newDeckButton").onclick = () => showScreen("setupScreen");
