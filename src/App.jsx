import { useState, useEffect } from 'react';
import './App.css';

const typeColors = {
  fire: '#FDDFDF',
  grass: '#DEFDE0',
  electric: '#FCF7DE',
  water: '#DEF3FD',
  ground: '#f4e7da',
  rock: '#d5d5d4',
  fairy: '#fceaff',
  poison: '#98d7a5',
  bug: '#f8d5a3',
  dragon: '#97b3e6',
  psychic: '#eaeda1',
  flying: '#F5F5F5',
  fighting: '#E6E0D4',
  normal: '#F5F5F5'
};

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllPokemons = async () => {
      setLoading(true);
      const fetchedPokemons = [];

      for (let i = 1; i <= 151; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        const res = await fetch(url);
        const data = await res.json();
        fetchedPokemons.push(data);
      }

      setPokemons(fetchedPokemons);
      setLoading(false);
    };

    fetchAllPokemons();
  }, []);

  const filteredPokemons = pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="app-container">
        <h1>Pokédex Masterclass</h1>

        <input
            type="text"
            placeholder="Rechercher un Pokémon..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
            <div className="loading">Chargement du Pokédex... ⏳</div>
        ) : (
            <div className="grid-container">
              {filteredPokemons.map((pokemon) => {
                const type = pokemon.types[0].type.name;
                const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
                const id = pokemon.id.toString().padStart(3, '0');
                const sprite = pokemon.sprites.other['official-artwork'].front_default;
                const bgColor = typeColors[type] || '#f5f5f5';

                return (
                    <div key={pokemon.id} className="pokemon-card" style={{ backgroundColor: bgColor }}>
                      <div className="img-container">
                        <img src={sprite} alt={name} />
                      </div>
                      <div className="info">
                        <span className="number">#{id}</span>
                        <h3 className="name">{name}</h3>
                        <small className="type">Type: <span>{type}</span></small>
                      </div>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
}

export default App;