import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BlogPost from './pages/BlogPost'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  )
}
