import { isAuthApiError } from "@supabase/supabase-js";

const RATE_LIMIT_MESSAGE = "Too many attempts. Wait a minute and try again.";

const EMAIL_RATE_LIMIT_MESSAGE =
  "Too many emails requested. Wait a few minutes before asking for another.";

export function authErrorMessage(error: Error): string {
  if (!isAuthApiError(error)) return error.message;

  if (error.code === "over_email_send_rate_limit")
    return EMAIL_RATE_LIMIT_MESSAGE;

  if (error.code === "over_request_rate_limit" || error.status === 429)
    return RATE_LIMIT_MESSAGE;

  return error.message;
}
