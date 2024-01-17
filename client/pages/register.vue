<script setup>
import Joi from "joi";
import validation from "@/utils/validation";

definePageMeta({ name: "register", middleware: ["guest"], layout: false });
const isLoading = ref(false);
const formValues = ref({
  displayName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  agree: false,
});
const formErrors = ref({
  displayName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  agree: false,
});
const canSubmit = ref(false);
const formRules = Joi.object({
  username: Joi.string()
    .required()
    .min(1)
    .max(30)
    .regex(/^(?!.*[._]{2,})(?!^[._])(?!^[0-9])(?!.*[._]$)[a-zA-Z0-9._]{1,30}$/),
  password: Joi.string().required().min(8).max(30),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")),
  email: Joi.string().required().email({ tlds: false }),
  displayName: Joi.string().optional().allow(""),
  agree: Joi.bool().required().valid(true),
});
const formError = ref(false);
const router = useRouter();

const validateForm = () => {
  let validationResult = validation(formRules, formValues.value);

  formErrors.value = validationResult.errors;
  canSubmit.value = validationResult.canSubmit;
};

const onSubmit = async () => {
  formError.value = false;
  isLoading.value = true;

  let res = await useAPIClient("/register", { body: formValues.value });

  if (res.success) {
    useCookie("X-User-Token").value = res.data.token;
    useCookie("User-Data").value = res.data.user;
    navigateTo({ name: "feed" });
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
              :error-messages="formErrors.displayName"
              required
              v-model="formValues.displayName"
              type="text"
              label="Display Name"
              variant="outlined"
            />
            <VTextField
              @input="validateForm"
              :error-messages="formErrors.username"
              required
              v-model="formValues.username"
              type="text"
              label="Username"
              variant="outlined"
            />
            <VTextField
              @input="validateForm"
              :error-messages="formErrors.email"
              required
              v-model="formValues.email"
              type="email"
              label="E-mail Address"
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
            <VTextField
              @input="validateForm"
              :error-messages="formErrors.confirmPassword"
              required
              v-model="formValues.confirmPassword"
              type="password"
              label="Confirm password"
              variant="outlined"
            />
            <VCheckbox
              @input="validateForm"
              :error-messages="formErrors.agree"
              v-model="formValues.agree"
              label="By checking this, I've read and agree to the Privacy Policy"
            />
            <VBtn
              :disabled="!canSubmit"
              type="submit"
              :loading="isLoading"
              color="primary"
            >
              Create account</VBtn
            >
          </VForm>
        </VCardText>
        <VDivider />
        <VCardText>
          <NuxtLink :to="{ name: 'login' }">Or sign in instead</NuxtLink>
        </VCardText>
      </VCard>
    </VContainer>
  </VLayout>
</template>
