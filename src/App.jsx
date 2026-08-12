

import { useState } from "react";
import Data from "./Data";

export default function App() {
  const [cards, setCards] = useState(() => {
    return [...Data]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({
        ...card,
        isHidden: true,
        matched: false,
      }));
  });

  const [choices, setChoices] = useState([]);

  function startNewGame() {
    const shuffledCards = [...Data]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({
        ...card,
        isHidden: true,
        matched: false,
        id: Math.random(),
      }));

    setCards(shuffledCards);
    setChoices([]);
  }

  function handleClick(clickedCard) {
    if (!clickedCard.isHidden || choices.length >= 2) return;

    setCards((prevCards) =>
      prevCards.map((card) => {
        if (card.id === clickedCard.id) {
          return {
            ...card,
            isHidden: false,
          };
        }

        return card;
      }),
    );

    const newChoices = [...choices, clickedCard];
    setChoices(newChoices);

    if (newChoices.length === 2) {
      if (newChoices[0].name !== newChoices[1].name) {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) => {
              if (
                card.id === newChoices[0].id ||
                card.id === newChoices[1].id
              ) {
                return {
                  ...card,
                  isHidden: true,
                };
              }

              return card;
            }),
          );

          setChoices([]);
        }, 1000);
      } else {
        setCards((prevCards) =>
          prevCards.map((card) => {
            if (card.id === newChoices[0].id || card.id === newChoices[1].id) {
              return {
                ...card,
                matched: true,
              };
            }

            return card;
          }),
        );

        setChoices([]);
      }
    }
  }

  const matchedCards = cards.filter((card) => card.matched).length;
  const totalPairs = Data.length / 2;
  const matchedPairs = matchedCards / 2;

  return (
    <div className="app-container">
      <div className="game-container">
        <header className="game-header">
          <div>
            <p className="eyebrow">MEMORY CHALLENGE</p>
            <h1 className="title">Memory Game</h1>
            <p className="subtitle">Find all matching pairs</p>
          </div>

          <div className="score-card">
            <span className="score-label">MATCHES</span>
            <span className="score">
              {matchedPairs} / {totalPairs}
            </span>
          </div>
        </header>

        <div className="cards-grid">
          {cards.map((card) => (
            <Card key={card.id} card={card} onClick={() => handleClick(card)} />
          ))}
        </div>

        <button className="new-game-btn" onClick={startNewGame}>
          <span>↻</span>
          New Game
        </button>
      </div>
    </div>
  );
}

function Card({ card, onClick }) {
  return (
    <div
      className={`card ${
        card.matched ? "matched" : ""
      } ${!card.isHidden ? "revealed" : ""}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-back">
          <span>?</span>
        </div>

        <div className="card-front">
          <img src={card.img} alt={card.name} />
          <span className="card-name">{card.name}</span>
        </div>
      </div>
    </div>
  );
}