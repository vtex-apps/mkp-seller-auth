import { json } from 'co-body'
import { UserInputError } from '@vtex/api'

export async function validateRequest(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      logger,
      route: { params },
    },
  } = ctx

  const body = await json(ctx.req)
  // console.info('validateRequest Received params:', params)
  // console.info('validateRequest Received body: ', body)

  if (body.accountType !== 'seller' && body.accountType !== 'marketplace') {
    logger.error({
      message: 'Invalid body',
      data: {
        body,
      },
    })
    throw new UserInputError(
      'Invalid accountType. It must be seller or marketplace'
    )
  }

  if (
    body.method !== 'get' &&
    body.method !== 'post' &&
    body.method !== 'put'
  ) {
    logger.error({
      message: 'Invalid body',
      data: {
        body,
      },
    })
    throw new UserInputError('Invalid method. It must be get, post or put')
  }

  ctx.state.params = params
  ctx.state.requestBody = body
  ctx.state.requestHeaders = ctx.headers

  console.info('validateRequest passed')

  await next()
}
