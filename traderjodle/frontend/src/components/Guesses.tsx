import React, { useState } from "react";
// itemSolution should always be formatted correctly.
interface GuessesProps {
    itemSolution: string;
    UpdateGameInfo: (guessCount: number, hasWon: boolean) => void;
}
function Guesses({ itemSolution, UpdateGameInfo }: GuessesProps) {
    const [guess, setGuess] = useState<string>("");
    const [history, setHistory] = useState<
        { value: string; direction: "up" | "down" | "correct" }[]
    >([]);
    const [hasWon, setHasWon] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const error = isValidSubmission();
        if (error) {
            setErrorMessage(error);
            setIsError(true);
            setGuess("");
            return;
        }
        // valid guess
        setIsError(false);
        // format guess
        const formattedGuess = formatGuess(guess);
        // compare solution to guess
        const numGuess = parseFloat(formattedGuess);
        const numSolution = parseFloat(itemSolution);
        let direction: "up" | "down" | "correct";
        if (numGuess < numSolution) direction = "up";
        else if (numGuess > numSolution) direction = "down";
        else direction = "correct";

        // update history
        setHistory((prevHistory) => {
            const newHistory = [
                // sets to local variable and then sets it
                ...prevHistory,
                { value: formattedGuess, direction },
            ];
            return newHistory;
        });
        // still want to add to History even if you win
        if (direction === "correct") {
            setHasWon(true);
            console.log("You win!");
        }
        setGuess("");

        // pass up logic
        const buffer = 2;
        const roundsTemp = buffer + history.length;
        const hasWonTemp = hasWon;
        UpdateGameInfo(roundsTemp, hasWonTemp);
    };
    // checks for empty input or previously guessed input, else returns null
    const isValidSubmission = () => {
        if (guess === "") {
            return "Please enter a valid price.";
        } else if (history.some((entry) => entry.value === guess)) {
            return "Already tried that price.";
        }
        return null;
    };
    // handles visual of past guesses
    // adds trailing 0's to cents section
    // remove any leading zeros
    const formatGuess = (guess: string) => {
        // parseInt removes trailing 0
        console.log("OG Guess: ", guess);
        const numGuess = parseFloat(guess);
        console.log("Numbered Guess: ", numGuess);

        // add a '.' if necessary
        let strGuess = numGuess.toString();
        if (strGuess.split(".").length === 1) {
            strGuess = strGuess + ".";
        }
        // adds trailing 0's
        const parts = strGuess.split(".");
        while (parts[1].length < 2) {
            parts[1] = parts[1] + "0";
            strGuess = strGuess + "0";
        }
        console.log("Formatted Guess: ", strGuess);

        return strGuess;
    };
    // handles input into form
    // only allows 1 '.' and integers
    // only allows 2 digits in cents section
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!/^[0-9]*\.?[0-9]*$/.test(value)) return;
        const dotCount = value.split(".").length - 1;
        if (dotCount > 1) return;
        const parts = value.split(".");
        if (parts[1] && parts[1].length > 2) return;

        setGuess(value);
    };
    return (
        <>
            <h3>Your guesses:</h3>
            <ul>
                {history.map((g, index) => (
                    <li key={index}>
                        {" "}
                        {g.value} {g.direction === "up" && "⬆️"}
                        {g.direction === "down" && "⬇️"}
                        {g.direction === "correct" && "✅"}
                    </li>
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
        </>
    );
}

export default Guesses;
