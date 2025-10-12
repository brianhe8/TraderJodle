import { useState } from "react";

const useJodle = (solution: string) => {
  const [round, setRound] = useState<number>(0);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<[string]>([""]); // each guess is {price and isHigher}
  const [history, setHistory] = useState([]); // each guess is just the price
  const [isCorrect, setIsCorrect] = useState(false);

  // format a guess into an object of price and higher lower
  // e.g. {guess: '5.99', isHigher: true}
  const formatGuess = () => {};

  // takes a guess and adds it to history
  // update the isCorrect state if guess is correct
  // add one to turn state #NOT CALLED FROM OUTSIDE HOOK, so not returned
  const addNewGuess = () => {};

  // handles key input event & tracks current guess
  // if user presses enter, add the new guess
  // if user presses backspace, delete a char
  const handleKeyup = () => {};

  return { round, currentGuess, guesses, isCorrect, handleKeyup };
};
export default useJodle;
