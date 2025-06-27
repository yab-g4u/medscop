"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight, ArrowLeft, Shield, Brain, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface OnboardingData {
  firstName: string
  lastName: string
  jobTitle: string
  experience: string
  region: string
  primaryConcerns: string[]
  goals: string[]
  teamSize: string
  budget: string
  previousExperience: string
  specificNeeds: string
}

const roleQuestions = {
  government: {
    icon: Shield,
    color: "from-blue-500 to-cyan-500",
    questions: [
      {
        id: "experience",
        label: "Years in Public Health Policy",
        type: "select",
        options: ["0-2 years", "3-5 years", "6-10 years", "10+ years"],
      },
      {
        id: "region",
        label: "Primary Region of Responsibility",
        type: "select",
        options: ["West Africa", "East Africa", "Central Africa", "Southern Africa", "Multi-Regional"],
      },
      {
        id: "primaryConcerns",
        label: "Primary Health Concerns",
        type: "multiselect",
        options: [
          "Epidemic Preparedness",
          "Healthcare Infrastructure",
          "Cross-Border Coordination",
          "Funding Allocation",
          "Emergency Response",
        ],
      },
      {
        id: "goals",
        label: "Key Objectives",
        type: "multiselect",
        options: [
          "Reduce Response Time",
          "Improve Coordination",
          "Enhance Transparency",
          "Optimize Resource Allocation",
          "Strengthen Partnerships",
        ],
      },
      {
        id: "teamSize",
        label: "Team Size",
        type: "select",
        options: ["1-5 people", "6-15 people", "16-50 people", "50+ people"],
      },
    ],
  },
  ngo: {
    icon: Heart,
    color: "from-green-500 to-emerald-500",
    questions: [
      {
        id: "experience",
        label: "Years in Humanitarian Work",
        type: "select",
        options: ["0-2 years", "3-5 years", "6-10 years", "10+ years"],
      },
      {
        id: "region",
        label: "Primary Operating Region",
        type: "select",
        options: ["West Africa", "East Africa", "Central Africa", "Southern Africa", "Multi-Regional"],
      },
      {
        id: "primaryConcerns",
        label: "Focus Areas",
        type: "multiselect",
        options: ["Emergency Response", "Supply Chain", "Community Outreach", "Capacity Building", "Advocacy"],
      },
      {
        id: "goals",
        label: "Mission Objectives",
        type: "multiselect",
        options: [
          "Reach More Communities",
          "Improve Efficiency",
          "Enhance Transparency",
          "Build Local Capacity",
          "Strengthen Partnerships",
        ],
      },
      {
        id: "budget",
        label: "Annual Operating Budget",
        type: "select",
        options: ["Under $100K", "$100K - $500K", "$500K - $2M", "$2M - $10M", "Over $10M"],
      },
    ],
  },
  hospital: {
    icon: Brain,
    color: "from-red-500 to-pink-500",
    questions: [
      {
        id: "experience",
        label: "Years in Hospital Administration",
        type: "select",
        options: ["0-2 years", "3-5 years", "6-10 years", "10+ years"],
      },
      {
        id: "region",
        label: "Hospital Location",
        type: "select",
        options: ["Urban Center", "Suburban Area", "Rural Community", "Remote Location"],
      },
      {
        id: "primaryConcerns",
        label: "Key Challenges",
        type: "multiselect",
        options: [
          "Capacity Management",
          "Resource Allocation",
          "Staff Coordination",
          "Supply Chain",
          "Emergency Preparedness",
        ],
      },
      {
        id: "goals",
        label: "Improvement Goals",
        type: "multiselect",
        options: [
          "Increase Capacity",
          "Improve Efficiency",
          "Enhance Patient Care",
          "Reduce Costs",
          "Better Coordination",
        ],
      },
      {
        id: "teamSize",
        label: "Hospital Size",
        type: "select",
        options: ["Small (< 100 beds)", "Medium (100-300 beds)", "Large (300-500 beds)", "Major (500+ beds)"],
      },
    ],
  },
}

export default function OnboardingPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    jobTitle: "",
    experience: "",
    region: "",
    primaryConcerns: [],
    goals: [],
    teamSize: "",
    budget: "",
    previousExperience: "",
    specificNeeds: "",
  })
  const [loading, setLoading] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth")
        return
      }
      setUser(user)
    }
    getUser()
  }, [supabase.auth, router])

  const userRole = user?.user_metadata?.role || "government"
  const roleConfig = roleQuestions[userRole as keyof typeof roleQuestions]
  const totalSteps = 3 + roleConfig.questions.length

  const handleInputChange = (field: string, value: string | string[]) => {
    setOnboardingData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleMultiSelectChange = (field: string, option: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      [field]: prev[field as keyof OnboardingData].includes(option)
        ? (prev[field as keyof OnboardingData] as string[]).filter((item) => item !== option)
        : [...(prev[field as keyof OnboardingData] as string[]), option],
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      // Save onboarding data to Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user?.user_metadata,
          onboarding_completed: true,
          profile: onboardingData,
          display_name: `${onboardingData.firstName} ${onboardingData.lastName}`,
        },
      })

      if (error) throw error

      // Redirect to role-specific dashboard
      switch (userRole) {
        case "government":
          router.push("/dashboard/government")
          break
        case "ngo":
          router.push("/dashboard/ngo")
          break
        case "hospital":
          router.push("/dashboard/hospital")
          break
        default:
          router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error completing onboarding:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className={`p-4 bg-gradient-to-r ${roleConfig.color} rounded-xl w-fit mx-auto mb-4`}>
              <roleConfig.icon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Medscope!</h2>
            <p className="text-gray-400">Let's set up your profile to personalize your experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">
                First Name
              </Label>
              <Input
                id="firstName"
                value={onboardingData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="bg-gray-800/50 border-gray-600/50 text-white"
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={onboardingData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="bg-gray-800/50 border-gray-600/50 text-white"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-white">
              Job Title
            </Label>
            <Input
              id="jobTitle"
              value={onboardingData.jobTitle}
              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
              className="bg-gray-800/50 border-gray-600/50 text-white"
              placeholder="e.g., Public Health Director, Program Manager, Chief Medical Officer"
            />
          </div>
        </div>
      )
    }

    if (currentStep <= roleConfig.questions.length) {
      const question = roleConfig.questions[currentStep - 1]
      if (!question) return null

      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{question.label}</h2>
            <p className="text-gray-400">Help us understand your specific needs and context</p>
          </div>

          {question.type === "select" && (
            <Select
              value={onboardingData[question.id as keyof OnboardingData] as string}
              onValueChange={(value) => handleInputChange(question.id, value)}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-600/50 text-white">
                <SelectValue placeholder={`Select ${question.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {question.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {question.type === "multiselect" && (
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">Select all that apply:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options?.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleMultiSelectChange(question.id, option)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      (onboardingData[question.id as keyof OnboardingData] as string[]).includes(option)
                        ? `border-blue-500 bg-blue-900/20`
                        : "border-gray-600 bg-gray-800/50 hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white">{option}</span>
                      {(onboardingData[question.id as keyof OnboardingData] as string[]).includes(option) && (
                        <CheckCircle className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }

    if (currentStep === totalSteps - 2) {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Previous Experience</h2>
            <p className="text-gray-400">
              Tell us about your background with epidemic simulation or public health tools
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="previousExperience" className="text-white">
              Previous Experience (Optional)
            </Label>
            <Textarea
              id="previousExperience"
              value={onboardingData.previousExperience}
              onChange={(e) => handleInputChange("previousExperience", e.target.value)}
              className="bg-gray-800/50 border-gray-600/50 text-white"
              placeholder="Describe any previous experience with epidemic modeling, public health simulations, or similar tools..."
              rows={4}
            />
          </div>
        </div>
      )
    }

    if (currentStep === totalSteps - 1) {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Specific Needs</h2>
            <p className="text-gray-400">Any specific requirements or features you're looking for?</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specificNeeds" className="text-white">
              Specific Needs or Requirements (Optional)
            </Label>
            <Textarea
              id="specificNeeds"
              value={onboardingData.specificNeeds}
              onChange={(e) => handleInputChange("specificNeeds", e.target.value)}
              className="bg-gray-800/50 border-gray-600/50 text-white"
              placeholder="Describe any specific features, integrations, or capabilities you need for your work..."
              rows={4}
            />
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-4">Profile Summary</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <span className="text-gray-400">Name:</span> {onboardingData.firstName} {onboardingData.lastName}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Role:</span> {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Title:</span> {onboardingData.jobTitle}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Experience:</span> {onboardingData.experience}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Region:</span> {onboardingData.region}
              </p>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge className={`bg-gradient-to-r ${roleConfig.color} text-white px-4 py-2`}>
              <roleConfig.icon className="h-4 w-4 mr-2" />
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Setup
            </Badge>
            <span className="text-gray-400 text-sm">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <Progress value={(currentStep / (totalSteps - 1)) * 100} className="h-2" />
        </div>

        {/* Main Content */}
        <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
          <CardContent className="p-8">{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="bg-gray-800/50 text-white border-gray-600 hover:bg-gray-700/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === totalSteps - 1 ? (
            <Button
              onClick={handleComplete}
              disabled={loading || !onboardingData.firstName || !onboardingData.lastName}
              className={`bg-gradient-to-r ${roleConfig.color} hover:opacity-90`}
            >
              {loading ? "Completing..." : "Complete Setup"}
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={
                currentStep === 0 && (!onboardingData.firstName || !onboardingData.lastName || !onboardingData.jobTitle)
              }
              className={`bg-gradient-to-r ${roleConfig.color} hover:opacity-90`}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
