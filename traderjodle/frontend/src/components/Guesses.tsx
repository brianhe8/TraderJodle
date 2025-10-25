import React, { useState } from "react";
// itemSolution should always be formatted correctly.
interface GuessesProps {
    itemSolution: string;
    UpdateGameInfo: (roundsUpdate: number, hasWonUpdate: boolean) => void;
}
function Guesses({ itemSolution, UpdateGameInfo }: GuessesProps) {
    const [guess, setGuess] = useState<string>("");
    const [history, setHistory] = useState<
        { value: string; direction: "up" | "down" | "correct" }[]
    >([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [hasWon, setHasWon] = useState<boolean>(false);
    let hasWonUpdate = false;
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // format guess
        const formattedGuess = formatGuess(guess);
        const error = isValidSubmission(formattedGuess);
        if (error) {
            setErrorMessage(error);
            setIsError(true);
            setGuess("");
            return;
        }
        // valid guess
        setIsError(false);
        // compare solution to guess
        const numGuess = parseFloat(formattedGuess);
        const numSolution = parseFloat(itemSolution);
        let direction: "up" | "down" | "correct";
        if (numGuess < numSolution) direction = "up";
        else if (numGuess > numSolution) direction = "down";
        else direction = "correct";

        // update history
        setHistory((h) => [...h, { value: formattedGuess, direction }]);
        // still want to add to History even if you win
        if (direction === "correct") {
            hasWonUpdate = true;
            setHasWon((w) => !w);
            console.log(-1, hasWon);
        }
        setGuess("");
        console.log(0, hasWon);
        // pass up logic
        console.log(
            1,
            "Guesses level hasWonUpdate before Update: ",
            hasWonUpdate
        );
        console.log(2, "Current Guess Length: ", 2 + history.length);
        UpdateGameInfo(2 + history.length, hasWonUpdate); // pass up local var, state for return
        console.log(6);
    };
    // checks for empty input or previously guessed input, else returns null
    const isValidSubmission = (guess: string) => {
        if (guess === "") {
            return "Please enter a valid price.";
        } else if (history.some((entry) => entry.value === guess)) {
            return "Already tried that price.";
        }
        return null;
    };
    const formatGuess = (guess: string) => {
        // handles visual of past guesses
        // adds trailing 0's to cents section
        // remove any leading zeros
        // parseInt removes trailing 0
        const numGuess = parseFloat(guess);

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

        return strGuess;
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // handles input into form
        // only allows 1 '.' and integers
        // only allows 2 digits in cents section
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
                    disabled={hasWon || 2 + history.length === 8}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    disabled={hasWon || 2 + history.length === 8}
                >
                    Submit
                </button>
            </form>
            <p className="error-message">{isError ? errorMessage : ""}</p>
        </>
    );
}

export default Guesses;
