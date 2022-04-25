import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class Affiliations extends JanusClient {
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

  // https://developers.vtex.com/vtex-rest-api/reference/affiliations
  public async getAffiliationsList(): Promise<any> {
    const url = `/api/fulfillment/pvt/affiliates`

    return this.http.getRaw(url, { metric: 'seller-list' })
  }
}
