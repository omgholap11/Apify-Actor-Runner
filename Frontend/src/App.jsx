import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ApiKeyForm from './components/ApiKeyForm'
import ActorsList from './components/ActorsList'
import HomePage from './components/HomePage'
import ActorDetails from './components/ActorDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apikeyform" element={<ApiKeyForm />} />
        <Route path="/actorslist" element={<ActorsList />} />
        <Route path="/actor/:actorId" element={<ActorDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
