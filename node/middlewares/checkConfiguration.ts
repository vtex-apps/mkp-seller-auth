import atob from 'atob'
import { NotFoundError } from '@vtex/api'

function parseJwt(token: string) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c: string) => {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}

// TODO optimize this to avoid always iterating the whole array
function listContainsAccountId(list: [], accountId: string) {
  // console.info('checkConfiguration accountId: ', accountId)
  const mapped = list.map((elem: any) => {
    console.info('checkConfiguration SellerId: ', elem.SellerId)

    return accountId === elem.SellerId
  })

  return mapped.includes(true)
}

export async function checkConfiguration(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: { logger },
    state: { requestBody, requestHeaders },
    clients: { sellers, affiliations },
  } = ctx

  const requesterTokenDetails = parseJwt(
    requestHeaders.requestervtexidclientautcookie
  )

  // console.warn(
  //   'checkConfiguration requesterTokenDetails: ',
  //   requesterTokenDetails
  // )

  ctx.state.requesterTokenDetails = requesterTokenDetails

  let validConfig = false

  if (requestBody.accountType === 'seller') {
    // check account seller list
    const sellersListResponse = await sellers.getSellerList()

    validConfig = listContainsAccountId(
      sellersListResponse.data,
      requesterTokenDetails.account
    )
  } else if (requestBody.accountType === 'marketplace') {
    // check account affiliations
    const affiliationsListResponse = await affiliations.getAffiliationsList()
    const affiliatedMarketplaces = affiliationsListResponse.data.map( (affiliation: any) => {
      const splittedUri = affiliation.searchURIEndpoint.split('/')
      return { SellerId: splittedUri[splittedUri.length-2] }
    })
    validConfig = listContainsAccountId(
      affiliatedMarketplaces,
      requesterTokenDetails.account
    )
  }

  if (!validConfig) {
    logger.error({
      message: 'Invalid configuration',
      data: {
        requesterTokenDetails,
      },
    })
    throw new NotFoundError(
      'Configuration for account not found. If seller check affiliations (https://{account}.myvtex.com/admin/checkout/#/affiliates). If marketplace check sellers list (https://{account}.myvtex.com/admin/Site/Seller.aspx)'
    )
  }

  await next()
}
