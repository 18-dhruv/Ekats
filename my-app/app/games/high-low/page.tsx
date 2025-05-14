"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowDown, ArrowLeft, ArrowUp, Target } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function HighLowGame() {
  const PREDEFINED_NUMBER = 50
  const RANGE = 100

  const [balance, setBalance] = useState(1000) // Mock initial balance
  const [betAmount, setBetAmount] = useState("")
  const [selectedOption, setSelectedOption] = useState<"high" | "low" | null>(null)
  const [result, setResult] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null)
  const [history, setHistory] = useState<
    Array<{
      bet: number
      choice: string
      result: number
      outcome: string
      timestamp: string
    }>
  >([])
  const { toast } = useToast()

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d+$/.test(value)) {
      setBetAmount(value)
    }
  }

  const handlePlay = () => {
    const bet = Number.parseInt(betAmount)

    if (!betAmount || bet <= 0) {
      toast({
        title: "Invalid bet",
        description: "Please enter a valid bet amount.",
        variant: "destructive",
      })
      return
    }

    if (bet > balance) {
      toast({
        title: "Insufficient balance",
        description: "Your bet amount exceeds your current balance.",
        variant: "destructive",
      })
      return
    }

    if (!selectedOption) {
      toast({
        title: "No selection",
        description: "Please select high or low.",
        variant: "destructive",
      })
      return
    }

    setIsPlaying(true)

    // Simulate game animation
    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * (RANGE + 1))
      setResult(randomNumber)

      const isCorrect =
        (selectedOption === "high" && randomNumber > PREDEFINED_NUMBER) ||
        (selectedOption === "low" && randomNumber < PREDEFINED_NUMBER)

      setGameResult(isCorrect ? "win" : "lose")

      // Update balance
      const newBalance = isCorrect ? balance + bet : balance - bet
      setBalance(newBalance)

      // Add to history
      const newHistoryItem = {
        bet,
        choice: selectedOption,
        result: randomNumber,
        outcome: isCorrect ? "win" : "lose",
        timestamp: new Date().toLocaleString(),
      }
      setHistory([newHistoryItem, ...history])

      setIsPlaying(false)

      // Show toast notification
      toast({
        title: isCorrect ? "You won!" : "You lost!",
        description: isCorrect
          ? `Congratulations! You won ${bet} coins.`
          : `Better luck next time. You lost ${bet} coins.`,
        variant: isCorrect ? "default" : "destructive",
      })
    }, 1500)
  }

  const resetGame = () => {
    setBetAmount("")
    setSelectedOption(null)
    setResult(null)
    setGameResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link href="/">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="ml-auto rounded-full bg-yellow-400 px-4 py-2 text-gray-900">Balance: {balance} coins</div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-yellow-400/20 bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Target className="h-6 w-6" />
                High-Low Game
              </CardTitle>
              <CardDescription className="text-gray-300">
                Predict whether the random number will be higher or lower than {PREDEFINED_NUMBER}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bet-amount" className="text-gray-200">
                  Bet Amount
                </Label>
                <Input
                  id="bet-amount"
                  type="text"
                  placeholder="Enter bet amount"
                  value={betAmount}
                  onChange={handleBetChange}
                  className="border-gray-600 bg-gray-700 text-white"
                  disabled={isPlaying}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200">Select Your Prediction</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={selectedOption === "high" ? "default" : "outline"}
                    className={
                      selectedOption === "high"
                        ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                        : "border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
                    }
                    onClick={() => setSelectedOption("high")}
                    disabled={isPlaying}
                  >
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Higher than {PREDEFINED_NUMBER}
                  </Button>
                  <Button
                    type="button"
                    variant={selectedOption === "low" ? "default" : "outline"}
                    className={
                      selectedOption === "low"
                        ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                        : "border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
                    }
                    onClick={() => setSelectedOption("low")}
                    disabled={isPlaying}
                  >
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Lower than {PREDEFINED_NUMBER}
                  </Button>
                </div>
              </div>

              <Button
                className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                onClick={handlePlay}
                disabled={isPlaying}
              >
                {isPlaying ? "Generating number..." : "Play"}
              </Button>

              {result !== null && (
                <div className="mt-6 rounded-lg bg-gray-700 p-4 text-center">
                  <h3 className="mb-2 text-lg font-semibold">Result</h3>
                  <div className="mb-4 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-yellow-400 text-4xl font-bold text-gray-900">
                      {result}
                    </div>
                  </div>
                  <p className="mb-2 text-lg">
                    {result > PREDEFINED_NUMBER ? "Higher" : "Lower"} than {PREDEFINED_NUMBER}
                  </p>
                  <p className={`text-lg font-bold ${gameResult === "win" ? "text-green-400" : "text-red-400"}`}>
                    You {gameResult}!
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
                    onClick={resetGame}
                  >
                    Play Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-yellow-400/20 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-yellow-400">Transaction History</CardTitle>
              <CardDescription className="text-gray-300">Your recent high-low games</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[400px] overflow-y-auto rounded-lg border border-gray-700">
                {history.length > 0 ? (
                  <table className="w-full">
                    <thead className="border-b border-gray-700 bg-gray-900">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium text-gray-300">Time</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-300">Bet</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-300">Choice</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-300">Result</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-300">Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="p-3 text-sm">{item.timestamp}</td>
                          <td className="p-3 text-sm">{item.bet}</td>
                          <td className="p-3 text-sm capitalize">{item.choice}</td>
                          <td className="p-3 text-sm">{item.result}</td>
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
                  <div className="p-6 text-center text-gray-400">
                    No transaction history yet. Start playing to see your results here.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
