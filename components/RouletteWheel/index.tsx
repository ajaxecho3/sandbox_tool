import { useEffect, useRef, useState } from "react"
import RandomGeneratorHexColor from "../../utils/ColorGenerator"


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

const RouletteWheel = (
  {
    segments ,
    upDuration ,
    downDuration ,
    winningSegment,
    onFinished,
    primaryColor,
    primaryColoraround,
    fontFamily = "proxima-nova",
    contrastColor,
    buttonText,
    size,
    isOnlyOnce = true,
    segmentColors,
    fontSize,
    onIsFinished
  }: RouletteWheelProps) => {
  
  const [isFinished, setFinished] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const timerDelay = segments.length
  const upTime = segments.length * upDuration
  const downTime = segments.length * downDuration
  let canvasctx: CanvasRenderingContext2D | null | undefined  = null
  let isStarted = false
  let timerHandle = 0
  let spinStart = 0
  let maxSpeed = Math.PI / segments.length
  let frames = 0
  let currentSegment = ""
  let angleCurrent = 0
  let angleDelta = 0
  const centerX = 300
  const centerY = 300


  const SPIN_FREQUENCY = 10;
  const PI2 = Math.PI * 2;
  const UP_TIME = upDuration | 1000;
  const DOWN_TIME = downDuration | 500;
  const SPIN_UP_PROGRESS = 0.8;
  const SPEED_MODIFIER_1 = 1.2;
  const SPEED_MODIFIER_2 = 2;


  useEffect(() => {
    
    wheelInit()
    console.log(segments)
    return () => {
      window.scrollTo(0, 1)
  
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments])


  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle(canvasctx);
  };

  const drawNeedle = (ctx: CanvasRenderingContext2D | null | undefined) => {
    if (ctx) {
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
  };
  const initCanvas = () => {
    if(canvasRef.current){
      canvasRef.current.addEventListener('click', spin2, false)
      canvasctx = canvasRef.current?.getContext('2d')
    }
  }
  const spin2 = () => {
    isStarted = true;
    if (!timerHandle) {
      spinStart = new Date().getTime();
      maxSpeed = Math.PI / segments.length;
      frames = 0;
      timerHandle = window.setInterval(onTimerTick2, SPIN_FREQUENCY);
    }
  };

  const onTimerTick2 = () => {
    
    frames++;
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    let speedModifier = 1;

    if (duration >= UP_TIME) {
      progress = duration >= DOWN_TIME ? 1 : duration / DOWN_TIME;
      const segmentProgress = progress * Math.PI / 2;
      const baseSpeed = maxSpeed * Math.sin(segmentProgress);

      if (winningSegment) {
        if (currentSegment === winningSegment && frames > segments.length) {
          speedModifier = SPEED_MODIFIER_2;
        }
      } else if (progress >= SPIN_UP_PROGRESS) {
        speedModifier = SPEED_MODIFIER_1;
      } else if (progress >= 0.98) {
        speedModifier = SPEED_MODIFIER_2;
      }

      angleDelta = baseSpeed / speedModifier;
      finished = progress >= 1;
    } else {
      progress = duration / UP_TIME;
      angleDelta = maxSpeed * Math.sin(progress * Math.PI / 2);
    }

    angleCurrent += angleDelta;
    angleCurrent = angleCurrent % (Math.PI * 2)
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
    drawWheel();
    drawNeedle(canvasctx);
  }

  const drawSegment = (key: number, lastAngle: number, angle: number) => {
    const ctx = canvasctx;
    const value = segments[key];
    if (ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, size, lastAngle, angle, false);
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
      ctx.fillStyle = segmentColors[key];
      ctx.fill();
      ctx.stroke();
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((lastAngle + angle) / 2);
      ctx.fillStyle = contrastColor || "white";
      ctx.font = `bold ${fontSize}px ` + fontFamily;
      ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
      ctx.restore();
    }
  };

  const drawWheel = () => {
    let lastAngle = angleCurrent;
    const len = segments.length

    const PI2 = Math.PI * 2
    if (canvasctx) {
      canvasctx.lineWidth = 1;
      canvasctx.strokeStyle = primaryColor || "black";
      canvasctx.textBaseline = "middle";
      canvasctx.textAlign = "center";
      canvasctx.font = "1em " + fontFamily;
      for (let i = 1; i <= len; i++) {
        const angle = PI2 * (i / len) + angleCurrent;
        drawSegment(i - 1, lastAngle, angle);
        lastAngle = angle;
      }

      // Draw a center circle
      canvasctx.beginPath();
      canvasctx.arc(centerX, centerY, 40, 0, PI2, false);
      canvasctx.closePath();
      canvasctx.fillStyle = primaryColor || "black";
      canvasctx.lineWidth = 5;
      canvasctx.strokeStyle = contrastColor || "white";
      canvasctx.fill();
      canvasctx.font = "bold 2em " + fontFamily;
      canvasctx.fillStyle = contrastColor || "white";
      canvasctx.textAlign = "center";
      canvasctx.fillText(buttonText || "Spin", centerX, centerY + 3);
      canvasctx.stroke();

      // Draw outer circle
      canvasctx.beginPath();
      canvasctx.arc(centerX, centerY, size, 0, PI2, false);
      canvasctx.closePath();
      canvasctx.lineWidth = 25;
      canvasctx.strokeStyle = primaryColoraround || "white";
      canvasctx.stroke();
    }
    
  }

  const clear = () => {
    canvasctx?.clearRect(0, 0, 1000, 800)
  }
  

  return (
    <div id='wheel' className=" items-center">
      <canvas
        ref={canvasRef}
        id="canvas"
        width={600}
        height={600}
        style={{
          pointerEvents: isFinished && isOnlyOnce ? "none" : "auto"
        }}
      />
    </div>
  )
}

export default RouletteWheel