"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface EyeShape {
  id: string
  title: string
  description: string
  image: string
  correctMapping: "oeil-de-poupee" | "naturel" | "oeil-de-biche" | "oeil-ouvert" | "oeil-de-chaton"
  explanation: string
}

interface DropResult {
  correct: boolean
  explanation: string
}

const eyeShapes: EyeShape[] = [
  {
    id: "droopy-eyes",
    title: "Droopy Eyes",
    description: "Upper eyelid that droops towards the outer corner",
    image: "/images/yeux-tombants.png",
    correctMapping: "oeil-de-biche",
    explanation: "Correct! The doe eye with increasing lengths towards the outer corner corrects the drooping effect.",
  },
  {
    id: "round-eyes",
    title: "Round Eyes",
    description: "Naturally rounded eye shape",
    image: "/images/yeux-ronds.png",
    correctMapping: "naturel",
    explanation: "Exactly! The natural mapping enhances the beautiful round shape without altering it.",
  },
  {
    id: "deep-set-eyes",
    title: "Deep-Set Eyes",
    description: "Eyes that appear set back in the socket",
    image: "/images/yeux-enfonces.png",
    correctMapping: "oeil-ouvert",
    explanation: "Perfect! The open eye with its emphasis at the center makes deep-set eyes stand out.",
  },
  {
    id: "wide-set-eyes",
    title: "Wide-Set Eyes",
    description: "Large distance between the two eyes",
    image: "/images/yeux-ecartes.png",
    correctMapping: "oeil-de-poupee",
    explanation: "Correct! The doll eye concentrates attention at the center and visually brings the eyes closer together.",
  },
  {
    id: "close-set-eyes",
    title: "Close-Set Eyes",
    description: "Small distance between the two eyes",
    image: "/images/yeux-rapproches.png",
    correctMapping: "oeil-de-biche",
    explanation: "Exactly! The doe eye stretches the gaze towards the outside and visually separates the eyes.",
  },
  {
    id: "small-eyes",
    title: "Small Eyes",
    description: "Small-sized eyes that lack intensity",
    image: "/images/yeux-petits.png",
    correctMapping: "oeil-de-chaton",
    explanation: "Perfect! The kitten eye gives a subtle lift that delicately enlarges small eyes.",
  },
]

const mappingStyles = [
  {
    id: "oeil-de-poupee",
    title: "Doll Eye",
    description: "Long lashes in the center, innocent gaze effect",
    image: "/images/oeil-de-poupee.png",
  },
  {
    id: "naturel",
    title: "Natural",
    description: "Uniform distribution, enhances natural shape",
    image: "/images/naturel.png",
  },
  {
    id: "oeil-de-biche",
    title: "Doe Eye",
    description: "Increasing lengths towards outer corner, elongated effect",
    image: "/images/oeil-de-biche.png",
  },
  {
    id: "oeil-ouvert",
    title: "Open Eye",
    description: "Emphasis at center, enlarges small eyes",
    image: "/images/oeil-ouvert.png",
  },
  {
    id: "oeil-de-chaton",
    title: "Kitten Eye",
    description: "Soft version of doe eye, subtle lift",
    image: "/images/oeil-de-chaton.png",
  },
]

export default function EyelashMappingGame() {
  const [score, setScore] = useState(0)
  const [completedShapes, setCompletedShapes] = useState<Set<string>>(new Set())
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<DropResult | null>(null)
  const [showGuide, setShowGuide] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null)

  const handleDragStart = (shapeId: string) => {
    setDraggedItem(shapeId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, mappingId: string) => {
    e.preventDefault()

    if (!draggedItem) return

    const eyeShape = eyeShapes.find((s) => s.id === draggedItem)
    if (!eyeShape) return

    const isCorrect = eyeShape.correctMapping === mappingId

    if (isCorrect && !completedShapes.has(draggedItem)) {
      setScore((prev) => prev + 1)
      setCompletedShapes((prev) => new Set([...prev, draggedItem]))
    }

    setFeedback({
      correct: isCorrect,
      explanation: isCorrect
        ? eyeShape.explanation
        : `Error! ${eyeShape.title} requires ${mappingStyles.find((m) => m.id === eyeShape.correctMapping)?.title}.`,
    })

    setDraggedItem(null)

    // Clear feedback after 3 seconds
    setTimeout(() => setFeedback(null), 3000)
  }

  const resetGame = () => {
    setScore(0)
    setCompletedShapes(new Set())
    setFeedback(null)
    setDraggedItem(null)
    setZoomedImage(null)
  }

  const isGameComplete = completedShapes.size === eyeShapes.length

  const handleImageClick = (imageSrc: string, imageAlt: string) => {
    setZoomedImage({ src: imageSrc, alt: imageAlt })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-900 mb-2">
            Eyelash Mapping - Choose the Right Technique
          </h1>
          <p className="text-purple-700 mb-4">Drag and drop the appropriate technique according to the eye morphology</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Badge className="text-lg px-4 py-2 bg-purple-200 text-purple-800 hover:bg-purple-200">
              Score: {score}/6
            </Badge>

            <div className="flex gap-2">
              <Dialog open={showGuide} onOpenChange={setShowGuide}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">GUIDE</Button>
                </DialogTrigger>
                <DialogContent className="w-96 h-96 p-6 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl">
                  <DialogHeader className="flex-shrink-0 mb-4">
                    <DialogTitle className="text-purple-900 text-lg text-center">Eyelash Mapping Guide</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto space-y-3 text-xs">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2 text-sm">Doll Eye</h3>
                      <div className="space-y-1 text-purple-800">
                        <p className="font-medium text-xs">Long center, short corners = enlarges small eyes</p>
                        <p className="text-xs text-purple-600">Rule: 12mm center, 9mm corners</p>
                      </div>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2 text-sm">Natural</h3>
                      <div className="space-y-1 text-purple-800">
                        <p className="font-medium text-xs">Uniform lengths = follows natural shape</p>
                        <p className="text-xs text-purple-600">Rule: same curl everywhere</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2 text-sm">Doe Eye</h3>
                      <div className="space-y-1 text-purple-800">
                        <p className="font-medium text-xs">Short → long towards outside = corrects droopy eyes</p>
                        <p className="text-xs text-purple-600">Rule: 9mm inner, 14mm outer</p>
                      </div>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2 text-sm">Open Eye</h3>
                      <div className="space-y-1 text-purple-800">
                        <p className="font-medium text-xs">Peak at center = opens deep-set eyes</p>
                        <p className="text-xs text-purple-600">Rule: 12mm middle, 10mm corners</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2 text-sm">Kitten Eye</h3>
                      <div className="space-y-1 text-purple-800">
                        <p className="font-medium text-xs">Soft doe version = subtle lift</p>
                        <p className="text-xs text-purple-600">Rule: less pronounced progression</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg">
                      <p className="text-xs font-medium text-purple-900">
                        <strong>Memo:</strong> Center = enlarge / Outside = elongate / Uniform = natural
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={resetGame}
                variant="outline"
                className="border-pink-300 text-pink-600 hover:bg-pink-50 bg-transparent"
              >
                Restart
              </Button>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded-lg shadow-lg max-w-md mx-auto text-center ${
              feedback.correct
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            <p className="font-medium">{feedback.explanation}</p>
          </div>
        )}

        {/* Game Complete */}
        {isGameComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">🎉 Congratulations!</h2>
              <p className="text-purple-700 mb-4">You completed the game with a perfect score of 6/6!</p>
              <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700">
                Play Again
              </Button>
            </div>
          </div>
        )}

        {/* Zoom Modal */}
        <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-2">
            <DialogHeader>
              <DialogTitle className="text-center text-purple-900">{zoomedImage?.alt}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center">
              {zoomedImage && (
                <div className="relative w-full max-w-2xl aspect-square">
                  <Image
                    src={zoomedImage.src || "/placeholder.svg"}
                    alt={zoomedImage.alt}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Game Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Eye Shapes */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-purple-900 mb-4">Eye Morphologies</h2>
            <p className="text-purple-600 mb-6 text-sm">
              Drag each eye morphology towards the mapping technique you think is most appropriate
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eyeShapes.map((shape) => (
                <Card
                  key={shape.id}
                  className={`cursor-move transition-all duration-200 hover:shadow-lg ${
                    completedShapes.has(shape.id) ? "bg-green-50 border-green-200" : "bg-white hover:bg-purple-50"
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(shape.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="relative w-40 h-40 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(shape.image || "/placeholder.svg", shape.title)}
                      >
                        <Image
                          src={shape.image || "/placeholder.svg"}
                          alt={shape.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-purple-900 mb-1">{shape.title}</h3>
                        <p className="text-sm text-purple-600">{shape.description}</p>
                        {completedShapes.has(shape.id) && (
                          <Badge className="mt-2 bg-green-100 text-green-800">✓ Completed</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Drop Zones */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-purple-900">Mapping Styles</h2>
            <p className="text-purple-600 mb-4 text-sm">Click on images to enlarge and see details</p>

            {mappingStyles.map((style) => (
              <div
                key={style.id}
                className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center transition-colors hover:border-purple-400 hover:bg-purple-50 min-h-[100px] flex flex-col justify-center"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, style.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="relative w-16 h-16 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleImageClick(style.image || "/placeholder.svg", style.title)}
                  >
                    <Image
                      src={style.image || "/placeholder.svg"}
                      alt={style.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-purple-900 mb-1">{style.title}</h3>
                    <p className="text-xs text-purple-600">{style.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}