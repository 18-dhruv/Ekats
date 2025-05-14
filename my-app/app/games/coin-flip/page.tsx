"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { DraculaHost } from "@/components/dracula-host"
import { BatsAnimation } from "@/components/bats-animation"
import { MistEffect } from "@/components/mist-effect"
import { CoinFlip } from "@/components/coin-flip"

type DraculaState = {
  message: string
  expression: "welcome" | "curious" | "happy" | "sad" | "snarky" | "farewell"
}

export default function CoinFlipGame() {
  const [balance, setBalance] = useState(1000)
  const [betAmount, setBetAmount] = useState("")
  const [selectedOption, setSelectedOption] = useState<"heads" | "tails" | null>(null)
  const [result, setResult] = useState<"heads" | "tails" | null>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null)
  const [history, setHistory] = useState<
    Array<{
      bet: number
      choice: string
      result: string
      outcome: string
      timestamp: string
    }>
  >([])
  const [draculaState, setDraculaState] = useState<DraculaState>({
    message: "Mwahaha! Welcome to the Coin Flip of Fate, mortal... I mean, friend!",
    expression: "welcome",
  })
  const { toast } = useToast()

  useEffect(() => {
    // Initial welcome message
    setDraculaState({
      message: "Mwahaha! Welcome to the Coin Flip of Fate, mortal... I mean, friend!",
      expression: "welcome",
    })
  }, [])

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d+$/.test(value)) {
      setBetAmount(value)
      setDraculaState({
        message: "Place your bet, and let's see if the night favors you!",
        expression: "curious",
      })
    }
  }

  const handleOptionSelect = (option: "heads" | "tails") => {
    setSelectedOption(option)
    setDraculaState({
      message: `Ah, you choose ${option}! A ${option === "heads" ? "wise" : "brave"} choice, perhaps?`,
      expression: "curious",
    })
  }

  const handleFlip = () => {
    const bet = Number.parseInt(betAmount)

    if (!betAmount || bet <= 0) {
      setDraculaState({
        message: "Hmm… even a bat could type better. Try a valid bet amount, yes?",
        expression: "snarky",
      })
      toast({
        title: "Invalid bet",
        description: "Please enter a valid bet amount.",
        variant: "destructive",
      })
      return
    }

    if (bet > balance) {
      setDraculaState({
        message: "Oh my! Your pockets are emptier than my blood bank on a Monday!",
        expression: "snarky",
      })
      toast({
        title: "Insufficient balance",
        description: "Your bet amount exceeds your current balance.",
        variant: "destructive",
      })
      return
    }

    if (!selectedOption) {
      setDraculaState({
        message: "You must choose heads or tails! Even I make decisions faster, and I'm 500 years old!",
        expression: "snarky",
      })
      toast({
        title: "No selection",
        description: "Please select heads or tails.",
        variant: "destructive",
      })
      return
    }

    setIsFlipping(true)
    setDraculaState({
      message: "The coin of destiny is in the air! What will fate decide?",
      expression: "curious",
    })

    // Simulate coin flip animation
    setTimeout(() => {
      const flipResult = Math.random() < 0.5 ? "heads" : "tails"
      setResult(flipResult)

      const userWon = selectedOption === flipResult
      setGameResult(userWon ? "win" : "lose")

      // Update balance
      const newBalance = userWon ? balance + bet : balance - bet
      setBalance(newBalance)

      // Add to history
      const newHistoryItem = {
        bet,
        choice: selectedOption,
        result: flipResult,
        outcome: userWon ? "win" : "lose",
        timestamp: new Date().toLocaleString(),
      }
      setHistory([newHistoryItem, ...history])

      setIsFlipping(false)

      // Update Dracula's state based on result
      if (userWon) {
        setDraculaState({
          message: "Bravo! The fangs of fortune bite sweetly tonight!",
          expression: "happy",
        })
      } else {
        setDraculaState({
          message: "Oh no! Even garlic wouldn't have helped you this time! Try harder!",
          expression: "sad",
        })
      }

      // Show toast notification
      toast({
        title: userWon ? "You won!" : "You lost!",
        description: userWon
          ? `Congratulations! You won ${bet} coins.`
          : `Better luck next time. You lost ${bet} coins.`,
        variant: userWon ? "default" : "destructive",
      })
    }, 2500)
  }

  const resetGame = () => {
    setBetAmount("")
    setSelectedOption(null)
    setResult(null)
    setGameResult(null)
    setDraculaState({
      message: "Another round? The night is still young... even if I am not!",
      expression: "welcome",
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[url('/castle-interior.png')] bg-cover bg-center text-white">
      <MistEffect />
      <BatsAnimation />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link href="/">
            <Button variant="ghost" className="text-purple-200 hover:bg-purple-900/50 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Castle
            </Button>
          </Link>
          <div className="ml-auto rounded-full bg-red-700 px-4 py-2 text-white">Balance: {balance} coins</div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Card className="border-purple-700 bg-midnight-blue/80 text-white backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-creepster text-2xl text-red-400">Coin Flip of Fate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bet-amount" className="text-purple-200">
                    Bet Amount
                  </Label>
                  <Input
                    id="bet-amount"
                    type="text"
                    placeholder="Enter bet amount"
                    value={betAmount}
                    onChange={handleBetChange}
                    className="border-purple-700 bg-purple-900/50 text-white placeholder:text-purple-300"
                    disabled={isFlipping}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-200">Select Your Prediction</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={selectedOption === "heads" ? "default" : "outline"}
                      className={
                        selectedOption === "heads"
                          ? "bg-red-700 text-white hover:bg-red-800"
                          : "border-red-700/50 text-red-400 hover:bg-red-900/20"
                      }
                      onClick={() => handleOptionSelect("heads")}
                      disabled={isFlipping}
                    >
                      Heads
                    </Button>
                    <Button
                      type="button"
                      variant={selectedOption === "tails" ? "default" : "outline"}
                      className={
                        selectedOption === "tails"
                          ? "bg-red-700 text-white hover:bg-red-800"
                          : "border-red-700/50 text-red-400 hover:bg-red-900/20"
                      }
                      onClick={() => handleOptionSelect("tails")}
                      disabled={isFlipping}
                    >
                      Tails
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center py-4">
                  <CoinFlip isFlipping={isFlipping} result={result} />
                </div>

                <Button
                  className="w-full bg-red-700 text-white hover:bg-red-800"
                  onClick={handleFlip}
                  disabled={isFlipping}
                >
                  {isFlipping ? "Flipping..." : "Flip Coin"}
                </Button>

                {result && (
                  <div className="mt-6 rounded-lg bg-purple-900/70 p-4 text-center">
                    <h3 className="mb-2 text-lg font-semibold text-purple-200">Result</h3>
                    <p className="mb-2 text-xl capitalize text-white">{result}</p>
                    <p className={`text-lg font-bold ${gameResult === "win" ? "text-green-400" : "text-red-400"}`}>
                      You {gameResult}!
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 border-red-700/50 text-red-400 hover:bg-red-900/20"
                      onClick={resetGame}
                    >
                      Play Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-8">
            <DraculaHost message={draculaState.message} expression={draculaState.expression} />

            <Card className="border-purple-700 bg-midnight-blue/80 text-white backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-creepster text-xl text-red-400">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[300px] overflow-y-auto rounded-lg border border-purple-700">
                  {history.length > 0 ? (
                    <table className="w-full">
                      <thead className="border-b border-purple-700 bg-purple-900/70">
                        <tr>
                          <th className="p-3 text-left text-sm font-medium text-purple-200">Time</th>
                          <th className="p-3 text-left text-sm font-medium text-purple-200">Bet</th>
                          <th className="p-3 text-left text-sm font-medium text-purple-200">Choice</th>
                          <th className="p-3 text-left text-sm font-medium text-purple-200">Result</th>
                          <th className="p-3 text-left text-sm font-medium text-purple-200">Outcome</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((item, index) => (
                          <tr key={index} className="border-b border-purple-700/50">
                            <td className="p-3 text-sm">{item.timestamp}</td>
                            <td className="p-3 text-sm">{item.bet}</td>
                            <td className="p-3 text-sm capitalize">{item.choice}</td>
                            <td className="p-3 text-sm capitalize">{item.result}</td>
                            <td
                              className={`p-3 text-sm font-medium ${
                                item.outcome === "win" ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {item.outcome.toUpperCase()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-6 text-center text-purple-300">
                      No transaction history yet. Start playing to see your results here.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
