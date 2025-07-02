import React from "react";

const WinnerMessage = ({
  hasWon,
  handlePlayAgain,
  winnerName,
  onGoToSetup,
}) => {
  return (
    <div className="winner-message">
      <h2 className={hasWon ? "bounce" : ""}>🎉 Well Done, {winnerName}! 🎉</h2>
      <h2 className={hasWon ? "bounce" : ""}>You won the game! </h2>
      <div className="winner-message-btns">
        <button className="play-again-btn" onClick={handlePlayAgain}>
          Play Again
        </button>

        <button className="play-again-btn" onClick={onGoToSetup}>
          Change Players
        </button>
      </div>
    </div>
  );
};

export default WinnerMessage;
