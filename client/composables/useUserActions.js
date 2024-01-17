export default {
  async followUser(username) {
    let req = await useAPIClient("/user/follow", {
      method: "POST",
      body: { username },
    });

    return req;
  },
  async unfollowUser(username) {
    let req = await useAPIClient("/user/unfollow", {
      method: "POST",
      body: { username },
    });

    return req;
  },
  async likePost(post, reactionId) {
    let req = await useAPIClient("/post/react", {
      body: { post, reactionId },
    });

    return req;
  },
  async unlikePost(post) {
    let req = await useAPIClient("/post/delete-reaction", {
      method:"DELETE",
      body: { post },
    });

    return req;
  },
};
