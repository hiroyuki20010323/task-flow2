# Agent1: 認証機能担当

## ブランチ情報
- **ブランチ名**: `feature/auth`
- **担当ディレクトリ**: 
  - `src/app/(auth)/`
  - `src/lib/auth/`

## 具体的なタスク一覧

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

## 参照すべき型定義

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

## 編集禁止ファイル
- `src/types/index.ts` - 共有型定義ファイル（編集禁止）
- 他のエージェントの担当ディレクトリ
- `package.json`（依存関係の追加が必要な場合は相談）

## 完了条件
- [ ] NextAuth.jsが正常に動作する
- [ ] ログイン・登録ページが実装され、動作する
- [ ] セッション管理が正常に機能する
- [ ] 型定義に準拠した実装になっている
- [ ] エラーハンドリングが適切に実装されている
- [ ] Tailwind CSSでスタイリングされている
