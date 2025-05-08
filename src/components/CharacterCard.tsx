// src/components/CharacterCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export type Character = {
  id: string;
  name: string;
  iconUrl: string;
};

type Props = {
  character: Character;
};

const CharacterCard: React.FC<Props> = ({ character }) => (
  <Link
    to={`/character/${character.id}`}
    className="block bg-white rounded-2xl shadow p-4 flex flex-col items-center hover:shadow-lg transition"
  >
    <img
      src={character.iconUrl}
      alt={character.name}
      className="w-24 h-24 object-cover mb-2"
    />
    <span className="text-lg font-medium text-center">
      {character.name}
    </span>
  </Link>
);

export default CharacterCard;
