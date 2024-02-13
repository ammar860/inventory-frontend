<template>
    <div>
        <div class="text-right mb-1">
            <b-button variant="primary" pill @click="createProperty" v-if="hasPermission('create_role')">
                <feather-icon icon="PlusIcon" class="mr-50" />
                <span class="align-middle">Create</span>
            </b-button>
        </div>
        <b-card>
            <!-- <b-row class="mb-1" align-v="center">
                <b-col md="7">
                    <div v-if="searchType">
                        <b-form-group label="Name" label-for="name" class="w-50" v-if="searchType.value === 1">
                            <b-input-group>
                                <template #prepend> </template>
                            </b-input-group>
                            <b-form-input id="name" v-model="name" placeholder="Name" />
                        </b-form-group>
                        <b-form-group label="Code Name" label-for="codeName" class="w-50" v-if="searchType.value === 2">
                            <b-form-input id="codeName" v-model="codeName" placeholder="Code Name" />
                        </b-form-group>
                    </div>
                </b-col>
                <b-col md="3">
                    <b-form-group label="Search Type" label-for="searchType">
                        <v-select id="searchType" v-model="searchType" :options="searchTypes" placeholder="Search Type"
                            label="name" />
                    </b-form-group>
                </b-col>
                <b-col md="2">
                    <b-button variant="primary" pill @click="search">
                        <feather-icon icon="SearchIcon" class="mr-50" />
                        <span class="align-middle">Search</span>
                    </b-button>
                </b-col>
            </b-row> -->
            <b-table responsive="sm" :fields="fields" :items="properties" details-td-class="m-0 p-0" small
                v-if="hasPermission('read_role')" :per-page="0">
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
                <template #cell(type)="row">
                    {{
                        OfficerPropertyTypesNames(row.item.type)
                    }}
                </template>
                <template #cell(image)="row">
                    <b-img :src="row.item.image" alt="image" height="100" />
                </template>
                <template #cell(manage)="row">
                    <b-button variant="info" pill size="sm" class="mr-50" @click="editProperty(row.item)"
                        v-if="hasPermission('update_role')">
                        Edit
                    </b-button>
                    <b-button variant="danger" pill size="sm" @click="removeProperty(row.item)"
                        v-if="hasPermission('delete_role')">
                        Delete
                    </b-button>
                    <b-button variant="secondary" pill size="sm" @click="showMaintenance(row.item)"
                        v-if="hasPermission('delete_role')">
                        Maintainance
                    </b-button>
                </template>
            </b-table>
            <b-pagination size="md" :total-rows="totalItems" v-model="currentPage" :per-page="perPage"></b-pagination>
        </b-card>
        <CreatePropertyModal @modalClosed="onModalClosed" :key="`create-${createOfficerPropertyModalCount}`" />
        <MaintainanceShowModal @modalClosed="onModalClosed" :property="property" :maintenance="maintenance"
            :key="`maintenance-${maintenanceShowModalCount}`" />
        <EditPropertyModal :property="property" @modalClosed="onModalClosed"
            :key="`edit-${editOfficerPropertyModalCount}`" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CreatePropertyModal from "@/components/offrs-property/CreatePropertyModal.vue";
import EditPropertyModal from "@/components/offrs-property/EditPropertyModal.vue";
import MaintainanceShowModal from "@/components/offrs-maintenance/MaintenanceShowModal.vue";
import util from "@/util.js";

export default {
    components: {
        CreatePropertyModal,
        EditPropertyModal,
        MaintainanceShowModal
    },
    data() {
        return {
            fields: [
                { key: "name", label: "Name" },
                { key: "house_no", label: "House No" },
                { key: "loc", label: "Loc" },
                { key: "unit", label: "Unit" },
                { key: "type", label: "Type" },
                // { key: "created_at", label: "Created At" },
                // { key: "created_by_data", label: "Created By" },
                // { key: "updated_at", label: "Updated At" },
                // { key: "updated_by_data", label: "Updated By" },
                { key: "image", label: "Image" },
                { key: "manage", label: "Manage" },
            ],
            currentPage: 1,
            perPage: 0,
            totalItems: 0,
            properties: [],
            property: null,
            maintenance: [],
            createOfficerPropertyModalCount: 0,
            editOfficerPropertyModalCount: 0,
            maintenanceShowModalCount: 0,
            searchTypes: [
                { value: 1, name: "Name" },
                { value: 2, name: "Code Name" },
            ],
            searchType: null,
            name: "",
            codeName: "",

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
            getOfficerProperties: "appData/getOfficerProperties",
            deleteOfficerProperty: "appData/deleteOfficerProperty",
        }),

        async search() {
            if (this.searchType) {
                switch (this.searchType.value) {
                    case 1:
                        this.codeName = "";
                        break;
                    case 2:
                        this.name = "";
                        break;
                }
            } else {
                this.name = "";
                this.codeName = "";
            }
            this.currentPage = 1;
            await this.fetchPaginatedData();
        },
        async fetchPaginatedData() {
            try {
                const res = await this.getOfficerProperties({
                    pageNumber: this.currentPage,
                    // name: this.name,
                    // codeName: this.codeName,
                });
                this.properties = res.data.results;
                this.totalItems = res.data.count;
                this.perPage = res.data.per_page;
                console.log(this.properties);
            } catch (error) {
                this.displayError(error);
            }
        },
        createProperty() {
            this.createOfficerPropertyModalCount += 1;
            this.$nextTick(() => {
                this.$bvModal.show("create-officer-property-modal");
            });
        },
        editProperty(property) {
            this.property = property;
            this.editOfficerPropertyModalCount += 1;
            this.$nextTick(() => {
                this.$bvModal.show("edit-officer-property-modal");
            });
        },
        showMaintenance(property) {
            this.property = property;
            this.maintenance = property.maintenance;
            this.editOfficerPropertyModalCount += 1;
            this.$nextTick(() => {
                this.$bvModal.show("officer-maintenance-show-modal");
            });
        },
        async removeProperty(property) {
            this.property = property;
            try {
                const res = await this.deleteOfficerProperty({
                    pk: this.property.id,
                });
                if (res.status === 204) {
                    this.$swal({
                        title: "Property deleted successfully",
                        icon: "success",
                    });
                    if (
                        (this.totalItems - 1) % this.perPage === 0 &&
                        this.currentPage !== 1
                    ) {
                        this.currentPage -= 1;
                    } else {
                        await this.fetchPaginatedData();
                    }
                }
            } catch (error) {
                this.displayError(error);
            }
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
