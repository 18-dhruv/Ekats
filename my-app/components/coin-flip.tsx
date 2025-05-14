"use client"

import { motion, AnimatePresence } from "framer-motion"

type CoinFlipProps = {
  isFlipping: boolean
  result: "heads" | "tails" | null
}

export function CoinFlip({ isFlipping, result }: CoinFlipProps) {
  return (
    <div className="relative h-32 w-32">
      <AnimatePresence>
        {isFlipping ? (
          <motion.div
            key="flipping"
            className="absolute left-0 top-0 h-full w-full"
            initial={{ rotateY: 0 }}
            animate={{
              rotateY: 1800,
              rotateX: 1800,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
            }}
          >
            <div className="relative h-full w-full">
              <img
                src="/coin-heads.png"
                alt="Coin Heads"
                className="absolute left-0 top-0 h-full w-full rounded-full object-contain"
                style={{ backfaceVisibility: "hidden" }}
              />
              <img
                src="/coin-tails.png"
                alt="Coin Tails"
                className="absolute left-0 top-0 h-full w-full rounded-full object-contain"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              />
            </div>
          </motion.div>
        ) : result ? (
          <motion.div
            key="result"
            className="h-full w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={result === "heads" ? "/coin-heads.png" : "/coin-tails.png"}
              alt={`Coin ${result}`}
              className="h-full w-full rounded-full object-contain drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]"
            />
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img src="/coin-idle.png" alt="Coin" className="h-full w-full rounded-full object-contain opacity-70" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
