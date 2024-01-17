<script setup>
const post = defineModel();
const comments = ref([]);
const commentForm = ref({ content: "" });

const addComment = async () => {
  let req = await useAPIClient("/post/comment/create", {
    body: { content: commentForm.value.content, post: post.value.slug },
  });

  if (req.success) {
    comments.value.push({
      ...commentForm.value,
      user: useUser().value,
      createdAt: Date.now(),
    });
    commentForm.value.content = "";
    post.value.commentCount++;
  }
};
</script>
<template>
  <VCardText class="d-flex flex-column">
    <div v-for="comment in comments">
      <div class="d-flex align-start w-100 my-2">
        <VAvatar
          :image="useAPIAsset(comment.user.profilePicture)"
          size="40"
          class="mb-2"
        />
        <div>
          <div
            style="min-height: 40px"
            class="ml-2 d-flex flex-column justify-center"
          >
            <NuxtLink
              :to="{
                name: 'view-user',
                params: { username: comment.user.username },
              }"
              style="text-decoration: none"
            >
              <span class="text-body-1 font-weight-bold">{{
                comment.user.displayName
              }}</span
              ><span class="text-disabled">
                &middot; @{{ comment.user.username }}</span
              >
            </NuxtLink>
            <span class="text-body-2 text-disabled">{{
              useMoment().relativeDate(comment.createdAt)
            }}</span>
          </div>
          <p class="text-body-2 mt-2 mb-2 ml-2">{{ comment.content }}</p>
          <div>
            <div class="d-flex">
              <VBtn
                prepend-icon="mdi-thumb-up"
                variant="text"
                density="compact"
                class="pa-0 px-2 text-body-2"
              >
                Like
              </VBtn>
              <VBtn
                prepend-icon="mdi-comment"
                variant="text"
                density="compact"
                class="pa-0 px-2 text-body-2"
              >
                Reply
              </VBtn>
              <VBtn
                prepend-icon="mdi-pencil"
                variant="text"
                density="compact"
                class="pa-0 px-2 text-body-2"
                v-if="comment.user.id == useUser().id"
              >
                Edit
              </VBtn>
              <VBtn
                prepend-icon="mdi-delete"
                variant="text"
                density="compact"
                class="pa-0 px-2 text-body-2"
                v-if="comment.user.id == useUser().id"
              >
                Delete
              </VBtn>
            </div>
          </div>
        </div>
      </div>
      <VDivider />
    </div>
    <VForm @submit.prevent="addComment">
      <VTextarea
        density="compact"
        variant="outlined"
        rows="2"
        class="text-body-2"
        hide-details
        placeholder="Your comment"
        no-resize
        v-model="commentForm.content"
      />
      <div class="d-flex">
        <VBtn
          type="submit"
          prepend-icon="mdi-comment"
          color="primary"
          class="text-body-2 mt-2 ml-auto"
          >Comment</VBtn
        >
      </div>
    </VForm>
  </VCardText>
</template>
