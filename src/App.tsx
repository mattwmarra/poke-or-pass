import { useEffect, useState } from 'react'
import './App.scss'
import axios from 'axios';
import pokemon from 'pokemon';

function App() {
  const [smashCount, setSmashCount] = useState<number>(0);
  const [passCount, setPassCount] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);


  const [currentPokemon, setCurrentPokemon] = useState({
    'name': '',
    'sprites': {
      'front_default': ''
    }
  });
  
  const images = import.meta.globEager("./img/*.png");
  const imageArray = Object.keys(images).map((key) => key);
  const [smashArray, setSmashArray] = useState<string[]>([]);

  const smash = () => {
    const newArray: string[] = [...smashArray];
    newArray.push(currentPokemon.sprites.front_default);
    setSmashCount(smashCount + 1);
    setSmashArray(newArray);
  }
  const pass = () => {
    setPassCount(passCount + 1);
  }

  const getNextPokemon = async () => {
    setIndex(index + 1);
    const nextPokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${index+1}`);
    setCurrentPokemon(nextPokemon.data);
  }

  function toURL(url: string) {
    return new URL(url, import.meta.url).href
  }

  const handleKeyDown = (e: any) => {
    switch (e.keyCode) {
      case 37: {
        return smash();
      }
      case 39: {
        return pass();
      }
    }
  }

  document.onkeydown = handleKeyDown;
  
  useEffect(() => {
    getNextPokemon();
}, [smashCount, passCount]);

  return (
    <div className="App" >
      <header>
        <h1>Pokemon Smash or Pass</h1>
      </header>
      <main>
        {
          currentPokemon.name !== '' &&         
          <section className="pokemon-display">
          <div>
            <img src={toURL( imageArray[index-1] )} alt={currentPokemon.name} />
            <h2>#{index}: {pokemon.getName(index).toUpperCase()}</h2>
          </div>
          <div className='buttons' >
            <button className="button smash" onClick={smash}>Smash: {smashCount}</button>
            <button className="button pass" onClick={pass}>Pass: {passCount}</button>
          </div>
          <small>Smash: Left Arrow Key  |  Pass: Right Arrow Key</small>
        </section>
        }

        <section className='smash-list-wrapper'>
          <h3>You'd Smash:</h3>
          <div className="smash-list">
            <br></br>
            {
              smashArray.map((sprite, index) => {
                return (
                  <>
                    <img key={index} src={sprite} />
                  </>
                )
              })
            }
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
