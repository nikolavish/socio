<script setup>
import Joi from "joi";
import validation from "@/utils/validation";

definePageMeta({ name: "login", layout: false });
const router = useRouter();
const route = useRoute();
if (route.query.logout) {
  useCookie("X-User-Token").value = null;
  useCookie("User-Data").value = null;
  navigateTo({ name: "login", query: { to: route.query.to } });
}

const isLoading = ref(false);
const canSubmit = ref(false);
const formError = ref(false);
const formValues = ref({
  username: "",
  password: "",
});
const formErrors = ref({
  username: "",
  password: "",
});
const formRules = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const validateForm = () => {
  let validationResult = validation(formRules, formValues.value);

  formErrors.value = validationResult.errors;
  canSubmit.value = validationResult.canSubmit;
};

const onSubmit = async () => {
  formError.value = false;
  isLoading.value = true;

  let res = await useAPIClient("/login", { body: formValues.value });

  if (res.success) {
    useCookie("X-User-Token").value = res.data.token;
    useCookie("User-Data").value = res.data.user;
    router.push({ name: "feed" }, undefined, { reload: true });
  } else {
    formError.value = res.data.message;
  }
  isLoading.value = false;
};
</script>
<template>
  <VLayout full-height>
    <VContainer>
      <VCard
        :loading="isLoading"
        :disabled="isLoading"
        max-width="480"
        location="center center"
      >
        <VCardTitle class="my-3">{{ $t("welcome") }}</VCardTitle>
        <VDivider />
        <VCardText>
          <VForm @submit.prevent="onSubmit">
            <VAlert v-if="formError" color="error" class="mb-3">{{
              formError
            }}</VAlert>
            <VTextField
              @input="validateForm"
              :error-messages="formErrors.username"
              required
              v-model="formValues.username"
              type="text"
              label="Username / E-mail address"
              variant="outlined"
            />
            <VTextField
              @input="validateForm"
              :error-messages="formErrors.password"
              required
              v-model="formValues.password"
              type="password"
              label="Password"
              variant="outlined"
            />
            <VBtn
              :disabled="!canSubmit"
              type="submit"
              :loading="isLoading"
              color="primary"
            >
              Login</VBtn
            >
          </VForm>
        </VCardText>
        <VDivider />
        <VCardText>
          <NuxtLink :to="{ name: 'register' }">Or create an account</NuxtLink>
        </VCardText>
      </VCard>
    </VContainer>
  </VLayout>
</template>
