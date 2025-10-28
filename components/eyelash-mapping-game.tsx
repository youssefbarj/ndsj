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
    title: "العيون الهابطة",
    description: "الجفن العلوي الهابط نحو الزاوية الخارجية للعين",
    image: "/images/yeux-tombants.png",
    correctMapping: "oeil-de-biche",
    explanation: "صحيحة! تقنية الغزال ترفع زوايا العين الهابطة بشكل احترافي.",
  },
  {
    id: "round-eyes",
    title: "العيون المستديرة",
    description: "شكل العين المستدير الطبيعي",
    image: "/images/yeux-ronds.png",
    correctMapping: "naturel",
    explanation: "ممتازة! التقنية الطبيعية تحافظ على جمال العين المستديرة.",
  },
  {
    id: "deep-set-eyes",
    title: "العيون الغائرة",
    description: "العيون الغائرة داخل تجويف الحجاج",
    image: "/images/yeux-enfonces.png",
    correctMapping: "oeil-ouvert",
    explanation: "مثالية! تقنية العين المفتوحة تبرز جمال العيون الغائرة.",
  },
  {
    id: "wide-set-eyes",
    title: "العيون البعيدة عن بعضها",
    description: "مسافة واسعة بين العينين",
    image: "/images/yeux-ecartes.png",
    correctMapping: "oeil-de-poupee",
    explanation: "صحيحة! تقنية الدمية تضيف كثافة في الوسط لتقريب المسافة بين العينين.",
  },
  {
    id: "close-set-eyes",
    title: "العيون القريبة من بعضها",
    description: "مسافة قصيرة بين العينين",
    image: "/images/yeux-rapproches.png",
    correctMapping: "oeil-de-biche",
    explanation: "ممتازة! تقنية الغزال تمدد العينين لتوسيع المسافة بينهما.",
  },
  {
    id: "small-eyes",
    title: "العيون الصغيرة",
    description: "العيون الصغيرة التي تحتاج إلى تكبير",
    image: "/images/yeux-petits.png",
    correctMapping: "oeil-de-chaton",
    explanation: "مثالية! تقنية الهرة تمنح حجم أكبر للعيون الصغيرة بشكل طبيعي.",
  },
]

const mappingStyles = [
  {
    id: "oeil-de-poupee",
    title: "تقنية الدمية",
    description: "رموش طويلة في المنتصف مع أطراف قصيرة لنظرة بريئة",
    image: "/images/oeil-de-poupee.png",
  },
  {
    id: "naturel",
    title: "التقنية الطبيعية",
    description: "توزيع متساوٍ للحفاظ على شكل العين الطبيعي",
    image: "/images/naturel.png",
  },
  {
    id: "oeil-de-biche",
    title: "تقنية الغزال",
    description: "أطوال متزايدة نحو الزاوية الخارجية لرفع العين",
    image: "/images/oeil-de-biche.png",
  },
  {
    id: "oeil-ouvert",
    title: "تقنية العين المفتوحة",
    description: "تركيز على المنتصف لإبراز العيون الصغيرة",
    image: "/images/oeil-ouvert.png",
  },
  {
    id: "oeil-de-chaton",
    title: "تقنية الهرة",
    description: "نسخة مخففة من تقنية الغزال لرفع طبيعي",
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
        : `إجابة خاطئة! ${eyeShape.title} تتطلب تقنية ${mappingStyles.find((m) => m.id === eyeShape.correctMapping)?.title}.`,
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
            تصميم الرموش - اختر التقنية المناسبة
          </h1>
          <p className="text-purple-700 mb-4">اسحب وأفلت التقنية المناسبة حسب شكل العين</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Badge className="text-lg px-4 py-2 bg-purple-200 text-purple-800 hover:bg-purple-200">
              النقاط: {score}/6
            </Badge>

            <div className="flex gap-2">
              <Dialog open={showGuide} onOpenChange={setShowGuide}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">GUIDE</Button>
                </DialogTrigger>
                <DialogContent className="w-96 h-96 p-6 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl">
                  <DialogHeader className="flex-shrink-0 mb-4">
                    <DialogTitle className="text-purple-900 text-lg text-center">دليل تصميم الرموش</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto space-y-3 text-xs">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2 text-sm">تقنية الدمية</h3>
                      <div className="space-y-1 text-purple-800">
                        <p className="font-medium text-xs">وسط طويل وأطراف قصيرة = تكبير العيون الصغيرة</p>
                        <p className="text-xs text-purple-600">القياس: 12ملم في الوسط، 9ملم في الأطراف</p>
                      </div>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2 text-sm">التقنية الطبيعية</h3>
                      <div className="space-y-1 text-purple-800">
                        <p className="font-medium text-xs">أطوال متساوية = الحفاظ على الشكل الطبيعي</p>
                        <p className="text-xs text-purple-600">القياس: نفس الطول في كل الأماكن</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2 text-sm">تقنية الغزال</h3>
                      <div className="space-y-1 text-purple-800">
                        <p className="font-medium text-xs">قصير نحو الداخل وطويل نحو الخارج = رفع العيون الهابطة</p>
                        <p className="text-xs text-purple-600">القياس: 9ملم في الداخل، 14ملم في الخارج</p>
                      </div>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2 text-sm">تقنية العين المفتوحة</h3>
                      <div className="space-y-1 text-purple-800">
                        <p className="font-medium text-xs">طول في الوسط = إبراز العيون الغائرة</p>
                        <p className="text-xs text-purple-600">القياس: 12ملم في المنتصف، 10ملم في الأطراف</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2 text-sm">تقنية الهرة</h3>
                      <div className="space-y-1 text-purple-800">
                        <p className="font-medium text-xs">نسخة مخففة من الغزال = رفع طبيعي خفيف</p>
                        <p className="text-xs text-purple-600">القياس: تدرج أقل حدة</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg">
                      <p className="text-xs font-medium text-purple-900">
                        <strong>ملخص سريع:</strong> الوسط = تكبير / الخارج = رفع / الموحد = طبيعي
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
                إعادة اللعب
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
              <h2 className="text-2xl font-bold text-purple-900 mb-4">🎉 أحسنت!</h2>
              <p className="text-purple-700 mb-4">لقد أكملت اللعبة بنقاط كاملة 6/6!</p>
              <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700">
                العب مرة أخرى
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
            <h2 className="text-xl font-semibold text-purple-900 mb-4">أنواع العيون</h2>
            <p className="text-purple-600 mb-6 text-sm">
              اسحب نوع العين نحو التقنية المناسبة لها
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
                          <Badge className="mt-2 bg-green-100 text-green-800">✓ تم</Badge>
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
            <h2 className="text-xl font-semibold text-purple-900">التقنيات</h2>
            <p className="text-purple-600 mb-4 text-sm">انقر على الصور لتكبيرها ورؤية التفاصيل</p>

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
