export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)

    if (pathname === '/api/students') {
      const { results } = await env.DB.prepare('SELECT * FROM students').all()
      return Response.json(results)
    }

    if (pathname === '/api/events') {
      const { results } = await env.DB.prepare('SELECT * FROM events').all()
      return Response.json(results)
    }

    return env.ASSETS.fetch(request)
  },
}
