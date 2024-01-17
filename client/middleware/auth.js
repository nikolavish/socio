export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp();
  // if (process.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered)
  //   return;
  // if (process.server) return;
  let token = useCookie("X-User-Token").value;

  if (token != null) {
    let user = await useAPIClient("/validate-token", { method: "POST" });

    if (user.success) {
      useCookie("User-Data").value = JSON.stringify(user.data.user);

      return;
    }
  }
  if (process.client) {
    useCookie("X-User-Token").value = null;
    useCookie("User-Data").value = null;
  } else if (process.server) {
    console.log(to);

    // to.res.setHeader(
    //   "Set-Cookie",
    //   "X-User-Token=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/"
    // );
  }
  return navigateTo(
    { name: "login", query: { to: to.path, logout: true } }
    // { external: true }
  );
});
