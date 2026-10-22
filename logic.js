// Logic: no page, no storage. Data in, data out.

// Read topics.json, then every topic file it lists.
// Returns { fileNames, cardsByFile }, where each card is [question, answer].
async function loadTopics() {
  const fileNames = await (await fetch("topics.json")).json();
  const cardsByFile = {};

  for (const fileName of fileNames) {
    cardsByFile[fileName] = await (await fetch("topics/" + fileName)).json();
  }

  return { fileNames, cardsByFile };
}


function topicName(fileName) {
  return fileName.replace(".json", "");
}



function buildDeck(cardsByFile, selectedFiles, perTopic) {
  const deck = [];                               // start with an empty deck

  for (const fileName of selectedFiles) {        // for each topic in selected
    const cards = [...cardsByFile[fileName]];    //   copy that topics cards
    shuffle(cards);                              //   shuffle the copy
    const firstFew = cards.slice(0, perTopic);   //   take the first n

    for (const card of firstFew) {               //   append each one to the deck
      deck.push({
        topicName: topicName(fileName),
        question: card[0],
        answer: card[1],
      });
    }
  }

  shuffle(deck);   // optional: mixes topics together. Delete this line to keep them grouped.
  return deck;
}


function shuffle(list) {
  for (let position = list.length - 1; position > 0; position--) {
    const randomPosition = Math.floor(Math.random() * (position + 1));
    [list[position], list[randomPosition]] = [list[randomPosition], list[position]];
  }

  return list;
}
