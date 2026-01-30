# TaskFlow 並列開発用エージェント指示文

## Agent1: 認証機能担当

### ブランチ情報
- **ブランチ名**: `feature/auth`
- **担当ディレクトリ**: 
  - `src/app/(auth)/`
  - `src/lib/auth/`

### 具体的なタスク一覧

1. **NextAuth.jsのセットアップ**
   - `src/lib/auth/config.ts` にNextAuth設定を作成
   - Credentials Providerを実装
   - セッション管理の設定

2. **認証ページの実装**
   - `src/app/(auth)/login/page.tsx` - ログインページ
   - `src/app/(auth)/register/page.tsx` - 登録ページ
   - フォームバリデーション（email, password）
   - エラーハンドリングとメッセージ表示

3. **認証ミドルウェア**
   - `src/lib/auth/middleware.ts` - 認証チェック用ミドルウェア
   - 保護されたルートの設定

4. **認証ユーティリティ**
   - `src/lib/auth/utils.ts` - 認証関連のヘルパー関数
   - パスワードハッシュ化（bcrypt）
   - セッション取得関数

5. **APIルート**
   - `src/app/api/auth/[...nextauth]/route.ts` - NextAuth APIルート

### 参照すべき型定義

```typescript
// src/types/index.ts から以下をインポートして使用
import type {
  User,
  Session,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '@/types';
```

### 編集禁止ファイル
- `src/types/index.ts` - 共有型定義ファイル（編集禁止）
- 他のエージェントの担当ディレクトリ
- `package.json`（依存関係の追加が必要な場合は相談）

### 完了条件
- [ ] NextAuth.jsが正常に動作する
- [ ] ログイン・登録ページが実装され、動作する
- [ ] セッション管理が正常に機能する
- [ ] 型定義に準拠した実装になっている
- [ ] エラーハンドリングが適切に実装されている
- [ ] Tailwind CSSでスタイリングされている

---

## Agent2: プロジェクト管理機能担当

### ブランチ情報
- **ブランチ名**: `feature/projects`
- **担当ディレクトリ**: 
  - `src/app/(dashboard)/projects/`
  - `src/lib/projects/`

### 具体的なタスク一覧

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

### 参照すべき型定義

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

### 編集禁止ファイル
- `src/types/index.ts` - 共有型定義ファイル（編集禁止）
- 他のエージェントの担当ディレクトリ
- `src/app/api/` - Agent4の担当（API実装はAgent4に依頼）

### 完了条件
- [ ] プロジェクトのCRUD操作が全て実装されている
- [ ] メンバー管理機能が実装されている（追加・削除・ロール変更）
- [ ] プロジェクト一覧・詳細ページが実装されている
- [ ] 型定義に準拠した実装になっている
- [ ] 認証が必要なページは適切に保護されている
- [ ] Tailwind CSSでスタイリングされている
- [ ] エラーハンドリングが適切に実装されている

---

## Agent3: タスク管理機能担当

### ブランチ情報
- **ブランチ名**: `feature/tasks`
- **担当ディレクトリ**: 
  - `src/app/(dashboard)/tasks/`
  - `src/lib/tasks/`

### 具体的なタスク一覧

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

### 参照すべき型定義

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

### 編集禁止ファイル
- `src/types/index.ts` - 共有型定義ファイル（編集禁止）
- 他のエージェントの担当ディレクトリ
- `src/app/api/` - Agent4の担当（API実装はAgent4に依頼）

### 完了条件
- [ ] タスクのCRUD操作が全て実装されている
- [ ] ステータス管理が実装されている
- [ ] 優先度管理が実装されている
- [ ] フィルタリング・ソート機能が実装されている
- [ ] タスク一覧・詳細ページが実装されている
- [ ] 型定義に準拠した実装になっている
- [ ] 認証が必要なページは適切に保護されている
- [ ] Tailwind CSSでスタイリングされている
- [ ] エラーハンドリングが適切に実装されている

---

## Agent4: API実装担当

### ブランチ情報
- **ブランチ名**: `feature/api`
- **担当ディレクトリ**: 
  - `src/app/api/`
  - `prisma/`

### 具体的なタスク一覧

1. **Prismaスキーマの定義**
   - `prisma/schema.prisma` - データベーススキーマ定義
   - User, Project, ProjectMember, Taskモデルの定義
   - リレーションの定義
   - インデックスの設定

2. **Prismaクライアントのセットアップ**
   - `src/lib/prisma.ts` - Prismaクライアントの初期化
   - シングルトンパターンでの実装

3. **認証API**
   - `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API（Agent1と連携）

4. **プロジェクトAPI**
   - `src/app/api/projects/route.ts` - GET（一覧）, POST（作成）
   - `src/app/api/projects/[id]/route.ts` - GET（詳細）, PATCH（更新）, DELETE（削除）
   - `src/app/api/projects/[id]/members/route.ts` - GET（メンバー一覧）, POST（メンバー追加）
   - `src/app/api/projects/[id]/members/[memberId]/route.ts` - PATCH（ロール変更）, DELETE（メンバー削除）

5. **タスクAPI**
   - `src/app/api/tasks/route.ts` - GET（一覧）, POST（作成）
   - `src/app/api/tasks/[id]/route.ts` - GET（詳細）, PATCH（更新）, DELETE（削除）
   - `src/app/api/tasks/[id]/status/route.ts` - PATCH（ステータス変更）
   - `src/app/api/projects/[id]/tasks/route.ts` - GET（プロジェクト別タスク一覧）

6. **APIエラーハンドリング**
   - `src/lib/api/errors.ts` - エラーハンドリングユーティリティ
   - 統一されたエラーレスポンス形式

7. **APIバリデーション**
   - `src/lib/api/validation.ts` - リクエストバリデーション関数
   - Zodスキーマの定義（必要に応じて）

### 参照すべき型定義

```typescript
// src/types/index.ts から以下をインポートして使用
import type {
  User,
  Project,
  ProjectMember,
  Task,
  CreateProjectData,
  UpdateProjectData,
  AddMemberData,
  UpdateMemberRoleData,
  CreateTaskData,
  UpdateTaskData,
  ApiResponse,
  PaginatedResponse,
  ApiError,
  ProjectResponse,
  ProjectsResponse,
  TaskResponse,
  TasksResponse,
} from '@/types';
```

### 編集禁止ファイル
- `src/types/index.ts` - 共有型定義ファイル（編集禁止）
- 他のエージェントの担当ディレクトリ（`src/app/(auth)/`, `src/app/(dashboard)/projects/`, `src/app/(dashboard)/tasks/`）
- `src/lib/auth/` - Agent1の担当

### 完了条件
- [ ] Prismaスキーマが型定義に準拠して定義されている
- [ ] 全てのAPIエンドポイントが実装されている
- [ ] REST APIの規約に従った実装になっている
- [ ] 認証・認可が適切に実装されている
- [ ] エラーハンドリングが統一されている
- [ ] 型定義に準拠した実装になっている
- [ ] バリデーションが適切に実装されている
- [ ] データベースマイグレーションが正常に実行できる

---

## 共通の注意事項

1. **型定義の遵守**: `src/types/index.ts`の型定義を必ず使用してください。独自の型定義は作成しないでください。

2. **ブランチ管理**: 各エージェントは指定されたブランチで作業し、定期的にmainブランチから最新の変更をマージしてください。

3. **コミットメッセージ**: 明確で説明的なコミットメッセージを使用してください（例: `feat: プロジェクト一覧ページを実装`）。

4. **コードスタイル**: ESLintの設定に従い、一貫したコードスタイルを保ってください。

5. **依存関係の追加**: 新しいパッケージが必要な場合は、他のエージェントと相談してから追加してください。

6. **テスト**: 可能な限り、実装した機能の動作確認を行ってください。

7. **ドキュメント**: 複雑な実装については、コメントで説明を追加してください。
