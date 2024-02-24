<template>
    <div style="height: 82%" class="py-50 px-50">
        <b-row>
            <b-col md="4">
                <b-card no-body class="h-100 m-0">
                    <p class="font-weight-bolder m-0 text-center w-100 mt-50">Officers</p>
                    <b-card-body class="h-100 p-50">
                        <apexchart type="donut" :options="chartOptions" :series="series">
                        </apexchart>
                    </b-card-body>
                </b-card>
            </b-col>
            <b-col md="4">
                <b-card no-body class="h-100 m-0">
                    <p class="font-weight-bolder m-0 text-center w-100 mt-50">Soldiers</p>
                    <b-card-body class="h-100 p-50">
                        <apexchart type="donut" :options="chartOptions" :series="series">
                        </apexchart>
                    </b-card-body>
                </b-card>
            </b-col>
            <b-col md="4">
                <b-card no-body class="h-100 m-0">
                    <p class="font-weight-bolder m-0 text-center w-100 mt-50">Non Residential</p>
                    <b-card-body class="h-100 p-50">
                        <apexchart type="donut" :options="chartOptions" :series="series">
                        </apexchart>
                    </b-card-body>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>
// import store from "@/store";
import { mapActions, mapGetters } from "vuex";
import VueApexCharts from "vue-apexcharts";
import util from "@/util.js";

export default {
    components: {
        apexchart: VueApexCharts,
    },
    mixins: [util],
    data() {
        return {
            series: [44, 55, 41],
            chartOptions: {
                chart: {
                    type: 'donut',
                },
                labels: ['Team A', 'Team B', 'Team C'],
                legend: {
                    position: "bottom",
                },
            },
        };
    },
    methods: {

    },
    computed: {
        ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
    },
};
</script>