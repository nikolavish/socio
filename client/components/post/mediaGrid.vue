<script setup>
const props = defineProps({ post: { required: true } });
const trimmedMedia = computed(() => {
  return props.post.post_media.slice(
    0,
    Math.min(4, props.post.post_media.length)
  );
});
const hasMoreMedia = computed(() => props.post.post_media.length > 4);
</script>

<template>
  <div class="media_wrapper" :media="trimmedMedia.length">
      <VCard  v-for="(media, ind) in trimmedMedia" class="media_card pa-0" :index="ind" >
        <img
          class="media_el"
          v-if="!media.isVideo && !media.isDocument"
          :src="useAPIAsset(media.url)"
        />
        <video
          class="media_el"
          v-else-if="media.isVideo"
          :src="useAPIAsset(media.url)"
          autoplay
          muted
        />
          <div v-if="ind == 3 && hasMoreMedia" class="show_more_card text-body-2">See all</div>
    </VCard>
  </div>
</template>

<style scoped>
.media_wrapper {
  /* display: flex; */
}

.media_wrapper[media="2"] {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.media_wrapper[media="2"] .media_card {
  width: 100%;
}

.media_wrapper[media="3"] {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 4px;
  width: 100%;
}

.media_wrapper[media="3"] .media_card[index="0"] {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 3;
}

.media_wrapper[media="3"] .media_card[index="1"] {
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 2;
}

.media_wrapper[media="3"] .media_card[index="2"] {
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 3;
}
.media_wrapper[media="4"] {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 4px;
  width: 100%;
}

.media_wrapper[media="4"] .media_card[index="0"] {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 4;
}

.media_wrapper[media="4"] .media_card[index="1"] {
  grid-column-start: 4;
  grid-column-end: 5;
  grid-row-start: 1;
  grid-row-end: 2;
}

.media_wrapper[media="4"] .media_card[index="2"] {
  grid-column-start: 4;
  grid-column-end: 5;
  grid-row-start: 2;
  grid-row-end: 3;
}

.media_wrapper[media="4"] .media_card[index="3"] {
  grid-column-start: 4;
  grid-column-end: 5;
  grid-row-start: 3;
  grid-row-end: 4;
}

.media_card {
  aspect-ratio: 1;
  width: 100%;
  position: relative;
}
.media_el {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.show_more_card {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
