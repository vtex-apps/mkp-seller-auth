import type { InstanceOptions, IOContext, IOResponse } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class ExecuteCall extends JanusClient {
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

  public async get(url: string): Promise<IOResponse<string>> {
    return this.http.getRaw(url, {
      metric: 'mkp-seller-auth-get',
    })
  }

  public async post(url: string, body: any): Promise<IOResponse<string>> {
    return this.http.postRaw(url, body, {
      metric: 'mkp-seller-auth-post',
    })
  }

  public async put(url: string, body: any): Promise<IOResponse<string>> {
    return this.http.putRaw(url, body, {
      metric: 'mkp-seller-auth-put',
    })
  }
}
