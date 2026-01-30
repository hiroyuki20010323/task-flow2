import bcrypt from 'bcryptjs';
import type { User, LoginCredentials, RegisterData } from '@/types';

/**
 * パスワードをハッシュ化する
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * パスワードを検証する
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * メールアドレスのバリデーション
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * パスワードのバリデーション
 * - 最低8文字
 * - 英数字を含む
 */
export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return {
      valid: false,
      message: 'パスワードは8文字以上である必要があります',
    };
  }

  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'パスワードは英数字を含む必要があります',
    };
  }

  return { valid: true };
}

/**
 * ログイン認証情報のバリデーション
 */
export function validateLoginCredentials(
  credentials: LoginCredentials
): { valid: boolean; message?: string } {
  if (!credentials.email || !credentials.password) {
    return {
      valid: false,
      message: 'メールアドレスとパスワードを入力してください',
    };
  }

  if (!validateEmail(credentials.email)) {
    return {
      valid: false,
      message: '有効なメールアドレスを入力してください',
    };
  }

  return { valid: true };
}

/**
 * 登録データのバリデーション
 */
export function validateRegisterData(
  data: RegisterData
): { valid: boolean; message?: string } {
  if (!data.email || !data.password) {
    return {
      valid: false,
      message: 'メールアドレスとパスワードを入力してください',
    };
  }

  if (!validateEmail(data.email)) {
    return {
      valid: false,
      message: '有効なメールアドレスを入力してください',
    };
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  return { valid: true };
}
