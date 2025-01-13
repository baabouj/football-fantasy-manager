export class HttpError extends Error {
  constructor(
    private readonly status: number,
    private readonly response: string | Record<string, any>
  ) {
    super();
  }

  public getResponse(): string | object {
    return typeof this.response === "object"
      ? this.response
      : {
          statusCode: this.status,
          message: this.response,
        };
  }

  public getStatus(): number {
    return this.status;
  }
}
