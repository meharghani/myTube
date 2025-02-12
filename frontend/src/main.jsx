import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux"
import store from "./store/index.js"
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Protected from "./components/Auth.jsx"
import {Home, Login, User} from "./pages"
const router = createBrowserRouter([
  {
    path:"/",
    element:<App />,
    children:[
      {
        path:"/",
        element:
        <Home />
      },
      {
        path:"/user",
        element:(
          <Protected authentication={true}>
            <User />
          </Protected>
        )
      },
      {
        path:"/login",
        element:(
          <Protected authentication={false}>
            <Login />
          </Protected>
        )
      }
    ]
  }
],{
future: {
  v7_startTransition: true,
}}
)


createRoot(document.getElementById('root')).render(
 
    <Provider store={store}>
      <RouterProvider future={{
    v7_startTransition: true,
  }} router={router} />
    </Provider>
   
 
)
