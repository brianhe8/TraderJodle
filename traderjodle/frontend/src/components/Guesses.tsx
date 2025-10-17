import React, { useState } from "react";
// itemSolution should always be formatted correctly.
function Guesses({ itemSolution }: { itemSolution: string }) {
    const [guess, setGuess] = useState<string>("");
    const [history, setHistory] = useState<
        { value: string; direction: "up" | "down" | "correct" }[]
    >([]);
    const [hasWon, setHasWon] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // valid guess
        if (guess !== "" && !history.some((entry) => entry.value === guess)) {
            console.log(history);
            setIsError(false);
            // format guess

            // compare solution to guess
            const numGuess = parseFloat(guess);
            const numSolution = parseFloat(itemSolution);
            let direction: "up" | "down" | "correct";

            if (numGuess < numSolution) direction = "up";
            else if (numGuess > numSolution) direction = "down";
            else direction = "correct";
            // update history
            setHistory([...history, { value: guess, direction }]);
            setGuess("");
            // still want to add to History even if you win
            if (direction === "correct") {
                setHasWon(true);
                console.log("You win!");
            }
        } else {
            if (history.some((entry) => entry.value === guess)) {
                setErrorMessage("Already tried that price.");
            } else if (guess === "") {
                setErrorMessage("Please enter a valid price.");
            }
            setIsError(true);
            setGuess("");
        }
    };
    const formatGuess = () => {};

    // handles input into form
    // only allows 1 '.' and integers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
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

            <p>{hasWon ? "You win! The answer is: " + itemSolution : ""}</p>
        </>
    );
}

export default Guesses;
