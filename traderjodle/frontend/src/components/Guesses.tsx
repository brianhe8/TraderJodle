import React, { useState } from 'react';
import '../styles/Guesses.css';
interface GuessesProps {
  history: Guess[];
  hasWon: boolean;
  isGameOver: boolean;
  onSubmitGuess: (formattedGuess: string) => void;
}

type Guess = {
  value: string | null;
  direction: 'up' | 'down' | 'correct' | null;
};

function Guesses({ history, hasWon, isGameOver, onSubmitGuess }: GuessesProps) {
  const [guess, setGuess] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const numGuesses = history.filter((g) => g.value !== null).length;
  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Format guess.
    const formattedGuess = formatGuess(guess);
    const error = isValidSubmission(formattedGuess);
    if (error) {
      setErrorMessage(error);
      setIsError(true);
      setGuess('');
      return;
    }

    // Valid guess: commit it to App.
    setIsError(false);

    onSubmitGuess(formattedGuess);
    setGuess('');
  }
  // checks for empty input or previously guessed input, else returns null
  function isValidSubmission(guess: string) {
    console.log('Checking submission');
    console.log(guess);
    if (guess === '') {
      return 'Please enter a valid price.';
    } else if (history.some((entry) => entry.value === '$' + guess)) {
      return 'Already tried that price.';
    } else if (guess === 'NaN.00') {
      return 'Please enter a valid price.';
    }
    return null;
  }
  function formatGuess(guess: string) {
    // handles visual of past guesses
    // adds trailing 0's to cents section
    // remove any leading zeros

    // have to check for empty string in this step
    if (guess === '') {
      return '';
    }
    // parseInt removes trailing 0
    const numGuess = parseFloat(guess);

    // add a '.' if necessary
    let strGuess = numGuess.toString();
    if (strGuess.split('.').length === 1) {
      strGuess = strGuess + '.';
    }
    // adds trailing 0's
    const parts = strGuess.split('.');
    while (parts[1].length < 2) {
      parts[1] = parts[1] + '0';
      strGuess = strGuess + '0';
    }

    return strGuess;
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // handles input into form
    // only allows 1 '.' and integers
    // only allows 2 digits in cents section
    const value = e.target.value;
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) return;
    const dotCount = value.split('.').length - 1;
    if (dotCount > 1) return;
    const parts = value.split('.');
    if (parts[1] && parts[1].length > 2) return;

    setGuess(value);
  }
  return (
    <>
      {/* <h3>Your guesses:</h3> */}
      <div className="grid-container">
        {history.map((g, i) => (
          <div key={i} className="guess-value-box">
            <div className="flip-front">
              <div className="value-cell">{g.value ?? ''}</div>
              <div className="direction-cell">
                {g.direction === 'up' && '⬆️'}
                {g.direction === 'down' && '⬇️'}
                {g.direction === 'correct' && '✅'}
              </div>
            </div>
            {/*
                            <div className="flip-back">
                                <div className="value-cell">
                                    {g.value ?? ''}
                                </div>
                                <div className="direction-cell">
                                    {g.direction === 'up' && '⬆️'}
                                    {g.direction === 'down' && '⬇️'}
                                    {g.direction === 'correct' && '✅'}
                                </div>
                            </div> */}
          </div>
        ))}
      </div>
      <div className="input-submit-container">
        <form onSubmit={handleSubmit}>
          <div className="price-input-wrapper">
            <span className="price-input-prefix">$</span>
            <input
              className="price-input"
              type="text"
              name="guess"
              value={guess}
              onChange={handleChange}
              placeholder="0.00"
              disabled={hasWon || isGameOver || numGuesses === 6}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={hasWon || isGameOver || numGuesses === 6}
          >
            Submit
          </button>
        </form>
      </div>

      <p className="error-message">{isError ? errorMessage : ''}</p>
    </>
  );
}

export default Guesses;
