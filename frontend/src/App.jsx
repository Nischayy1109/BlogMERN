import {BrowserRouter,Routes,Route} from 'react-router-dom'
//import { useAuth0 } from "@auth0/auth0-react";
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Projects from './pages/Projects'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdmin'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'

function App() {

  //const {loginWithRedirect,logout, isAuthenticated,user} = useAuth0();
  
  return (
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route element={<PrivateRoute/>}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<OnlyAdminPrivateRoute/>}>
            <Route path="/create-post" element={<CreatePost/>}/>
            <Route path="/update-post/:postId" element={<UpdatePost/>}/>
          </Route>
          <Route path="/projects" element={<Projects />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
        </Routes>
        <Footer/>
    </BrowserRouter>
  )
}

export default App
