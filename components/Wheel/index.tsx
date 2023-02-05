
import { useEffect } from 'react';
import { useState } from 'react';
import RandomGeneratorHexColor from '../../utils/ColorGenerator';
import Spinner from './Spinners';


interface WheelProps<TSegments> {
  segments: Array<TSegments>;
  segColors?: Array<string>;
  onFinish: (winner: TSegments) => TSegments;
}


function Wheel<TWheel extends WheelProps<string>>({ segments, onFinish, segColors }: TWheel) {
  const [activeSegment, setActiveSegment] = useState<Array<string>>([])

  const segRandomColorSet = segments.map((seg) => {
    return RandomGeneratorHexColor()
  })

  useEffect(() => {
    setActiveSegment(segments)
  }, [segments])



  return (
    <div id="wheelCircle flex justify-center">
      <Spinner
        activeSegments={activeSegment}
        segColors={segColors ? segColors : segRandomColorSet}
        winningSegment=""
        onFinished={(winner: any) => onFinish(winner)}
        primaryColor="black"
        primaryColoraround="#ffffffb4"
        contrastColor="white"
        buttonText="Spin"
        isOnlyOnce={false}
        size={290}
        height={800}
        width={800}
        upDuration={50}
        downDuration={2000}
        onRotate={undefined}
        onRotatefinish={undefined} />
    </div>
  );
}

export default Wheel;