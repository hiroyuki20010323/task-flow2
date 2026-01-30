# Agent3: タスク管理機能担当

## ブランチ情報
- **ブランチ名**: `feature/tasks`
- **担当ディレクトリ**: 
  - `src/app/(dashboard)/tasks/`
  - `src/lib/tasks/`

## 具体的なタスク一覧

1. **タスク一覧ページ**
   - `src/app/(dashboard)/tasks/page.tsx` - タスク一覧表示
   - フィルタリング（ステータス、優先度、プロジェクト別）
   - ソート機能
   - 検索機能

2. **タスク詳細ページ**
   - `src/app/(dashboard)/tasks/[id]/page.tsx` - タスク詳細表示
   - タスク情報の表示
   - ステータス変更UI
   - 優先度変更UI
   - 担当者変更UI

3. **タスク作成ページ**
   - `src/app/(dashboard)/tasks/new/page.tsx` - 新規タスク作成
   - フォーム実装（title, description, priority, projectId, assigneeId, dueDate）
   - バリデーション

4. **タスク編集ページ**
   - `src/app/(dashboard)/tasks/[id]/edit/page.tsx` - タスク編集
   - 編集フォーム
   - 全フィールドの編集可能

5. **タスクライブラリ**
   - `src/lib/tasks/queries.ts` - タスク取得関数
   - `src/lib/tasks/mutations.ts` - タスク作成・更新・削除関数
   - `src/lib/tasks/filters.ts` - フィルタリング・ソート関数

6. **タスクコンポーネント**
   - `src/components/tasks/TaskCard.tsx` - タスクカードコンポーネント
   - `src/components/tasks/TaskStatusBadge.tsx` - ステータスバッジ
   - `src/components/tasks/TaskPriorityBadge.tsx` - 優先度バッジ

## 参照すべき型定義

```typescript
// src/types/index.ts から以下をインポートして使用
import type {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskData,
  UpdateTaskData,
  TaskResponse,
  TasksResponse,
  SortParams,
  PaginationParams,
} from '@/types';
```

## 編集禁止ファイル
- `src/types/index.ts` - 共有型定義ファイル（編集禁止）
- 他のエージェントの担当ディレクトリ
- `src/app/api/` - Agent4の担当（API実装はAgent4に依頼）

## 完了条件
- [ ] タスクのCRUD操作が全て実装されている
- [ ] ステータス管理が実装されている
- [ ] 優先度管理が実装されている
- [ ] フィルタリング・ソート機能が実装されている
- [ ] タスク一覧・詳細ページが実装されている
- [ ] 型定義に準拠した実装になっている
- [ ] 認証が必要なページは適切に保護されている
- [ ] Tailwind CSSでスタイリングされている
- [ ] エラーハンドリングが適切に実装されている
