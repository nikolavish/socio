<script setup>
const post = defineModel();
const isLiking = ref(false);
const commentsShowed = ref(false);
const reactions = useReaction();

const likePost = async (id) => {
  isLiking.value = true;
  let req = await useUserActions.likePost(post.value.slug, id);

  if (req.success) {
    if (!post.value.reactionType) {
      post.value.reactionCount++;
    }
    post.value.reactionType = id;
  }
  isLiking.value = false;
};
const unlikePost = async () => {
  isLiking.value = true;
  let req = await useUserActions.unlikePost(post.value.slug);

  if (req.success) {
    if (post.value.reactionType) {
      post.value.reactionCount--;
    }
    post.value.reactionType = false;
  }
  isLiking.value = false;
};
const toggleComments = () => {
  commentsShowed.value = !commentsShowed.value;
};

const getCurrentReaction = () => {
  if (post.value.reactionType) {
    return reactions.value.find(
      (reaction) => reaction.id == post.value.reactionType
    );
  }
  return reactions.value[0];
};

const isCurrentReaction = (id) => {
  return post.value.reactionType == id;
};
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex">
        <VAvatar
          :image="useAPIAsset(post.user.profilePicture)"
          rounded="circle"
          size="32"
          class="mt-2"
        />
        <div class="d-flex flex-column align-stretch ml-2 flex-grow-1">
          <div style="height: 52px">
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex flex-column">
                <NuxtLink
                  :to="{
                    name: 'view-user',
                    params: { username: post.user.username },
                  }"
                  style="text-decoration: none"
                >
                  <span class="text-body-1 font-weight-bold">{{
                    post.user.displayName
                  }}</span
                  ><span class="text-disabled">
                    &middot; @{{ post.user.username }}</span
                  >
                </NuxtLink>
                <span class="text-body-2 text-disabled">{{
                  useMoment().relativeDate(post.createdAt)
                }}</span>
              </div>
              <VMenu location="bottom end">
                <template #activator="{props}">
                  <VBtn v-bind="props" v-if="post.user.username == useUser().value.username" icon="mdi-dots-horizontal" size="32" />
                </template>
                <VCard min-width="200">
                  <VBtn prepend-icon="mdi-pencil" class="text-body-2 align-left w-100 d-flex align-center justify-start px-4 py-2" >Edit post</VBtn>
                  <VBtn prepend-icon="mdi-delete" class="text-body-2 align-left w-100 d-flex align-center justify-start px-4 py-2" >Delete post</VBtn>
                </VCard>
              </VMenu>
            </div>
          </div>
          <p>{{ post.content }}</p>
          <PostMediaGrid :post="post" />
        </div>
      </div>
    </VCardText>
    <div class="d-flex align-center justify-space-between px-2 pb-2">
      <p class="text-body-2 text-disabled">
        <span v-if="post.reactionCount == 1">
          {{ post.reactionCount }} reaction
        </span>
        <span v-else-if="post.reactionCount > 1">
          {{ post.reactionCount }} reactions
        </span>
        <span v-else>Be the first to react</span>
      </p>
      <p class="text-body-2 text-disabled">
        <span v-if="post.commentCount == 1"
          >{{ post.commentCount }} comment</span
        >
        <span v-else-if="post.commentCount != 1"
          >{{ post.commentCount }} comments</span
        >
        &middot;
        <span v-if="post.shareCount == 1">{{ post.shareCount }} share</span>
        <span v-else-if="post.shareCount != 1"
          >{{ post.shareCount }} shares</span
        >
      </p>
    </div>
    <VDivider />
    <VRow no-gutters>
      <VCol cols="4" class="d-flex">
        <div class="custom-reaction">
          <VCard rounded="pill" class="reaction-wrapper">
            <VBtn
              v-for="reaction in reactions"
              :color="isCurrentReaction(reaction.id) ? 'primary' : undefined"
              :icon="reaction.icon"
              :title="reaction.name"
              @click="
                isCurrentReaction(reaction.id)
                  ? unlikePost()
                  : likePost(reaction.id)
              "
              density="compact"
              size="40"
            />
          </VCard>
          <VBtn
            :disabled="isLiking"
            rounded="0"
            :prepend-icon="getCurrentReaction()?.icon"
            density="comfortable"
            class="flex-grow-1 text-body-2"
            height="40"
            :color="post.reactionType ? 'primary' : null"
            :variant="post.reactionType ? 'tonal' : null"
            @click="
              post.reactionType
                ? unlikePost()
                : likePost(getCurrentReaction()?.id)
            "
            >{{ getCurrentReaction()?.name }}</VBtn
          >
        </div>
      </VCol>
      <VCol cols="4" class="d-flex"
        ><VBtn
          rounded="0"
          prepend-icon="mdi-comment"
          density="comfortable"
          class="flex-grow-1 text-body-2"
          height="40"
          @click="toggleComments"
          >Comment</VBtn
        ></VCol
      >
      <VCol cols="4" class="d-flex"
        ><VBtn
          rounded="0"
          prepend-icon="mdi-share"
          density="comfortable"
          class="flex-grow-1 text-body-2"
          height="40"
          >Share
        </VBtn></VCol
      >
    </VRow>
    <VDivider />
    <PostComments v-model="post" v-if="commentsShowed" />
  </VCard>
</template>

<style scoped>
.custom-reaction {
  position: relative;
  display: flex;
  flex-grow: 1;
}
.custom-reaction .reaction-wrapper {
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  transform: translateY(-100%);
  z-index: 10;
  padding: 8px;
  display: flex;
  gap: 4px;
  pointer-events: none;
}
.custom-reaction:not([disabled]):hover > .reaction-wrapper {
  opacity: 1;
  pointer-events: all;
}
</style>
