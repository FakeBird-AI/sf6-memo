// src/components/SortableMemoItem.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Memo } from './MemoList';

export type SortableMemoItemProps = {
  id: string;
  memo: Memo;
  onEdit: (memo: Memo) => void;
  onDelete: (memoId: string) => void;
};

const SortableMemoItem: React.FC<SortableMemoItemProps> = ({
  id,
  memo,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 mb-2 rounded shadow cursor-move flex justify-between items-start"
    >
      <div className="flex-1">
        <div
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: memo.content }}
        />
        <div className="text-xs text-gray-400 mt-1">
          {new Date(memo.createdAt).toLocaleString()}
        </div>
      </div>
      <div className="ml-4 flex flex-col space-y-1">
        <button
          onClick={() => onEdit(memo)}
          className="text-blue-500 hover:underline text-sm"
        >
          編集
        </button>
        <button
          onClick={() => onDelete(memo.memoId)}
          className="text-red-500 hover:underline text-sm"
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default SortableMemoItem;
