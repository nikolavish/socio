<script setup>
definePageMeta({ name: "view-user", middleware: ["auth"] });
const route = useRoute();
const myUser = useUser();
const showingEditProfile = ref(false);

const getUserData = async () => {
  let user = false;
  if (route.params.username == myUser.value.username) {
    user = myUser.value;
  }
  let req = await useAPIClient("/user/get?username=" + route.params.username, {
    method: "GET",
  });

  if (req.success) {
    user = req.data.user;
  }

  return user;
};

const followUser = async () => {
  let follow = await useUserActions.followUser(user.value.username);

  if (follow.success) {
    user.value.followerCount++;
    user.value.isFollowing = true;
  }
};

const unfollowUser = async () => {
  let follow = await useUserActions.unfollowUser(user.value.username);

  if (follow.success) {
    user.value.followerCount--;
    user.value.isFollowing = false;
  }
};

const userData = useAsyncData(
  async () => {
    if(process.client)return;
    return await getUserData();
  },
  { server: true, }
);
const user = ref(process.server ? userData.data : false);

onMounted(async () => {
  if (user.value === false && process.client) {
    user.value = await getUserData();
  }
});

const toggleEditProfile = () => {
  showingEditProfile.value = true;
};
</script>

<template>
  <div class="user-intro">
    <ProfileCoverPicture :coverUrl="user.coverPicture" />
    <div class="user-data d-flex">
      <VAvatar size="96" :image="useAPIAsset(user.profilePicture)" />
      <div class="ml-2 d-flex flex-column justify-center">
        <p class="text-h6 font-weight-bold">{{ user.displayName }}</p>
        <p class="text-disabled text-body-2">@{{ user.username }}</p>
        <p class="text-disabled text-body-2">
          <VBtn variant="plain" density="compact" class="text-body-2 px-0"
            >{{ user.followerCount }} Followers
          </VBtn>
          &middot;
          <VBtn variant="plain" density="compact" class="text-body-2 px-0"
            >{{ user.followingCount }} Following
          </VBtn>
          &middot;
          {{ user.postCount }} Posts
        </p>
      </div>
    </div>
  </div>
  <VRow class="mt-2">
    <VCol cols="12" class="d-flex">
      <div class="ml-auto d-flex">
        <VBtn
          v-if="user.username == myUser.username"
          variant="tonal"
          class="text-body-2"
          color="primary"
          @click="toggleEditProfile"
          >Edit profile</VBtn
        >
        <VBtn
          v-else-if="!user.isFollowing"
          @click.prevent="() => followUser(user)"
          prepend-icon="mdi-plus"
          class="text-body-2"
          color="primary"
          >Follow</VBtn
        >
        <VBtn
          v-else-if="user.isFollowing"
          @click.prevent="() => unfollowUser(user)"
          prepend-icon="mdi-plus"
          class="text-body-2"
          variant="tonal"
          color="primary"
          >Following</VBtn
        >
      </div>
    </VCol>
    <VCol cols="12" lg="4">
      <VCard>
        <VCardText>
          <h5 class="text-h6 mb-2">Biography</h5>
          <p v-if="user.biography">{{ user.biography }}</p>
          <p v-else class="text-body-2 text-disabled">No biography provided.</p>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" lg="8">
      <PostCreatePostCard
        v-if="user.username == myUser.username"
        class="mb-4"
      />
      <PostFeedListing :user="route.params.username" />
    </VCol>
  </VRow>
  <ProfileEditModal v-model="showingEditProfile" />
</template>

<style scoped>
.user-intro {
  position: relative;
}
.user-intro .user-data {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
}
.cover-pic img {
  object-fit: cover !important;
}
</style>
