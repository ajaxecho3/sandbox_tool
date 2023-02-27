/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react'

type RouletteWheelProps = {
  buttonText: string
  contrastColor: string
  downDuration: number
  fontFamily?: string
  fontSize: number
  isOnlyOnce: boolean
  onFinished: (value: string) => void
  onIsFinished?: (value: boolean) => void
  primaryColor: string
  primaryColoraround: string
  segmentColors: string[]
  segments: string[]
  size: number
  upDuration: number
  winningSegment: string
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({
  buttonText,
  contrastColor = 'white',
  downDuration = 500,
  fontFamily = 'proxima-nova',
  fontSize = 1.5,
  isOnlyOnce = true,
  onFinished,
  onIsFinished,
  primaryColor,
  primaryColoraround,
  segmentColors,
  segments,
  size,
  upDuration = 1000,
  winningSegment,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isFinished, setFinished] = useState<boolean>(false)
  const [canvas2Dctx, setCanvas2Dctx] = useState<CanvasRenderingContext2D | null>(null)
  const [angleCurrent, setAngleCurrent] = useState(0)
  const angleDelta = useRef(0)
  const currentSegment = useRef('')
  const timerHandle = useRef(0)
  const maxSpeed = useRef(0)
  const frames = useRef(0)
  const isStarted = useRef(false)

  const TICK_INTERVAL = 10
  const PI2 = Math.PI * 2
  const centerX = 300
  const centerY = 300
  const SPIN_UP_PROGRESS = 0.8
  const SPEED_MODIFIER_1 = 1.2
  const SPEED_MODIFIER_2 = 2

  useEffect(() => {
    setCanvas2Dctx(canvasRef.current?.getContext('2d') ?? null)
    setAngleCurrent(0)
    maxSpeed.current = Math.PI / segments.length
  }, [])

  const startSpin = useCallback(() => {
    if (!canvas2Dctx) return
    if (isStarted.current) return

    isStarted.current = true
    setFinished(false)
    currentSegment.current = ''
    frames.current = 0

    const randomSpinCount = Math.floor(Math.random() * 3 + 4) * segments.length
    const targetAngle = PI2 * randomSpinCount + (Math.PI * segments.indexOf(winningSegment)) / (segments.length / 2)

    const minSpeed = PI2 / segments.length / downDuration * SPEED_MODIFIER_1
    maxSpeed.current = PI2 / segments.length / upDuration * SPEED_MODIFIER_2
    angleDelta.current = (maxSpeed.current - minSpeed) / (SPIN_UP_PROGRESS / TICK_INTERVAL)

    spin(minSpeed, targetAngle)
  }, [canvas2Dctx, segments, winningSegment])



  const draw = useCallback(() => {
    if (!canvas2Dctx) return
    const outsideRadius = size - 20
    const textRadius = size - 70
    const insideRadius = size - 100

    canvas2Dctx.clearRect(0, 0, 600, 600)

    canvas2Dctx.strokeStyle = primaryColoraround
    canvas2Dctx.lineWidth = 10
    canvas2Dctx.font = `${fontSize}em ${fontFamily}`

    segments.forEach((segment, index) => {
      const angle = PI2 * (index / segments.length) + angleCurrent
      const segmentColor = segmentColors[index] ?? '#333'

      canvas2Dctx.fillStyle = segmentColor
      canvas2Dctx.beginPath()
      canvas2Dctx.arc(centerX, centerY, outsideRadius, angle, angle + PI2 / segments.length)
      canvas2Dctx.arc(centerX, centerY, insideRadius, angle + PI2 / segments.length, angle, true)
      canvas2Dctx.stroke()
      canvas2Dctx.fill()

      canvas2Dctx.save()
      canvas2Dctx.fillStyle = contrastColor
      canvas2Dctx.translate(
        centerX + Math.cos(angle + PI2 / segments.length / 2) * textRadius,
        centerY + Math.sin(angle + PI2 / segments.length / 2) * textRadius
      )
      canvas2Dctx.rotate(angle + PI2 / segments.length / 2 + Math.PI / 2)
      canvas2Dctx.fillText(segment, -canvas2Dctx.measureText(segment).width / 2, 0)
      canvas2Dctx.restore()
    })
  }, [
    angleCurrent,
    canvas2Dctx,
    contrastColor,
    fontFamily,
    fontSize,
    primaryColoraround,
    segmentColors,
    segments,
    size,
  ])

  const spin = useCallback((speed: number, targetAngle: number) => {
    if (!canvas2Dctx) return
    clearTimeout(timerHandle.current)
    frames.current++
    setAngleCurrent((angleCurrent) => {
      const nextAngle = angleCurrent + speed

      if (nextAngle >= targetAngle) {
        finishSpin(targetAngle)
        return nextAngle - PI2
      }

      if (frames.current < SPIN_UP_PROGRESS / TICK_INTERVAL) {
        speed += angleDelta.current
      } else if (isOnlyOnce) {
        if (currentSegment.current === winningSegment) {
          finishSpin(targetAngle)
          return nextAngle - PI2
        }
      } else {
        speed -= angleDelta.current
        if (speed < maxSpeed.current) {
          speed = maxSpeed.current
        }
      }

      const currentSegmentIndex = Math.floor(((nextAngle + Math.PI / segments.length) % PI2) / (PI2 / segments.length))
      currentSegment.current = segments[currentSegmentIndex]

      draw()
      timerHandle.current = window.setTimeout(() => spin(speed, targetAngle), TICK_INTERVAL)
      return nextAngle
    })
  }, [canvas2Dctx, draw, isOnlyOnce, segments, winningSegment])
  const finishSpin = useCallback((targetAngle: number) => {
    setFinished(true)
    isStarted.current = false
    const winningSegmentIndex = Math.floor(((targetAngle + Math.PI / segments.length) % PI2) / (PI2 / segments.length))
    const winningSegment = segments[winningSegmentIndex]
    onFinished(winningSegment)

    if (onIsFinished) {
      onIsFinished(true)
    }
  }, [onFinished, onIsFinished, segments])

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={600} style={{ width: ` ${size}px`, height: `${size}px` }} />
      <button onClick={startSpin} disabled={isFinished}>
        {buttonText}
      </button>
    </div>
  )
}

export default RouletteWheel

