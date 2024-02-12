<template>
  <b-card>
    <b-row class="mb-1" align-v="center">
      <b-col md="7">
        <div v-if="searchType">
          <b-form-group
            label="Name"
            label-for="name"
            class="w-50"
            v-if="searchType.value === 1"
          >
            <b-input-group>
              <template #prepend> </template>
            </b-input-group>
            <b-form-input id="name" v-model="name" placeholder="Name" />
          </b-form-group>
          <VueSelectPaginated
            name="Organization"
            label="name"
            searchBy="name"
            :prevSelected="parent"
            :getListMethod="getOrganizations"
            customClass="w-50"
            @setMethod="
              (value) => {
                parent = value;
              }
            "
            v-if="searchType.value === 2"
          />
        </div>
      </b-col>
      <b-col md="3">
        <b-form-group label="Search Type" label-for="searchType">
          <v-select
            id="searchType"
            v-model="searchType"
            :options="searchTypes"
            placeholder="Search Type"
            label="name"
          />
        </b-form-group>
      </b-col>
      <b-col md="2">
        <b-button variant="primary" pill @click="search">
          <feather-icon icon="SearchIcon" class="mr-50" />
          <span class="align-middle">Search</span>
        </b-button>
      </b-col>
    </b-row>
    <b-table
      responsive="sm"
      :fields="fields"
      :items="organizations"
      details-td-class="m-0 p-0"
      small
      v-if="hasPermission('read_organization')"
      :per-page="0"
    >
      <template #cell(parent_data)="row">
        {{ row.item.parent_data ? row.item.parent_data.name : "Self" }}
      </template>
    </b-table>
    <b-pagination
      size="md"
      :total-rows="totalItems"
      v-model="currentPage"
      :per-page="perPage"
    ></b-pagination>
  </b-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import util from "@/util.js";

export default {
  components: {
    VueSelectPaginated,
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Name" },
        { key: "parent_data", label: "Parent" },
        { key: "organization_type", label: "Type" },
        { key: "location", label: "Location" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      organizations: [],
      searchTypes: [
        { value: 1, name: "Name" },
        { value: 2, name: "Parent" },
      ],
      searchType: null,
      name: "",
      parent: null,
    };
  },
  mixins: [util],
  created() {
    this.searchType = this.searchTypes[0];
  },
  async mounted() {
    await this.fetchPaginatedData();
  },
  methods: {
    ...mapActions({
      getOrganizations: "appData/getOrganizations",
    }),
    async search() {
      if (this.searchType) {
        switch (this.searchType.value) {
          case 1:
            this.parent = null;
            break;
          case 2:
            this.name = "";
            break;
        }
      } else {
        this.name = "";
        this.parent = null;
      }
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getOrganizations({
          pageNumber: this.currentPage,
          name: this.name,
          parent: this.parent ? this.parent.id : null,
        });
        this.organizations = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
    }),
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
  },
};
</script>

<style></style>
