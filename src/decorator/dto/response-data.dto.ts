export class ResponseDataDto<T> {
  public result: boolean;

  public data: T;

  constructor(data: T, result = true) {
    this.result = result;
    this.data = data;
  }
}
