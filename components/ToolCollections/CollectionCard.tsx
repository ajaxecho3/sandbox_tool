/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react'
import { subtile } from '../../types/subtitle';
import LottieRoulette from '../Lottie/LottieRoulette';

type Props = {
  imgSrc: string;
  subtitle: subtile;
  title: string;
  desription: string;
}

const CollectionCard = ({ imgSrc, title, desription, subtitle}: Props) => {
  return (
    <Link href="/roulette" className="xl:w-1/4 md:w-1/2 p-4">
      <div className=" bg-blue-700 p-6 rounded-lg shadow-lg">
        <LottieRoulette />
        <p className='text-center text-white font-bold'>Wheel of Chance</p>
      </div>
    </Link>
  )
}

export default CollectionCard