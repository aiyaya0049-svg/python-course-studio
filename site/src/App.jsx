import { useEffect, useState } from 'react'
import './App.css'
import StudentLab from './StudentLab'
import TeacherStudio from './TeacherStudio'

function getRoute() {
  const path = window.location.hash.replace(/^#/, '')
  return path === '/student' ? 'student' : 'teacher'
}

function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const updateRoute = () => setRoute(getRoute())
    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  const roomId = new URLSearchParams(window.location.search).get('room')?.trim().slice(0, 32) || 'DEMO-101'
  const profile = route === 'teacher'
    ? { role: 'teacher', displayName: '任课教师', roomId }
    : { role: 'student', displayName: '学习者', roomId }

  return route === 'teacher' ? <TeacherStudio profile={profile} /> : <StudentLab profile={profile} />
}

export default App
