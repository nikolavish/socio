<script setup>
const route = useRoute();
const keywords = ref(route.query.q ?? "");
const nuxtApp = useNuxtApp();

const emitSearch = () => {
  return navigateTo({ name: "search", query: { q: keywords.value } });
};
watch(
  () => route.query.q,
  (val) => (keywords.value = val)
);
</script>

<template>
  <VForm
    @submit.prevent="emitSearch"
    :class="$vuetify.display.smAndUp ? 'flex-grow-0 w-25' : 'w-100'"
  >
    <VTextField
      class="w-100"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      placeholder="Search..."
      density="compact"
      rounded
      v-model="keywords"
    />
  </VForm>
</template>
