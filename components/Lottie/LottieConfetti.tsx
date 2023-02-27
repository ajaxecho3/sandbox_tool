import React from 'react'
import Lottie from "lottie-react";
import confetti from '../../assets/62717-confetti.json'
type Props = {
  className: string
}

const LottieConfetti = (props: Props) => {
  return (
    <Lottie className={props.className} animationData={confetti} loop={true} />
  )
}

export default LottieConfetti