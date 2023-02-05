import React, { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

type WheelProps = {
  activeSegments: Array<string>
  segColors: Array<string>
  primaryColor?: string
  fontFamily?: string
  contrastColor?: string
  buttonText?: string
  size?: number
  primaryColoraround?: string
  upDuration?: number
  downDuration?: number
  winningSegment: string
  onFinished: (value: string) => void
}

const WheelSpinner = ({
  activeSegments,
  primaryColor,
  fontFamily = "proxima-nova",
  contrastColor,
  buttonText,
  size = 290,
  primaryColoraround,
  segColors,
  upDuration = 1000,
  downDuration = 100,
  winningSegment,
  onFinished
}: WheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContext = canvasRef.current?.getContext('2d')
  const [segments, setSegments] = useState<Array<string>>([])
  const [isFinished, setFinished] = useState(false);
  const centerX = 300;
  const centerY = 300;

  let angleCurrent = 0
  let currentSegment = "";
  let isStarted = false;
  let timerHandle = 0;
  let spinStart = 0;
  let maxSpeed = Math.PI / segments.length
  let frames = 0;
  let angleDelta = 0;
  const timerDelay = segments.length;
  const upTime = segments.length * upDuration;
  const downTime = segments.length * downDuration;
  const drawSegment = (key: number, lastAngle: number, angle: number, ctx: CanvasRenderingContext2D) => {

    const value = segments[key]
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = segColors[key];
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = contrastColor || "white";
    ctx.font = "bold 1em " + fontFamily;
    ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
    ctx.restore();
  }

  const drawWheel = (ctx: CanvasRenderingContext2D) => {

    let lastAngle = angleCurrent
    const len = segments.length
    const PI2 = Math.PI * 2;

    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor || 'black'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = '1em' + fontFamily
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle, ctx)
      lastAngle = angle;
    }

    //draw a center circle

    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, PI2, false)
    ctx.closePath();
    ctx.fillStyle = primaryColor || 'black'
    ctx.lineWidth = 5
    ctx.strokeStyle = contrastColor || 'white'
    ctx.fill()
    ctx.font = 'bold 2em' + fontFamily
    ctx.fillStyle = contrastColor || "white"
    ctx.textAlign = "center"
    ctx.fillText(buttonText || "Spin", centerX, centerY + 3);
    ctx.stroke();

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();
    ctx.lineWidth = 25;
    ctx.strokeStyle = primaryColoraround || "white";
    ctx.stroke();
  }

  const drawNeedle = (ctx: CanvasRenderingContext2D) => {

    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastColor || "white";
    ctx.fillStyle = contrastColor || "white";
    ctx.beginPath();
    ctx.moveTo(centerX + 10, centerY - 40);
    ctx.lineTo(centerX - 10, centerY - 40);
    ctx.lineTo(centerX, centerY - 60);
    ctx.closePath();
    ctx.fill();
    const change = angleCurrent + Math.PI / 2;
    let i = segments.length - Math.floor((change / (Math.PI * 2)) * segments.length) - 1;
    if (i < 0) i = i + segments.length;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "transparent";
    ctx.font = "bold 1.5em " + fontFamily;
    currentSegment = segments[i];
    isStarted &&
      ctx.fillText(currentSegment, centerX + 10, centerY + size + 50);
  }
  const wheelDraw = () => {
    clear();
    if (canvasContext) {
      drawWheel(canvasContext);
      drawNeedle(canvasContext);
    }
  }

  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  }

  const clear = () => {
    canvasContext?.clearRect(0, 0, 1000, 800)
  }
  const spin = () => {
    isStarted = true;
    // onRotate();
    if (timerHandle === 0) {
      spinStart = new Date().getTime();
      // maxSpeed = Math.PI / ((segments.length*2) + Math.random())
      maxSpeed = Math.PI / segments.length;
      frames = 0;
      timerHandle = Number(setInterval(onTimerTick, timerDelay));
    }
  }
  const onTimerTick = () => {
    frames++;
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      if (winningSegment) {
        if (currentSegment === winningSegment && frames > segments.length) {
          progress = duration / upTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
          progress = 1;
        } else {
          progress = duration / downTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        }
      } else {
        progress = duration / downTime;
        if (progress >= 0.8) {
          angleDelta =
            (maxSpeed / 1.2) * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        } else if (progress >= 0.98) {
          angleDelta =
            (maxSpeed / 2) * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        } else
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      }
      if (progress >= 1) finished = true;
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
    if (finished) {
      setFinished(true);
      onFinished(currentSegment);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  };

  const draw = () => {
    clear();
    if (canvasContext) {
      drawWheel(canvasContext);
      drawNeedle(canvasContext);
    }
  };
  const initCanvas = () => {
    canvasRef.current?.addEventListener("click", spin, false)

  }

  useEffect(() => {
    wheelInit()
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);

  }, [])

  useEffect(() => {


    setSegments(activeSegments)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSegments])

  return (
    <div id="wheel" className='flex items-center justify-center'>
      <canvas width="600" height="600" id="canvas" ref={canvasRef} />
    </div>
  )
}

export default WheelSpinner