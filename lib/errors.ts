export function getSupabaseErrorMessage(error: any) {
  // Supabase 에러 코드에 따른 메시지 매핑
  const errorMessages: { [key: string]: string } = {
    "23505": "이미 가입된 이메일입니다.",
    "23514": "잘못된 입력값입니다.",
    "23503": "참조 무결성 오류가 발생했습니다.",
    "401": "인증에 실패했습니다.",
    "400": "잘못된 요청입니다.",
    "422": "이미 가입된 이메일입니다.",
  };

  // PostgreSQL 에러 코드
  if (error.code) {
    return errorMessages[error.code] || "알 수 없는 에러가 발생했습니다.";
  }

  // Supabase AuthError
  if (error.message) {
    if (error.message.includes("User already registered")) {
      return "이미 가입된 이메일입니다.";
    }
    if (error.message.includes("Password should be at least")) {
      return "비밀번호가 너무 짧습니다.";
    }
    if (error.message.includes("Email not confirmed")) {
      return "이메일 인증이 필요합니다.";
    }
    return error.message;
  }

  return "알 수 없는 에러가 발생했습니다.";
}
