import { UserInputError } from '@vtex/api'

export async function executeCall(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: { logger },
    state: { requestBody },
    clients: { executeCallClient },
  } = ctx

  // console.info('executeCall Received requestHeaders:', requestHeaders)
  // console.info('executeCall Received requestBody:', requestBody)

  let response

  switch (requestBody.method) {
    case 'get':
      response = await executeCallClient.get(requestBody.url)
      break

    case 'post':
      response = await executeCallClient.post(requestBody.url, requestBody.body)
      break

    case 'put':
      response = await executeCallClient.put(requestBody.url, requestBody.body)
      break

    default:
      logger.error({
        message: 'Invalid body',
        data: {
          requestBody,
        },
      })
      throw new UserInputError('Invalid method. It must be get, post or put')
  }

  ctx.body = response.data
  ctx.status = response.status

  await next()
}
