export class MethodNotAllowedError extends Error {
  readonly status: number;
  readonly allow: string;

  constructor(method: string) {
    super(`Method ${method} not allowed`);
    this.name = "MethodNotAllowedError";
    this.status = 405;
    this.allow = "GET, HEAD";
  }
}
