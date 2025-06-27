"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Bell, Shield, HelpCircle, Save, ArrowLeft, Eye, EyeOff, Trash2, Download } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"

export default function SettingsPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")

  // Profile settings
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    organization: "",
    email: "",
    phone: "",
    bio: "",
    region: "",
    experience: "",
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    simulationAlerts: true,
    fundingUpdates: true,
    systemUpdates: false,
    weeklyReports: true,
    emergencyAlerts: true,
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "team",
    dataSharing: false,
    analyticsOptIn: true,
    marketingEmails: false,
  })

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

      // Load profile data from user metadata
      const profile = user.user_metadata?.profile || {}
      setProfileData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        jobTitle: profile.jobTitle || "",
        organization: user.user_metadata?.organization || "",
        email: user.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        region: profile.region || "",
        experience: profile.experience || "",
      })

      setLoading(false)
    }
    getUser()
  }, [supabase.auth, router])

  const handleProfileUpdate = async () => {
    setSaving(true)
    setMessage("")

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user?.user_metadata,
          profile: profileData,
          display_name: `${profileData.firstName} ${profileData.lastName}`,
        },
      })

      if (error) throw error

      setMessage("Profile updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    setSaving(true)
    setMessage("")

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setMessage("Password updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleExportData = () => {
    const data = {
      profile: profileData,
      notifications,
      privacy,
      userMetadata: user?.user_metadata,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `medscope-data-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // In a real app, you'd call a server function to handle account deletion
        await supabase.auth.signOut()
        router.push("/")
      } catch (error: any) {
        setMessage(`Error: ${error.message}`)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  const userRole = user?.user_metadata?.role || "researcher"

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <DashboardHeader user={user} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-gray-400">Manage your account and preferences</p>
            </div>
          </div>
          <Badge className="bg-blue-900/20 text-blue-300 border-blue-800">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </Badge>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("Error")
                ? "bg-red-900/20 text-red-300 border border-red-800"
                : "bg-green-900/20 text-green-300 border border-green-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-700">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-700">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-gray-700">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-gray-700">
              <Settings className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="help" className="data-[state=active]:bg-gray-700">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information and professional details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-white">
                    Job Title
                  </Label>
                  <Input
                    id="jobTitle"
                    value={profileData.jobTitle}
                    onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-white">
                    Organization
                  </Label>
                  <Input
                    id="organization"
                    value={profileData.organization}
                    onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      Phone (Optional)
                    </Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">
                    Bio (Optional)
                  </Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                    placeholder="Tell us about yourself and your work..."
                  />
                </div>

                <Button onClick={handleProfileUpdate} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Email Notifications</Label>
                      <p className="text-gray-400 text-sm">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Simulation Alerts</Label>
                      <p className="text-gray-400 text-sm">Get notified about simulation status changes</p>
                    </div>
                    <Switch
                      checked={notifications.simulationAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, simulationAlerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Funding Updates</Label>
                      <p className="text-gray-400 text-sm">Blockchain transaction and funding notifications</p>
                    </div>
                    <Switch
                      checked={notifications.fundingUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, fundingUpdates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">System Updates</Label>
                      <p className="text-gray-400 text-sm">Platform updates and maintenance notifications</p>
                    </div>
                    <Switch
                      checked={notifications.systemUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Weekly Reports</Label>
                      <p className="text-gray-400 text-sm">Weekly summary of your simulations and activities</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Emergency Alerts</Label>
                      <p className="text-gray-400 text-sm">Critical alerts for emergency situations</p>
                    </div>
                    <Switch
                      checked={notifications.emergencyAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emergencyAlerts: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Security Settings</CardTitle>
                <CardDescription className="text-gray-400">Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-white">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        className="bg-gray-700 border-gray-600 text-white pr-10"
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-white">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button
                    onClick={() => handlePasswordChange("", "")}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {saving ? "Updating..." : "Update Password"}
                  </Button>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-white font-semibold mb-4">Two-Factor Authentication</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Add an extra layer of security to your account with two-factor authentication.
                  </p>
                  <Button variant="outline" className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Privacy Settings</CardTitle>
                <CardDescription className="text-gray-400">Control your data and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Profile Visibility</Label>
                    <Select
                      value={privacy.profileVisibility}
                      onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="public">Public - Visible to everyone</SelectItem>
                        <SelectItem value="team">Team - Visible to team members only</SelectItem>
                        <SelectItem value="private">Private - Only visible to you</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Data Sharing</Label>
                      <p className="text-gray-400 text-sm">Allow anonymized data sharing for research purposes</p>
                    </div>
                    <Switch
                      checked={privacy.dataSharing}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, dataSharing: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Analytics</Label>
                      <p className="text-gray-400 text-sm">Help improve the platform with usage analytics</p>
                    </div>
                    <Switch
                      checked={privacy.analyticsOptIn}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, analyticsOptIn: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Marketing Emails</Label>
                      <p className="text-gray-400 text-sm">Receive updates about new features and improvements</p>
                    </div>
                    <Switch
                      checked={privacy.marketingEmails}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, marketingEmails: checked })}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-white font-semibold mb-4">Data Management</h3>
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleExportData}
                      variant="outline"
                      className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button
                      onClick={handleDeleteAccount}
                      variant="outline"
                      className="bg-red-900/20 text-red-300 border-red-800 hover:bg-red-900/40"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Getting Started</CardTitle>
                  <CardDescription className="text-gray-400">Learn how to use Medscope effectively</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    >
                      📖 Platform Overview
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    >
                      🚀 Quick Start Guide
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    >
                      🎯 Role-Specific Tutorials
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    >
                      🤖 AI Agents Guide
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Advanced Features</CardTitle>
                  <CardDescription className="text-gray-400">Master the advanced capabilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    >
                      ⛓️ Blockchain Integration
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    >
                      📊 Data Import/Export
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    >
                      🔧 API Documentation
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    >
                      🎨 Customization Options
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Support</CardTitle>
                  <CardDescription className="text-gray-400">Get help when you need it</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    >
                      💬 Community Forum
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    >
                      📧 Contact Support
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    >
                      🐛 Report Bug
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    >
                      💡 Feature Request
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Interactive Tutorial</CardTitle>
                  <CardDescription className="text-gray-400">Step-by-step guided tour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm">
                      Take an interactive tour of Medscope tailored to your role as a{" "}
                      <span className="text-blue-400 font-semibold">
                        {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                      </span>
                      .
                    </p>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                      Start Interactive Tutorial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Keyboard Shortcuts</CardTitle>
                <CardDescription className="text-gray-400">Speed up your workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">New Simulation</span>
                      <Badge variant="outline" className="bg-gray-700 text-gray-300">
                        Ctrl + N
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Quick Search</span>
                      <Badge variant="outline" className="bg-gray-700 text-gray-300">
                        Ctrl + K
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Dashboard</span>
                      <Badge variant="outline" className="bg-gray-700 text-gray-300">
                        Ctrl + D
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Settings</span>
                      <Badge variant="outline" className="bg-gray-700 text-gray-300">
                        Ctrl + ,
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Help</span>
                      <Badge variant="outline" className="bg-gray-700 text-gray-300">
                        Ctrl + ?
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Export Data</span>
                      <Badge variant="outline" className="bg-gray-700 text-gray-300">
                        Ctrl + E
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
