# Agent2: プロジェクト管理機能担当

## ブランチ情報
- **ブランチ名**: `feature/projects`
- **担当ディレクトリ**: 
  - `src/app/(dashboard)/projects/`
  - `src/lib/projects/`

## 具体的なタスク一覧

1. **プロジェクト一覧ページ**
   - `src/app/(dashboard)/projects/page.tsx` - プロジェクト一覧表示
   - プロジェクトカード/リスト表示
   - フィルタリング（ステータス別）
   - 検索機能

2. **プロジェクト詳細ページ**
   - `src/app/(dashboard)/projects/[id]/page.tsx` - プロジェクト詳細
   - プロジェクト情報の表示
   - メンバー一覧の表示
   - タスク一覧の表示（Agent3と連携）

3. **プロジェクト作成ページ**
   - `src/app/(dashboard)/projects/new/page.tsx` - 新規プロジェクト作成
   - フォーム実装（name, description）
   - バリデーション

4. **プロジェクト編集機能**
   - `src/app/(dashboard)/projects/[id]/edit/page.tsx` - プロジェクト編集
   - 編集フォーム
   - ステータス変更機能

5. **メンバー管理機能**
   - `src/app/(dashboard)/projects/[id]/members/page.tsx` - メンバー管理ページ
   - メンバー追加フォーム
   - メンバー一覧表示
   - ロール変更機能
   - メンバー削除機能

6. **プロジェクトライブラリ**
   - `src/lib/projects/queries.ts` - プロジェクト取得関数
   - `src/lib/projects/mutations.ts` - プロジェクト作成・更新・削除関数
   - `src/lib/projects/members.ts` - メンバー管理関数

## 参照すべき型定義

```typescript
// src/types/index.ts から以下をインポートして使用
import type {
  Project,
  ProjectMember,
  ProjectStatus,
  ProjectRole,
  CreateProjectData,
  UpdateProjectData,
  AddMemberData,
  UpdateMemberRoleData,
  ProjectResponse,
  ProjectsResponse,
} from '@/types';
```

## 編集禁止ファイル
- `src/types/index.ts` - 共有型定義ファイル（編集禁止）
- 他のエージェントの担当ディレクトリ
- `src/app/api/` - Agent4の担当（API実装はAgent4に依頼）

## 完了条件
- [ ] プロジェクトのCRUD操作が全て実装されている
- [ ] メンバー管理機能が実装されている（追加・削除・ロール変更）
- [ ] プロジェクト一覧・詳細ページが実装されている
- [ ] 型定義に準拠した実装になっている
- [ ] 認証が必要なページは適切に保護されている
- [ ] Tailwind CSSでスタイリングされている
- [ ] エラーハンドリングが適切に実装されている
