<template>
    <div>
        <b-modal id="officer-maintenance-show-modal" centered size="xl" hide-footer :no-close-on-esc="true"
            :no-close-on-backdrop="true" dialog-class="my-dialog-class">
            <template #modal-title>
                <h2 class="m-0 text-primary">Soldier Maintenance Record</h2>
            </template>
            <div>
                <div class="text-right mb-1">
                    <b-button variant="primary" pill @click="createMaintenance" v-if="hasPermission('create_role')">
                        <feather-icon icon="PlusIcon" class="mr-50" />
                        <span class="align-middle">Create</span>
                    </b-button>
                </div>
                <b-card>
                    <b-table responsive="sm" :fields="fields" :items="items" details-td-class="m-0 p-0" small
                        v-if="hasPermission('read_role')" :per-page="0">
                        <template #cell(image)="row">
                            <b-img :src="row.item.image" alt="image" height="100" />
                        </template>
                    </b-table>
                    <b-pagination size="md" :total-rows="totalItems" v-model="currentPage"
                        :per-page="perPage"></b-pagination>
                </b-card>

            </div>
        </b-modal>
        <CreateMaintenanceModal @modalClosed="onModalClosed" :property="property"
            :key="`create-maintenance-${createMaintetanceModalCount}`" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import CreateMaintenanceModal from "@/components/sldr-maintenance/CreateMaintenanceModal.vue";
import { required } from "@validations";
import util from "@/util.js";

export default {
    components: {
        ValidationProvider,
        ValidationObserver,
        CreateMaintenanceModal,
    },
    props: {
        maintenance: Array,
        property: Object,
    },
    mixins: [util],
    data() {
        return {
            items: [],
            fields: [
                { key: "description", label: "Description" },
                { key: "cost", label: "Cost" },
                { key: "image", label: "Image" },
            ],
            createMaintetanceModalCount: 0,

            currentPage: 1,
            perPage: 0,
            totalItems: 0,
            required,
        };
    },
    mounted() {
        this.items = this.maintenance;
        // console.log('maintenance', this.maintenance);
    },
    methods: {
        ...mapActions({
            updateOfficerProperty: "appData/updateOfficerProperty",
        }),
        async validationForm() {
            const success = await this.$refs.editOfficerPropertyFormValidation.validate();
            if (success) {
                await this.submit();
            }
        },
        createMaintenance() {
            this.createMaintetanceModalCount += 1;
            console.log('open create maintenance modal');
            this.$nextTick(() => {
                this.$bvModal.show("create-officer-maintenance-modal");
            });

        },
        async onModalClosed() {
            this.$nextTick(() => {
                this.$bvModal.hide("officer-maintenance-show-modal");
            });
            this.$emit("modalClosed");
            // await this.fetchPaginatedData();
        },
        // async submit() {
        //     try {
        //         console.log('in submit');
        //         let formData = new FormData();

        //         formData.append("name", this.name);
        //         formData.append("house_no", this.house_no);
        //         formData.append("unit", this.unit);
        //         formData.append("loc", this.loc);
        //         formData.append("updated_by", this.getLoggedInUser.id);
        //         formData.append("image", this.image);
        //         console.log('formData', formData);

        //         const res = await this.updateOfficerProperty({
        //             payload: formData,
        //             // {
        //             //   name: this.name,
        //             //   house_no: this.house_no,
        //             //   loc: this.loc,
        //             //   unit: this.unit,
        //             //   updated_by: this.getLoggedInUser.id,
        //             // },
        //             pk: this.property.id,
        //         });
        //         if (res.status === 200) {
        //             this.$swal({
        //                 title: "Property updated successfully",
        //                 icon: "success",
        //             });
        //             this.$nextTick(() => {
        //                 this.$bvModal.hide("edit-officer-property-modal");
        //             });
        //             this.$emit("modalClosed");
        //         }
        //     } catch (error) {
        //         this.displayError(error);
        //     }
        // },

    },
    computed: {
        ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser", hasPermission: "appData/hasPermission", }),
    },
    watch: {
        maintenance: {
            handler: function (val) {
                this.items = val;
            },
            deep: true,
        },
    },
};
</script>

<style scoped>
.scroll-area-size {
    height: 45vh;
}

.scroll-area-size ul {
    height: 100%;
}
</style>
