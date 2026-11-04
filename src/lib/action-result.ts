/**
 * What every Server Action returns. Plain data only (it crosses to the
 * client): actions never throw to the browser.
 */
export type FieldErrors = Record<string, string[]>;

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: string;
      fieldErrors?: FieldErrors;
      /** Correlates the user's message with the server log line. */
      requestId?: string;
    };

export const idle = null;
export type ActionState<T = undefined> = ActionResult<T> | null;
