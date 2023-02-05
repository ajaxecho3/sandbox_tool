import React from 'react'
import Lottie from "lottie-react";
import rouletteWheel from '../../assets/113454-spin-wheel.json'
type Props = {}

const LottieRoulette = (props: Props) => {
  return (
    <Lottie  animationData={rouletteWheel} loop={true} />
  )
}

export default LottieRoulette