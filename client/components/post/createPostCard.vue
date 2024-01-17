<script setup>
const user = useUser();
const formValues = ref({ content: "", files: [] });
const isPublishing = ref(false);

const isAlreadySelected = (filename) => {
  return formValues.value.files.find((file) => file.file.name == filename);
};

const generatePreview = (file) => {
  return new Promise((res, rej) => {
    let fr = new FileReader();
    fr.addEventListener("load", () => {
      res(fr.result);
    });

    fr.readAsDataURL(file);
  });
};
const removeFile = (file) => {
  formValues.value.files = formValues.value.files.filter((f) => f != file);
};

const addFile = () => {
  let fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.multiple = true;
  fileInput.accept = "image/*,video/*";
  fileInput.addEventListener("change", async () => {
    if (fileInput.files) {
      for (let file of fileInput.files) {
        // TODO: Add handling for overwriting files
        if (!isAlreadySelected(file.name)) {
          let preview = await generatePreview(file);
          let type = file.type.split("/")[0];
          formValues.value.files.push({ file, preview, type });
        }
      }
    }
    fileInput.remove();
  });
  fileInput.click();
};

const publishPost = async () => {
  isPublishing.value = true;

  let formData = new FormData();
  formData.set("content", formValues.value.content);
  for (let file of formValues.value.files) {
    formData.append("media", file.file);
  }
  let req = await useAPIClient("/post/create", {
    method: "put",
    body: formData,
  });

  if (req.success) {
    user.value.postCount++;
    formValues.value = { content: "", files: [] };

    dispatchEvent(
      new CustomEvent("prepend-post", { detail: { post: req.data.post } })
    );

  }

  isPublishing.value = false;
};
</script>

<template>
  <VCard :loading="isPublishing" :disabled="isPublishing">
    <VCardText>
      <div class="d-flex">
        <VAvatar
          :image="useAPIAsset(user?.profilePicture)"
          rounded="circle"
          size="32"
          class="mt-2"
        />
        <VForm class="flex-grow-1">
          <div class="ml-2 d-flex flex-column">
            <VTextarea
              hide-details=""
              variant="outlined"
              placeholder="What's on your mind..."
              density="compact"
              maxlength="100"
              no-resize
              name="content"
              v-model="formValues.content"
            />
            <div class="my-2 media-list">
              <VCard
                @click="() => removeFile(file)"
                variant="flat"
                v-for="file in formValues.files"
              >
                <VAvatar
                  v-if="file.type == 'image'"
                  :image="file.preview"
                  size="64"
                  rounded
                />
                <video
                  v-if="file.type == 'video'"
                  :src="file.preview"
                  width="64"
                  height="64"
                  autoplay
                  muted
                />
              </VCard>
              <VBtn variant="tonal" class="media-el" @click="addFile">
                <VIcon icon="mdi-plus" size="16" />
              </VBtn>
            </div>
            <div class="d-flex align-center justify-end">
              <VBtn
                type="submit"
                color="primary"
                variant="flat"
                class="ml-2 text-body-2"
                @click.prevent="publishPost"
                :loading="isPublishing"
                >Publish post</VBtn
              >
            </div>
          </div>
        </VForm>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped>
.media-list {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.media-list .media-el {
  aspect-ratio: 1;
  height: 64px;
  display: grid;
  place-items: center;
}
</style>
