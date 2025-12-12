'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import weddingConfig from '@/config/wedding_config.json'

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || !gameStarted) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simple T-Rex style game
    let gameRunning = true
    let playerY = canvas.height - 50
    let playerVelocity = 0
    let obstacles: Array<{ x: number; width: number }> = []
    let gameSpeed = 2
    let frameCount = 0

    const jump = () => {
      if (playerY === canvas.height - 50) {
        playerVelocity = -15
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
      if (!gameRunning) return

      frameCount++
      
      // Clear canvas
      ctx.fillStyle = '#F7F7F7'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update player
      playerY += playerVelocity
      playerVelocity += 0.8 // gravity
      if (playerY >= canvas.height - 50) {
        playerY = canvas.height - 50
        playerVelocity = 0
      }

      // Draw player (simple rectangle)
      ctx.fillStyle = '#81D8D0'
      ctx.fillRect(50, playerY, 30, 30)

      // Spawn obstacles
      if (frameCount % 100 === 0) {
        obstacles.push({ x: canvas.width, width: 20 })
      }

      // Update and draw obstacles
      obstacles = obstacles.filter(obstacle => {
        obstacle.x -= gameSpeed
        
        // Draw obstacle
        ctx.fillStyle = '#000000'
        ctx.fillRect(obstacle.x, canvas.height - 50, obstacle.width, 30)

        // Check collision
        if (
          obstacle.x < 80 &&
          obstacle.x + obstacle.width > 50 &&
          playerY + 30 > canvas.height - 50
        ) {
          gameRunning = false
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
  }, [gameStarted])

  if (!gameStarted) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Link href="/" className="text-primary mb-6 inline-block hover:underline">
            ← Back to Home
          </Link>
          
          <h1 className="font-heading text-5xl mb-4">{weddingConfig.fun.game.name}</h1>
          <p className="text-xl text-accent/70 mb-8">{weddingConfig.fun.game.description}</p>
          
          <button
            onClick={() => setGameStarted(true)}
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Start Game
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
          <div className="text-right">
            <p className="font-semibold">Score: {score}</p>
            <p className="text-sm text-accent/70">Press Space or Click to Jump</p>
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full border-2 border-primary rounded-lg bg-background"
        />
      </div>
    </main>
  )
}

