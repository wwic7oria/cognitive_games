import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Memory from './pages/Memory'
import Sequence from './pages/Sequence'
import Attention from './pages/Attention'
import Stats from './pages/Stats'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/memory"
          element={<Memory />}
        />
        <Route
          path="/sequence"
          element={<Sequence />}
        />
        <Route
          path="/attention"
          element={<Attention />}
        />
        <Route
          path="/stats"
          element={<Stats />}
        />
      </Routes>
    </BrowserRouter>
  )
}
