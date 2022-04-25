import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class VtexID extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...options?.headers,
        'x-vtex-user-agent': context.userAgent,
      },
    })
  }

  // https://developers.vtex.com/vtex-rest-api/reference/catalog-api-get-seller-list
  public async validate(token: string, account: string): Promise<any> {
    const url = `/api/vtexid/credential/validate?an=${account}`

    return this.http.post(url, { token }, { metric: 'vtexid-validate' })
  }
}
