<script setup>

definePageMeta({ name: "feed", middleware: ["auth"] });
</script>

<template>
  <VRow class="mt-2">
    <VCol v-if="$vuetify.display.lgAndUp" lg="3">
      <CardMyProfile/>
    </VCol>
    <VCol cols="12" lg="6" style="position: relative"
      ><PostCreatePostCard
    />
    <PostFeedListing class="mt-4"/>
  
  </VCol>
    <VCol v-if="$vuetify.display.lgAndUp" lg="3">
      <VCard style="top: 16px; position: sticky">a</VCard></VCol
    >
  </VRow>
</template>
