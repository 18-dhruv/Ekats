"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for demonstration
const MOCK_TRANSACTIONS = [
  {
    id: 1,
    username: "john_doe",
    gameType: "CoinFlip",
    betAmount: 100,
    outcome: "win",
    timestamp: "2025-05-10T14:30:00",
  },
  {
    id: 2,
    username: "john_doe",
    gameType: "DiceRoll",
    betAmount: 50,
    outcome: "lose",
    timestamp: "2025-05-10T14:35:00",
  },
  {
    id: 3,
    username: "jane_smith",
    gameType: "HighLow",
    betAmount: 200,
    outcome: "win",
    timestamp: "2025-05-10T15:10:00",
  },
  {
    id: 4,
    username: "jane_smith",
    gameType: "CoinFlip",
    betAmount: 75,
    outcome: "lose",
    timestamp: "2025-05-10T15:20:00",
  },
  {
    id: 5,
    username: "mike_jones",
    gameType: "DiceRoll",
    betAmount: 150,
    outcome: "win",
    timestamp: "2025-05-10T16:05:00",
  },
  {
    id: 6,
    username: "john_doe",
    gameType: "HighLow",
    betAmount: 125,
    outcome: "lose",
    timestamp: "2025-05-10T16:30:00",
  },
  {
    id: 7,
    username: "mike_jones",
    gameType: "CoinFlip",
    betAmount: 300,
    outcome: "win",
    timestamp: "2025-05-10T17:15:00",
  },
  {
    id: 8,
    username: "jane_smith",
    gameType: "DiceRoll",
    betAmount: 100,
    outcome: "lose",
    timestamp: "2025-05-10T17:45:00",
  },
  {
    id: 9,
    username: "john_doe",
    gameType: "CoinFlip",
    betAmount: 200,
    outcome: "win",
    timestamp: "2025-05-10T18:20:00",
  },
  {
    id: 10,
    username: "mike_jones",
    gameType: "HighLow",
    betAmount: 250,
    outcome: "lose",
    timestamp: "2025-05-10T19:00:00",
  },
]

// Calculate user stats from transactions
const calculateUserStats = (username: string) => {
  const userTransactions = MOCK_TRANSACTIONS.filter((t) => t.username === username)

  const gameStats = userTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.gameType]) {
      acc[transaction.gameType] = {
        playCount: 0,
        totalBet: 0,
        wins: 0,
        losses: 0,
      }
    }

    acc[transaction.gameType].playCount += 1
    acc[transaction.gameType].totalBet += transaction.betAmount

    if (transaction.outcome === "win") {
      acc[transaction.gameType].wins += 1
    } else {
      acc[transaction.gameType].losses += 1
    }

    return acc
  }, {})

  return Object.entries(gameStats).map(([gameType, stats]) => ({
    gameType,
    ...stats,
  }))
}

export default function AdminPage() {
  const [searchUsername, setSearchUsername] = useState("")
  const [activeTab, setActiveTab] = useState("transactions")

  // Filter transactions based on search
  const filteredTransactions = searchUsername
    ? MOCK_TRANSACTIONS.filter((t) => t.username.toLowerCase().includes(searchUsername.toLowerCase()))
    : MOCK_TRANSACTIONS

  // Get user stats if a username is entered
  const userStats = searchUsername ? calculateUserStats(searchUsername) : []

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
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
          <h1 className="ml-4 text-2xl font-bold text-yellow-400">Admin Panel</h1>
        </div>

        <Card className="border-yellow-400/20 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-yellow-400">Game Transactions and Statistics</CardTitle>
            <CardDescription className="text-gray-300">
              View and search for user transactions and game statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by username"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    className="border-gray-600 bg-gray-700 pl-10 text-white"
                  />
                </div>
                <Button
                  variant="outline"
                  className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
                  onClick={() => setSearchUsername("")}
                >
                  Clear
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 bg-gray-700">
                <TabsTrigger
                  value="transactions"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-900"
                >
                  Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="statistics"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-900"
                >
                  User Statistics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transactions" className="mt-0">
                <div className="rounded-lg border border-gray-700">
                  {filteredTransactions.length > 0 ? (
                    <div className="max-h-[500px] overflow-y-auto">
                      <table className="w-full">
                        <thead className="border-b border-gray-700 bg-gray-900">
                          <tr>
                            <th className="p-3 text-left text-sm font-medium text-gray-300">ID</th>
                            <th className="p-3 text-left text-sm font-medium text-gray-300">Username</th>
                            <th className="p-3 text-left text-sm font-medium text-gray-300">Game Type</th>
                            <th className="p-3 text-left text-sm font-medium text-gray-300">Bet Amount</th>
                            <th className="p-3 text-left text-sm font-medium text-gray-300">Outcome</th>
                            <th className="p-3 text-left text-sm font-medium text-gray-300">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTransactions.map((transaction) => (
                            <tr key={transaction.id} className="border-b border-gray-700">
                              <td className="p-3 text-sm">{transaction.id}</td>
                              <td className="p-3 text-sm">{transaction.username}</td>
                              <td className="p-3 text-sm">{transaction.gameType}</td>
                              <td className="p-3 text-sm">{transaction.betAmount}</td>
                              <td
                                className={`p-3 text-sm font-medium ${
                                  transaction.outcome === "win" ? "text-green-400" : "text-red-400"
                                }`}
                              >
                                {transaction.outcome.toUpperCase()}
                              </td>
                              <td className="p-3 text-sm">{formatDate(transaction.timestamp)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-400">
                      No transactions found for the specified username.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="statistics" className="mt-0">
                {searchUsername ? (
                  userStats.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {userStats.map((stat, index) => (
                        <Card key={index} className="border-yellow-400/20 bg-gray-700">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-yellow-400">{stat.gameType}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <dl className="space-y-2">
                              <div className="flex justify-between">
                                <dt className="text-gray-300">Total Games:</dt>
                                <dd className="font-medium">{stat.playCount}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-gray-300">Total Bet:</dt>
                                <dd className="font-medium">{stat.totalBet} coins</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-gray-300">Wins:</dt>
                                <dd className="font-medium text-green-400">{stat.wins}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-gray-300">Losses:</dt>
                                <dd className="font-medium text-red-400">{stat.losses}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-gray-300">Win Rate:</dt>
                                <dd className="font-medium">{((stat.wins / stat.playCount) * 100).toFixed(1)}%</dd>
                              </div>
                            </dl>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-gray-700 p-6 text-center text-gray-400">
                      No statistics found for user &quot;{searchUsername}&quot;.
                    </div>
                  )
                ) : (
                  <div className="rounded-lg border border-gray-700 p-6 text-center text-gray-400">
                    Enter a username to view their game statistics.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
