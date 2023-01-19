import { isNil } from 'lodash';
import { ResponseData, ResponsePagination } from '../types/response.type';

export class Response<T extends ResponseData> {
  data: T | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

export class ArrayResponse<T extends ResponseData> {
  data: T | null = null;
  pagination: ResponsePagination | undefined = undefined;

  constructor(data: T, { pagination }: { pagination?: ResponsePagination }) {
    this.data = data;

    if (!isNil(pagination)) {
      const { count } = pagination;
      this.pagination = {
        count,
      };
    }
  }
}
