/** Small shared helpers used by every API route, regardless of which AI
 *  provider backs that route. */
export function errorResponse(message: string, status = 500) {
  return Response.json({ ok: false, error: message }, { status });
}
