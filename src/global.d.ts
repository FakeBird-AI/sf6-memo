// src/global.d.ts

// Workers KV の名前空間型定義
interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
    // 必要に応じて他のメソッドも追加
  }
  
  // Workers の env オブジェクト型定義
  interface Env {
    MEMOS: KVNamespace;
  }
  