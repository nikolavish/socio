<script setup>
const props = defineProps({ user: { default: false } });

const page = ref(1);
const reachedEnd = ref(false);

const fetchPosts = async () => {
  let query = new URLSearchParams({ page: page.value });
  console.log(props.user);
  if (props.user) query.set("username", props.user);
  let req = await useAPIClient("/feed?" + query, { method: "GET" });

  if (req.success) {
    if(req.data.posts.length < 10){
      reachedEnd.value = true;
    }
    page.value++;
    return req.data.posts;
  }
};

// const postData = useAsyncData(async () => {
//   return await fetchPosts();
// });
// const posts = ref(process.server ? postData.data : []);
const posts = ref([]);

onMounted(async () => {
  window.addEventListener("prepend-post", (event) => {
    console.log(event.detail.post);
    posts.value = [event.detail.post, ...posts.value];
  });
  // if (posts.value.length < 1 && process.client) {
  posts.value = await fetchPosts();
  // }
});

const load = async (props) => {
  posts.value.push(...await fetchPosts());
  console.log(props);
  props.done();
};
</script>

<template>
  <VInfiniteScroll
    mode="manual"
    v-if="posts"
    class="listing-feed"
    @load="load" 
  >
    <template v-for="(post, index) in posts">
      <PostSingle v-model="posts[index]" />
    </template>
    <template #load-more v-if="reachedEnd">

    </template>
  </VInfiniteScroll>
</template>

<style scoped>
.listing-feed {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
}
</style>
