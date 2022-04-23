import React from 'react';
import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";

// Components
import Welcome from "./Components/Welcome";
import Materials from "./Components/Materials";
import ThreeDTexts from "./Components/3DTexts";
import Lights from "./Components/Lights";
import Shadows from "./Components/Shadows";
import HauntedHouse from "./Components/HauntedHouse";
import Particles from "./Components/Particles";
import Galaxy from "./Components/Galaxy";
import Raycaster from "./Components/Raycaster";
import ScrollBasedAnimation from "./Components/ScrollBasedAnimation";

function App() {
  return (
    <div className="App">
      <main>
        <Router>
          <Switch>
            <Route path='/haunted-house'>
              <HauntedHouse />
            </Route>
            <Route path='/borderland'>
              <ScrollBasedAnimation />
            </Route>
          </Switch>
        </Router>
        {/*<Welcome />*/}
        {/*<Materials />*/}
        {/*<ThreeDTexts />*/}
        {/*<Lights />*/}
        {/*<Shadows />*/}
        {/*<Particles />*/}
        {/*<Galaxy />*/}
        {/*<Raycaster />*/}
      </main>
    </div>
  );
}

export default App;
