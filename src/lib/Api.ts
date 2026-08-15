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

export enum ValueOperator {
  Equals = "Equals",
  Greater = "Greater",
  GreaterEquals = "GreaterEquals",
  Less = "Less",
  LessEquals = "LessEquals",
}

export enum UserOrderBy {
  New = "New",
  Old = "Old",
  Honey = "Honey",
  Name = "Name",
}

export enum SubProperty {
  Row = "Row",
  Column = "Column",
  Date = "Date",
  Month = "Month",
  DayOfMonth = "DayOfMonth",
  DayOfWeek = "DayOfWeek",
  Hour = "Hour",
  Minute = "Minute",
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
  Grid = "Grid",
  Date = "Date",
  Geo = "Geo",
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

export enum BooleanOperator {
  And = "And",
  Or = "Or",
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

export interface CandidateCategoryDistributionResultDto {
  /** @format uuid */
  categoryId?: string;
  /** @format int32 */
  voteCount?: number;
}

export type CandidateCategoryResultDto = CandidateResultDto & {
  distribution?: CandidateCategoryDistributionResultDto[] | null;
};

export interface CandidateCategoryResultDtoPollResultDto {
  candidates?: CandidateCategoryResultDto[] | null;
}

export type CandidateCategoryVoteDto = CandidateVoteDto & {
  /** @format uuid */
  categoryId?: string;
};

export type CandidateChoiceResultDto = CandidateResultDto & object;

export interface CandidateChoiceResultDtoPollResultDto {
  candidates?: CandidateChoiceResultDto[] | null;
}

export type CandidateChoiceVoteDto = CandidateVoteDto & object;

export interface CandidateDateDistributionResultDto {
  /** @format int64 */
  timestamp?: number;
  /** @format int32 */
  voteCount?: number;
}

export type CandidateDateResultDto = CandidateResultDto & {
  distribution?: CandidateDateDistributionResultDto[] | null;
};

export interface CandidateDateResultDtoPollResultDto {
  candidates?: CandidateDateResultDto[] | null;
}

export type CandidateDateVoteDto = CandidateVoteDto & {
  /** @format int64 */
  timestamp?: number;
};

export interface CandidateDto {
  /** @format uuid */
  id?: string;
  name?: string | null;
  description?: string | null;
  isCustom?: boolean;
  mediaKeys?: string[] | null;
}

export interface CandidateGridDistributionResultDto {
  /** @format int32 */
  row?: number;
  /** @format int32 */
  column?: number;
  /** @format int32 */
  voteCount?: number;
}

export type CandidateGridResultDto = CandidateResultDto & {
  distribution?: CandidateGridDistributionResultDto[] | null;
};

export interface CandidateGridResultDtoPollResultDto {
  candidates?: CandidateGridResultDto[] | null;
}

export type CandidateGridVoteDto = CandidateVoteDto & {
  /** @format int32 */
  row?: number;
  /** @format int32 */
  column?: number;
};

export interface CandidateRankDistributionResultDto {
  /** @format int32 */
  rank?: number;
  /** @format int32 */
  voteCount?: number;
}

export type CandidateRankResultDto = CandidateResultDto & {
  distribution?: CandidateRankDistributionResultDto[] | null;
};

export interface CandidateRankResultDtoPollResultDto {
  candidates?: CandidateRankResultDto[] | null;
}

export type CandidateRankVoteDto = CandidateVoteDto & {
  /** @format int32 */
  rank?: number;
};

export interface CandidateResultDto {
  /** @format uuid */
  id?: string;
  name?: string | null;
  isCustom?: boolean;
  /** @format int32 */
  voteCount?: number;
}

export type CandidateScoreResultDto = CandidateResultDto & {
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
};

export interface CandidateScoreResultDtoPollResultDto {
  candidates?: CandidateScoreResultDto[] | null;
}

export type CandidateScoreVoteDto = CandidateVoteDto & {
  /** @format double */
  score?: number;
};

export interface CandidateVoteDto {
  /** @format uuid */
  id?: string | null;
  name?: string | null;
}

export interface CategoryDto {
  /** @format uuid */
  id?: string;
  name?: string | null;
  description?: string | null;
  /** @format int32 */
  color?: number;
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
  dto?: CommentDto | UserHistoryCommentDto | null;
}

export interface CommentDtoPaginationResultDto {
  items?: (CommentDto | UserHistoryCommentDto)[] | null;
  nextCursor?: PaginationCursorDto;
}

export type CommentPaginationDto = PaginationDto & {
  filter?: string | null;
  orderBy?: CommentOrderBy;
};

export interface CommentPostDto {
  title?: string | null;
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
  /** @format double */
  minValue?: number;
  /** @format double */
  maxValue?: number;
  /** @format int32 */
  allowedCustomCandidateCount?: number;
  /** @format int32 */
  minVotes?: number;
  /** @format int32 */
  maxVotes?: number;
  /** @format int32 */
  minVotesPerCandidate?: number;
  /** @format int32 */
  maxVotesPerCandidate?: number;
  /** @format int32 */
  rows?: number | null;
  /** @format int32 */
  columns?: number | null;
  /** @format double */
  stepValue?: number | null;
  dateFilterQuery?: FilterQuery | FilterQueryGroup | null;
  ignoreTimeZone?: boolean | null;
  conditionQuery?: FilterQuery | FilterQueryGroup | null;
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

export type FilterQuery = FilterQueryBase & {
  property?: string | null;
  subProperty?: SubProperty;
  valueOperator?: ValueOperator;
  value?: string | null;
};

export interface FilterQueryBase {
  isNegated?: boolean;
  leftOperator?: BooleanOperator;
}

export type FilterQueryGroup = FilterQueryBase & {
  children?: (FilterQuery | FilterQueryGroup)[] | null;
};

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

export type HivePaginationDto = PaginationDto & {
  filter?: string | null;
  orderBy?: HiveOrderBy;
};

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

export type HiveUserPaginationDto = PaginationDto & {
  filter?: string | null;
  orderBy?: HiveUserOrderBy;
};

export interface PaginationCursorDto {
  cursor?: string | null;
  /** @format uuid */
  id?: string;
}

export interface PaginationDto {
  /** @format int32 */
  pageSize?: number;
  cursor?: PaginationCursorDto;
}

export interface PollDto {
  /** @format uuid */
  id?: string;
  title?: string | null;
  mediaKeys?: string[] | null;
  description?: string | null;
  /** @format int32 */
  allowedCustomCandidateCount?: number;
  isShuffled?: boolean;
  /** @format double */
  minValue?: number;
  /** @format double */
  maxValue?: number;
  /** @format int32 */
  minVotes?: number;
  /** @format int32 */
  maxVotes?: number;
  /** @format int32 */
  minVotesPerCandidate?: number;
  /** @format int32 */
  maxVotesPerCandidate?: number;
  /** @format int32 */
  rows?: number | null;
  /** @format int32 */
  columns?: number | null;
  /** @format double */
  stepValue?: number | null;
  dateFilterQuery?: FilterQuery | FilterQueryGroup | null;
  ignoreTimeZone?: boolean | null;
  conditionQuery?: FilterQuery | FilterQueryGroup | null;
  pollType?: PollType;
  candidates?: CandidateDto[] | null;
  categories?: CategoryDto[] | null;
}

export interface PollVoteDto {
  /** @format uuid */
  id?: string;
  candidates?:
    | (
        | CandidateChoiceVoteDto
        | CandidateScoreVoteDto
        | CandidateRankVoteDto
        | CandidateCategoryVoteDto
        | CandidateGridVoteDto
        | CandidateDateVoteDto
      )[]
    | null;
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

export type PostPaginationDto = PaginationDto & {
  filter?: string | null;
  orderBy?: PostOrderBy;
};

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

export type UserHistoryCommentDto = CommentDto & {
  post?: CommentPostDto;
};

export type UserPaginationDto = PaginationDto & {
  filter?: string | null;
  orderBy?: UserOrderBy;
};

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
      this.request<CommentDto | UserHistoryCommentDto, any>({
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
      this.request<CommentDto | UserHistoryCommentDto, any>({
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
     * @name PostChoiceResultCreate
     * @request POST:/api/Post/choiceResult
     * @secure
     */
    postChoiceResultCreate: (
      data: FilterQuery | FilterQueryGroup,
      query?: {
        /** @format uuid */
        pollId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CandidateChoiceResultDtoPollResultDto, any>({
        path: `/api/Post/choiceResult`,
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
     * @name PostScoreResultCreate
     * @request POST:/api/Post/scoreResult
     * @secure
     */
    postScoreResultCreate: (
      data: FilterQuery | FilterQueryGroup,
      query?: {
        /** @format uuid */
        pollId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CandidateScoreResultDtoPollResultDto, any>({
        path: `/api/Post/scoreResult`,
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
     * @name PostRankResultCreate
     * @request POST:/api/Post/rankResult
     * @secure
     */
    postRankResultCreate: (
      data: FilterQuery | FilterQueryGroup,
      query?: {
        /** @format uuid */
        pollId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CandidateRankResultDtoPollResultDto, any>({
        path: `/api/Post/rankResult`,
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
     * @name PostCategoryResultCreate
     * @request POST:/api/Post/categoryResult
     * @secure
     */
    postCategoryResultCreate: (
      data: FilterQuery | FilterQueryGroup,
      query?: {
        /** @format uuid */
        pollId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CandidateCategoryResultDtoPollResultDto, any>({
        path: `/api/Post/categoryResult`,
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
     * @name PostGridResultCreate
     * @request POST:/api/Post/gridResult
     * @secure
     */
    postGridResultCreate: (
      data: FilterQuery | FilterQueryGroup,
      query?: {
        /** @format uuid */
        pollId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CandidateGridResultDtoPollResultDto, any>({
        path: `/api/Post/gridResult`,
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
     * @name PostDateResultCreate
     * @request POST:/api/Post/dateResult
     * @secure
     */
    postDateResultCreate: (
      data: FilterQuery | FilterQueryGroup,
      query?: {
        /** @format uuid */
        pollId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CandidateDateResultDtoPollResultDto, any>({
        path: `/api/Post/dateResult`,
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
     * @name PostCustomCandidateSuggestionsList
     * @request GET:/api/Post/customCandidateSuggestions
     * @secure
     */
    postCustomCandidateSuggestionsList: (
      query?: {
        /** @format uuid */
        pollId?: string;
        query?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CandidateDto[], any>({
        path: `/api/Post/customCandidateSuggestions`,
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
