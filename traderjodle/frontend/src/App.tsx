import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Guesses from './components/Guesses';
// import LoadImage from './assets/loading.jpg';

interface RealItem {
    // id: number;
    item_name: string;
    item_price: string;
    item_image: string;
}
export default function Game() {
    const [itemName, setItemName] = useState<string>('');
    const [itemSolution, setItemSolution] = useState<string>('');
    const [itemImage, setItemImage] = useState<string>('');
    const [guessesSubmitted, setGuessesSubmitted] = useState<number>(1);
    const [hasWon, setHasWon] = useState<boolean>(false);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // Pulls item from DB
    useEffect(() => {
        setIsLoading(true);
        try {
            async function fetchData() {
                const item = await getData();
                setItemName(item.item_name);
                setItemSolution(item.item_price);
                setItemImage(item.item_image);
            }
            fetchData();
        } catch {
            console.error('Was not able to fetch data from database.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleGameInfoUpdate = (
        currGuessCountUpdate: number,
        hasWonUpdate: boolean,
    ) => {
        console.log('=====Updating Game Info=====');
        if (!hasWonUpdate) {
            setGuessesSubmitted(currGuessCountUpdate);
        }
        // doesnt set guessesSubmitted until after handleGameInfoUpdate
        console.log(3, 'guessesSubmitted: ', guessesSubmitted);
        if (guessesSubmitted === 6) {
            setIsGameOver(true);
            console.log('Game Over!');
        }
        // console.log("Upper level hasWonTemp: ", hasWonUpdate);
        console.log(4, hasWonUpdate);
        setHasWon((hasWon) => hasWonUpdate);
        console.log(5, hasWon);
        console.log('============================');
    };
    return (
        <>
            <header>
                <Navbar />
            </header>
            <div className="game-area">
                {/* <div className="item-price">
                    <h1>{isLoading ? "" : "Answer: " + itemSolution}</h1>
                </div> */}
                <div className="item-container">
                    <div className="item-image-container">
                        <img
                            src={isLoading ? undefined : itemImage}
                            height="300px"
                            className="item-image"
                        />
                    </div>
                    <div className="image-item-name-container">
                        <p>{isLoading ? '' : itemName}</p>
                    </div>
                </div>
                <div className="game-stats">
                    <p>
                        {guessesSubmitted >= 7
                            ? 'Guess 6/6'
                            : 'Guess ' + guessesSubmitted + '/6'}
                    </p>
                    <p>
                        {hasWon
                            ? 'You win! The answer is: ' + itemSolution
                            : ''}
                    </p>
                    <p>
                        {isGameOver && !hasWon
                            ? "You'll get it next time!"
                            : ''}
                    </p>
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

// returns object of day's index taken from products.json
async function getData(): Promise<RealItem> {
    const response = await fetch('/data/products.json');

    const data = await response.json();
    const startDate = new Date(2025, 9, 6);
    let currDate = new Date();
    let timeDiff = currDate.getTime() - startDate.getTime();
    let dayDiff = timeDiff / (1000 * 3600 * 24);
    console.log('Start Date: ' + startDate);
    let index = Math.ceil(dayDiff) % data.length;
    console.log(index);
    console.log(data[index]);
    return data[index];
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
