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

export enum UserOrderBy {
  New = "New",
  Old = "Old",
  Honey = "Honey",
  Name = "Name",
}

export enum PostOrderBy {
  New = "New",
  Old = "Old",
  Hot = "Hot",
}

export enum PollType {
  Choice = "Choice",
  Score = "Score",
  Rank = "Rank",
  Category = "Category",
}

export enum MemberRole {
  Guest = "Guest",
  Follower = "Follower",
  Moderator = "Moderator",
  Admin = "Admin",
  Creator = "Creator",
}

export enum HiveUserOrderBy {
  New = "New",
  Old = "Old",
}

export enum HiveOrderBy {
  New = "New",
  Old = "Old",
  Users = "Users",
}

export enum CommentOrderBy {
  New = "New",
  Old = "Old",
  Best = "Best",
}

export enum ApprovalStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  Banned = "Banned",
}

export interface BooleanHoneyDeltaDto {
  /** @format double */
  honeyDelta?: number;
  dto?: boolean;
}

export interface CandidateDistributionResultDto {
  /** @format uuid */
  id?: string;
  /** @format int32 */
  voteCount?: number;
  distribution?: CandidationDistributionResultValueDto[] | null;
}

export interface CandidateDistributionResultDtoPollResultDto {
  /** @format uuid */
  id?: string;
  title?: string | null;
  mediaKeys?: string[] | null;
  description?: string | null;
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
  candidates?: CandidateDistributionResultDto[] | null;
  categories?: CategoryDto[] | null;
}

export interface CandidateDto {
  /** @format uuid */
  id?: string;
  name?: string | null;
  description?: string | null;
  mediaKeys?: string[] | null;
}

export interface CandidateStatisticsResultDto {
  /** @format int32 */
  voteCount?: number;
  /** @format uuid */
  id?: string;
  /** @format double */
  min?: number;
  /** @format double */
  q1?: number;
  /** @format double */
  median?: number;
  /** @format double */
  q3?: number;
  /** @format double */
  max?: number;
  /** @format double */
  average?: number;
}

export interface CandidateStatisticsResultDtoPollResultDto {
  /** @format uuid */
  id?: string;
  title?: string | null;
  mediaKeys?: string[] | null;
  description?: string | null;
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
  candidates?: CandidateStatisticsResultDto[] | null;
  categories?: CategoryDto[] | null;
}

export interface CandidateSumResultDto {
  /** @format uuid */
  id?: string;
  /** @format int32 */
  voteCount?: number;
}

export interface CandidateSumResultDtoPollResultDto {
  /** @format uuid */
  id?: string;
  title?: string | null;
  mediaKeys?: string[] | null;
  description?: string | null;
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
  candidates?: CandidateSumResultDto[] | null;
  categories?: CategoryDto[] | null;
}

export interface CandidateVoteDto {
  /** @format uuid */
  id?: string;
  /** @format int32 */
  value?: number | null;
}

export interface CandidationDistributionResultValueDto {
  /** @format double */
  value?: number;
  /** @format int32 */
  voteCount?: number;
}

export interface CategoryDto {
  /** @format uuid */
  id?: string;
  name?: string | null;
  description?: string | null;
  /** @format int32 */
  color?: number;
  /** @format int32 */
  value?: number;
}

export interface CommentDto {
  user?: UserDto;
  role?: MemberRole;
  /** @format uuid */
  id?: string;
  /** @format uuid */
  postId?: string;
  /** @format uuid */
  parentCommentId?: string | null;
  content?: string | null;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string | null;
  /** @format int32 */
  replyCount?: number;
  isOriginalPoster?: boolean;
}

export interface CommentDtoHoneyDeltaDto {
  /** @format double */
  honeyDelta?: number;
  dto?: CommentDto;
}

export interface CommentDtoPaginationResultDto {
  items?: CommentDto[] | null;
  nextCursor?: PaginationCursorDto;
}

export interface CommentPaginationDto {
  /** @format int32 */
  pageSize?: number;
  cursor?: PaginationCursorDto;
  filter?: string | null;
  orderBy?: CommentOrderBy;
}

export interface CreateCandidateDto {
  name?: string | null;
  description?: string | null;
  media?: UploadMediaRequestDto;
}

export interface CreateCategoryDto {
  name?: string | null;
  description?: string | null;
  /** @format int32 */
  color?: number;
}

export interface CreateCommentDto {
  /** @format uuid */
  postId?: string;
  /** @format uuid */
  parentCommentId?: string | null;
  content?: string | null;
}

export interface CreateHiveDto {
  name?: string | null;
  description?: string | null;
}

export interface CreatePollDto {
  title?: string | null;
  description?: string | null;
  media?: UploadMediaRequestDto;
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
  candidates?: CreateCandidateDto[] | null;
  categories?: CreateCategoryDto[] | null;
}

export interface CreatePostDto {
  /** @format uuid */
  hiveId?: string | null;
  polls?: CreatePollDto[] | null;
}

export interface EditCommentDto {
  /** @format uuid */
  commentId?: string;
  newContent?: string | null;
}

export interface HiveDto {
  /** @format uuid */
  id?: string;
  name?: string | null;
  description?: string | null;
  /** @format date-time */
  createdAt?: string;
  /** @format int32 */
  postCount?: number;
  /** @format int32 */
  userCount?: number;
  settings?: HiveSettingsDto;
}

export interface HiveDtoPaginationResultDto {
  items?: HiveDto[] | null;
  nextCursor?: PaginationCursorDto;
}

export interface HivePaginationDto {
  /** @format int32 */
  pageSize?: number;
  cursor?: PaginationCursorDto;
  filter?: string | null;
  orderBy?: HiveOrderBy;
}

export interface HiveSettingsDto {
  isPrivate?: boolean;
  joinRequiresApproval?: boolean;
  /** @format double */
  minHoneyToJoin?: number;
  postRequiresApproval?: boolean;
  /** @format double */
  minHoneyToPost?: number;
  minRoleToPost?: MemberRole;
  /** @format double */
  minHoneyToComment?: number;
  minRoleToComment?: MemberRole;
}

export interface HiveUserDto {
  /** @format uuid */
  id?: string;
  hive?: HiveDto;
  user?: UserDto;
  approvalStatus?: ApprovalStatus;
  role?: MemberRole;
  /** @format date-time */
  createdAt?: string;
}

export interface HiveUserDtoPaginationResultDto {
  items?: HiveUserDto[] | null;
  nextCursor?: PaginationCursorDto;
}

export interface HiveUserPaginationDto {
  /** @format int32 */
  pageSize?: number;
  cursor?: PaginationCursorDto;
  filter?: string | null;
  orderBy?: HiveUserOrderBy;
}

export interface PaginationCursorDto {
  cursor?: string | null;
  /** @format uuid */
  id?: string;
}

export interface PollDto {
  /** @format uuid */
  id?: string;
  title?: string | null;
  mediaKeys?: string[] | null;
  description?: string | null;
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
  candidates?: CandidateDto[] | null;
  categories?: CategoryDto[] | null;
}

export interface PollVoteDto {
  /** @format uuid */
  id?: string;
  candidates?: CandidateVoteDto[] | null;
}

export interface PostDto {
  hive?: HiveDto;
  creator?: UserDto;
  role?: MemberRole;
  /** @format uuid */
  id?: string;
  polls?: PollDto[] | null;
  /** @format int32 */
  commentCount?: number;
  /** @format int32 */
  voteCount?: number;
  /** @format date-time */
  createdAt?: string;
  /** @format double */
  hotness?: number;
  approvalStatus?: ApprovalStatus;
  isDraft?: boolean;
}

export interface PostDtoHoneyDeltaDto {
  /** @format double */
  honeyDelta?: number;
  dto?: PostDto;
}

export interface PostDtoPaginationResultDto {
  items?: PostDto[] | null;
  nextCursor?: PaginationCursorDto;
}

export interface PostPaginationDto {
  /** @format int32 */
  pageSize?: number;
  cursor?: PaginationCursorDto;
  filter?: string | null;
  orderBy?: PostOrderBy;
}

export interface PostVoteDto {
  /** @format uuid */
  id?: string;
  polls?: PollVoteDto[] | null;
}

export interface UploadCandidateDto {
  /** @format uuid */
  id?: string;
  mediaUploadUrls?: string[] | null;
}

export interface UploadMediaRequestDto {
  contentType?: string | null;
  /** @format int64 */
  contentLength?: number;
  /** @format int64 */
  thumbnailContentLength?: number;
}

export interface UploadPollDto {
  /** @format uuid */
  id?: string;
  mediaUploadUrls?: string[] | null;
  candidates?: UploadCandidateDto[] | null;
}

export interface UploadPostDto {
  /** @format uuid */
  id?: string;
  polls?: UploadPollDto[] | null;
}

export interface UserDetailsDto {
  /** @format uuid */
  id?: string;
  username?: string | null;
  /** @format double */
  honey?: number;
  isVerified?: boolean;
  /** @format date-time */
  dateOfBirth?: string | null;
  settings?: UserSettingsDto;
}

export interface UserDto {
  /** @format uuid */
  id?: string;
  username?: string | null;
  /** @format date-time */
  createdAt?: string;
  /** @format double */
  honey?: number;
  isVerified?: boolean;
}

export interface UserDtoPaginationResultDto {
  items?: UserDto[] | null;
  nextCursor?: PaginationCursorDto;
}

export interface UserPaginationDto {
  /** @format int32 */
  pageSize?: number;
  cursor?: PaginationCursorDto;
  filter?: string | null;
  orderBy?: UserOrderBy;
}

export interface UserProfileDto {
  /** @format uuid */
  id?: string;
  username?: string | null;
  /** @format double */
  honey?: number;
  /** @format int32 */
  postCount?: number;
  /** @format int32 */
  commentCount?: number;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  lastLogin?: string;
}

export interface UserSettingsDto {
  country?: string | null;
  shareDateOnVote?: boolean;
  shareCountryOnVote?: boolean;
  shareAgeOnVote?: boolean;
  protectVoteOnFilter?: boolean;
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
     * @tags Comment
     * @name CommentGetList
     * @request GET:/api/Comment/get
     * @secure
     */
    commentGetList: (
      query?: {
        /** @format uuid */
        commentId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CommentDto, any>({
        path: `/api/Comment/get`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Comment
     * @name CommentCreateCreate
     * @request POST:/api/Comment/create
     * @secure
     */
    commentCreateCreate: (data: CreateCommentDto, params: RequestParams = {}) =>
      this.request<CommentDtoHoneyDeltaDto, any>({
        path: `/api/Comment/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Comment
     * @name CommentEditPartialUpdate
     * @request PATCH:/api/Comment/edit
     * @secure
     */
    commentEditPartialUpdate: (
      data: EditCommentDto,
      params: RequestParams = {},
    ) =>
      this.request<CommentDto, any>({
        path: `/api/Comment/edit`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Comment
     * @name CommentDeleteDelete
     * @request DELETE:/api/Comment/delete
     * @secure
     */
    commentDeleteDelete: (
      query?: {
        /** @format uuid */
        commentId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Comment/delete`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Comment
     * @name CommentBrowseCreate
     * @request POST:/api/Comment/browse
     * @secure
     */
    commentBrowseCreate: (
      data: CommentPaginationDto,
      query?: {
        /** @format uuid */
        userId?: string;
        /** @format uuid */
        postId?: string;
        /** @format uuid */
        parentCommentId?: string;
        onlyRoot?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<CommentDtoPaginationResultDto, any>({
        path: `/api/Comment/browse`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hive
     * @name HiveGetList
     * @request GET:/api/Hive/get
     * @secure
     */
    hiveGetList: (
      query?: {
        /** @format uuid */
        hiveId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HiveDto, any>({
        path: `/api/Hive/get`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hive
     * @name HiveJoinedList
     * @request GET:/api/Hive/joined
     * @secure
     */
    hiveJoinedList: (
      query?: {
        /** @format uuid */
        userId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HiveUserDto[], any>({
        path: `/api/Hive/joined`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hive
     * @name HiveJoinCreate
     * @request POST:/api/Hive/join
     * @secure
     */
    hiveJoinCreate: (
      query?: {
        /** @format uuid */
        hiveId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HiveUserDto, any>({
        path: `/api/Hive/join`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hive
     * @name HiveUsersCreate
     * @request POST:/api/Hive/users
     * @secure
     */
    hiveUsersCreate: (
      data: HiveUserPaginationDto,
      query?: {
        /** @format uuid */
        hiveId?: string;
        status?: ApprovalStatus;
      },
      params: RequestParams = {},
    ) =>
      this.request<HiveUserDtoPaginationResultDto, any>({
        path: `/api/Hive/users`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hive
     * @name HiveModifyUserPartialUpdate
     * @request PATCH:/api/Hive/modifyUser
     * @secure
     */
    hiveModifyUserPartialUpdate: (
      query?: {
        /** @format uuid */
        followRequestId?: string;
        approvalStatus?: ApprovalStatus;
        role?: MemberRole;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Hive/modifyUser`,
        method: "PATCH",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hive
     * @name HiveBanUserPartialUpdate
     * @request PATCH:/api/Hive/banUser
     * @secure
     */
    hiveBanUserPartialUpdate: (
      query?: {
        /** @format uuid */
        userId?: string;
        /** @format uuid */
        hiveId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Hive/banUser`,
        method: "PATCH",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hive
     * @name HiveLeaveDelete
     * @request DELETE:/api/Hive/leave
     * @secure
     */
    hiveLeaveDelete: (
      query?: {
        /** @format uuid */
        followId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Hive/leave`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hive
     * @name HiveBrowseCreate
     * @request POST:/api/Hive/browse
     * @secure
     */
    hiveBrowseCreate: (data: HivePaginationDto, params: RequestParams = {}) =>
      this.request<HiveDtoPaginationResultDto, any>({
        path: `/api/Hive/browse`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hive
     * @name HiveCreateCreate
     * @request POST:/api/Hive/create
     * @secure
     */
    hiveCreateCreate: (data: CreateHiveDto, params: RequestParams = {}) =>
      this.request<HiveUserDto, any>({
        path: `/api/Hive/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hive
     * @name HiveUpdatePartialUpdate
     * @request PATCH:/api/Hive/update
     * @secure
     */
    hiveUpdatePartialUpdate: (data: HiveDto, params: RequestParams = {}) =>
      this.request<HiveDto, any>({
        path: `/api/Hive/update`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostGetList
     * @request GET:/api/Post/get
     * @secure
     */
    postGetList: (
      query?: {
        /** @format uuid */
        postId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PostDto, any>({
        path: `/api/Post/get`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostBrowseCreate
     * @request POST:/api/Post/browse
     * @secure
     */
    postBrowseCreate: (
      data: PostPaginationDto,
      query?: {
        /** @format uuid */
        creatorId?: string;
        /** @format uuid */
        hiveId?: string;
        approvalStatus?: ApprovalStatus;
      },
      params: RequestParams = {},
    ) =>
      this.request<PostDtoPaginationResultDto, any>({
        path: `/api/Post/browse`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostPublishPartialUpdate
     * @request PATCH:/api/Post/publish
     * @secure
     */
    postPublishPartialUpdate: (
      query?: {
        /** @format uuid */
        postId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PostDtoHoneyDeltaDto, any>({
        path: `/api/Post/publish`,
        method: "PATCH",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostCreateCreate
     * @request POST:/api/Post/create
     * @secure
     */
    postCreateCreate: (data: CreatePostDto, params: RequestParams = {}) =>
      this.request<UploadPostDto, any>({
        path: `/api/Post/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostDeleteDelete
     * @request DELETE:/api/Post/delete
     * @secure
     */
    postDeleteDelete: (
      query?: {
        /** @format uuid */
        postId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Post/delete`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostModifyPostPartialUpdate
     * @request PATCH:/api/Post/modifyPost
     * @secure
     */
    postModifyPostPartialUpdate: (
      query?: {
        /** @format uuid */
        postId?: string;
        approvalStatus?: ApprovalStatus;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Post/modifyPost`,
        method: "PATCH",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostSumResultList
     * @request GET:/api/Post/sumResult
     * @secure
     */
    postSumResultList: (
      query?: {
        /** @format uuid */
        pollId?: string;
        filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CandidateSumResultDtoPollResultDto, any>({
        path: `/api/Post/sumResult`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostStatisticsResultList
     * @request GET:/api/Post/statisticsResult
     * @secure
     */
    postStatisticsResultList: (
      query?: {
        /** @format uuid */
        pollId?: string;
        filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CandidateStatisticsResultDtoPollResultDto, any>({
        path: `/api/Post/statisticsResult`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostDistributionResultList
     * @request GET:/api/Post/distributionResult
     * @secure
     */
    postDistributionResultList: (
      query?: {
        /** @format uuid */
        pollId?: string;
        filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CandidateDistributionResultDtoPollResultDto, any>({
        path: `/api/Post/distributionResult`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostVoteCreate
     * @request POST:/api/Post/vote
     * @secure
     */
    postVoteCreate: (data: PostVoteDto, params: RequestParams = {}) =>
      this.request<BooleanHoneyDeltaDto, any>({
        path: `/api/Post/vote`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserMergeList
     * @request GET:/api/User/merge
     * @secure
     */
    userMergeList: (
      query?: {
        previousJwt?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/User/merge`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserMeList
     * @request GET:/api/User/me
     * @secure
     */
    userMeList: (params: RequestParams = {}) =>
      this.request<UserDetailsDto, any>({
        path: `/api/User/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserBrowseCreate
     * @request POST:/api/User/browse
     * @secure
     */
    userBrowseCreate: (data: UserPaginationDto, params: RequestParams = {}) =>
      this.request<UserDtoPaginationResultDto, any>({
        path: `/api/User/browse`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserProfileList
     * @request GET:/api/User/profile
     * @secure
     */
    userProfileList: (
      query?: {
        /** @format uuid */
        userId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserProfileDto, any>({
        path: `/api/User/profile`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserLoginList
     * @request GET:/api/User/login
     * @secure
     */
    userLoginList: (params: RequestParams = {}) =>
      this.request<UserDetailsDto, any>({
        path: `/api/User/login`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserUpdateCreate
     * @request POST:/api/User/update
     * @secure
     */
    userUpdateCreate: (data: UserDetailsDto, params: RequestParams = {}) =>
      this.request<UserDetailsDto, any>({
        path: `/api/User/update`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
