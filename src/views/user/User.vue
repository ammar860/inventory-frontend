<template>
  <div>
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
            <b-form-group
              label="Username"
              label-for="username"
              class="w-50"
              v-if="searchType.value === 2"
            >
              <b-form-input
                id="username"
                v-model="username"
                placeholder="Username"
              />
            </b-form-group>
            <VueSelectPaginated
              name="Organization"
              label="name"
              searchBy="name"
              :prevSelected="organization"
              :getListMethod="getOrganizations"
              customClass="w-50"
              @setMethod="
                (value) => {
                  organization = value;
                }
              "
              v-if="searchType.value === 3"
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
        :items="users"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_user')"
        :per-page="0"
      >
        <template #cell(created_by_data)="row">
          {{
            row.item.created_by_data ? row.item.created_by_data.username : ""
          }}
        </template>
        <template #cell(updated_by_data)="row">
          {{
            row.item.updated_by_data ? row.item.updated_by_data.username : ""
          }}
        </template>
        <template #cell(role_data)="row">
          {{ row.item.role_data ? row.item.role_data.name : "" }}
        </template>
        <template #cell(organization_data)="row">
          {{
            row.item.organization_data ? row.item.organization_data.name : ""
          }}
        </template>
        <template #cell(manage)="row">
          <b-button
            variant="info"
            pill
            size="sm"
            class="mr-50"
            @click="editUser(row.item)"
            v-if="hasPermission('update_user')"
          >
            Edit
          </b-button>
        </template>
      </b-table>
      <b-pagination
        size="md"
        :total-rows="totalItems"
        v-model="currentPage"
        :per-page="perPage"
      ></b-pagination>
    </b-card>
    <EditUserModal
      :user="user"
      @modalClosed="onModalClosed"
      :key="`edit-${editUserModalCount}`"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import EditUserModal from "@/components/user/EditUserModal.vue";
import util from "@/util.js";

export default {
  components: {
    EditUserModal,
    VueSelectPaginated,
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Name" },
        { key: "username", label: "Username" },
        { key: "role_data", label: "Role" },
        { key: "manage", label: "Manage" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      users: [],
      user: null,
      editUserModalCount: 0,
      searchTypes: [
        { value: 1, name: "Name" },
        { value: 2, name: "Username" },
        { value: 3, name: "Organization" },
      ],
      searchType: null,
      name: "",
      username: "",
      organization: null,
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
      getUsers: "appData/getUsers",
      getOrganizations: "appData/getOrganizations",
    }),
    async search() {
      if (this.searchType) {
        switch (this.searchType.value) {
          case 1:
            this.username = "";
            this.organization = null;
            break;
          case 2:
            this.name = "";
            this.organization = null;
            break;
          case 3:
            this.name = "";
            this.username = "";
            break;
        }
      } else {
        this.name = "";
        this.username = "";
        this.organization = "";
      }
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getUsers({
          pageNumber: this.currentPage,
          name: this.name,
          username: this.username,
          organization: this.organization ? this.organization.id : null,
        });
        this.users = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    editUser(user) {
      this.user = user;
      this.editUserModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("edit-user-modal");
      });
    },
    async onModalClosed() {
      await this.fetchPaginatedData();
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
