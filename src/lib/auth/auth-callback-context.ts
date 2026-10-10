import { AsyncLocalStorage } from "node:async_hooks";

export type AuthCallbackOAuthDetail = {
  error: string | null;
  description: string;
};

const store = new AsyncLocalStorage<AuthCallbackOAuthDetail | undefined>();

export function runWithAuthCallbackOAuthDetail<T>(
  detail: AuthCallbackOAuthDetail | undefined,
  fn: () => T | Promise<T>,
): T | Promise<T> {
  return store.run(detail, fn);
}

export function getAuthCallbackOAuthDetail(): AuthCallbackOAuthDetail | undefined {
  return store.getStore();
}
