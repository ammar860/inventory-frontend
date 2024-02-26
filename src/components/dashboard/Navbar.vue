<template>
  <div style="height: 5%">
    <div class="d-flex justify-content-center align-items-center h-100 bg-primary">
      <b-link class="text-white my-nav-item my-nav-link d-flex align-items-center" :to="{ name: 'OfficerProperty' }"
        v-if="hasPermission('show_officer_property')">
        <feather-icon icon="HomeIcon" size="16" class="mr-50 text-white" />
        <span>Home</span>
      </b-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {

  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
  },
  methods: {
    reloadPage() {
      window.location.reload();
    },
  },

};
</script>

<style></style>