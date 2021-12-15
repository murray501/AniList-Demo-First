import React from "react";
import {Routes, Route} from "react-router-dom";
import PageList from "./pages/list";
import Character from "./pages/character";
import {
  Home,
  Other,
  Whoops404,
  Description
} from "./pages";



function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<PageList />} >
          <Route path="description/:id/:type" element={<Description />} />
          <Route path="character/:id/:type" element={<Character />} />
        </Route>  
        <Route path="*" element={<Whoops404 />} />
      </Routes>
    </div>
  )
}

export default App;
