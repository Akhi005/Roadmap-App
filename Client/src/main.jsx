import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import App from './App.jsx'
import Home from './Home.jsx'
import './index.css'
import SignUpForm from '/src/pages/forms/SignUpForm.jsx'
import SignInForm from '/src/pages/forms/SignInForm.jsx'
import MainPage from './pages/MainPage.jsx'
import CategoryProvider from '/src/context/RoadmapContext.jsx'
import CategoryItem from './pages/CategoryItem.jsx'
import CategoryList from './pages/CategoryList.jsx'
import PrivateRoute from './PrivateRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
        children: [
          {
            path: '/',
            element: <SignUpForm />
          },
          {
            path: '/signin',
            element: <SignInForm />
          }
        ]
      }, {
        path: '/roadmap',
        element: <PrivateRoute><MainPage /></PrivateRoute>,
        children: [
          {
            path: '/roadmap',
            element: <CategoryList />
          },
          {
            path: '/roadmap/:id',
            element: <CategoryItem />
          }
        ]
      }
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CategoryProvider>
        <RouterProvider router={router} />
      </CategoryProvider>
    </AuthProvider>
  </StrictMode>
)
