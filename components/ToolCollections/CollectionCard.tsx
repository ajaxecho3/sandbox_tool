/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React, { ReactNode } from 'react'
import { subtile } from '../../types/subtitle';
import LottieRoulette from '../Lottie/LottieRoulette';

type Props = {
  route: string
  children: ReactNode
}

const CollectionCard = ({ route, children}: Props) => {
  return (
    <Link href={route} className="xl:w-1/4 md:w-1/2 p-4">
      {children}
    </Link>
  )
}

export default CollectionCard