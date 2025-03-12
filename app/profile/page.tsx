'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/protected-route'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await updateUserProfile({ name })
      
      if (error) {
        setError(error.message || 'Failed to update profile')
        return
      }
      
      setSuccess(true)
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container max-w-4xl py-10">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user?.avatarUrl || '/placeholder-user.jpg'} alt={user?.name || 'User'} />
                <AvatarFallback className="text-4xl">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="mt-4">
                <Button variant="outline" size="sm">
                  Change Picture
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>Profile updated successfully!</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user?.email || ''}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">Your email cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <Input 
                    value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
                    disabled
                  />
                  {user?.role === 'creator' && user?.creatorStatus && (
                    <p className="text-xs text-muted-foreground">
                      Creator status: {user.creatorStatus.charAt(0).toUpperCase() + user.creatorStatus.slice(1)}
                    </p>
                  )}
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}

