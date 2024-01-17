<script setup>
const user = useUser();
</script>

<template>
  <VCard :to="{ name: 'view-user', params: { username: user?.username } }">
    <div>
      <div>
        <ProfileCoverPicture :coverUrl="user?.coverPicture" />
      </div>
      <div class="mt-n8 d-flex align-center justify-center">
        <VAvatar
          :image="useAPIAsset(user?.profilePicture)"
          size="64"
        />
      </div>
    </div>
    <VCardText>
      <div class="d-flex flex-column">
        <span class="text-h6 text-center">{{ user?.displayName }}</span>
        <span class="text-body-2 text-center text-disabled mb-2"
          >@{{ user?.username }}</span
        >
      </div>
      <VRow>
        <VCol cols="4" class="d-flex flex-column align-center">
          <span class="font-weight-bold text-h6">{{
            user?.followerCount
          }}</span>
          <span class="text-body-2 text-disabled">Followers</span>
        </VCol>
        <VCol cols="4" class="d-flex flex-column align-center">
          <span class="font-weight-bold text-h6">{{
            user?.followingCount
          }}</span>
          <span class="text-body-2 text-disabled">Following</span>
        </VCol>
        <VCol cols="4" class="d-flex flex-column align-center">
          <span class="font-weight-bold text-h6">{{ user?.postCount }}</span>
          <span class="text-body-2 text-disabled">Posts</span>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
