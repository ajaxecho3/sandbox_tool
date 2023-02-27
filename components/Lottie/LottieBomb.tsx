import React from 'react'
import Lottie from "lottie-react";
import bomb from '../../assets/114778-bomb-explosion-cartoon.json'
type Props = {}

const LottieBomb = (props: Props) => {
  return (
    <Lottie animationData={bomb} loop={true} />
  )
}

export default LottieBomb