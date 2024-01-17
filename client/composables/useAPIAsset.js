export default (url) => {
  if (!url) return url;
  if (url[0] == "/") {
    url = url.substring(1);
  }
  const runtimeConfig = useRuntimeConfig();

  return runtimeConfig.public.apiEndpoint + "/" + url;
};
