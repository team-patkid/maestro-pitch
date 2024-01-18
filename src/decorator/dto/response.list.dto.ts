export class ResponseListDto<T> {
  public result: boolean;

  public data: {
    total: number;
    list: Array<T>;
  };

  constructor(data: Array<T>, total?: number, result = true) {
    this.result = result;
    this.data = {
      total: total ? total : data.length,
      list: data,
    };
  }
}
