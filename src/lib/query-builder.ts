import { makeObservable, observable } from "mobx";
import { PollDto, CandidateDto } from "./Api";

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
  leftOperator: BooleanOperator = BooleanOperator.And;

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
  candidate: CandidateDto | null = null;
  valueOperator: ValueOperator | null = null;
  value: number | null = null;

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
    return `${this.candidate?.id}${this.valueOperator}${this.value}`;
  }
}