import React from 'react'
import useSound from 'use-sound';

interface CellProps {
  details: {
    x: number;
    y: number;
    value: number | 'X';
    flagged: boolean;
    revealed: boolean;
  };
  updateFlag: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, x: number, y: number) => void;
  revealcell: (x: number, y: number) => void;
}
export default function Cell({ details, updateFlag, revealcell }: CellProps) {
  // Adding three sounds
  const [playOne] = useSound('/boop.mp3', { volume: 5.6 });
  const [playTwo] = useSound('/plunger.mp3', { volume: 10.5 });
  const [playThree] = useSound('/bite.mp3', { volume: 10.5 });
  const style = {
    cellStyle: {
      width: 40,
      height: 40,
      backgroundColor: details.revealed && details.value !== 0 ? details.value === 'X' ? 'red' : ' #00226d' : details.revealed && details.value === 0 ? '#00226f' : '#000',
      opacity: '0.8',
      border: '3px solid white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px',
      cursor: 'pointer',
      color: 'cyan',
      fontWeight: '1000'
    },
  }

  // Playing Sound on differents Clicks

  const click = () => {
    if (details.value === 'X') {
      playTwo();
    } else {
      playOne();
    }
    // calling revealcell for specific cell x and y
    revealcell(details.x, details.y);
  }

  // Right Click Function

  const rightclick = (e: any) => {
    updateFlag(e, details.x, details.y)
    playThree();
  }
  // rendering the cell component and showing the different values on right and left clicks 

  return (
    <div style={style.cellStyle} onClick={click} onContextMenu={rightclick}>
      {!details.revealed && details.flagged ? (
        "🚩"
      ) : details.revealed && details.value !== 0 ? (
        details.value === "X" ? (
          "💣"
        ) : (
          details.value
        )
      ) : (
        ""
      )}
    </div>
  )
}

