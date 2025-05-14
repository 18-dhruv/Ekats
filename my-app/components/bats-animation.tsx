"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function BatsAnimation() {
  const [bats, setBats] = useState<Array<{ id: number; delay: number; duration: number; path: string }>>([])

  useEffect(() => {
    // Create random bats on component mount
    const newBats = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 7,
      path: Math.random() > 0.5 ? "M" : "W", // Different flight paths
    }))
    setBats(newBats)

    // Periodically add new bats
    const interval = setInterval(() => {
      setBats((prev) => [
        ...prev,
        {
          id: Date.now(),
          delay: 0,
          duration: 8 + Math.random() * 7,
          path: Math.random() > 0.5 ? "M" : "W",
        },
      ])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      <AnimatePresence>
        {bats.map((bat) => (
          <motion.div
            key={bat.id}
            className="absolute"
            initial={{
              x: -100,
              y: 100 + Math.random() * 300,
              scale: 0.5 + Math.random() * 0.5,
              opacity: 0,
            }}
            animate={{
              x: window.innerWidth + 100,
              y: [
                100 + Math.random() * 300,
                50 + Math.random() * 200,
                150 + Math.random() * 300,
                100 + Math.random() * 200,
              ],
              opacity: [0, 0.7, 0.7, 0],
              scale: 0.5 + Math.random() * 0.5,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: bat.duration,
              delay: bat.delay,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1],
            }}
            onAnimationComplete={() => {
              // Remove bat after animation completes
              setBats((prev) => prev.filter((b) => b.id !== bat.id))
            }}
          >
            <img src="/bat.png" alt="Bat" className="h-12 w-12" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
