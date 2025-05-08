// src/components/MemoList.tsx
import React, { useEffect, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import SortableMemoItem from './SortableMemoItem';
import MemoEditor from './MemoEditor';

export type Memo = {
  memoId: string;
  content: string;
  createdAt: string;
};

type MemoListProps = {
  characterId: string;
};

const MemoList: React.FC<MemoListProps> = ({ characterId }) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  const [showEditor, setShowEditor] = useState<boolean>(false);

  // デスクトップとモバイル両対応のセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  useEffect(() => {
    fetchMemos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]);

  const fetchMemos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/characters/${characterId}/memos`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data: Memo[] = await res.json();
      setMemos(data);
    } catch (e) {
      console.error('メモ取得失敗', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setMemos((current) => {
      const oldIndex = current.findIndex(i => i.memoId === active.id);
      const newIndex = current.findIndex(i => i.memoId === over.id);
      const newOrder = arrayMove(current, oldIndex, newIndex);
      updateOrderOnServer(newOrder);
      return newOrder;
    });
  };

  const updateOrderOnServer = async (newItems: Memo[]) => {
    try {
      await fetch(
        `/api/characters/${characterId}/memos/order`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItems.map(i => i.memoId)),
        }
      );
    } catch (e) {
      console.error('並べ替え更新失敗', e);
    }
  };

  const handleSave = async (content: string) => {
    try {
      if (editingMemo?.memoId) {
        await fetch(
          `/api/characters/${characterId}/memos/${editingMemo.memoId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
          }
        );
      } else {
        await fetch(`/api/characters/${characterId}/memos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
      }
    } catch (e) {
      console.error('保存失敗', e);
    }
    setShowEditor(false);
    setEditingMemo(null);
    fetchMemos();
  };

  const handleDelete = async (memoId: string) => {
    if (!window.confirm('本当にこのメモを削除しますか？')) return;
    try {
      await fetch(
        `/api/characters/${characterId}/memos/${memoId}`,
        { method: 'DELETE' }
      );
    } catch (e) {
      console.error('削除失敗', e);
    }
    fetchMemos();
  };

  if (loading) {
    return <div className="p-4 text-center">メモを読み込み中…</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">メモ一覧</h2>
        <button
          onClick={() => { setEditingMemo(null); setShowEditor(true); }}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          メモ追加
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={memos.map(m => m.memoId)}
          strategy={verticalListSortingStrategy}
        >
          {memos.map(memo => (
            <SortableMemoItem
              key={memo.memoId}
              id={memo.memoId}
              memo={memo}
              onEdit={(m) => { setEditingMemo(m); setShowEditor(true); }}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>

      {showEditor && (
        <MemoEditor
          initialContent={editingMemo?.content || ''}
          onSave={handleSave}
          onCancel={() => { setShowEditor(false); setEditingMemo(null); }}
        />
      )}
    </div>
  );
};

export default MemoList;
