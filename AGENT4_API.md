# Agent4: API実装担当

## ブランチ情報
- **ブランチ名**: `feature/api`
- **担当ディレクトリ**: 
  - `src/app/api/`
  - `prisma/`

## 具体的なタスク一覧

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

## 参照すべき型定義

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

## 編集禁止ファイル
- `src/types/index.ts` - 共有型定義ファイル（編集禁止）
- 他のエージェントの担当ディレクトリ（`src/app/(auth)/`, `src/app/(dashboard)/projects/`, `src/app/(dashboard)/tasks/`）
- `src/lib/auth/` - Agent1の担当

## 完了条件
- [ ] Prismaスキーマが型定義に準拠して定義されている
- [ ] 全てのAPIエンドポイントが実装されている
- [ ] REST APIの規約に従った実装になっている
- [ ] 認証・認可が適切に実装されている
- [ ] エラーハンドリングが統一されている
- [ ] 型定義に準拠した実装になっている
- [ ] バリデーションが適切に実装されている
- [ ] データベースマイグレーションが正常に実行できる
