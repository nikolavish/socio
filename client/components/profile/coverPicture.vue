<script setup>
const props = defineProps({ coverUrl: { required: true } });
</script>

<template>
  <div class="cover-photo">
    <img :src="useAPIAsset(props.coverUrl)" />
    <div class="overlay" />
  </div>
</template>

<style scoped>
.cover-photo {
  aspect-ratio: 3;
  width: 100%;
  display: flex;
  position: relative;
}
.cover-photo img {
  flex-grow: 1;
  object-fit: cover;
}

.cover-photo .overlay{
  position: absolute;
  inset: 0;
  display: block;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8));
}
</style>
