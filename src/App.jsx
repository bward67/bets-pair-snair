import React, { useState, useEffect } from "react";
import MemoryCard from "./components/MemoryCard";
import WinnerMessage from "./components/WinnerMessage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Confetti from "react-confetti"; // Importing the Confetti component
import PlayerSetup from "./components/PlayerSetup";

const App = () => {
  const [hasWon, setHasWon] = useState(false);
  const [gameKey, setGameKey] = useState(0); //! Each time you increment this key, React will fully re-render the MemoryCard component — which effectively resets all its state.

  const [playerNames, setPlayerNames] = useState([]);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const [winnerName, setWinnerName] = useState("");

  const currentYear = new Date().getFullYear();

  //! for confetti to fall down to the end of the screen on a phone
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: Math.max(
      window.innerHeight,
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    ),
  });

  const [showChangePlayersPrompt, setShowChangePlayersPrompt] = useState(false);

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: Math.max(
          window.innerHeight,
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        ),
      });
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handlePlayAgain() {
    // console.log("Game started!");
    setGameKey((prev) => prev + 1); // Increment the key will trigger a full remount of the MemoryCard component
    setHasWon(false); // Reset the win state when the game restarts
    setShowChangePlayersPrompt(true); // asks if they wnat to change/add players
  }

  useEffect(() => {
    if (hasWon) {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page when the game is won
    }
    function updateHeight() {
      setDimensions({
        width: window.innerWidth,
        height: Math.max(
          window.innerHeight,
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        ),
      });
    }

    updateHeight(); // run once immediately
    window.addEventListener("resize", updateHeight);
    window.addEventListener("scroll", updateHeight);

    // also in case content loads after
    const interval = setInterval(updateHeight, 500);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("scroll", updateHeight);
      clearInterval(interval);
    };
  }, [hasWon]);

  function handleGoToSetup() {
    setIsSetupComplete(false);
    setHasWon(false); // reset winner state
    setWinnerName("");
    setGameKey((prev) => prev + 1); // full reset
  }

  return (
    <div>
      {hasWon && (
        // <Confetti />
        <Confetti width={dimensions.width} height={dimensions.height} />
      )}
      {showChangePlayersPrompt && (
        <div className="change-players-prompt">
          <p>Would you like to change players?</p>
          <div className="winner-message-btns">
            <button
              className="play-again-btn"
              onClick={() => {
                setIsSetupComplete(false);
                setHasWon(false);
                setPlayerNames([]);
                setWinnerName("");
                setShowChangePlayersPrompt(false);
              }}
            >
              Yes
            </button>
            <button
              className="play-again-btn"
              onClick={() => {
                setGameKey((prev) => prev + 1);
                setHasWon(false);
                setShowChangePlayersPrompt(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      )}

      {hasWon ? (
        <WinnerMessage
          hasWon={hasWon}
          handlePlayAgain={handlePlayAgain}
          winnerName={winnerName}
          onGoToSetup={handleGoToSetup}
        />
      ) : (
        <Header />
      )}

      {!isSetupComplete ? (
        <PlayerSetup
          setPlayerNames={setPlayerNames}
          setIsSetupComplete={setIsSetupComplete}
        />
      ) : (
        <MemoryCard
          key={gameKey} // ensures a fresh remount
          setHasWon={setHasWon}
          playerNames={playerNames}
          setWinnerName={setWinnerName}
        />
      )}
      <Footer currentYear={currentYear} />
    </div>
  );
};

export default App;
