import React from "react";

const WinnerMessage = ({ hasWon, handlePlayAgain }) => {
  return (
    <>
      <h2 className={hasWon ? "bounce" : ""}>
        WINNER WINNER - CHICKEN DINNER!!
      </h2>
      <p>Why not Play Again?</p>
      {hasWon && (
        <button className="play-again-btn" onClick={handlePlayAgain}>
          Play Again
        </button>
      )}
      ,
    </>
  );
};

export default WinnerMessage;
