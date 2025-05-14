"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function MistEffect() {
  const [mistLayers, setMistLayers] = useState<Array<{ id: number; delay: number; duration: number; y: number }>>([])

  useEffect(() => {
    // Create initial mist layers
    const initialLayers = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      delay: i * 5,
      duration: 25 + Math.random() * 15,
      y: 70 + i * 10,
    }))
    setMistLayers(initialLayers)

    // Periodically add new mist layers
    const interval = setInterval(() => {
      setMistLayers((prev) => [
        ...prev,
        {
          id: Date.now(),
          delay: 0,
          duration: 25 + Math.random() * 15,
          y: 70 + Math.floor(Math.random() * 3) * 10,
        },
      ])
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <AnimatePresence>
        {mistLayers.map((layer) => (
          <motion.div
            key={layer.id}
            className="absolute left-0 right-0"
            style={{ bottom: `${layer.y}%` }}
            initial={{ opacity: 0, x: "-100%" }}
            animate={{
              opacity: [0, 0.2, 0.2, 0],
              x: "100%",
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: layer.duration,
              delay: layer.delay,
              ease: "linear",
              times: [0, 0.2, 0.8, 1],
            }}
            onAnimationComplete={() => {
              // Remove mist layer after animation completes
              setMistLayers((prev) => prev.filter((l) => l.id !== layer.id))
            }}
          >
            <div className="h-20 w-full bg-gradient-to-r from-purple-900/0 via-purple-900/20 to-purple-900/0 blur-xl"></div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
