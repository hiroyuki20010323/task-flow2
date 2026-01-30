import { NextResponse } from 'next/server';
import type { RegisterData, AuthResponse } from '@/types';
import { validateRegisterData, hashPassword } from '@/lib/auth/utils';

/**
 * ユーザー登録API
 * TODO: データベースにユーザーを保存する実装が必要
 */
export async function POST(request: Request) {
  try {
    const body: RegisterData = await request.json();

    // バリデーション
    const validation = validateRegisterData(body);
    if (!validation.valid) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: validation.message || '入力内容が無効です',
        },
        { status: 400 }
      );
    }

    // TODO: データベースでメールアドレスの重複チェック
    // const existingUser = await getUserByEmail(body.email);
    // if (existingUser) {
    //   return NextResponse.json<AuthResponse>(
    //     {
    //       success: false,
    //       error: 'このメールアドレスは既に登録されています',
    //     },
    //     { status: 400 }
    //   );
    // }

    // パスワードをハッシュ化
    const hashedPassword = await hashPassword(body.password);

    // TODO: データベースにユーザーを保存
    // const user = await createUser({
    //   email: body.email,
    //   password: hashedPassword,
    //   name: body.name,
    // });

    // モックレスポンス
    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: '登録が完了しました',
        // user: {
        //   id: user.id,
        //   email: user.email,
        //   name: user.name,
        //   createdAt: user.createdAt,
        //   updatedAt: user.updatedAt,
        // },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        error: '登録処理中にエラーが発生しました',
      },
      { status: 500 }
    );
  }
}
