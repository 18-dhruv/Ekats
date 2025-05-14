"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Dice1Icon as Dice } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

export default function DiceRollGame() {
  const [balance, setBalance] = useState(1000) // Mock initial balance
  const [betAmount, setBetAmount] = useState("")
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null)
  const [result, setResult] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null)
  const [history, setHistory] = useState<
    Array<{
      bet: number
      choice: number
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

  const handleRoll = () => {
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

    if (!selectedNumber) {
      toast({
        title: "No selection",
        description: "Please select a number from 1 to 6.",
        variant: "destructive",
      })
      return
    }

    setIsRolling(true)

    // Simulate dice roll animation
    setTimeout(() => {
      const diceResult = Math.floor(Math.random() * 6) + 1
      setResult(diceResult)

      const userWon = Number.parseInt(selectedNumber) === diceResult
      setGameResult(userWon ? "win" : "lose")

      // Update balance (5x multiplier for wins as per the Java code)
      const winnings = bet * 5
      const newBalance = userWon ? balance + winnings : balance - bet
      setBalance(newBalance)

      // Add to history
      const newHistoryItem = {
        bet,
        choice: Number.parseInt(selectedNumber),
        result: diceResult,
        outcome: userWon ? "win" : "lose",
        timestamp: new Date().toLocaleString(),
      }
      setHistory([newHistoryItem, ...history])

      setIsRolling(false)

      // Show toast notification
      toast({
        title: userWon ? "You won!" : "You lost!",
        description: userWon
          ? `Congratulations! You won ${winnings} coins.`
          : `Better luck next time. You lost ${bet} coins.`,
        variant: userWon ? "default" : "destructive",
      })
    }, 1500)
  }

  const resetGame = () => {
    setBetAmount("")
    setSelectedNumber(null)
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
                <Dice className="h-6 w-6" />
                Dice Roll Game
              </CardTitle>
              <CardDescription className="text-gray-300">
                Guess the dice number (1-6) and win 5x your bet!
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
                  disabled={isRolling}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200">Select Your Number</Label>
                <RadioGroup
                  value={selectedNumber || ""}
                  onValueChange={setSelectedNumber}
                  className="grid grid-cols-3 gap-2"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div
                      key={num}
                      className={`flex h-16 cursor-pointer items-center justify-center rounded-lg border border-gray-600 transition-colors ${
                        selectedNumber === num.toString()
                          ? "border-yellow-400 bg-yellow-400/20"
                          : "hover:border-gray-500"
                      }`}
                    >
                      <RadioGroupItem
                        value={num.toString()}
                        id={`num-${num}`}
                        className="sr-only"
                        disabled={isRolling}
                      />
                      <Label
                        htmlFor={`num-${num}`}
                        className="flex h-full w-full cursor-pointer items-center justify-center text-2xl font-bold"
                      >
                        {num}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button
                className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                onClick={handleRoll}
                disabled={isRolling}
              >
                {isRolling ? "Rolling..." : "Roll Dice"}
              </Button>

              {result !== null && (
                <div className="mt-6 rounded-lg bg-gray-700 p-4 text-center">
                  <h3 className="mb-2 text-lg font-semibold">Result</h3>
                  <div className="mb-4 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-yellow-400 text-4xl font-bold text-gray-900">
                      {result}
                    </div>
                  </div>
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
              <CardDescription className="text-gray-300">Your recent dice roll games</CardDescription>
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
                          <td className="p-3 text-sm">{item.choice}</td>
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
