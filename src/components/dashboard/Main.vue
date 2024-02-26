<template>
    <div style="height: 82%" class="py-50 px-50">
        <b-row ref="chart">
            <b-col md="4">
                <b-card no-body class="h-100 m-0">
                    <p class="font-weight-bolder m-0 text-center w-100 mt-50">Officers</p>
                    <b-card-body class="h-100 p-50">
                        <apexchart ref="chart1" type="donut" :options="officerChartOptions" :series="officerSeries">
                        </apexchart>
                    </b-card-body>
                </b-card>
            </b-col>
            <b-col md="4">
                <b-card no-body class="h-100 m-0">
                    <p class="font-weight-bolder m-0 text-center w-100 mt-50">Soldiers</p>
                    <b-card-body class="h-100 p-50">
                        <apexchart ref="chart2" type="donut" :options="SoldierChartOptions" :series="SoldierSeries">
                        </apexchart>
                    </b-card-body>
                </b-card>
            </b-col>
            <b-col md="4">
                <b-card no-body class="h-100 m-0">
                    <p class="font-weight-bolder m-0 text-center w-100 mt-50">Non Residential</p>
                    <b-card-body class="h-100 p-50">
                        <apexchart ref="chart3" type="donut" :options="nonResidentialChartOptions" :series="nonResidentialSeries">
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
            officerSeries: [],
            officerChartOptions: {
                chart: {
                    type: 'donut',
                },
                labels: [],
                legend: {
                    position: "bottom",
                },
            },
            SoldierSeries: [],
            SoldierChartOptions: {
                chart: {
                    type: 'donut',
                },
                labels: [],
                legend: {
                    position: "bottom",
                },
            },
            nonResidentialSeries: [],
            nonResidentialChartOptions: {
                chart: {
                    type: 'donut',
                },
                labels: [],
                legend: {
                    position: "bottom",
                },
            },
        };
    },
    async mounted() {
        // const res = await this.getDashboardData();
        // console.log(res);
        await this.setData();
    },
    methods: {
        ...mapActions({
            getDashboardData: "appData/getDashboardData",
        }),
        async setData() {
            const res = await this.getDashboardData();
            console.log(res.data);
            let data = res.data.data;
            let non_residential_obj = data.non_residential_obj;
            let officers_obj = data.officers_obj;
            let soldiers_obj = data.soldiers_obj
            console.log('officers_obj', officers_obj);
            console.log('soldiers_obj', soldiers_obj);
            console.log('non_residential_obj', non_residential_obj);

            this.officerSeries = officers_obj.series;
            this.officerChartOptions.labels = officers_obj.labels;
            this.SoldierSeries = soldiers_obj.series;
            this.SoldierChartOptions.labels = soldiers_obj.labels;
            this.nonResidentialSeries = non_residential_obj.series;
            this.nonResidentialChartOptions.labels = non_residential_obj.labels;

            this.$refs.chart1.refresh();
            this.$refs.chart2.refresh();
            this.$refs.chart3.refresh();
            console.log('officerchartoptions',this.officerChartOptions);



        },
    },
    computed: {
        ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
    },
};
</script>