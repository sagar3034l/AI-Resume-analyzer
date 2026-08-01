import './App.css'
import { RouterProvider } from 'react-router'
import router from './app.routes.jsx'
import { AuthProvider } from './features/auth/auth.context.jsx'
import {Toaster} from 'react-hot-toast'
import { InterviewProvider } from './features/Interview/Interview.context.jsx'


function App() {
  return (
    <>
    <InterviewProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </InterviewProvider>
    <Toaster />
    </>
  )
}

export default App
