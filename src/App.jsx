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
  const [selectedPokemon, setSelectedPokemon] = useState(null); // Nouvel état pour le Pokémon cliqué

  useEffect(() => {
    const fetchAllPokemons = async () => {
      setLoading(true);

      // Optimisation : Promise.all permet de faire toutes les requêtes en parallèle
      const promises = [];
      for (let i = 1; i <= 151; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then(res => res.json()));
      }

      const fetchedPokemons = await Promise.all(promises);
      setPokemons(fetchedPokemons);
      setLoading(false);
    };

    fetchAllPokemons();
  }, []);

  const filteredPokemons = pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour fermer la modale
  const closeModal = () => setSelectedPokemon(null);

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
            <div className="loading">Chargement du Pokédex...</div>
        ) : (
            <div className="grid-container">
              {filteredPokemons.map((pokemon) => {
                const type = pokemon.types[0].type.name;
                const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
                const id = pokemon.id.toString().padStart(3, '0');
                const sprite = pokemon.sprites.other['official-artwork'].front_default;
                const bgColor = typeColors[type] || '#f5f5f5';

                return (
                    <div
                        key={pokemon.id}
                        className="pokemon-card"
                        style={{ backgroundColor: bgColor }}
                        onClick={() => setSelectedPokemon(pokemon)} // Ouvre la modale au clic
                    >
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

        {/* Fenêtre Modale pour les Stats */}
        {selectedPokemon && (
            <div className="modal-overlay" onClick={closeModal}>
              <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique à l'intérieur
                  style={{ backgroundColor: typeColors[selectedPokemon.types[0].type.name] || '#f5f5f5' }}
              >
                <button className="close-btn" onClick={closeModal}>&times;</button>

                <div className="modal-header">
                  <h2>{selectedPokemon.name[0].toUpperCase() + selectedPokemon.name.slice(1)}</h2>
                  <img
                      src={selectedPokemon.sprites.other['official-artwork'].front_default}
                      alt={selectedPokemon.name}
                  />
                </div>

                <div className="stats-container">
                  <h3>Statistiques de base</h3>
                  {selectedPokemon.stats.map((stat) => (
                      <div key={stat.stat.name} className="stat-row">
                        <span className="stat-name">{stat.stat.name.replace('-', ' ')}</span>
                        <span className="stat-value">{stat.base_stat}</span>
                        <div className="stat-bar-bg">
                          {/* La stat max théorique est souvent considérée autour de 255 */}
                          <div
                              className="stat-bar-fill"
                              style={{ width: `${Math.min((stat.base_stat / 150) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                  ))}

                  <div className="extra-info">
                    <p><strong>Poids:</strong> {selectedPokemon.weight / 10} kg</p>
                    <p><strong>Taille:</strong> {selectedPokemon.height / 10} m</p>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

export default App;