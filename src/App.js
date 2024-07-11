import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

const root = document.documentElement;
const MAX_ROUND = 24;
const MAX_BLOCK = 50;
const MIN_BLOCK = 4;
let timer;

const initialBlocks = {
  boxs: new Array(MAX_BLOCK).fill(false),
  jackpot: false,
  active: true,
};
const initialMap = new Array(MAX_ROUND).fill(initialBlocks);
const initialIncorrect = {
  correct: true,
  score: 0,
  won: false,
};

function App() {
  useEffect(() => {
    root.style.setProperty("--max-box", `${MAX_BLOCK * 100 + 100}%`);
  }, []);

  const [hasStarted, setHasStarted] = useState(false);
  const [stage, setStage] = useState(MAX_ROUND);
  const [blocks, setBlocks] = useState(initialMap);

  const [hasSelected, setHasSelected] = useState(true);
  const [roundAnimation, setRoundAnimation] = useState(false);

  const [hasIncorrect, setHasIncorrect] = useState(initialIncorrect);

  const [hasRendered, setHasRendered] = useState(false);

  function getPackage() {
    const target = Math.floor(Math.random() * stage);
    let count = -1;

    const temp = blocks.map(({ boxs, active }) => {
      let jackpot = false;
      const n = Math.floor(
        Math.random() * (MAX_BLOCK - 3 - MIN_BLOCK) + MIN_BLOCK
      );
      let newBoxs;
      if (active) {
        count++;

        if (target === count) {
          jackpot = true;
          newBoxs = new Array(MAX_BLOCK).fill(false).map((_, idx) => ({
            empty:
              idx !== n - 1 && Math.floor(Math.random() * 2) === 0
                ? true
                : false,
            spot: idx === n - 1 ? true : false,
          }));
        } else {
          newBoxs = new Array(MAX_BLOCK).fill(false).map(() => ({
            empty: Math.floor(Math.random() * 2) === 0 ? true : false,
            spot: false,
          }));
        }
      }

      return { boxs: active ? newBoxs : boxs, jackpot, active };
    });

    setBlocks(temp);
  }

  function startClickHandler() {
    getPackage();
    setHasStarted(true);
    clearTimeout(timer);
    setHasSelected(false);
  }

  useEffect(() => {
    if (hasStarted) {
      timer = setTimeout(() => {
        setHasStarted(false);
      }, (stage / 5) * 1000);
    }
  }, [hasStarted]);

  useEffect(() => {
    if (roundAnimation) {
      setTimeout(() => {
        setRoundAnimation(false);
      }, 300);
    }
  }, [roundAnimation]);

  useEffect(() => {
    if (stage === 1) {
      setHasIncorrect(() => ({
        correct: false,
        score: 1 + MAX_ROUND - stage,
        won: true,
      }));
    }
  }, [stage]);

  function blockClickHandler(v, a, n) {
    if (!a) {
      return;
    }
    setHasSelected(true);
    if (v) {
      const temp = blocks.map(({ boxs, jackpot, active }, idx) => ({
        boxs,
        jackpot,
        active: idx === n ? false : active,
      }));
      setBlocks(temp);
      setStage((prev) => prev - 1);
      setHasStarted(false);
      clearTimeout(timer);
      setRoundAnimation(true);
    } else {
      setHasIncorrect(() => ({
        correct: false,
        score: 1 + MAX_ROUND - stage,
        won: false,
      }));
      setHasStarted(false);
      clearTimeout(timer);
    }
  }

  return (
    <div className="App">
      <div className="container">
        <div className="top-container">
          {blocks.map(({ boxs, jackpot, active }, idx) => (
            <div
              className={`box ${active ? "box--active" : "box--inactive"}`}
              onClick={() => blockClickHandler(jackpot, active, idx)}
              key={idx}
            >
              <div
                className={`box-container ${
                  hasStarted && active && "box-container--active"
                } ${!active && "box-container--inactive"}`}
                style={
                  hasStarted ? { animation: `roll ${stage / 5}s linear` } : {}
                }
              >
                {boxs.map(({ empty, spot }, idx) =>
                  spot ? (
                    <div className="box__item box__item--j" key={idx}>
                      <div></div>
                    </div>
                  ) : (
                    <div
                      className={`box__item ${
                        empty ? "box__item--x" : "box__item--o"
                      }`}
                      key={idx}
                    >
                      <div></div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="bot-container">
          <div className="round">
            <div
              className={`round-animation ${
                roundAnimation && "round-animation--active"
              }`}
              style={{
                color:
                  MAX_ROUND - stage >= 23
                    ? "rgb(0, 0, 0)"
                    : MAX_ROUND - stage >= 19
                    ? "rgb(235, 3, 3)"
                    : MAX_ROUND - stage >= 14
                    ? "rgb(255, 122, 65)"
                    : MAX_ROUND - stage >= 9
                    ? "rgb(201, 149, 103)"
                    : MAX_ROUND - stage >= 4
                    ? `rgb(142, 240, 112)`
                    : MAX_ROUND - stage > 0
                    ? "rgb(162, 195, 255)"
                    : "#fff",
              }}
            >
              ROUND - {1 + MAX_ROUND - stage}
            </div>
            <span
              style={{
                color:
                  MAX_ROUND - stage >= 23
                    ? "rgb(0, 0, 0)"
                    : MAX_ROUND - stage >= 19
                    ? "rgb(235, 3, 3)"
                    : MAX_ROUND - stage >= 14
                    ? "rgb(255, 122, 65)"
                    : MAX_ROUND - stage >= 9
                    ? "rgb(201, 149, 103)"
                    : MAX_ROUND - stage >= 4
                    ? `rgb(142, 240, 112)`
                    : MAX_ROUND - stage > 0
                    ? "rgb(162, 195, 255)"
                    : "#fff",
                fontSize: "2em",
                fontWeight: "bold",
              }}
            >
              ROUND - {1 + MAX_ROUND - stage}
            </span>
          </div>
          <button
            disabled={hasStarted || !hasSelected}
            className="game-button"
            onClick={startClickHandler}
          >
            START
          </button>
        </div>
      </div>
      {!hasRendered && (
        <div className="modal">
          <div className="bg"></div>
          <div className="modal__container">
            <div className="modal__container__text">
              <div>TIP</div>
              Yellow objects will fall within the box, and you need to find the
              white one among them. As the stages progress, the difficulty will
              increase with the speed.
            </div>
            <button
              onClick={() => {
                setHasRendered(true);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {!hasIncorrect.correct && (
        <div className="modal">
          <div className="bg"></div>
          <div className="modal__container">
            <div className="modal__container__text">
              <div>{hasIncorrect.won ? "YOU WON" : "YOU LOST"}</div>
              FINAL ROUND<span>{hasIncorrect.score}</span>
            </div>
            <button
              onClick={() => {
                setHasIncorrect(initialIncorrect);
                setStage(MAX_ROUND);
                setBlocks(initialMap);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
