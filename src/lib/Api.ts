/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum PollType {
  SingleChoice = "SingleChoice",
  MultipleChoice = "MultipleChoice",
  Scoring = "Scoring",
  Ranking = "Ranking",
  Categorization = "Categorization",
}

export interface CreatePollDto {
  title?: string | null;
  description?: string | null;
  allowCustomAnswer?: boolean;
  isShuffled?: boolean;
  isOptional?: boolean;
  /** @format int32 */
  minValue?: number | null;
  /** @format int32 */
  maxValue?: number | null;
  /** @format double */
  stepValue?: number | null;
  /** @format int32 */
  minVotes?: number | null;
  /** @format int32 */
  maxVotes?: number | null;
  pollType?: PollType;
  candidates?: PollCandidateDto[] | null;
  categories?: PollCategoryDto[] | null;
}

export interface CreatePostDto {
  title?: string | null;
  description?: string | null;
  polls?: CreatePollDto[] | null;
}

export interface ListPollDto {
  title?: string | null;
  description?: string | null;
  allowCustomAnswer?: boolean;
  isShuffled?: boolean;
  isOptional?: boolean;
  /** @format int32 */
  minValue?: number;
  /** @format int32 */
  maxValue?: number;
  /** @format double */
  stepValue?: number | null;
  /** @format int32 */
  minVotes?: number;
  /** @format int32 */
  maxVotes?: number;
  pollType?: PollType;
  candidates?: PollCandidateDto[] | null;
  categories?: PollCategoryDto[] | null;
}

export interface ListPostDto {
  /** @format int32 */
  id?: number;
  title?: string | null;
  description?: string | null;
  polls?: ListPollDto[] | null;
}

export interface LoginDto {
  username?: string | null;
  token?: string | null;
}

export interface PollCandidateDto {
  name?: string | null;
  description?: string | null;
}

export interface PollCandidateResultDto {
  name?: string | null;
  description?: string | null;
  /** @format int32 */
  voterAmount?: number;
  /** @format int32 */
  score?: number;
}

export interface PollCategoryDto {
  name?: string | null;
  description?: string | null;
  /** @format int32 */
  color?: number;
}

export interface PollResultsDto {
  pollType?: PollType;
  candidates?: PollCandidateResultDto[] | null;
}

export interface PostResultsDto {
  polls?: PollResultsDto[] | null;
  country?: PollResultsDto;
  date?: PollResultsDto;
}

export interface UpsertVoteToCandidateDto {
  /** @format int32 */
  value?: number | null;
}

export interface UpsertVoteToPollDto {
  candidates?: UpsertVoteToCandidateDto[] | null;
}

export interface UpsertVoteToPostDto {
  /** @format int32 */
  postId?: number;
  polls?: UpsertVoteToPollDto[] | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title hivemime-backend
 * @version 1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthLoginList
     * @request GET:/api/Auth/login
     * @secure
     */
    authLoginList: (params: RequestParams = {}) =>
      this.request<LoginDto, any>({
        path: `/api/Auth/login`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostBrowseList
     * @request GET:/api/post/browse
     * @secure
     */
    postBrowseList: (params: RequestParams = {}) =>
      this.request<ListPostDto[], any>({
        path: `/api/post/browse`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostCreateCreate
     * @request POST:/api/post/create
     * @secure
     */
    postCreateCreate: (data: CreatePostDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/post/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserList
     * @request GET:/api/User
     * @secure
     */
    userList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/User`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Vote
     * @name PostDetail
     * @request GET:/api/post/{postId}
     * @secure
     */
    postDetail: (postId: number, params: RequestParams = {}) =>
      this.request<PostResultsDto, any>({
        path: `/api/post/${postId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Vote
     * @name PostVoteCreate
     * @request POST:/api/post/{postId}/vote
     * @secure
     */
    postVoteCreate: (
      postId: string,
      data: UpsertVoteToPostDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/post/${postId}/vote`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
