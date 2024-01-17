export default () => {
  const didFetch = useState("reactions-didfetch", () => false);

  const getReactions = async () => {
    let req = await useAPIClient("/reference/reactions", { method: "GET" });

    return req.data.reactions;
  };
  let reactions;
  if (process.server) {
    const reactionList = useAsyncData(
      async () => {
        return await getReactions();
      },
      { server: true }
    );
    reactions = useState("reactions", () => reactionList.data);
  } else {
    reactions = useState("reactions", () => []);
  }

  onMounted(async () => {
    if (reactions.value.length < 1 && process.client) {
      if (didFetch.value) return;
      didFetch.value = true;
      reactions.value = await getReactions();
    }
  });

  return reactions;
};
