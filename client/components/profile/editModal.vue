<script setup>
const user = useUser();
const showing = defineModel();
const isSaving = ref(false);
const formValues = ref(user.value);

watch(
  () => user,
  () => (formValues.value = user.value)
);

const closeModal = () => {
  showing.value = false;
};

const changeCoverPicture = async () => {
  let input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", async () => {
    let files = input.files;
    if (files[0]) {
      isSaving.value = true;
      let file = files[0];

      let form = new FormData();
      form.set("image", file);
      let req = await useAPIClient("/user/change-cover", { body: form });

      if (req.success) {
        user.value.coverPicture = "";
        setTimeout(() => {
          user.value.coverPicture = req.data.coverPicture + "&t=" + Date.now();
        }, 0);
      }

      isSaving.value = false;
    }
    input.remove();
  });

  input.click();
};

const changeProfilePicture = async () => {
  let input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", async () => {
    let files = input.files;
    if (files[0]) {
      isSaving.value = true;
      let file = files[0];

      let form = new FormData();
      form.set("image", file);
      let req = await useAPIClient("/user/change-profile-picture", {
        body: form,
      });

      if (req.success) {
        user.value.profilePicture = "";
        setTimeout(() => {
          user.value.profilePicture =
            req.data.profilePicture + "&t=" + Date.now();
        }, 0);
      }

      isSaving.value = false;
    }
    input.remove();
  });

  input.click();
};

const updateProfile = async () => {
  isSaving.value = true;
  formValues.value.username = formValues.value.username.trim().toLowerCase();
  let body = {
    displayName: formValues.value.displayName,
    username: formValues.value.username.trim().toLowerCase(),
    biography: formValues.value.biography,
  };

  if (body.displayName == user.value.displayName) {
    delete body.displayName;
  }

  if (body.username == user.value.username) {
    delete body.username;
  }

  if (body.biography == user.value.biography) {
    delete body.biography;
  }
  let req = await useAPIClient("/user/update", {
    body,
  });

  if (req.success) {
    user.value = {
      ...user.value,
      ...body,
    };
    formValues.value = user.value;
    showing.value = false;

    if (body.username) {
      navigateTo({ name: "view-user", params: { username: body.username } });
    }
  }
  isSaving.value = false;
};
</script>

<template>
  <VDialog v-model="showing" max-width="600">
    <VCard :loading="isSaving" :disabled="isSaving">
      <VCardTitle>Edit profile</VCardTitle>
      <VDivider />
      <VCardText>
        <div style="position: relative" class="mb-4">
          <ProfileCoverPicture :coverUrl="user.coverPicture" />
          <div style="position: absolute; right: 8px; top: 8px">
            <VBtn @click="changeCoverPicture" icon="mdi-pencil" />
          </div>
          <div style="position: absolute; left: 8px; bottom: 8px">
            <div>
              <VAvatar :image="useAPIAsset(user.profilePicture)" size="64" />
              <VBtn
                @click="changeProfilePicture"
                icon="mdi-pencil"
                style="position: absolute; top: -8px; right: -8px"
                density="compact"
              />
            </div>
          </div>
        </div>
        <VForm @submit.prevent="updateProfile">
          <VTextField
            v-model="formValues.displayName"
            variant="outlined"
            density="compact"
            label="Display name"
          />
          <VTextField
            v-model="formValues.username"
            variant="outlined"
            density="compact"
            label="Username"
          />
          <VTextarea
            v-model="formValues.biography"
            variant="outlined"
            density="compact"
            label="Biography"
          />
          <div class="d-flex justify-end">
            <VBtn
              class="text-body-2 mr-2"
              @click="closeModal"
              color="primary"
              variant="outline"
              >Close</VBtn
            >
            <VBtn class="text-body-2" color="primary" type="submit"
              >Save changes</VBtn
            >
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
