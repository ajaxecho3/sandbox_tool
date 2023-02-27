import React, { useEffect, useRef, useState } from 'react'

type RouletteWheelProps = {
  segments: Array<string>
  segmentColors: Array<string>
  upDuration: number
  downDuration: number
  winningSegment: string
  onFinished: (value: string) => void
  onIsFinished?: (value: boolean) => void
  primaryColor: string
  primaryColoraround: string
  fontFamily?: string
  contrastColor: string
  buttonText: string
  size: number
  isOnlyOnce: boolean
  fontSize: number
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({
  isOnlyOnce = true,
  segments,
  primaryColor,
  contrastColor,
  fontFamily = "proxima-nova",
  size,
  primaryColoraround,
  buttonText,
  segmentColors,
  fontSize,
  upDuration,
  downDuration,
  winningSegment,
  onFinished
}) => {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isFinished, setFinished] = useState<boolean>(false)
  
  const [canvas2Dctx, setCanvas2Dctx] = useState<CanvasRenderingContext2D | null>(null)
  const TICK_INTERVAL = 10
  const PI2 = Math.PI * 2
  const centerX = 300
  const centerY = 300
  const SPIN_UP_PROGRESS = 0.8
  const SPEED_MODIFIER_1 = 1.2
  const SPEED_MODIFIER_2 = 2


  // let canvas2Dctx = null as CanvasRenderingContext2D | null
  let angleCurrent = 0
  let len = useRef(0)
  let angleDelta =0
  let currentSegment = ''
  let isStarted = false
  let timerHandle = 0
  let spinStart = 0
  let maxSpeed = 0
  let frames = 0


  useEffect(() => {
    setCanvas2Dctx(canvasRef.current?.getContext('2d') ?? null)
    len.current = segments.length
    wheelInit()
    return () => {
      window.scrollTo(0, 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments])
  



  function wheelInit() {
    draw() 
    maxSpeed = Math.PI / segments.length
  }

 

  function spin() {
    isStarted = true
    if (!timerHandle) {
      spinStart = new Date().getTime();
      maxSpeed = Math.PI / len.current;
      frames = 0;
      timerHandle = window.setInterval(onTimerTick, TICK_INTERVAL)

    }
  }

  function draw() {
    clear();
    drawWheel();
    drawNeedle();
  }

  function onTimerTick() {

    frames++;
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false
    let speedModifier = 1;

    if (duration >= upDuration) {
      progress = duration >= downDuration ? 1 : duration / downDuration;
      const segmentProgress = progress * Math.PI / 2;
      const baseSpeed = maxSpeed * Math.sin(segmentProgress);

      if (winningSegment) {
        if (currentSegment === winningSegment  ) {
          speedModifier = SPEED_MODIFIER_2;
        }
      } else if (progress >= SPIN_UP_PROGRESS) {
        speedModifier = SPEED_MODIFIER_1;
      } else if (progress >= 0.98) {
        speedModifier = SPEED_MODIFIER_2;
      }

      angleDelta = baseSpeed / speedModifier;
      finished = progress >= 1 ? true : false;
    } else {
      progress = duration / upDuration;
      angleDelta = maxSpeed * Math.sin(progress * Math.PI / 2);
    }

    angleCurrent += angleDelta;
    angleCurrent = angleCurrent % (Math.PI * 2)

  
    if (finished) {
      setFinished(true);
      onFinished(currentSegment);
      currentSegment = ''
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
      
      draw()
     

    }
    
    draw();
  }

  function drawNeedle() {
    if (canvas2Dctx) {
      canvas2Dctx.lineWidth = 1;
      canvas2Dctx.strokeStyle = contrastColor || "white";
      canvas2Dctx.fillStyle = contrastColor || "white";
      canvas2Dctx.beginPath();
      canvas2Dctx.moveTo(centerX + 10, centerY - 40);
      canvas2Dctx.lineTo(centerX - 10, centerY - 40);
      canvas2Dctx.lineTo(centerX, centerY - 60);
      canvas2Dctx.closePath();
      canvas2Dctx.fill();
      const change = angleCurrent + Math.PI / 2;
      let i = len.current - Math.floor((change / (Math.PI * 2)) * len.current) - 1;
      if (i < 0) i = i + len.current;
      canvas2Dctx.textAlign = "center";
      canvas2Dctx.textBaseline = "middle";
      canvas2Dctx.fillStyle = "transparent";
      canvas2Dctx.font = "bold 1.5em " + fontFamily;
      currentSegment = segments[i];
      isStarted &&
        canvas2Dctx.fillText(currentSegment, centerX + 10, centerY + size + 50);
    }
  }

  

  function drawWheel() {
    let lastAngle = angleCurrent;
    if (!canvas2Dctx) return

    canvas2Dctx.lineWidth = 1;
    canvas2Dctx.strokeStyle = primaryColor || 'black'
    canvas2Dctx.textBaseline = "middle";
    canvas2Dctx.textAlign = "center";
    canvas2Dctx.font = "1em " + fontFamily;

    //Draw segments
    for (let i = 1; i <= len.current; i++) {
      if (segments[i - 1]){
        const angle = PI2 * (i / len.current) + angleCurrent;
        canvas2Dctx.save();
        canvas2Dctx.beginPath();
        canvas2Dctx.moveTo(centerX, centerY);
        canvas2Dctx.arc(centerX, centerY, size, lastAngle, angle, false);
        canvas2Dctx.lineTo(centerX, centerY);
        canvas2Dctx.closePath();
        canvas2Dctx.fillStyle = segmentColors[i - 1];
        canvas2Dctx.fill();
        canvas2Dctx.stroke();
        canvas2Dctx.save();
        canvas2Dctx.translate(centerX, centerY);
        canvas2Dctx.rotate((lastAngle + angle) / 2);
        canvas2Dctx.fillStyle = contrastColor || "white";
        canvas2Dctx.font = `bold ${fontSize}px ` + fontFamily;
        canvas2Dctx.fillText(segments[i - 1], size / 2 + 20, 0);
        canvas2Dctx.restore();
        lastAngle = angle;
      }
    }

    // Draw a center circle
    canvas2Dctx.beginPath();
    canvas2Dctx.arc(centerX, centerY, 40, 0, PI2, false);
    canvas2Dctx.closePath();
    canvas2Dctx.fillStyle = primaryColor || "black";
    canvas2Dctx.lineWidth = 5;
    canvas2Dctx.strokeStyle = contrastColor || "white";
    canvas2Dctx.fill();
    canvas2Dctx.font = "bold 2em " + fontFamily;
    canvas2Dctx.fillStyle = contrastColor || "white";
    canvas2Dctx.textAlign = "center";
    // canvas2Dctx.fillText(buttonText || "Spin", centerX, centerY + 3);
    canvas2Dctx.stroke();

    // Draw outer circle
    canvas2Dctx.beginPath();
    canvas2Dctx.arc(centerX, centerY, size, 0, PI2, false);
    canvas2Dctx.closePath();
    canvas2Dctx.lineWidth = 25;
    canvas2Dctx.strokeStyle = primaryColoraround || "white";
    canvas2Dctx.stroke();

  }

  function clear() {
    canvas2Dctx?.clearRect(0, 0, 1000, 800)
  }

  return (
    <div id='wheel' className=" items-center relative">
      <canvas
        ref={canvasRef}
        id="canvas"
        width={600}
        height={600}
        className='  z-0'
       
      />
      <button onClick={() => spin()} style={{ left: centerX - 25, top: centerY - 15, pointerEvents: isFinished && isOnlyOnce ? "none" : "auto" }} className=' absolute l z-10 text-2xl text-white'>
        {buttonText ?? 'SPIN'}
        </button>
    </div>
  )
}


// export default RouletteWheel


export default RouletteWheel

