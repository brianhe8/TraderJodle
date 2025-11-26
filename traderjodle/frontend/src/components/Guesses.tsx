import React, { useState } from 'react';
import './Guesses.css';
// itemSolution should always be formatted correctly.
interface GuessesProps {
    itemSolution: string;
    UpdateGameInfo: (roundsUpdate: number, hasWonUpdate: boolean) => void;
}
type Guess = {
    value: string | null;
    direction: 'up' | 'down' | 'correct' | null;
};
function Guesses({ itemSolution, UpdateGameInfo }: GuessesProps) {
    const [guess, setGuess] = useState<string>('');
    const [history, setHistory] = useState<Guess[]>(
        Array(6).fill({ value: null, direction: null })
    );
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [hasWon, setHasWon] = useState<boolean>(false);
    const numGuesses = history.filter((g) => g.value !== null).length;
    let hasWonUpdate = false;
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // format guess
        const formattedGuess = formatGuess(guess);
        const error = isValidSubmission(formattedGuess);
        if (error) {
            setErrorMessage(error);
            setIsError(true);
            setGuess('');
            return;
        }
        // valid guess
        setIsError(false);
        // compare solution to guess
        const numGuess = parseFloat(formattedGuess);
        const numSolution = parseFloat(itemSolution);
        let direction: 'up' | 'down' | 'correct';
        if (numGuess < numSolution) direction = 'up';
        else if (numGuess > numSolution) direction = 'down';
        else direction = 'correct';

        // update history
        setHistory((prevHistory) => {
            const updated = [...prevHistory];
            const index = updated.findIndex((g) => g.value === null);
            if (index !== -1) {
                updated[index] = { value: '$' + formattedGuess, direction };
            }
            return updated;
        });
        // still want to add to History even if you win
        if (direction === 'correct') {
            hasWonUpdate = true;
            setHasWon((w) => !w);
            console.log(-1, hasWon);
        }
        setGuess('');
        console.log(0, hasWon);
        // pass up logic
        console.log(
            1,
            'Guesses level hasWonUpdate before Update: ',
            hasWonUpdate
        );
        console.log(2, 'Current Guess Length: ', 2 + history.length);
        UpdateGameInfo(2 + numGuesses, hasWonUpdate); // pass up local var, state for return
        console.log(6);
    };
    // checks for empty input or previously guessed input, else returns null
    const isValidSubmission = (guess: string) => {
        console.log('Checking submission');
        console.log(guess);
        if (guess === '') {
            return 'Please enter a valid price.';
        } else if (history.some((entry) => entry.value === '$' + guess)) {
            return 'Already tried that price.';
        }
        return null;
    };
    const formatGuess = (guess: string) => {
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
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    };
    return (
        <>
            <h3>Your guesses:</h3>
            <div className="grid-container">
                {history.map((g, i) => (
                    <div key={i} className="guess-value-box">
                        <div className="value-cell">{g.value ?? ''}</div>

                        <div className="direction-cell">
                            {g.direction === 'up' && '⬆️'}
                            {g.direction === 'down' && '⬇️'}
                            {g.direction === 'correct' && '✅'}
                        </div>
                    </div>
                ))}
            </div>
            <div className="input-submit-container">
                <form onSubmit={handleSubmit}>
                    <input
                        className="price-input"
                        type="text"
                        name="guess"
                        value={guess}
                        onChange={handleChange}
                        placeholder="$0.00"
                        disabled={hasWon || 2 + numGuesses === 8}
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={hasWon || 2 + numGuesses === 8}
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
