import { useState, useEffect } from 'react';
import './styles/App.css';
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

type GuessDirection = 'up' | 'down' | 'correct' | null;
type Guess = {
  value: string | null;
  direction: GuessDirection;
  flipped: boolean;
};

function createInitialHistory(): Guess[] {
  return Array.from({ length: 6 }, () => ({
    value: null,
    direction: null,
    flipped: false,
  }));
}

export default function Game() {
  const [itemName, setItemName] = useState<string>('');
  const [itemSolution, setItemSolution] = useState<string>('');
  const [itemImage, setItemImage] = useState<string>('');
  const [history, setHistory] = useState<Guess[]>(() => createInitialHistory());
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const numGuesses = history.filter((g) => g.value !== null).length + 1;
  // Pulls item from DB
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const item = await getData();
        setItemName(item.item_name);
        setItemSolution(item.item_price);
        setItemImage(item.item_image);
      } catch {
        console.error('Was not able to fetch data from database.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleGuessSubmit(formattedGuess: string) {
    // Guard: don't accept guesses before the solution arrives, or after game ends.
    if (!itemSolution || hasWon || isGameOver) return;

    // Find first empty slot from current state.
    const index = history.findIndex((g) => g.value === null);
    if (index === -1) return;

    const numGuess = parseFloat(formattedGuess);
    const numSolution = parseFloat(itemSolution);

    let guessDirection: 'up' | 'down' | 'correct';
    if (numGuess < numSolution) guessDirection = 'up';
    else if (numGuess > numSolution) guessDirection = 'down';
    else guessDirection = 'correct';

    // Commit guess to history (value includes the leading '$' for display).
    setHistory((prev) => {
      const updated = [...prev];
      const targetIndex = updated.findIndex((g) => g.value === null);
      if (targetIndex === -1) return prev;
      updated[targetIndex] = {
        value: '$' + formattedGuess,
        direction: guessDirection,
        flipped: false,
      };
      return updated;
    });

    const flipIndex = index;
    window.setTimeout(() => {
      setHistory((prev) => {
        const next = [...prev];
        const row = next[flipIndex];
        if (row?.value !== null) {
          next[flipIndex] = { ...row, flipped: true };
        }
        return next;
      });
    }, 100);

    if (guessDirection === 'correct') {
      setHasWon(true);
      setIsGameOver(true);
    }
    if (index === 5) {
      setIsGameOver(true);
    }
  }
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
          <p>{numGuesses >= 6 ? 'Guess 6/6' : 'Guess ' + numGuesses + '/6'}</p>
          <div className="game-stats-result-message">
            <p>{hasWon ? 'You win!' : ''}</p>
            <p> {isGameOver ? 'Answer: $' + itemSolution : ''}</p>
            <p>{isGameOver && !hasWon ? "You'll get it next time!" : ''}</p>
          </div>
        </div>
        <div className="guesses-container">
          <Guesses
            history={history}
            hasWon={hasWon}
            isGameOver={isGameOver}
            onSubmitGuess={handleGuessSubmit}
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
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  const startDate = new Date(2025, 9, 6);
  const currDate = new Date();
  const timeDiff = currDate.getTime() - startDate.getTime();
  const dayDiff = timeDiff / (1000 * 3600 * 24);
  const index = Math.ceil(dayDiff) % data.length;
  console.log('Start Date: ' + startDate);
  console.log(index);
  console.log(data[index]);
  return data[index];
}
