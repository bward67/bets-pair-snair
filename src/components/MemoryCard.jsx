import React, { useState, useEffect } from "react";

import data from "../data";
import images from "../images";
import LastMatchMessageModal from "./LastMatchMessageModal";

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const MemoryCard = ({ setHasWon, playerNames, setWinnerName }) => {
  // console.log(data);

  const [cards, setCards] = useState([]); // holds the full list of card objects(duplicated and shuffled)
  const [flipped, setFlipped] = useState([]); // holds ID's of flipped cards and the max length is 2 which is the player's current guess [3, 7]
  const [matched, setMatched] = useState([]); // holds ID's of cards that have been sucessfully matched - once in here, a card stays visible and unclickable
  const [disabled, setDisabled] = useState(false); // to lock flipping while checking for matches
  const [mismatchedIds, setMismatchedIds] = useState([]);
  const [lastMatch, setLastMatch] = useState(null); //or true or false
  const [showModal, setShowModal] = useState(false);
  const [players, setPlayers] = useState(
    playerNames.map((name) => ({ name, score: 0 }))
  );
  const [currentPlayer, setCurrentPlayer] = useState(0); /// index into players array

  useEffect(() => {
    const doubled = [...data, ...data]; // to get 2 of each
    const shuffled = shuffleArray(
      doubled.map((card, index) => ({
        ...card,
        id: index, // we will need for unique keys
      }))
    );

    //preload all images
    shuffled.forEach((card) => {
      const img = new Image();
      img.src = images[card.image];
    });

    setCards(shuffled);
  }, []);

  useEffect(() => {
    if (lastMatch !== null) {
      setShowModal(true);
      const timer = setTimeout(() => {
        setShowModal(false);
        setLastMatch(null); // reset match message
      }, 2200);
      return () => clearTimeout(timer); // cleanup function
    }
  }, [lastMatch]);

  function handleFlipCard(card) {
    if (disabled || flipped.includes(card.id) || matched.includes(card.id))
      return; //! this has us exit the function early if flipping is disabled or if the card is already flipped (meaning you clicked the same card twice) or the card is already matched (meaning you clicked a card that has already been matched and is no longer clickable)
    setFlipped((prev) => [...prev, card.id]);

    // //? add the clicked card's ID to the flipped array
    // const newFlipped = [...flipped, card.id]; // this adds the newly clicked card's ID to the flipped array & triggers a re-render so the UI shows the card as flipped ex. [3, 7]
    // setFlipped(newFlipped);

    // //! if 2 cards are flipped, disable further flipping & check for a match
    // if (newFlipped.length === 2) {
    //   setDisabled(true); // lock flipping while checking for matches
    // }
  }

  useEffect(() => {
    //? Get the actual card objects from the cards array using the IDs in newFlipped
    if (flipped.length !== 2) return;
    const [firstCard, secondCard] = flipped; // destructuring the newFlipped array [3, 7] to get the first and second card IDs
    const card1 = cards.find((c) => c.id === firstCard); // this finds the full card object in the cardsarray that has the ID of the first flipped card ex. {id: 3, name: "Milo", image: "Milo.jpg"}
    const card2 = cards.find((c) => c.id === secondCard); // this could be: {id: 7, name: "June", image: "June.jpg"}
    if (card1.name === card2.name) {
      // we check the .name and not the .id b/c each card image appears twice but with different ID's
      setMatched((prev) => [...prev, card1.id, card2.id]); // this adds the 2 matched cards ID's (3, 7) to the matched array - which keeps track of cards that should stay visible and be unclickable ex. if the matchedarray already has 1, 4 - now we have [1, 4, 3, 7] so now card ID's 3 and 7 will stay face-up & unclickable
      setPlayers((prevPlayers) =>
        prevPlayers.map((player, index) =>
          index === currentPlayer
            ? { ...player, score: player.score + 1 }
            : player
        )
      );
      setLastMatch(true);
      setTimeout(() => {
        setFlipped([]); // immediate reset b/c they are matched
        setDisabled(false); // unlock flipping immediately
      }, 500); // just a short delay to give the user feedback
    } else {
      //! we only want the delay if the cards are NOT a match as the delay is just to give the player time to "see" the mismatched cards before thye flip back
      setMismatchedIds([card1.id, card2.id]);
      setLastMatch(false);
      setTimeout(() => {
        setFlipped([]); // reset flipped cards after a delay - so they will be face down
        setMismatchedIds([]); // reset
        setDisabled(false); // unlock flipping so we can go again to find matches
        setCurrentPlayer((prev) => (prev + 1) % players.length); // switch player
      }, 1200); // give the player time to see the cards shake
    }
  }, [flipped, cards]);

  const hasWon = matched.length === cards.length && cards.length > 0;
  //we know the game is over when the number of items in the matched array is the same as the number of items in the cards array and there is at least 1 item in the cards array - it is not null

  useEffect(() => {
    if (hasWon) {
      setHasWon(true); // notify parent component that the game is won
      const winner = players.reduce((a, b) => (a.score >= b.score ? a : b));
      setWinnerName(winner.name); // display this in WinnerMessage
      //the >= will ensure if there is a tie - the 1st player will win
    }
  }, [hasWon, players]); // you don't need to add the setHasWon dependency, but it's a good practice to include all dependencies that are used in the effect.

  return (
    <>
      <LastMatchMessageModal
        hasWon={hasWon}
        lastMatch={lastMatch}
        showModal={showModal}
        cards={cards}
        matched={matched}
      />

      <div className="scorecard">
        {players.map((player, index) => (
          <p
            key={index}
            style={{
              fontWeight: index === currentPlayer ? "bold" : "normal",
              color: index === currentPlayer ? "var(--var-purple)" : "#333",
              fontSize: "2rem",
              marginBlock: "1rem .5rem",
            }}
          >
            {player.name}: {player.score}
          </p>
        ))}
      </div>
      <ul className="card-grid">
        {cards.map((card) => {
          const isFlipped =
            flipped.includes(card.id) || matched.includes(card.id);
          return (
            <li
              key={card.id}
              className={`card ${isFlipped ? "flipped" : ""} ${
                matched.includes(card.id) ? "matched" : ""
              } ${mismatchedIds.includes(card.id) ? "mismatchBounce" : ""}`}
              onClick={() => handleFlipCard(card)}
            >
              {isFlipped ? (
                <img src={images[card.image]} alt={card.name} />
              ) : (
                <div className="card-back">?</div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default MemoryCard;
