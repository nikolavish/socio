export default defineNuxtRouteMiddleware((to, from) => {
  let token = useCookie("X-User-Token").value;

  if (token) {
    return navigateTo({ name: "feed" });
  }
});
