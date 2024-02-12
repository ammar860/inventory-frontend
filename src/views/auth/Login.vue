<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">
      <b-link
        class="brand-logo d-flex justify-content-center align-items-center"
      >
        <img :src="this.appLogoImage" width="75" height="75" />
        <div class="d-none d-lg-block">
          <h1 class="text-white m-0 ml-1 display-5 font-weight-bolder">
            {{ this.appFullName }}
          </h1>
        </div>
        <div class="d-lg-none">
          <h2 class="brand-text text-primary m-0 ml-1">
            {{ this.appFullName }}
          </h2>
        </div>
      </b-link>

      <b-col lg="8" class="d-none d-lg-flex align-items-center p-5">
        <div class="overlay"></div>
        <div
          class="w-100 d-lg-flex align-items-center justify-content-center"
        ></div>
      </b-col>

      <b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
        <b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
          <b-card-title title-tag="h2" class="font-weight-bold mb-1">
            Welcome to
            <span class="font-weight-bolder text-primary"
              >{{ this.appFullName }}!</span
            >
          </b-card-title>
          <b-card-text class="mb-2">
            Please sign-in to your account
          </b-card-text>

          <validation-observer ref="loginFormValidation">
            <b-form class="auth-login-form mt-2" @submit.prevent>
              <b-form-group label="Username" label-for="username">
                <validation-provider
                  #default="{ errors }"
                  name="Username"
                  rules="required"
                >
                  <b-form-input
                    id="username"
                    v-model="username"
                    :state="errors.length > 0 ? false : null"
                    name="username"
                    placeholder="Ali"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group label="Password" label-for="password">
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="password"
                      v-model="password"
                      :state="errors.length > 0 ? false : null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="password"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-button
                type="submit"
                variant="primary"
                block
                @click="validateForm"
              >
                Sign in
              </b-button>
            </b-form>
          </validation-observer>
        </b-col>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import { $themeConfig } from "@themeConfig";
import { mapActions, mapGetters } from "vuex";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility, util],
  data() {
    return {
      appName: "",
      appFullName: "",
      appFullName: "",
      password: "",
      username: "",
      required,
    };
  },
  created() {
    this.appName = $themeConfig.app.appName;
    this.appFullName = $themeConfig.app.appFullName;
    this.appLogoImage = $themeConfig.app.appLogoImage;
  },
  methods: {
    ...mapActions({ login: "appData/login" }),
    async validateForm() {
      const success = await this.$refs.loginFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const res = await this.login({
          username: this.username,
          password: this.password,
        });
        if (res.status === 200) {
          this.$swal({
            title: "Logged in successfully",
            icon: "success",
          });
          this.$router.push({ name: "User" });
        }
      } catch (error) {
        this.displayError(error);
      }
    },
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
    ...mapGetters({ hasRole: "appData/hasRole" }),
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>

<style scoped>
.overlay {
  background: rgba(9, 65, 32, 0.7) url("~@/assets/images/slider/01.jpg");
  background-size: cover;
  position: absolute;
  background-blend-mode: multiply;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  -webkit-transition: all 0.4s ease-in-out 0s;
  -moz-transition: all 0.4s ease-in-out 0s;
  transition: all 0.4s ease-in-out 0s;
}
</style>
