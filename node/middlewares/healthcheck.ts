export async function healthcheck(ctx: Context, next: () => Promise<any>) {
  ctx.status = 200
  ctx.body = { timestamp: Date.now() }

  await next()
}
