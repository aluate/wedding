'use client'

import { useEffect, useRef, useState } from 'react'
import weddingConfig from '@/config/wedding_config.json'

export default function GameBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || !gameStarted || isPaused) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simple T-Rex style game - compact version for banner
    let gameRunning = true
    let playerY = canvas.height - 30
    let playerVelocity = 0
    let obstacles: Array<{ x: number; width: number }> = []
    let gameSpeed = 2
    let frameCount = 0

    const jump = () => {
      if (playerY === canvas.height - 30) {
        playerVelocity = -12
      }
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault()
        jump()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    canvas.addEventListener('click', jump)

    const gameLoop = () => {
      if (!gameRunning || isPaused) return

      frameCount++
      
      // Clear canvas
      ctx.fillStyle = '#F7F7F7'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update player
      playerY += playerVelocity
      playerVelocity += 0.7 // gravity
      if (playerY >= canvas.height - 30) {
        playerY = canvas.height - 30
        playerVelocity = 0
      }

      // Draw player (simple rectangle)
      ctx.fillStyle = '#81D8D0'
      ctx.fillRect(30, playerY, 20, 20)

      // Spawn obstacles
      if (frameCount % 120 === 0) {
        obstacles.push({ x: canvas.width, width: 15 })
      }

      // Update and draw obstacles
      obstacles = obstacles.filter(obstacle => {
        obstacle.x -= gameSpeed
        
        // Draw obstacle
        ctx.fillStyle = '#000000'
        ctx.fillRect(obstacle.x, canvas.height - 30, obstacle.width, 20)

        // Check collision
        if (
          obstacle.x < 60 &&
          obstacle.x + obstacle.width > 30 &&
          playerY + 20 > canvas.height - 30
        ) {
          gameRunning = false
          setGameStarted(false)
          setScore(0)
          return false
        }

        // Remove if off screen
        return obstacle.x + obstacle.width > 0
      })

      // Update score
      setScore(frameCount)

      // Increase speed
      if (frameCount % 500 === 0) {
        gameSpeed += 0.5
      }

      requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      gameRunning = false
    }
  }, [gameStarted, isPaused])

  if (!weddingConfig.fun.game.enabled) {
    return null
  }

  return (
    <div className="border-t border-accent/10 bg-background">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Game Title */}
          <div className="flex-shrink-0">
            <p className="font-heading text-sm font-semibold text-accent">
              {weddingConfig.fun.game.name}
            </p>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex items-center gap-3">
            {!gameStarted ? (
              <div className="flex-1 flex items-center justify-between">
                <p className="text-xs text-accent/60">
                  {weddingConfig.fun.game.description}
                </p>
                <button
                  onClick={() => setGameStarted(true)}
                  className="px-4 py-1.5 bg-primary text-white text-xs rounded font-semibold hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Start
                </button>
              </div>
            ) : (
              <>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={80}
                  className="flex-1 border border-primary/30 rounded bg-background cursor-pointer"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                />
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs font-semibold text-accent">Score: {score}</p>
                  <p className="text-xs text-accent/60">Space/Click to jump</p>
                  <button
                    onClick={() => {
                      setGameStarted(false)
                      setScore(0)
                      setIsPaused(false)
                    }}
                    className="mt-1 text-xs text-accent/60 hover:text-accent transition"
                  >
                    Reset
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
