import React, { useState } from "react";

const PlayerSetup = ({ setPlayerNames, setIsSetupComplete }) => {
  const [numPlayers, setNumPlayers] = useState(2);
  const [names, setNames] = useState(["", ""]);

  // update name at a specific index
  function handleNameChange(index, value) {
    const updatedNames = [...names];
    updatedNames[index] = value;
    setNames(updatedNames);
  }

  //handle change in number of players
  function handleNumPlayersChange(e) {
    const count = parseInt(e.target.value);
    setNumPlayers(count);
    setNames(Array(count).fill(""));
  }

  //submit and move to game
  function handleSubmit(e) {
    e.preventDefault();
    const trimmedNames = names.map((name, index) => {
      return name.trim() || `Player ${index + 1}`;
    });
    setPlayerNames(trimmedNames);
    setIsSetupComplete(true);
  }
  return (
    <div className="player-setup">
      <h3> Enter Player Names</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Number of players:
          <select value={numPlayers} onChange={handleNumPlayersChange}>
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </label>

        {names.map((name, index) => (
          <div key={index}>
            <label>
              Player {index + 1}:
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Enter player ${index + 1} name`}
                required
              />
            </label>
          </div>
        ))}

        <button type="submit" className="play-again-btn">
          Start Game
        </button>
      </form>
    </div>
  );
};

export default PlayerSetup;
