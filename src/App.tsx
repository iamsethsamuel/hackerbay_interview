import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  SetStateAction,
  Dispatch
} from "react";

interface Coords {
  x: number;
  y: number;
}

type ContextType = {
  cell: string;
  setCurrCell: Dispatch<SetStateAction<string>>;
  pickedCells: string[];
  setPickedCells: Dispatch<SetStateAction<string[]>>;
  availableCells: string[];
  setAvailableCells: Dispatch<SetStateAction<string[]>>;
  coords: Coords;
  numbOfSteps: number;
  setNumbOfSteps: Dispatch<SetStateAction<number>>;
  currCellIndex: number;
  setCurrCellIndex: Dispatch<SetStateAction<number>>;
};

const Context = createContext<ContextType>(null);
const Provider = Context.Provider;

export default function App() {
  const [coords, setCords] = useState<Coords>();
  const [cell, setCells] = useState("");
  const [pickedCells, setPickedCells] = useState([]);
  const [availableCells, setAvailableCells] = useState([]);
  const [numberOfSteps, setNumbOfSteps] = useState<number>(0);
  const [currCellIndex, setCurrCellIndex] = useState<number>(0);

  useEffect(() => {
    const x = Number(prompt("What is the width of the grid?"));
    const y = Number(prompt("What is the height of the grid?"));
    setCords({ y: y, x: x });
  }, []);

  useEffect(() => {
    if (pickedCells.length === 0 && availableCells.length > 0) {
      setTimeout(() => {
        alert(`Game over. Total moves to save princess: ${numberOfSteps}`);
      }, 200);
    }
  }, [numberOfSteps]);

  return (
    <div className="App">
      <Provider
        value={{
          cell: cell,
          pickedCells: pickedCells,
          availableCells: availableCells,
          coords: coords,
          currCellIndex: currCellIndex,
          numbOfSteps: numberOfSteps,
          setCurrCell: setCells,
          setPickedCells: setPickedCells,
          setAvailableCells: setAvailableCells,
          setNumbOfSteps: setNumbOfSteps,
          setCurrCellIndex: setCurrCellIndex
        }}
      >
        {coords && <Board />}
      </Provider>
    </div>
  );
}

const Board = () => {
  const cellNum = useRef<string[]>([]);
  const pickedCells = useRef<string[]>([]);
  const context = useContext(Context);
  const setCenter = context.setCurrCell;
  const setAvailableCells = context.setAvailableCells;

  useEffect(() => {
    //Creates the cells and pushes them to the context
    for (let i = 0; i < context.coords.x; i++) {
      for (let j = 0; j < context.coords.y; j++) {
        cellNum.current.push(`${i}${j}`);
      }
    }

    setAvailableCells(cellNum.current);

    // Checks the random cells using the randomizer function and added it to the context
    if (cellNum.current.length > 4) {
      let index = context.coords.x;
      while (index > 0) {
        const _picked = cellNum.current[randomizer(cellNum.current.length)];
        if (!pickedCells.current.includes(_picked)) {
          pickedCells.current.push(_picked);
        }
        index--;
      }
      context.setPickedCells(pickedCells.current);
    }
  }, []);

  useEffect(() => {
    if (context.coords) {
      //Gets the cell in the middle of the girde
      const midRow = Math.floor(context.coords.x / 2);
      const midCol = Math.floor(context.coords.y / 2);
      const _index = midRow * context.coords.y + midCol;

      setCenter(cellNum.current[_index]);
      context.setCurrCellIndex(_index);
    }
  }, [cellNum.current]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        flexDirection: "column"
      }}
    >
      {Array.from({ length: context.coords.y }, (_, index) => (
        <div key={index} style={{ display: "flex", flexDirection: "column" }}>
          <Grid
            style={{ flexDirection: "row" }}
            length={context.coords.x}
            xpos={index}
          />
        </div>
      ))}
    </div>
  );
};

const Grid = (props: {
  length: number;
  style: React.CSSProperties;
  xpos: number;
}) => {
  const context = useContext(Context);
  const currCell = context.cell;

  return (
    <div style={{ display: "flex", ...props.style }}>
      {Array.from({ length: props.length }, (_, index) => {
        return (
          <div
            id={`${props.xpos}${index}`}
            key={index}
            style={{
              backgroundColor: context.pickedCells.includes(
                `${props.xpos}${index}`
              )
                ? "green"
                : "#e7e4e4",
              padding: "20px",
              border: "white outset 1px",
              borderRadius: "10px",
              position: "relative",
              height: "60px",
              width: "60px"
            }}
          >
            {currCell && currCell === `${props.xpos}${index}` && <Player />}
            {context.pickedCells.includes(`${props.xpos}${index}`) && (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="20px"
                  height="20px"
                >
                  <path
                    fill="#f5bc00"
                    d="M43,14c-8,0-12,4-12,4h-7h-7c0,0-4-4-12-4c0,7.229,2.447,11.185,4.026,12.988	C9.01,27.157,9,27.327,9,27.5c0,2.986,2.381,5.411,5.348,5.492C14.124,33.62,14,34.295,14,35c0,3.08,2.33,5.62,5.32,5.96	l1.452,4.356C20.908,45.725,21.29,46,21.721,46h4.558c0.43,0,0.813-0.275,0.949-0.684l1.452-4.356C31.67,40.62,34,38.08,34,35	c0-0.705-0.124-1.38-0.348-2.008C36.619,32.911,39,30.486,39,27.5c0-0.173-0.01-0.343-0.026-0.512C40.553,25.185,43,21.229,43,14z"
                  />
                  <polygon
                    fill="#eb7900"
                    points="18,37 18,33 24,34 30,33 30,37 24,35"
                  />
                  <polygon
                    fill="#2100c4"
                    points="24,32 14.826,32 10.379,26.996 12.621,25.004 16.174,29 24,29"
                  />
                  <polygon
                    fill="#2100c4"
                    points="33.174,32 24,32 24,29 31.826,29 35.379,25.004 37.621,26.996"
                  />
                  <circle cx="20" cy="22" r="6" fill="#c2ffff" />
                  <circle cx="19.5" cy="24.5" r="1.5" fill="#2100c4" />
                  <circle cx="27.896" cy="22" r="6" fill="#c2ffff" />
                  <circle cx="28.5" cy="24.5" r="1.5" fill="#2100c4" />
                  <path
                    fill="#fadb00"
                    d="M28,29.5c0-0.709-0.494-1.301-1.156-1.457C26.358,25.714,24.834,24,24,24	c-0.832,0-2.353,1.733-2.841,4.042C20.495,28.198,20,28.79,20,29.5c0,0.726,0.516,1.331,1.201,1.47C21.732,33.041,23.192,35,24,35	s2.268-1.959,2.799-4.03C27.484,30.831,28,30.226,28,29.5z"
                  />
                  <path
                    fill="#6c19ff"
                    d="M37,19l-2,2l-22,0.25L11,19C7,10,16,2,24,2S41,10,37,19z"
                  />
                  <circle cx="24" cy="14.5" r="6.5" fill="#ddbaff" />
                  <rect width="5" height="2" x="22" y="11" fill="#6c19ff" />
                  <rect width="2" height="6" x="22" y="11" fill="#6c19ff" />
                  <path
                    fill="#a64aff"
                    d="M24,19H11l1.497,3.743C12.801,23.502,13.536,24,14.354,24H24h9.646c0.818,0,1.553-0.498,1.857-1.257	L37,19H24z"
                  />
                  <path
                    fill="#6c19ff"
                    d="M24,19h-4.684c1.183,1.231,2.842,2,4.684,2s3.501-0.769,4.684-2H24z"
                  />
                </svg>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

const Player = () => {
  const ref = useRef<HTMLDivElement>();
  const context = useContext(Context);

  useEffect(() => {
    const gridLength = context.availableCells.length - 1;

    const moveRow = (direction: string, start: number) => {
      return direction === "ArrowLeft" ? start - 1 : start + 1;
    };

    const moveCol = (direction: string, start: number) => {
      return direction === "ArrowUp"
        ? start - context.coords.y
        : context.coords.y + start;
    };

    const counter = (steps: number) => {
      if (steps > gridLength) {
        return;
      }

      if (steps < 0) {
        return;
      }
      if (context.pickedCells.length === 0) {
        return;
      }
      context.setNumbOfSteps((pS) => pS + 1);

      // Checks if the cell current cells is amount the selected cells
      if (context.pickedCells.includes(context.availableCells[steps])) {
        const _curr = context.pickedCells;
        _curr.splice(
          context.pickedCells.indexOf(context.availableCells[steps]),
          1
        );

        context.setPickedCells(_curr);
      }

      context.setCurrCell(context.availableCells[steps]);
      context.setCurrCellIndex(steps);
    };

    const winEv = (window.onkeydown = (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        counter(moveCol(event.key, context.currCellIndex));
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        counter(moveRow(event.key, context.currCellIndex));
      }
    });

    return () => {
      window.removeEventListener("keydown", winEv);
    };
  }, [context]);

  return (
    <div
      ref={ref}
      style={{ color: "red", position: "absolute", zIndex: "1000" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 128 128"
        width="34px"
        height="34px"
      >
        <path
          fill="#ffc5b3"
          d="M27.7 67.2A8 13 0 1 0 27.7 93.2A8 13 0 1 0 27.7 67.2Z"
          transform="rotate(-14.999 27.67 80.177)"
        />
        <path
          fill="#e8a695"
          d="M100.3 72.2A13 8 0 1 0 100.3 88.2A13 8 0 1 0 100.3 72.2Z"
          transform="rotate(-75.001 100.335 80.173)"
        />
        <path
          fill="#ffc5b3"
          d="M64,113.8L64,113.8c-20.1,0-36.3-16.3-36.3-36.3V45.3h72.7v32.1C100.3,97.5,84.1,113.8,64,113.8z"
        />
        <path
          fill="#e8a695"
          d="M36,51.6L36,51.6c-2,1.2-3.3,3.3-3.6,5.6l-0.5,4.3c0,3.2,3.4,5.8,6.2,4.3c6.3-3.5,16.6-4.3,22.8-4.5c2.8-0.1,5.1,2.2,5.1,5v31.5c0,2.4-1.9,4.3-4.3,4.4l-3.7,0.1l2.5,0.8c2.1,0.7,3.5,2.6,3.5,4.8v5.9h0c20.1,0,36.3-16.3,36.3-36.3v-7.7L95,53.2l0,0C77.4,41.1,54.3,40.5,36,51.6z"
        />
        <path
          fill="#444b54"
          d="M64,116.8c-15.3,0-29.3-8.9-35.7-22.8c-0.7-1.5,0-3.3,1.5-4c1.5-0.7,3.3,0,4,1.5c5.4,11.7,17.3,19.3,30.3,19.3c12.9,0,24.8-7.6,30.3-19.3c0.7-1.5,2.5-2.2,4-1.5c1.5,0.7,2.2,2.5,1.5,4C93.3,107.8,79.3,116.8,64,116.8z"
        />
        <path
          fill="#fff"
          d="M52 82.9L52 82.9c-3.9 0-7-3.1-7-7v-6c0-3.9 3.1-7 7-7h0c3.9 0 7 3.1 7 7v6C59 79.7 55.9 82.9 52 82.9zM76 82.9L76 82.9c-3.9 0-7-3.1-7-7v-6c0-3.9 3.1-7 7-7h0c3.9 0 7 3.1 7 7v6C83 79.7 79.9 82.9 76 82.9z"
        />
        <path
          fill="#ff5576"
          d="M105.7,49.3C100.1,29,83.9,14.2,64.6,14.2c-0.2,0-0.4,0-0.6,0c-0.2,0-0.4,0-0.6,0c-19.3,0-35.5,14.8-41.1,35.1c-3.1,11.4,5.1,19.2,5.1,19.2c5.8-10.8,20.3-19.3,36-19.3c0.2,0,0.4,0,0.6,0c0.2,0,0.4,0,0.6,0c15.7,0,30.2,8.6,36,19.3C100.6,68.5,108.8,60.7,105.7,49.3z"
        />
        <path
          fill="#c93f60"
          d="M101.6,66.3c-1.8,0-3.5-1.1-4.2-2.9l-1.6-4.2c-0.3-0.9-0.4-1.8-0.2-2.7c0.4-1.5,0.3-3-0.1-4.5c-1.5-5.3-3.7-10.1-6.8-14.3c-2.4-3.2-5.2-6-8.3-8.1c-2.1-1.4-2.6-4.2-1.2-6.3c1.4-2.1,4.2-2.6,6.3-1.2C89.5,25,93,28.4,96,32.5c3.7,5,6.5,10.8,8.3,17.3c0.7,2.5,0.8,5,0.4,7.5l1.1,2.9c0.9,2.3-0.2,4.9-2.5,5.8C102.7,66.2,102.2,66.3,101.6,66.3z"
        />
        <path
          fill="#c93f60"
          d="M36,51.6L36,51.6c-2,1.2-3.3,3.3-3.6,5.6l-0.5,4.3c0,0.2,0,0.5,0.1,0.7c7.2-7.6,18.9-13.1,31.4-13.1c0.2,0,0.4,0,0.6,0c0.2,0,0.4,0,0.6,0c14.6,0,28.1,7.4,34.6,17l-0.8-9.6L95,53.2C77.4,41.1,54.3,40.5,36,51.6z"
        />
        <path
          fill="#fff"
          d="M64 21.200000000000003A14 12 0 1 0 64 45.2A14 12 0 1 0 64 21.200000000000003Z"
        />
        <path
          fill="#444b54"
          d="M29.7,95.9c-2.5,0-5-1.1-7.2-3.2C20,90.3,18.1,86.9,17,83s-1.1-7.8-0.1-11.1c1.1-3.7,3.5-6.4,6.6-7.2c0.3-0.1,0.5-0.1,0.8-0.1h6c1.7,0,3,1.3,3,3v9c0,1.7-1.3,3-3,3s-3-1.3-3-3v-6h-2.5c-0.9,0.4-1.6,1.5-2.1,3c-0.7,2.2-0.6,5.1,0.1,7.9c0.7,2.8,2.1,5.3,3.8,6.9c1.3,1.2,2.6,1.8,3.6,1.5c1.6-0.4,3.2,0.5,3.7,2.1c0.4,1.6-0.5,3.2-2.1,3.7C31.1,95.8,30.4,95.9,29.7,95.9z"
        />
        <path
          fill="#ff5576"
          d="M28.6,57.7C28.6,57.7,28.6,57.7,28.6,57.7C28.6,57.7,28.6,57.7,28.6,57.7z"
        />
        <path
          fill="#444b54"
          d="M32.8,56.6c-0.9,0-1.8-0.4-2.4-1.2c-1-1.3-0.8-3.2,0.6-4.2c1.1-0.9,2.3-1.7,3.6-2.5c0.8-0.5,1.7-1,2.5-1.5c1.7-1,3.6-1.9,5.4-2.6c6.7-2.8,13.9-4.3,21-4.3c0.1,0,0.5,0,0.6,0c0.1,0,0.5,0,0.6,0c11.4,0,23,3.9,32,10.6c1.3,1,1.6,2.9,0.6,4.2s-2.9,1.6-4.2,0.6c-8-6-18.3-9.4-28.4-9.4c-0.1,0-0.5,0-0.5,0c0,0-0.1,0-0.1,0c0,0-0.4,0-0.5,0c-6.3,0-12.7,1.3-18.7,3.8c-1.7,0.7-3.3,1.5-4.8,2.4c-0.8,0.4-1.5,0.9-2.2,1.3c-1.1,0.7-2.1,1.4-3.1,2.2C34.1,56.4,33.5,56.6,32.8,56.6z"
        />
        <path
          fill="#ff5576"
          d="M100.5,57.6C100.6,57.7,100.6,57.7,100.5,57.6C100.6,57.6,100.6,57.6,100.5,57.6z"
        />
        <path
          fill="#895a55"
          d="M90,88.2c0-3.3-1.2-6-1.2-6c-24.8,18-49.7,0-49.7,0s-1.2,2.7-1.2,6c0,3,2.2,5.4,5,5.9c0,0,0,0.1,0,0.1c0,3.3,2.7,6,6,6c1.3,0,2.6-0.4,3.6-1.2c1.1,2.5,3.5,4.2,6.4,4.2c2,0,3.7-0.8,5-2.1c1.3,1.3,3,2.1,5,2.1c2.9,0,5.3-1.7,6.4-4.2c1,0.7,2.2,1.2,3.6,1.2c3.3,0,6-2.7,6-6c0,0,0-0.1,0-0.1C87.8,93.7,90,91.2,90,88.2z"
        />
        <path
          fill="#ffc5b3"
          d="M64 74.2A15 12 0 1 0 64 98.2A15 12 0 1 0 64 74.2Z"
        />
        <path
          fill="#e8a695"
          d="M64,98.2c-1.7,0-3-1.3-3-3s1.3-3,3-3c4.9,0,9-2.7,9-6c0-1.7,1.3-3,3-3s3,1.3,3,3C79,92.8,72.3,98.2,64,98.2z"
        />
        <path
          fill="#444b54"
          d="M54 70.7A3 3 0 1 0 54 76.7 3 3 0 1 0 54 70.7zM74 70.7A3 3 0 1 0 74 76.7 3 3 0 1 0 74 70.7zM56.4 62.4c-.8 0-1.5-.3-2.1-.9-1.6-1.6-4.1-1.6-5.7 0-1.2 1.2-3.1 1.2-4.2 0-1.2-1.2-1.2-3.1 0-4.2 3.9-3.9 10.2-3.9 14.1 0 1.2 1.2 1.2 3.1 0 4.2C58 62.1 57.2 62.4 56.4 62.4zM81.4 62.4c-.8 0-1.5-.3-2.1-.9-1.6-1.6-4.1-1.6-5.7 0-1.2 1.2-3.1 1.2-4.2 0-1.2-1.2-1.2-3.1 0-4.2 3.9-3.9 10.2-3.9 14.1 0 1.2 1.2 1.2 3.1 0 4.2C83 62.1 82.2 62.4 81.4 62.4z"
        />
        <g>
          <path
            fill="#444b54"
            d="M98.3,95.9c-0.7,0-1.4-0.1-2.1-0.3c-1.6-0.4-2.6-2.1-2.1-3.7c0.4-1.6,2.1-2.5,3.7-2.1c1,0.3,2.3-0.3,3.6-1.5c1.7-1.6,3.1-4.1,3.8-6.9c0.7-2.8,0.8-5.6,0.1-7.9c-0.5-1.7-1.4-2.8-2.4-3.1l-1.8-0.5c-1-0.3-1.8-1-2.1-1.9c-0.3-1-0.1-2,0.5-2.8c2.1-2.6,5.2-8.1,3.3-15.1c-5.4-19.7-20.7-32.9-38.2-32.9l-0.6,0l-0.7,0c-17.4,0-32.8,13.2-38.2,32.9c-0.4,1.6-2.1,2.5-3.7,2.1c-1.6-0.4-2.5-2.1-2.1-3.7c6.1-22.3,23.8-37.3,44-37.3c0.2,0,0.3,0,0.5,0l0.2,0l0.1,0c0.2,0,0.3,0,0.5,0c20.2,0,37.9,15,44,37.3c2,7.2,0,13.2-2.1,17c2.1,1.2,3.7,3.5,4.6,6.3c1,3.3,0.9,7.2-0.1,11.1s-3,7.3-5.5,9.7C103.3,94.8,100.7,95.9,98.3,95.9z"
          />
        </g>
        <g>
          <path
            fill="#444b54"
            d="M96.6,80.6c-1.7,0-3-1.3-3-3V67.6c0-1.7,1.3-3,3-3h6c1.7,0,3,1.3,3,3s-1.3,3-3,3h-3v7.1C99.6,79.3,98.3,80.6,96.6,80.6z"
          />
        </g>
      </svg>
    </div>
  );
};

function randomizer(maxNumber: number) {
  let randomNuber: number;
  const multipleLength = String(maxNumber).length;
  let multiple = "1";
  if (multipleLength === 1) {
    multiple = "10";
  } else {
    for (let i = 0; i < multipleLength - 1; i++) {
      multiple += "0";
    }
  }

  if (randomNuber == undefined) {
    randomNuber = Math.random() * Number(multiple);
  }

  if (randomNuber > maxNumber) {
    return randomizer(maxNumber);
  }

  return Math.floor(randomNuber);
}
