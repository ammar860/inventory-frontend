import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import moment from "moment";

const util = {
  data() {
    return {
      modes: {
        CREATE: 1,
        EDIT: 2,
      },
      rankCategories: [
        { value: 1, text: "General Officer" },
        { value: 2, text: "Senior Officer" },
        { value: 3, text: "Officer" },
        { value: 4, text: "Soldier" },
      ],
      rankCategory(category) {
        const cat = this.rankCategories.find((cat) => cat.value === category);
        return cat.text;
      },
      getDateString(date) {
        return moment(date).format("Do MMMM YYYY on HH:mm");
      },
      propertyTypes: {
        MOQ: 1,
        HOUSE: 2,
        FLAT: 3,
      },

      propertyTypesOptions: [
        { value: 1, name: "MOQ" },
        { value: 2, name: "HOUSE" },
        { value: 3, name: "FLAT" },

      ],
      statusName: {
        1: { value: 1, name: "Pending" },
        2: { value: 2, name: "Processing" },
        3: { value: 3, name: "Finalized" },
        4: { value: 4, name: "Closed" },

      },
      searchTypes: [
        { value: 1, name: "Token No" },
        { value: 2, name: "Status" },
        { value: 3, name: "Start Date" },
        { value: 4, name: "Completion Date" },
        { value: 5, name: "President" },
        { value: 6, name: "Ordered By" },
        { value: 7, name: "Remarks" },
        { value: 8, name: "Recom" },
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
    propertyTypesNames(type) {
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
  },
};

export default util;
