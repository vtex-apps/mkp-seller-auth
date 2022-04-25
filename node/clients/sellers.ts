import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class Sellers extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdclientAutCookie:
          context.adminUserAuthToken ?? context.authToken ?? '',
        'x-vtex-user-agent': context.userAgent,
      },
    })
  }

  // https://developers.vtex.com/vtex-rest-api/reference/catalog-api-get-seller-list
  public async getSellerList(
    tradePolicy?: string,
    sellerType?: string,
    isBetterScope?: boolean
  ): Promise<any> {
    let url = `/api/catalog_system/pvt/seller/list?an=${this.context.account}`

    if (tradePolicy) {
      url += `&${tradePolicy}`
    }

    if (sellerType) {
      url += `&${sellerType}`
    }

    if (isBetterScope) {
      url += `&${isBetterScope}`
    }

    return this.http.getRaw(url, { metric: 'seller-list' })
  }
}
