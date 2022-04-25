import { AuthenticationError } from '@vtex/api'

export async function validateVtexIdclientAutCookie(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: { logger },
    state: { requestHeaders, requesterTokenDetails },
    clients: { vtexid },
  } = ctx

  const tokenValidation = await vtexid.validate(
    requestHeaders.requestervtexidclientautcookie,
    requesterTokenDetails.account
  )

  if (tokenValidation.authStatus !== 'Success') {
    logger.error({
      message: 'Invalid RequesterVtexIdclientAutCookie',
      data: {
        requesterTokenDetails,
      },
    })
    throw new AuthenticationError(
      'Invalid RequesterVtexIdclientAutCookie Header'
    )
  }

  // TODO
  // also review policies to align with this url to have a double validation
  // check params url to see if it's an url it can hit

  //   const { url } = requestBody

  //   if (url !== 'valid url to hit' && url !== 'other valid url to hit') {
  //     throw new AuthenticationError('Invalid url')
  //   }

  await next()
}
