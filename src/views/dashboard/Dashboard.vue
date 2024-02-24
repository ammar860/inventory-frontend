<template>
    <div style="height: 100vh">
        <Topbar />
        <Navbar :selectedOrganization="selectedOrganization" />
        <Main />
        <Footer />
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Topbar from "@/components/dashboard/Topbar.vue";
import Navbar from "@/components/dashboard/Navbar.vue";
import Main from "@/components/dashboard/Main.vue";
import Footer from "@/components/dashboard/Footer.vue";
import util from "@/util.js";

export default {
    components: {
        Topbar,
        Navbar,
        Main,
        Footer,
    },
    mixins: [util],
    data() {
        return {
            selectedOrganization: "Army Data", // Set the default organization here
        };
    },
    methods: {
        // Listen for the event and update selectedOrganization
        updateSelectedOrganization(organization) {
            this.selectedOrganization = organization;
        },
    },
    computed: {
        ...mapGetters({
            hasPermission: "appData/hasPermission",
            getLoggedInUser: "appData/getLoggedInUser",
        }),
    },
    created() {
        // Listen for the emitted event and update selectedOrganization
        this.$root.$on("update-selected-organization", (organization) => {
            this.updateSelectedOrganization(organization);
        });
    },
};
</script>