<template>
    <b-modal id="create-officer-property-modal" centered size="lg" :no-close-on-esc="true" :no-close-on-backdrop="true"
        dialog-class="my-dialog-class">
        <template #modal-title>
            <h2 class="m-0 text-primary">Create Property</h2>
        </template>
        <validation-observer ref="createOfficerPropertyFormValidation">
            <b-form @submit.prevent>
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label-for="name">
                            <template #label>
                                Name <span class="text-danger">*</span>
                            </template>
                            <validation-provider #default="{ errors }" name="Name" :rules="{ required }">
                                <b-form-input id="name" v-model="name" :state="errors.length > 0 ? false : null"
                                    placeholder="Name" />
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-form-group label-for="house_no">
                            <template #label>
                                House no <span class="text-danger">*</span>
                            </template>
                            <validation-provider #default="{ errors }" name="house_no" :rules="{ required }">
                                <b-form-input id="house_no" v-model="house_no" :state="errors.length > 0 ? false : null"
                                    placeholder="House no" />
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label-for="loc">
                            <template #label>
                                loc <span class="text-danger">*</span>
                            </template>
                            <validation-provider #default="{ errors }" name="Name" :rules="{ required }">
                                <b-form-input id="loc" v-model="loc" :state="errors.length > 0 ? false : null"
                                    placeholder="loc" />
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-form-group label-for="unit">
                            <template #label>
                                unit <span class="text-danger">*</span>
                            </template>
                            <validation-provider #default="{ errors }" name="unit" :rules="{ required }">
                                <b-form-input id="unit" v-model="unit" :state="errors.length > 0 ? false : null"
                                    placeholder="unit" />
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <!-- <b-form-file v-model="image" class="mt-1" plain accept="image/*" /> -->
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
    data() {
        return {
            name: "",
            house_no: "",
            loc: "",
            unit: "",
            image: null,
            required,
        };
    },
    methods: {
        ...mapActions({
            createOfficerProperty: "appData/createOfficerProperty",
            getPermissions: "appData/getPermissions",
        }),
        async validationForm() {
            const success = await this.$refs.createOfficerPropertyFormValidation.validate();
            if (success) {
                await this.submit();
            }
        },
        async submit() {
            try {

                // let formData = new FormData();

                // formData.append("name", this.name);
                // formData.append("house_no", this.house_no);
                // formData.append("unit", this.unit);
                // formData.append("loc", this.loc);
                // formData.append("updated_by", this.getLoggedInUser.id);
                // formData.append("created_by", this.getLoggedInUser.id);
                // formData.append("image", this.image);
                // console.log('formData', formData);
                // const res = await this.createOfficerProperty(formData);

                const res = await this.createOfficerProperty({
                    name: this.name,
                    house_no: this.house_no,
                    loc: this.loc,
                    unit: this.unit,
                    created_by: this.getLoggedInUser.id,
                    updated_by: this.getLoggedInUser.id,
                });
                if (res.status === 201) {
                    this.$swal({
                        title: "Property created successfully",
                        icon: "success",
                    });
                    this.$nextTick(() => {
                        this.$bvModal.hide("create-officer-property-modal");
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
