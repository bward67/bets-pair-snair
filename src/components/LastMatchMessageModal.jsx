import React from "react";

const LastMatchMessageModal = ({
  hasWon,
  lastMatch,
  showModal,
  cards,
  matched,
}) => {
  if (!showModal || hasWon || !lastMatch) return null;

  //console.log(cards);
  //! b/c of the shuffling I must use the ID and not the index in cards
  let currentCard;
  if (matched.length > 0) {
    const currentMatchedId = matched[matched.length - 1];
    currentCard = cards.find((card) => card.id === currentMatchedId);
  }

  //console.log(matched);
  //!LETS get the name of the person in the image in the h4
  return (
    <div className="last-match-message-modal">
      {lastMatch && (
        <h4 style={{ color: "green" }}>
          WELL DONE! You found both photos of{" "}
          <span className="name">{currentCard?.name}</span>
        </h4>
      )}
    </div>
  );
};

export default LastMatchMessageModal;
