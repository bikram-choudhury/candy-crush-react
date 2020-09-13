import React, {
  Fragment,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect
} from 'react';
import './App.scss';
import {
  boardWidth,
  candyImageUrls,
  mergeAndDeleteForRow,
  mergeAndDeleteForColumn,
  moveDown,
  generateCandyImgs
} from './utils';

function App() {
  const [candyImages] = useState([...candyImageUrls]);
  const [candyBgImagesList, setCandyBgImagesList] = useState([]);
  const [score, setScore] = useState(0);

  const candyBeingDragged = useRef(null);
  const candyIdBeingDragged = useRef(null);
  const candyBeingReplaced = useRef(null);
  const candyIdBeingReplaced = useRef(null);
  const isBoardReady = useRef(false);

  const dragStart = useCallback((e) => {
    isBoardReady.current = true;
    const candyBgImgId = parseInt(e.target.getAttribute('data-id'));
    const candyBgImg = candyBgImagesList[candyBgImgId];
    candyIdBeingDragged.current = candyBgImgId;
    candyBeingDragged.current = candyBgImg;
  }, [candyBgImagesList]);

  const preventDefault = (e) => {
    e.preventDefault();
  };

  const dragDrop = useCallback((e) => {
    const candyBgImgId = parseInt(e.target.getAttribute('data-id'));
    candyBeingReplaced.current = candyBgImagesList[candyBgImgId];
    candyIdBeingReplaced.current = candyBgImgId;

    candyBgImagesList[candyIdBeingDragged.current] = candyBeingReplaced.current;
    candyBgImagesList[candyIdBeingReplaced.current] = candyBeingDragged.current;

    setCandyBgImagesList([...candyBgImagesList]);
  }, [candyBgImagesList]);

  const dragEnd = useCallback((e) => {
    // Valid moves
    const validMoves = [
      candyIdBeingDragged.current - 1,
      candyIdBeingDragged.current - boardWidth,
      candyIdBeingDragged.current + 1,
      candyIdBeingDragged.current + boardWidth
    ];

    if (candyIdBeingReplaced.current) {
      const isValidMove = validMoves.includes(candyIdBeingReplaced.current);
      if (isValidMove) {
        candyIdBeingDragged.current = null;
        candyIdBeingReplaced.current = null;
      } else {
        candyBgImagesList[candyIdBeingDragged.current] = candyBeingDragged.current;
        candyBgImagesList[candyIdBeingReplaced.current] = candyBeingReplaced.current;

        setCandyBgImagesList([...candyBgImagesList]);
      }
    }
  }, [candyBgImagesList]);

  const createBoard = useCallback(() => {
    const candyImgsForGrid = [];
    for (var i = 0; i < (boardWidth * boardWidth); i++) {
      const randomImg = Math.floor(Math.random() * candyImages.length);
      const bgImgUrl = candyImages[randomImg];
      candyImgsForGrid.push(bgImgUrl);
    }
    setCandyBgImagesList([...candyImgsForGrid]);
  }, [candyImages]);

  // Create candy board
  useMemo(() => {
    createBoard();
  }, [createBoard]);

  // Checking for matches
  const moveCandyImgsDown = useCallback(() => {
    if (!candyBgImagesList.length) return;

    moveDown(candyBgImagesList, (list) => {
      setCandyBgImagesList([...list]);
    });
  }, [candyBgImagesList]);

  // Check for row of 3
  const checkRowForThree = useCallback(() => {
    if (!candyBgImagesList.length) return;

    mergeAndDeleteForRow(candyBgImagesList, (list) => {
      setCandyBgImagesList([...list]);
      if(isBoardReady.current) {
        setScore(s => s + 3);
      }
    });
  }, [candyBgImagesList]);

  // Check for columm of 3
  const checkColumnForThree = useCallback(() => {
    if (!candyBgImagesList.length) return;

    mergeAndDeleteForColumn(candyBgImagesList, (list) => {
      setCandyBgImagesList([...list]);
      if(isBoardReady.current) {
        setScore(s => s + 3);
      }
    });
  }, [candyBgImagesList]);

  useEffect(() => {
    if (!candyBgImagesList.length) return;

    const timer = setInterval(() => {
      moveCandyImgsDown();
      checkColumnForThree();
      checkRowForThree();
      generateCandyImgs(candyBgImagesList, (list) => {
        setCandyBgImagesList([...list]);
      });
    }, 100);
    return () => clearInterval(timer)
  }, [moveCandyImgsDown, checkColumnForThree, checkRowForThree, candyBgImagesList]);

  return (
    <div className="App">
      {
        score >= 100 ? (
          <h1 className="complete">You Win!!!</h1>
        ): (
          <Fragment>
            <div className="grid">
              {
                candyBgImagesList.map((bgImg, index) => {
                  const style = {};
                  if(bgImg) {
                    style['backgroundImage'] = `url(${require(`${bgImg}`)})`;
                  }
                  return <div
                            key={`candy-${index}`}
                            data-id={index}
                            className="candy"
                            style={style}
                            draggable={true}
                            onDragStart={dragStart}
                            onDragOver={preventDefault}
                            onDragEnter={preventDefault}
                            onDragLeave={preventDefault}
                            onDrop={dragDrop}
                            onDragEnd={dragEnd}
                          />
                })
              }
            </div>
            <div className="score-grid">
              <div className="tip">
                <strong>Tip:</strong> <small>This game matches 3 consecutive colors (row or column).
                And you will win once your score reaches to 100.</small>
              </div>
              <div className="score-board">
                  <h1 id="score">{score}</h1>
              </div>
            </div>
          </Fragment>
        )
      }
  </div>
  );
}

export default App;
