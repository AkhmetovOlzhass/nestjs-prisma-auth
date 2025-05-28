import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();

    if (ctx.req && !ctx.req.header) {
      ctx.req.header = (name: string) => ctx.req.headers?.[name.toLowerCase()];
    }

    return {
      req: ctx.req,
      res: ctx.res ?? {
        setHeader: () => {},
        getHeader: () => null,
      },
    };
  }
}
