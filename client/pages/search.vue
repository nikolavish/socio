<script setup>
import useUserActions from "~/composables/useUserActions";

definePageMeta({ name: "search", middleware: ["auth"] });
const isLoading = ref(true);
const route = useRoute();
const results = ref(null);
const page = ref(0);
const runtimeConfig = useRuntimeConfig();
const myUser = useUser();

const handleSearch = async () => {
  let urlQuery = new URLSearchParams({
    q: route.query.q,
    page,
  });
  let req = await useAPIClient("/search?" + urlQuery, { method: "GET" });

  results.value = req.data;
  console.log(req.data);
  isLoading.value = false;
};

watch(
  () => route.query.q,
  () => {
    handleSearch();
  }
);

onMounted(() => {
  handleSearch();
});

const followUser = async (user) => {
  let follow = await useUserActions.followUser(user.username);

  if (follow.success) {
    results.value.users = results.value.users.map((u) => {
      if (u.username == user.username) {
        u.isFollowing = true;
      }
      return u;
    });
  }
};

const unfollowUser = async (user) => {
  let follow = await useUserActions.unfollowUser(user.username);

  if (follow.success) {
    results.value.users = results.value.users.map((u) => {
      if (u.username == user.username) {
        u.isFollowing = false;
      }
      return u;
    });
  }
};
</script>

<template>
  <VRow>
    <VCol v-if="$vuetify.display.lgAndUp" lg="3"> </VCol>
    <VCol cols="12" lg="6" style="position: relative">
      <VCard variant="text" :loading="isLoading" :disabled="isLoading">
        <VCardText>
          <div class="result-listing">
            <div v-if="results?.users?.length">
              <VCard :hover="false">
                <VCard
                  v-for="user in results.users"
                  variant="flat"
                  :to="{
                    name: 'view-user',
                    params: { username: user.username },
                  }"
                >
                  <div class="d-flex align-start pa-4">
                    <VAvatar
                      :image="
                        runtimeConfig.public.apiEndpoint + user.profilePicture
                      "
                      size="52"
                    />
                    <div class="ml-2 w-100">
                      <div
                        class="d-flex align-center justify-between"
                        style="height: 52px"
                      >
                        <p>
                          <span class="text-body-1 font-weight-bold">{{
                            user.displayName
                          }}</span
                          ><span class="text-disabled">
                            &middot; @{{ user.username }}</span
                          >
                        </p>
                        <div class="ml-auto d-flex">
                          <VBtn
                            v-if="user.username == myUser.username"
                            variant="tonal"
                            class="text-body-2"
                            color="primary"
                            >View profile</VBtn
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
                      </div>
                      <p
                        class="text-body-2 text-disabled mt-2"
                        v-if="user.biography"
                      >
                        {{ user.biography }}
                      </p>
                    </div>
                  </div>
                </VCard>
              </VCard>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol v-if="$vuetify.display.lgAndUp" lg="3"></VCol>
  </VRow>
</template>

<style scoped>
.result-listing {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
