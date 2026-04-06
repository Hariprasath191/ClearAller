import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Scan from './pages/Scan'
import Search from './pages/Search'
import Loading from './pages/Loading'
import Result from './pages/Result'
import Chatbot from './pages/Chatbot'
import Profile from './pages/Profile'

function Page({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/login"
            element={
              <Page>
                <Login />
              </Page>
            }
          />
          <Route
            path="/register"
            element={
              <Page>
                <Register />
              </Page>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <Page>
                  <Dashboard />
                </Page>
              }
            />
            <Route
              path="/profile"
              element={
                <Page>
                  <Profile />
                </Page>
              }
            />
            <Route
              path="/scan"
              element={
                <Page>
                  <Scan />
                </Page>
              }
            />
            <Route
              path="/search"
              element={
                <Page>
                  <Search />
                </Page>
              }
            />
            <Route
              path="/loading"
              element={
                <Page>
                  <Loading />
                </Page>
              }
            />
            <Route
              path="/result"
              element={
                <Page>
                  <Result />
                </Page>
              }
            />
            <Route
              path="/chat"
              element={
                <Page>
                  <Chatbot />
                </Page>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
