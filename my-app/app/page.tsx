import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BatsAnimation } from "@/components/bats-animation"
import { MistEffect } from "@/components/mist-effect"

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[url('/castle-background.png')] bg-cover bg-center text-white">
      <MistEffect />
      <BatsAnimation />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="font-creepster text-4xl text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] md:text-6xl">
            Ekats&apos;s Casino
          </h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-purple-700 text-purple-300 hover:bg-purple-900 hover:text-purple-100"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-red-700 text-white hover:bg-red-800">Sign Up</Button>
            </Link>
          </div>
        </header>

        <div className="mb-16 text-center">
          <h2 className="font-creepster mb-4 text-5xl text-white drop-shadow-xl]">
            Welcome to the Night&apos;s Playground
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-purple-100">
            Try your luck with our spooktacular games and win big! The Count awaits your presence...
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-purple-700 bg-midnight-blue/80 text-white backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-creepster text-2xl text-red-400">Coin Flip of Fate</CardTitle>
              <CardDescription className="text-purple-200">
                Heads or tails? The Count&apos;s coin decides your fortune!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img src="/coin-flip-game.png" alt="Coin Flip Game" className="h-48 w-full rounded-md object-cover" />
            </CardContent>
            <CardFooter>
              <Link href="/games/coin-flip" className="w-full">
                <Button className="w-full bg-red-700 text-white hover:bg-red-800">
                  Play Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-purple-700 bg-midnight-blue/80 text-white backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-creepster text-2xl text-red-400">Dice of Doom</CardTitle>
              <CardDescription className="text-purple-200">
                Roll the cursed dice and challenge the Count to a game of chance!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img src="/dice-game.png" alt="Dice Game" className="h-48 w-full rounded-md object-cover" />
            </CardContent>
            <CardFooter>
              <Link href="/games/dice-roll" className="w-full">
                <Button className="w-full bg-red-700 text-white hover:bg-red-800">
                  Play Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-purple-700 bg-midnight-blue/80 text-white backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-creepster text-2xl text-red-400">Transylvanian Slots</CardTitle>
              <CardDescription className="text-purple-200">
                Spin the reels of mystery and win supernatural treasures!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img src="/slots-game.png" alt="Slots Game" className="h-48 w-full rounded-md object-cover" />
            </CardContent>
            <CardFooter>
              <Link href="/games/slots" className="w-full">
                <Button className="w-full bg-red-700 text-white hover:bg-red-800">
                  Play Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      <footer className="relative z-10 mt-16 bg-black/50 py-6 text-center text-purple-200 backdrop-blur-sm">
        <p className="font-creepster">© 2025 Count&apos;s Casino. All rights reserved for eternity.</p>
      </footer>
    </div>
  )
}
