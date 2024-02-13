import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import moment from "moment";

const util = {
  data() {
    return {
    
      getDateString(date) {
        return moment(date).format("Do MMMM YYYY on HH:mm");
      },

      officerPropertyTypes: {
        MOQ: 1,
        HOUSE: 2,
        FLAT: 3,
      },
      officerPropertyTypesOptions: [
        { value: 1, name: "MOQ" },
        { value: 2, name: "HOUSE" },
        { value: 3, name: "FLAT" },

      ],
      soldierPropertyTypes: {
        JCO: 1,
        SOLDIER: 2,
        NCsE: 3,
      },
      soldierPropertyTypesOptions: [
        { value: 1, name: "JCO" },
        { value: 2, name: "SOLDIER" },
        { value: 3, name: "NCsE" },

      ],

      nonResidentialPropertyTypes: {
        SM_BARAK: 1,
        MT_SHED: 2,
        PARK_FUTSAL: 3,
      },
      nonResidentialPropertyTypesOptions: [
        { value: 1, name: "SM BARRAK" },
        { value: 2, name: "MT SHED" },
        { value: 3, name: "PAEK / FUTSAL" },

      ],
 
      searchTypes: [
        { value: 1, name: "Token No" },
      ],
      categoryColors: {
        1: "table-info",
        2: "table-success",
        3: "table-danger",
        4: "table-primary",
        5: "table-warning",
      },
    };
  },
  methods: {
    displayError(error) {
      const msgs = [];
      if (
        !error.response ||
        error.response.status === 500 ||
        typeof error.response.data === "string"
      ) {
        msgs.push("Error: Server Error");
      } else {
        const data = error.response.data;
        for (let key in data) {
          const element = data[key];
          if (Array.isArray(element)) {
            if (typeof element[0] === "string") {
              if (key !== "msg") {
                msgs.push(`${key}: ${element[0]}`);
              } else {
                msgs.push(`${element[0]}`);
              }
            } else if (typeof element[0] === "object") {
              for (const key in element[0]) {
                if (key !== "msg") {
                  msgs.push(`${key}: ${element[0][key][0]}`);
                } else {
                  msgs.push(`${element[0][key][0]}`);
                }
              }
            }
          } else if (typeof element === "object") {
            for (const key in element) {
              if (key !== "msg") {
                msgs.push(`${key}: ${element[key][0]}`);
              } else {
                msgs.push(`${element[key][0]}`);
              }
            }
          } else {
            if (element !== "Invalid page.") {
              msgs.push(element);
            }
          }
        }
      }

      for (let i = 0; i < msgs.length; i++) {
        const msg = msgs[i];
        this.$toast(
          {
            component: ToastificationContent,
            props: {
              title: "Error",
              icon: "BellIcon",
              text: msg,
              variant: "danger",
            },
          },
          {
            timeout: 2000,
            position: "top-center",
          }
        );
      }
    },
    getMember(obj) {
      return obj.name ? obj.name : "";
    },
    OfficerPropertyTypesNames(type) {
      let name = "";
      switch (type) {
        case 1:
          name = "MOQ";
          break;
        case 2:
          name = "HOUSE";
          break;
        case 3:
          name = "FLAT";
          break;
      }
      return name;
    },
    SoldierPropertyTypesNames(type) {
      let name = "";
      switch (type) {
        case 1:
          name = "JCO";
          break;
        case 2:
          name = "SOLDIER";
          break;
        case 3:
          name = "NCsE";
          break;
      }
      return name;
    },
    NonResidentialPropertyTypesNames(type) {
      let name = "";
      switch (type) {
        case 1:
          name = "SM BARRAK";
          break;
        case 2:
          name = "MT SHED";
          break;
        case 3:
          name = "PARK / FUTSAL";
          break;
      }
      return name;
    },
  },
};

export default util;
