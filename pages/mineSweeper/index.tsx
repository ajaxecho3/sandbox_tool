import React from 'react'
import Board from '../../components/MineBoard/Board'

type Props = {}

const MineSweepwer = (props: Props) => {
  
  return (
    <div className="__container bg-gray-50">
      <Board config={{row: 8, col: 8, bombs: 10}} />
    </div>
  )
}

export default MineSweepwer