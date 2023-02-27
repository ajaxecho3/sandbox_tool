/* eslint-disable @next/next/no-img-element */
import React from 'react'
import SectionHeader from '../common/SectionHeader'
import LottieBomb from '../Lottie/LottieBomb'
import LottieRoulette from '../Lottie/LottieRoulette'
import CollectionCard from './CollectionCard'

type Props = {}

const ToolCollections = (props: Props) => {
  return (
    <div className="__container">
     
      <div className="flex flex-wrap -m-4">
        <CollectionCard route="/roulette">
          <div className=" bg-blue-700 p-6 rounded-lg shadow-lg">
            <LottieRoulette />
            <p className='text-center text-white font-bold'>Wheel of Chance</p>
          </div>
        </CollectionCard>
        <CollectionCard route="/mineSweeper">
          <div className=" bg-orange-400 p-6 rounded-lg shadow-lg">
            <LottieBomb />
            <p className='text-center text-white font-bold'>Mine Sweeper</p>
          </div>
        </CollectionCard>
        
       
      </div>
    </div>
  )
}

export default ToolCollections