import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Guesses from "./components/Guesses";
import LoadImage from "./assets/loading.jpg";

interface RealItem {
    // prob useless?
    id: number;
    item_name: string;
    item_price: string;
    item_image: string;
}
export default function Game() {
    const [itemName, setItemName] = useState<string>("");
    const [itemSolution, setItemSolution] = useState<string>("");
    const [itemImage, setItemImage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [guessesSubmitted, setGuessesSubmitted] = useState<number>(1);
    const [hasWon, setHasWon] = useState<boolean>(false);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    // Pulls item from DB
    useEffect(() => {
        async function fetchData() {
            const data = await getData();
            const obj = data[0];
            setItemName(obj.item_name);
            setItemSolution(obj.item_price);
            setItemImage(obj.item_image);
            setIsLoading(false);
        }
        try {
            fetchData();
        } catch {
            console.error("Was not able to fetch data from database.");
        }
    }, []);

    const handleGameInfoUpdate = (
        currGuessCountUpdate: number,
        hasWonUpdate: boolean
    ) => {
        setGuessesSubmitted(currGuessCountUpdate);
        console.log("guessesSubmitted: ", guessesSubmitted);
        if (guessesSubmitted === 6) {
            setIsGameOver(true);
            console.log("Game Over!");
        }
        console.log("Upper level hasWonTemp: ", hasWonUpdate);
        setHasWon(hasWonUpdate);
    };
    return (
        <>
            <header>
                <Navbar />
            </header>
            <div className="game-area">
                <div className="item-price">
                    <h1>{isLoading ? "" : "Answer: " + itemSolution}</h1>
                </div>
                <div className="item-container">
                    <div className="image-container">
                        <img
                            src={isLoading ? LoadImage : itemImage}
                            height="400px"
                            className="item-image"
                        />
                    </div>
                    <div className="image-name-container">
                        <p>{isLoading ? "" : itemName}</p>
                    </div>
                </div>
                <div className="game-stats">
                    <p>Guess {guessesSubmitted}/6</p>
                    <p>
                        {hasWon
                            ? "You win! The answer is: " + itemSolution
                            : ""}
                    </p>
                    <p>{isGameOver && !hasWon ? "No More Guessing" : ""}</p>
                </div>
                <div className="guesses-container">
                    <Guesses
                        itemSolution={itemSolution}
                        UpdateGameInfo={handleGameInfoUpdate}
                    />
                </div>
            </div>
            <footer>
                <Footer />
            </footer>
        </>
    );
}

async function getData(): Promise<RealItem[]> {
    const response = await fetch("http://localhost:3000/items");
    const data = await response.json();
    return data;
}
function Error() {
    return (
        <>
            <div className="error-container">
                <h1>Loading Information</h1>
            </div>
        </>
    );
}
