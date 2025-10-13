import React, { useState } from "react";

function Guesses({ itemSolution }: { itemSolution: string }) {
    const [guess, setGuess] = useState<string>("");
    const [history, setHistory] = useState<string[]>([]);
    const [hasWon, setHasWon] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (guess !== "" && !history.includes(guess)) {
            console.log(history);
            setIsError(false);
            if (guess === itemSolution) {
                setHasWon(true);
                console.log("You win!");
            }
            setHistory([...history, guess]);
            setGuess("");
        } else {
            if (history.includes(guess)) {
                setErrorMessage("Already tried that price.");
            } else if (guess === "") {
                setErrorMessage("Please enter a valid price.");
            }
            setIsError(true);
            setGuess("");
        }
    };

    // handles input into form
    // only allows 1 '.' and integers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow digits and one dot
        const dotCount = value.split(".").length - 1;
        if (/^[0-9]*\.?[0-9]*$/.test(value) && dotCount <= 1) {
            setGuess(value);
        }
    };
    return (
        <>
            <h3>Your guesses:</h3>
            <ul>
                {history.map((g, index) => (
                    <li key={index}>{g}</li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input
                    className="price-input"
                    type="text"
                    name="guess"
                    value={guess}
                    onChange={handleChange}
                    placeholder="0.00"
                />
                <button type="submit">Submit</button>
            </form>
            <p className="error-message">{isError ? errorMessage : ""}</p>

            <p>{hasWon ? "You win! The answer is: " + itemSolution : ""}</p>
        </>
    );
}

export default Guesses;
