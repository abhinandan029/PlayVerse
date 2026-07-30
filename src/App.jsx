import {Routes, Route} from 'react-router-dom'

import Header from "./components/Header.jsx"
import Body from "./components/Body.jsx"
import Footer from "./components/Footer.jsx"

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/home" element={<Body />}/>
      </Routes>
      <Footer />
    </>
  );
  
}

export default App
