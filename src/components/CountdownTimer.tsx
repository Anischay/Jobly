'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaClock } from 'react-icons/fa'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date('2025-04-07T00:00:00')
      const now = new Date()
      const difference = +launchDate - +now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        setTimeLeft({ days, hours, minutes, seconds })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const TimeUnit = ({ value, label, blink = false }: { value: number; label: string; blink?: boolean }) => (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-400/20 flex items-center justify-center mb-2 relative group hover:border-purple-400/40 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-blue-500/5 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-colors rounded-xl" />
        <motion.span 
          key={value}
          animate={blink ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
          transition={blink ? { 
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          } : undefined}
          className="relative text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          {value.toString().padStart(2, '0')}
        </motion.span>
      </div>
      <span className="text-sm font-medium text-purple-200/60">{label}</span>
    </div>
  )

  return (
    <div className="w-full max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center px-6 py-2 rounded-full border border-purple-400/30 bg-purple-500/10 text-purple-300 mb-12"
      >
        <FaClock className="mr-2 text-purple-400" />
        Time Until Launch
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-12 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
      >
        Launching April 7th, 2025
      </motion.h2>
      
      <div className="flex justify-center items-center gap-8">
        <TimeUnit value={timeLeft.days} label="Days" />
        <div className="text-4xl font-bold text-purple-400/60 mb-8">:</div>
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <div className="text-4xl font-bold text-purple-400/60 mb-8">:</div>
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <div className="text-4xl font-bold text-purple-400/60 mb-8">:</div>
        <TimeUnit value={timeLeft.seconds} label="Seconds" blink={true} />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 space-y-4"
      >
        <p className="text-xl text-purple-200/80">
          Get ready for a revolutionary job matching experience
        </p>
        <p className="text-purple-200/60">
          Join our waitlist to be among the first to experience the future of recruitment
        </p>
      </motion.div>
    </div>
  )
} 