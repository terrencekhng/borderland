import React from 'react';
import './App.css';

// Components
import Welcome from "./Components/Welcome";
import Materials from "./Components/Materials";
import ThreeDTexts from "./Components/3DTexts";
import Lights from "./Components/Lights";
import Shadows from "./Components/Shadows";
import HauntedHouse from "./Components/HauntedHouse";
import Particles from "./Components/Particles";
import Galaxy from "./Components/Galaxy";

function App() {
  return (
    <div className="App">
      <main>
        {/*<Welcome />*/}
        {/*<Materials />*/}
        {/*<ThreeDTexts />*/}
        {/*<Lights />*/}
        {/*<Shadows />*/}
        {/*<HauntedHouse />*/}
        {/*<Particles />*/}
        <Galaxy />
      </main>
    </div>
  );
}

export default App;
