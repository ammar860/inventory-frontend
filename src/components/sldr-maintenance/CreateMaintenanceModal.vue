<template>
    <b-modal id="create-officer-maintenance-modal" centered size="lg" :no-close-on-esc="true" :no-close-on-backdrop="true"
        dialog-class="my-dialog-class">
        <template #modal-title>
            <h2 class="m-0 text-primary">Create Soldier Maintenance</h2>
        </template>
        <validation-observer ref="createSoldierMaintainanceFormValidation">
            <b-form @submit.prevent>
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label-for="description">
                            <template #label>
                                description <span class="text-danger">*</span>
                            </template>
                            <validation-provider #default="{ errors }" name="description" :rules="{ required }">
                                <b-form-input id="description" v-model="description"
                                    :state="errors.length > 0 ? false : null" placeholder="description" />
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-form-group label-for="cost">
                            <template #label>
                                Cost <span class="text-danger">*</span>
                            </template>
                            <validation-provider #default="{ errors }" name="cost" :rules="{ required }">
                                <b-form-input id="cost" v-model="cost" :state="errors.length > 0 ? false : null"
                                    placeholder="cost" />
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-file v-model="image" class="mt-1" plain accept="image/*" />
            </b-form>
        </validation-observer>
        <template #modal-footer>
            <b-form-group class="text-right">
                <b-button type="submit" variant="primary" pill @click="validationForm">
                    Submit
                </b-button>
            </b-form-group>
        </template>
    </b-modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
import util from "@/util.js";

export default {
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    mixins: [util],
    props: {
        property: Object,
    },
    data() {
        return {
            description: "",
            cost: "",
            image: null,
            required,
        };
    },
    methods: {
        ...mapActions({
            createSoldierMaintenance: "appData/createSoldierMaintenance",
            getPermissions: "appData/getPermissions",
        }),
        async validationForm() {
            const success = await this.$refs.createSoldierMaintainanceFormValidation.validate();
            if (success) {
                await this.submit();
            }
        },
        async submit() {
            try {

                let formData = new FormData();

                formData.append("description", this.description);
                formData.append("cost", this.cost);
                formData.append("officer_property", this.property.id);

                formData.append("updated_by", this.getLoggedInUser.id);
                formData.append("created_by", this.getLoggedInUser.id);
                formData.append("image", this.image);
                console.log('formData', formData);
                const res = await this.createSoldierMaintenance(formData);

                // const res = await this.createOfficerProperty({
                //     name: this.name,
                //     house_no: this.house_no,
                //     loc: this.loc,
                //     unit: this.unit,
                //     created_by: this.getLoggedInUser.id,
                //     updated_by: this.getLoggedInUser.id,
                // });
                if (res.status === 201) {
                    this.$swal({
                        title: "Property Maintenance created successfully",
                        icon: "success",
                    });
                    this.$nextTick(() => {
                        this.$bvModal.hide("create-officer-maintenance-modal");
                    });
                    this.$emit("modalClosed");
                }
            } catch (error) {
                this.displayError(error);
            }
        },
        changePermission(permission, isAdd) {
            if (isAdd) {
                this.availablePermissionList = this.availablePermissionList.filter(
                    (perm) => perm.id !== permission.id
                );
                this.allowedPermissionList.push(permission);
                this.allowedPermissionList.sort((a, b) => {
                    return a.id - b.id;
                });
            } else {
                this.allowedPermissionList = this.allowedPermissionList.filter(
                    (perm) => perm.id !== permission.id
                );
                this.availablePermissionList.push(permission);
                this.availablePermissionList.sort((a, b) => {
                    return a.id - b.id;
                });
            }
        },
    },
    computed: {
        ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
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
