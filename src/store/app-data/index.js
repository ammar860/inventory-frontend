import axiosIns from "@/libs/axios";

export default {
  namespaced: true,
  state: {
    isLoggedIn: false,
    user: null,
    navMenuItems: [],
  },
  getters: {
    getLoggedInUser: (state) => {
      return state.user;
    },
    hasPermission: (state) => (name) => {
      if (state.user) {
        return state.user.permissions.hasOwnProperty(name);
      }
      return false;
    },
    hasRole: (state) => (name) => {
      if (state.user.role_data.code_name === name) {
        return true;
      }
      return false;
    },
    isLoggedIn: (state) => state.isLoggedIn,
    getNavMenuItems: (state) => state.navMenuItems,
  },
  mutations: {
    login(state, data) {
      state.isLoggedIn = true;
      state.user = data.user;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    setNavMenuItems(state) {
      state.navMenuItems = [];

      if (state.user.permissions.hasOwnProperty("show_user")) {
        state.navMenuItems.push({
          title: "User",
          icon: "UserIcon",
          route: "User",
        });
      }

      if (state.user.permissions.hasOwnProperty("show_role")) {
        state.navMenuItems.push({
          title: "Role",
          icon: "UsersIcon",
          route: "Role",
        });
      }
      if (state.user.permissions.hasOwnProperty("show_flats")) {
        state.navMenuItems.push({
          title: "Offrs Property",
          icon: "UsersIcon",
          route: "Flats",
        });
      }
    },
  },
  actions: {
    async login({ commit }, payload) {
      const res = await axiosIns.post("login", payload);
      if (res.status === 200) {
        commit("login", res.data);
        commit("setNavMenuItems");
      }
      return res;
    },
    async logout({ commit }) {
      const res = await axiosIns.post("logout");
      if (res.status === 204) {
        commit("logout");
      }
      return res;
    },
    async getCurrentUser({ commit }) {
      const res = await axiosIns.get("current");
      if (res.status === 200) {
        commit("login", res.data);
        commit("setNavMenuItems");
      }
    },
    async getPermissions({ commit }) {
      const res = await axiosIns.get("permissions");
      return res;
    },
    async getRoles({ commit }, { pageNumber, name, codeName }) {
      let url = `roles/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      if (codeName) {
        url += `&code_name=${codeName}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getRole({ commit }, { pk }) {
      const res = await axiosIns.get(`roles/${pk}/`);
      return res;
    },
    async createRole({ commit }, payload) {
      const res = await axiosIns.post("roles/", payload);
      return res;
    },
    async updateRole({ commit }, { payload, pk }) {
      const res = await axiosIns.put(`roles/${pk}/`, payload);
      return res;
    },
    async deleteRole({ commit }, { pk }) {
      const res = await axiosIns.delete(`roles/${pk}/`);
      return res;
    },


    async getOfficerProperties({ commit }, { pageNumber, name, codeName }) {
      let url = `officer-properties/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      if (codeName) {
        url += `&code_name=${codeName}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getOfficerProperty({ commit }, { pk }) {
      const res = await axiosIns.get(`officer-properties/${pk}/`);
      return res;
    },
    async createOfficerProperty({ commit }, payload) {
      const res = await axiosIns.post("officer-properties/", payload);
      return res;
    },
    async updateOfficerProperty({ commit }, { payload, pk }) {
      const res = await axiosIns.put(`officer-properties/${pk}/`, payload);
      return res;
    },
    async deleteOfficerProperty({ commit }, { pk }) {
      const res = await axiosIns.delete(`officer-properties/${pk}/`);
      return res;
    },






    async getOfficerMaintenances({ commit }, { pageNumber, name, codeName }) {
      let url = `officer-maintenances/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      if (codeName) {
        url += `&code_name=${codeName}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getOfficerMaintenance({ commit }, { pk }) {
      const res = await axiosIns.get(`officer-maintenances/${pk}/`);
      return res;
    },
    async createOfficerMaintenance({ commit }, payload) {
      const res = await axiosIns.post("officer-maintenances/", payload);
      return res;
    },
    async updateOfficerMaintenance({ commit }, { payload, pk }) {
      const res = await axiosIns.put(`officer-maintenances/${pk}/`, payload);
      return res;
    },
    async deleteOfficerMaintenance({ commit }, { pk }) {
      const res = await axiosIns.delete(`officer-maintenances/${pk}/`);
      return res;
    },

    async getUsers({ commit }, { pageNumber, name, username, organization }) {
      let url = `users/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      if (username) {
        url += `&username=${username}`;
      }
      if (organization) {
        url += `&organization=${organization}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async updateUser({ commit }, {payload,pk}) {
      const res = await axiosIns.put(`users/${pk}/`, payload);
      return res;
    },
    async getOrganizations({ commit }, { pageNumber, name, parent }) {
      let url = `account/organizations/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      if (parent) {
        url += `&parent=${parent}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getOrganization({ commit }, { pk }) {
      const res = await axiosIns.get(`account/organizations/${pk}/`);
      return res;
    },
  },
};
