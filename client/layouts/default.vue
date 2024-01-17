<script setup>
import Logo from "~/components/logo.vue";

const runtimeConfig = useRuntimeConfig();
const user = useUser();
const currentTab = computed(() => {
  switch (route.name) {
    case "feed":
      return 0;
    default:
      return -1;
  }
});
const route = useRoute();

const logoutUser = () => {
  navigateTo({ name: "login", query: { logout: true } });
};

onMounted(() => {
  console.log(currentTab);
});
</script>

<template>
  <div style="position: sticky; left: 0; top: 0; right: 0; z-index: 10">
    <VRow>
      <VCol cols="12">
        <VCard
          :loading="!user"
          rounded="0"
          class="d-flex align-center justify-center"
        >
          <VContainer
            class="screen-container d-flex justify-between align-center ma-0 pa-0"
          >
            <VCardText>
              <div class="d-flex justify-start align-center">
                <NuxtLink :to="{ name: 'feed' }"
                  ><Logo fill="white" style="height: 24px"
                /></NuxtLink>
                <HeaderSearchBar />
              </div>
            </VCardText>
            <div
              class="d-flex align-center justify-end"
              v-if="$vuetify.display.lgAndUp"
            >
              <VTabs v-model="currentTab" height="40">
                <VTab
                  :to="{ name: 'feed' }"
                  prepend-icon="mdi-home"
                  class="text-body-2"
                  >Home</VTab
                >
                <!-- <VTab prepend-icon="mdi-compass" class="text-body-2"
                    >Explore</VTab
                  >
                  <VTab prepend-icon="mdi-bell" class="text-body-2"
                    >Notifications</VTab
                  > -->
              </VTabs>
              <VMenu
                :close-on-content-click="true"
                width="280"
                location="bottom right"
              >
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    variant="flat"
                    density="default"
                    height="48"
                  >
                    <div class="d-flex justify-center align-center">
                      <VAvatar
                        :image="
                          useAPIAsset(user?.profilePicture)
                        "
                        size="24"
                      />
                      <span class="text-body-2 ml-2">{{
                        user?.displayName
                      }}</span>
                    </div>
                  </VBtn>
                </template>
                <VCard>
                  <VCard
                    :to="{
                      name: 'view-user',
                      params: { username: user?.username },
                    }"
                    class="d-flex justify-start align-center w-100 pa-2"
                  >
                    <VAvatar
                      class="mr-2"
                      :image="useAPIAsset(user?.profilePicture)"
                      size="32"
                    />
                    <div class="d-flex flex-column align-start">
                      <span class="text-body-2">{{ user?.displayName }}</span>
                      <p class="text-body-2 text-disabled">Go to profile</p>
                    </div>
                  </VCard>
                  <VDivider />
                  <HeaderMenuButton label="Settings" icon="mdi-cog" />
                  <HeaderMenuButton
                    @click="logoutUser"
                    label="Log out"
                    icon="mdi-logout"
                  />
                </VCard>
              </VMenu>
            </div>
          </VContainer>
        </VCard>
      </VCol>
    </VRow>
  </div>
  <VContainer class="screen-container pt-0">
    <slot />
  </VContainer>
</template>

<style scoped>
.screen-container {
  max-width: 1280px;
}
.selected-tab {
  border: none;
  background-color: rgb(var(--v-theme-background));
}
</style>
