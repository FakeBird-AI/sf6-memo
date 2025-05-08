// src/components/MemoEditor.tsx
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export type MemoEditorProps = {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
};

const MemoEditor: React.FC<MemoEditorProps> = ({
  initialContent,
  onSave,
  onCancel,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editable: true,
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(initialContent);
      // 初回マウント時に自動フォーカス
      editor.commands.focus();
    }
  }, [editor, initialContent]);

  if (!editor) return null;

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-lg mx-auto">
      {/* この外枠をクリックするとエディタにフォーカス */}
      <div
        className="w-full border border-gray-300 p-2"
        onClick={() => editor.chain().focus()}
      >
        {/* EditorContent に直接 min-h を指定 */}
        <EditorContent
          editor={editor}
          className="min-h-[200px] w-full focus:outline-none whitespace-pre-wrap"
        />
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          キャンセル
        </button>
        <button
          onClick={() => onSave(editor.getHTML())}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          保存
        </button>
      </div>
    </div>
  );
};

export default MemoEditor;
