"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Info, TrendingUp, Users, Award, Calendar, Database, Lock } from "lucide-react"

interface StatsData {
  totalParticipants: number
  activeParticipants: number
  successRate: number
  demographics: {
    ageGroups: { label: string; count: number; percentage: number }[]
    genders: { label: string; count: number; percentage: number }[]
  }
  participation: {
    firstTimers: number
    veterans: number
  }
  dailyCheckIns: { day: number; checkIns: number; stillIn: number }[]
  topReasons: { reason: string; count: number }[]
  currentDay: number
}

export function StatsPage() {
  // Temporarily disabled - showing coming soon message
  const STATS_COMING_SOON = true;

  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (STATS_COMING_SOON) {
      setLoading(false)
      return
    }

    // Simulate API call
    const fetchStats = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockStats: StatsData = {
        totalParticipants: 12847,
        activeParticipants: 8234,
        successRate: 64.1,
        demographics: {
          ageGroups: [
            { label: "18-24", count: 4523, percentage: 35.2 },
            { label: "25-34", count: 5891, percentage: 45.9 },
            { label: "35-44", count: 1876, percentage: 14.6 },
            { label: "45+", count: 557, percentage: 4.3 },
          ],
          genders: [
            { label: "Male", count: 11234, percentage: 87.5 },
            { label: "Female", count: 1234, percentage: 9.6 },
            { label: "Other", count: 379, percentage: 2.9 },
          ],
        },
        participation: {
          firstTimers: 7821,
          veterans: 5026,
        },
        dailyCheckIns: Array.from({ length: 15 }, (_, i) => ({
          day: i + 1,
          checkIns: Math.floor(12847 - i * 300 - Math.random() * 200),
          stillIn: Math.floor(12847 - i * 400 - Math.random() * 300),
        })),
        topReasons: [
          { reason: "Self-discipline", count: 4234 },
          { reason: "Health benefits", count: 3456 },
          { reason: "Challenge myself", count: 2891 },
          { reason: "Community support", count: 1567 },
          { reason: "Personal growth", count: 899 },
        ],
        currentDay: 15,
      }

      setStats(mockStats)
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading stats...</p>
        </div>
      </div>
    )
  }

  // Show coming soon message
  if (STATS_COMING_SOON) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 relative overflow-hidden">
        {/* Blurred background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        </div>

        <div className="container mx-auto px-4 py-16 max-w-4xl relative z-10">
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
            {/* Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
              <div className="relative bg-card/50 backdrop-blur-xl border-2 rounded-3xl p-8 shadow-2xl">
                <Database className="w-20 h-20 text-primary mx-auto" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Statistics Coming Soon
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl">
                We're currently collecting data from participants
              </p>
            </div>

            {/* Info Card */}
            <Card className="bg-card/50 backdrop-blur-xl border-2 shadow-xl max-w-2xl w-full">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold mb-1">Real-time Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        Track participation rates, success metrics, and community trends as they happen
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold mb-1">Community Demographics</h3>
                      <p className="text-sm text-muted-foreground">
                        See how different age groups and demographics are participating in the challenge
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold mb-1">Daily Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        Monitor daily check-in rates and see how the community is progressing through November
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bottom text */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Statistics will be available once we have enough data
              </p>
              <p className="text-xs text-muted-foreground/70">
                Check back soon to see how the community is doing!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance mb-4">NNN Statistics</h1>

          {/* Alert about daily updates */}
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Statistics are updated daily at 12:00 AM EST with the latest participant data.
            </AlertDescription>
          </Alert>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 transition-colors hover:bg-accent/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Participants</h3>
            </div>
            <p className="text-3xl font-bold">{stats.totalParticipants.toLocaleString()}</p>
          </Card>

          <Card className="p-6 transition-colors hover:bg-accent/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Still Active</h3>
            </div>
            <p className="text-3xl font-bold">{stats.activeParticipants.toLocaleString()}</p>
          </Card>

          <Card className="p-6 transition-colors hover:bg-accent/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Success Rate</h3>
            </div>
            <p className="text-3xl font-bold">{stats.successRate}%</p>
          </Card>

          <Card className="p-6 transition-colors hover:bg-accent/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Calendar className="h-5 w-5 text-orange-500" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Current Day</h3>
            </div>
            <p className="text-3xl font-bold">Day {stats.currentDay}</p>
          </Card>
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Age Groups */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Age Distribution</h2>
            <div className="space-y-4">
              {stats.demographics.ageGroups.map((group) => (
                <div key={group.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{group.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {group.count.toLocaleString()} ({group.percentage}%)
                    </span>
                  </div>
                  <Progress value={group.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* Gender Distribution */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Gender Distribution</h2>
            <div className="space-y-4">
              {stats.demographics.genders.map((gender) => (
                <div key={gender.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{gender.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {gender.count.toLocaleString()} ({gender.percentage}%)
                    </span>
                  </div>
                  <Progress value={gender.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Participation Type */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Participation Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">First-Time Participants</span>
                <span className="text-sm text-muted-foreground">
                  {stats.participation.firstTimers.toLocaleString()} (
                  {((stats.participation.firstTimers / stats.totalParticipants) * 100).toFixed(1)}%)
                </span>
              </div>
              <Progress value={(stats.participation.firstTimers / stats.totalParticipants) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Returning Veterans</span>
                <span className="text-sm text-muted-foreground">
                  {stats.participation.veterans.toLocaleString()} (
                  {((stats.participation.veterans / stats.totalParticipants) * 100).toFixed(1)}%)
                </span>
              </div>
              <Progress value={(stats.participation.veterans / stats.totalParticipants) * 100} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Daily Trend */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Daily Participation Trend</h2>
          <div className="space-y-3">
            {stats.dailyCheckIns.slice(0, 10).map((day) => (
              <div key={day.day} className="flex items-center gap-4">
                <span className="text-sm font-medium w-16">Day {day.day}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Still In</span>
                    <span className="text-xs text-muted-foreground">{day.stillIn.toLocaleString()}</span>
                  </div>
                  <Progress value={(day.stillIn / stats.totalParticipants) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Reasons */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Top Reasons for Participating</h2>
          <div className="space-y-4">
            {stats.topReasons.map((reason, index) => (
              <div key={reason.reason} className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{reason.reason}</span>
                    <span className="text-sm text-muted-foreground">{reason.count.toLocaleString()}</span>
                  </div>
                  <Progress value={(reason.count / stats.topReasons[0].count) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
