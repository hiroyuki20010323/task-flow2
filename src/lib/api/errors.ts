import type { ApiError, ApiResponse } from '@/types';

export class ApiException extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiException';
  }

  toResponse(): ApiResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

// 一般的なエラー
export class BadRequestError extends ApiException {
  constructor(message: string, details?: unknown) {
    super('BAD_REQUEST', message, 400, details);
  }
}

export class UnauthorizedError extends ApiException {
  constructor(message: string = '認証が必要です') {
    super('UNAUTHORIZED', message, 401);
  }
}

export class ForbiddenError extends ApiException {
  constructor(message: string = 'アクセス権限がありません') {
    super('FORBIDDEN', message, 403);
  }
}

export class NotFoundError extends ApiException {
  constructor(resource: string = 'リソース') {
    super('NOT_FOUND', `${resource}が見つかりません`, 404);
  }
}

export class ConflictError extends ApiException {
  constructor(message: string, details?: unknown) {
    super('CONFLICT', message, 409, details);
  }
}

export class InternalServerError extends ApiException {
  constructor(message: string = 'サーバーエラーが発生しました') {
    super('INTERNAL_SERVER_ERROR', message, 500);
  }
}

// エラーハンドリングヘルパー
export function handleApiError(error: unknown): Response {
  if (error instanceof ApiException) {
    return Response.json(error.toResponse(), { status: error.statusCode });
  }

  // 予期しないエラー
  const internalError = new InternalServerError();
  console.error('Unexpected error:', error);
  return Response.json(internalError.toResponse(), { status: 500 });
}
