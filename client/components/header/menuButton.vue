<script setup>
const props = defineProps({
  label: { required: true },
  icon: { default: false },
});
</script>
<template>
  <VBtn
    variant="text"
    class="d-flex justify-start align-center w-100 text-body-2"
    :prepend-icon="props.icon"
  >
    {{ props.label }}
  </VBtn>
</template>
