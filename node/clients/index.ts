import { IOClients } from '@vtex/api'

import ExecuteCall from './executeCall'
import Sellers from './sellers'
import Affiliations from './affiliations'
import VtexID from './vtexid'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get executeCallClient() {
    return this.getOrSet('executeCallClient', ExecuteCall)
  }

  public get vtexid() {
    return this.getOrSet('vtexid', VtexID)
  }

  public get sellers() {
    return this.getOrSet('sellers', Sellers)
  }

  public get affiliations() {
    return this.getOrSet('affiliations', Affiliations)
  }
}
