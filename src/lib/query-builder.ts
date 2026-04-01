import { makeObservable, observable } from "mobx";
import { PollDto, PollCandidateDto } from "./Api";

export enum ValueOperator {
  Equals = "=",
  Greater = ">",
  GreaterEquals = ">=",
  Less = "<",
  LessEquals = "<=",
}

export enum BooleanOperator {
  And = "AND",
  Or = "OR",
}

export abstract class VoteQueryBase {
  isNegated = false;
  leftOperator: BooleanOperator | null = null;

  public toString(): string {
    let queryExpression = this.getQueryExpression();

    if (this.isNegated) {
      queryExpression = `NOT ${queryExpression}`;
    }

    return queryExpression;
  }

  protected abstract getQueryExpression(): string;
}

export class VoteQueryGroup extends VoteQueryBase {
  children: VoteQueryBase[] = [];

  constructor() {
    super();
    makeObservable(this, {
      children: observable,
      isNegated: observable,
      leftOperator: observable
    });
  }

  protected getQueryExpression(): string {
    const parts: string[] = [];

    for (let i = 0; i < this.children.length; i++) {
      if (i > 0) {
        parts.push(` ${this.children[i].leftOperator} `);
      }

      parts.push(this.children[i].toString());
    }

    return `(${parts.join("")})`;
  }
}

export class VoteQuery extends VoteQueryBase {
  poll: PollDto | null = null;
  candidate: PollCandidateDto | null = null;
  valueOperator: ValueOperator | null = null;
  value: unknown = null;

  constructor() {
    super();
    makeObservable(this, {
      poll: observable,
      candidate: observable,
      valueOperator: observable,
      value: observable,
      isNegated: observable,
      leftOperator: observable
    });
  }

  protected getQueryExpression(): string {
    return `candidateIdPlaceholder${this.valueOperator}${this.value}`;
  }
}