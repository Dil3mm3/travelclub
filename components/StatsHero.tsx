'use client'

import { useEffect, useRef, useState } from 'react'

interface Stat {
  value: number
  suffix: string
  label: string
}

function useCountUp(target: number, duration: number = 1800, start: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // Easing: ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])

  return count
}

function StatCard({ value, suffix, label, delay, started }: Stat & { delay: number; started: boolean }) {
  const [active, setActive] = useState(false)
  useEffect(() => {
    if (!started) return
    const t = setTimeout(() => setActive(true), delay)
    return () => clearTimeout(t)
  }, [started, delay])

  const count = useCountUp(value, 1600, active)

  return (
    <div style={{
      background: 'rgba(20,32,10,0.75)',
      border: '1px solid rgba(168,196,104,0.25)',
      borderRadius: 14,
      padding: '16px 18px',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        fontFamily: "'Fraunces', serif",
        fontSize: 32,
        fontWeight: 700,
        color: '#A8C468',
        lineHeight: 1,
        marginBottom: 4,
      }}>
        {count >= 100 ? `${Math.floor(count / 100) * 100}` : count}{suffix}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.5px' }}>
        {label}
      </div>
    </div>
  )
}

interface Props {
  activeGroups: number
  destinations: number
  totalMembers: number
  tips: number
}

export default function StatsHero({ activeGroups, destinations, totalMembers, tips }: Props) {
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const stats: (Stat & { delay: number })[] = [
    { value: activeGroups, suffix: '', label: 'gruppi attivi', delay: 0 },
    { value: destinations, suffix: '', label: 'paesi coperti', delay: 150 },
    { value: totalMembers, suffix: '+', label: 'membri', delay: 300 },
    { value: tips, suffix: '', label: 'consigli', delay: 450 },
  ]

  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {stats.map(s => (
        <StatCard key={s.label} {...s} started={started} />
      ))}
    </div>
  )
}
