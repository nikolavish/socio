export default async (
  endpoint,
  { baseUrl = null, method = "POST", body = null, headers = {} }
) => {
  const baseHeaders = {
    Authorization: useCookie("X-User-Token").value,
  };
  headers = { ...headers, ...baseHeaders };
  baseUrl = baseUrl ?? useRuntimeConfig().public.apiEndpoint;

  if (body && Object.getPrototypeOf(body) != FormData.prototype) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  let req = await fetch(`${baseUrl}${endpoint}`, { method, body, headers });

  return await req.json();
};
