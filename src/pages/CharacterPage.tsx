// src/pages/CharacterPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MemoList from '../components/MemoList';

export type CharacterInfo = {
  id: string;
  name: string;
  iconUrl: string;
};

const CharacterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [characters, setCharacters] = useState<CharacterInfo[]>([]);
  const [character, setCharacter] = useState<CharacterInfo | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/characters');
      if (!res.ok) {
        console.error('キャラ一覧の取得に失敗:', res.status);
        return;
      }
      const data: CharacterInfo[] = await res.json();
      setCharacters(data);
      if (id) {
        const found = data.find(c => c.id === id);
        setCharacter(found || null);
      }
    })();
  }, [id]);

  if (!character) {
    return <div className="p-4">キャラ情報を読み込み中…</div>;
  }

  return (
    <div className="p-4">
      {/* ナビゲーション：ホームに戻る + キャラサムネイルバー */}
      <div className="flex items-center mb-4 space-x-4 overflow-x-auto">
        <Link
          to="/"
          className="flex-shrink-0 text-blue-500 hover:underline"
        >
          ホームへ戻る
        </Link>
        <div className="flex space-x-2 flex-shrink-0 items-center">
          {characters.map(ch => (
            <Link
              key={ch.id}
              to={`/character/${ch.id}`}
              className={`p-2 flex items-center justify-center rounded transition ${
                ch.id === character.id
                  ? 'bg-blue-100'
                  : 'hover:bg-gray-100'
              }`}
            >
              <img
                src={ch.iconUrl}
                alt={ch.name}
                className="w-10 h-10 object-cover rounded"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* 現在のキャラタイトル */}
      <div className="flex items-center mb-4">
        <img
          src={character.iconUrl}
          alt={character.name}
          className="w-16 h-16 object-cover rounded mr-2"
        />
        <h1 className="text-3xl font-bold">{character.name}</h1>
      </div>

      {/* メモリスト */}
      <MemoList characterId={character.id} />
    </div>
  );
};

export default CharacterPage;
