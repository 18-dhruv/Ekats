"use client"

import { motion, AnimatePresence } from "framer-motion"

type DraculaHostProps = {
  message: string
  expression: "welcome" | "curious" | "happy" | "sad" | "snarky" | "farewell"
}

export function DraculaHost({ message, expression }: DraculaHostProps) {
  // Map expressions to image paths
  const expressionImages = {
    welcome: "/dracula-welcome.png",
    curious: "/dracula-curious.png",
    happy: "/dracula-happy.png",
    sad: "/dracula-sad.png",
    snarky: "/dracula-snarky.png",
    farewell: "/dracula-farewell.png",
  }

  return (
    <div className="flex items-end gap-4">
      <motion.div
        className="relative h-[200px] w-[150px] flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={expression}
            src={expressionImages[expression]}
            alt={`Dracula ${expression}`}
            className="h-full w-full object-contain"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="relative flex-1 rounded-2xl rounded-bl-none bg-purple-900/80 p-4 text-white backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute -bottom-2 -left-2 h-4 w-4 rotate-45 bg-purple-900/80"></div>
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            className="font-creepster text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
