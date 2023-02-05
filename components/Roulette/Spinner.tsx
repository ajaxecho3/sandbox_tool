import React, { ReactNode } from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

type SpinnerProps<TSegments> = {
  segments: Array<string>;
  segColors: Array<string>;
  winningSegment: ReactNode;
  onFinished: (value: string) => void;
  onRotate?: () => void;
  onRotateFinish?: () => void;
  primaryColor: string;
  primaryColorAround?: string;
  contrastColor: string;
  buttonText?: ReactNode;
  isOnlyOnce: boolean;
  size: number;
  upDuration: number;
  downDuration: number;
  fontFamily?: string;
  width?: number;
  height?: number;
  classname:string;


}

function Spinner <T extends SpinnerProps<ReactNode> >(
  {
    segments,
    segColors,
    winningSegment,
    onFinished,
    onRotate,
    onRotateFinish,
    primaryColor,
    primaryColorAround,
    contrastColor,
    buttonText,
    isOnlyOnce = true,
    size = 290,
    upDuration = 1000,
    downDuration = 100,
    fontFamily = "proxima-nova",
    width = 100,
    height = 100,
    classname
  }: T)
  {

  const [isFinished, setIsFinished] = useState<boolean>(false);
  let canvasRef = useRef<HTMLCanvasElement>()
  let currentSegment:string = ""
  let isStarted:boolean = false
  let timerHandle: number | any = 0
  const timerDelay = segments.length;
  let angleCurrent = 0;
  let angleDelta = 0;
  let canvasContext = useRef<CanvasRenderingContext2D | undefined>();
  let maxSpeed = Math.PI / segments.length;
  const upTime = segments.length * upDuration;
  const downTime = segments.length * downDuration;
  let spinStart = 0;
  let frames = 0;
  const centerX = 300;
  const centerY = 300;

  useEffect(() => {
    wheelInit()
    setTimeout(() => {
      window.scrollTo(0, 1)
    }, 0)
  
  }, [])

  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  }

  const initCanvas = () => {
    let canvas = document.getElementById('canvas')
    let canvas2 = canvasRef

    // canvas2.current?.addEventListener('click', spin, false)
    canvasContext.current = canvas2.current?.getContext('2d')!
  }

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  }

  const spin = () => {
    isStarted = true;
    if(timerHandle === 0){
      spinStart = new Date().getTime();
      maxSpeed = Math.PI / segments.length;
      frames++;
      timerHandle = setInterval(onTimerTick, timerDelay)
    }
  }

  const onTimerTick = () => {
    frames++;
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if(duration < upTime){
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    }else {
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
      setIsFinished(true);
      onFinished(currentSegment);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }


  }

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  }

  const drawWheel = () => {
    const ctx = canvasContext.current;
    let lastAngle = angleCurrent;
    const len = segments.length;
    const PI2 = Math.PI * 2;

    if(ctx){
      ctx.lineWidth = 1;
      ctx.strokeStyle = primaryColor || 'black'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.font = '1em' + fontFamily

      for (let i = 1 ; i <= len; i++){
        const angle = PI2 * (i / len) + angleCurrent
        drawSegment(i - 1, lastAngle, angle)
        lastAngle = angle
      }
    }

  }

  const drawSegment = (key:number, lastAngle: number, angle: number) => {
    const ctx = canvasContext.current
    const value = segments[key];
    
    if(ctx){
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
      ctx.fillStyle = contrastColor || 'white';
      ctx.font = "bold 1em" + fontFamily;
      ctx.fillText(value.substring(0, 1), size / 2 + 20,  0);
      ctx.restore();
    }
    
  }

  const drawNeedle = () => {
    const ctx = canvasContext.current;
    
    if(ctx){
      ctx.lineWidth = 1;
      ctx.strokeStyle = contrastColor || 'white';
      ctx.fillStyle = contrastColor || 'white';
      ctx.beginPath();
      ctx.moveTo(centerX + 10, centerY - 40);
      ctx.lineTo(centerX - 10, centerY - 40);
      ctx.lineTo(centerX, centerY - 60);
      ctx.closePath();
      ctx.fill();

      const change = angleCurrent + Math.PI / 2
      let i = segments.length - Math.floor((change / (Math.PI * 2)) * segments.length) - 1;

      if(i < 0) i = i + segments.length;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'transparent';
      ctx.font = 'bold 1.5em ' + fontFamily;
      currentSegment = segments[i]
      isStarted && ctx.fillText(currentSegment, centerX + 10, centerY + size  +  50) 
    }
    
  }



  const clear = () => {
    const ctx = canvasContext.current;
    if(ctx){
      ctx.clearRect(0, 0, 1000, 800)
    }
  }


  return (
    <div id="wheel">
      <canvas
        ref={() => canvasRef}
        id="canvas"
        onClick={() => spin()}
        width={width || "600"}
        height={height || "600"}
        style={{
          pointerEvents: isFinished && isOnlyOnce ? "none" : "auto"
        }}
      />
    </div>
  )
}

export default Spinner

