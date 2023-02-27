import React, { useState, useEffect } from 'react';
import CreateBoard from '../../utils/CreateBoard';
import { revealed } from "../../utils/Reveal";
import Cell from './Cell';

type BoardSetting = {
  col: number,
  row: number,
  bombs: number
}

type BoardProps = {
  config: BoardSetting
}


function Board({config }: BoardProps) {
  const [grid, setGrid] = useState<any[]>([]);
  const [nonMinecount, setNonMinecount] = useState<number>(0);
  const [mineLocation, setmineLocation] = useState<number[][]>([]);
  
  useEffect(() => {
    freshBoard();
  }, []);

  // Making freshboard at start
  const freshBoard = () => {
    const newBoard = CreateBoard(config.row, config.col, config.bombs);
    setNonMinecount(10 * 10 - 20);
    setmineLocation(newBoard.mineLocation);
    setGrid(newBoard.board);
  };

  const updateFlag = (e: React.MouseEvent<HTMLButtonElement>, x: number, y: number) => {
    e.preventDefault();
    // deep copy of the object
    let newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[x][y].flagged = true;
    console.log(newGrid[x][y]);
    setGrid(newGrid);
  };

  const newfresh = () => {
    freshBoard();
  };

  const revealcell = (x: number, y: number) => {
    let newGrid = JSON.parse(JSON.stringify(grid));
    if (newGrid[x][y].value === "X") {
      // toast.dark(' Clicked on Mine ,Try Again', { position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
      for (let i = 0; i < mineLocation.length; i++) {
        newGrid[mineLocation[i][0]][mineLocation[i][1]].revealed = true;
      }
      setGrid(newGrid);
      setTimeout(newfresh, 500);
    } else if (nonMinecount === 0) {
      // toast.success('Wohoo!!,You won', { position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
      setTimeout(newfresh, 500);
    } else {
      let revealedboard = revealed(newGrid, x, y, nonMinecount);
      setGrid(revealedboard.arr);
      setNonMinecount(revealedboard.newNonMines);
    }
  };

  return (
    <div className=" mx-auto w-3/5 flex justify-center">
      <div>
        {grid.map((singlerow: any[], index1: number) => {
          return (
            <div className=' flex flex-row w-fit text-white'  key={index1}>
              {singlerow.map((singlecol: any, index2: number) => {
                const cellProps: any = {
                  details: singlecol,
                  key: index2,
                  updateFlag: updateFlag,
                  revealcell: revealcell,
                };
                return <Cell details={cellProps.details} updateFlag={cellProps.updateFlag} revealcell={cellProps.revealcell} key={cellProps.key}  />;
              })}
            </div>
          );
        })}
      </div>

    </div>
  )
}
export default Board;