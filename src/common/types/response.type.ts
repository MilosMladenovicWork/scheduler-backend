export type Response = {
  data: ResponseData;
  pagination?: { count: ResponsePagination };
};

export type ResponseData = object[] | object;

export type ResponsePagination = { count: number };
