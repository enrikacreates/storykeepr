import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { AuthProvider, useAuth } from '@/lib/auth'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/pages/LoginPage'
import { LibraryPage } from '@/pages/LibraryPage'
import { NewStoryPage } from '@/pages/NewStoryPage'
import { StoryDetailPage } from '@/pages/StoryDetailPage'
import { EditStoryPage } from '@/pages/EditStoryPage'

function LoginRoute() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return <LoginPage />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route element={<AuthGuard />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<LibraryPage />} />
              <Route path="/new" element={<NewStoryPage />} />
              <Route path="/story/:id" element={<StoryDetailPage />} />
              <Route path="/story/:id/edit" element={<EditStoryPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
