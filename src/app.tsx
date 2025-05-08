// src/app.tsx
import React, { useEffect, useState } from 'react';
import CharacterCard, { Character } from './components/CharacterCard';
import './index.css';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/characters')
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: Character[]) => {
        setCharacters(data);
      })
      .catch(err => {
        console.error('Failed to fetch characters:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCardClick = (id: string) => {
    window.location.href = `/character/${id}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading…
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">キャラ一覧</h1>
      <div className="grid grid-cols-2 pc:grid-cols-3 gap-4">
        {characters.map(char => (
          <CharacterCard
            key={char.id}
            character={char}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
