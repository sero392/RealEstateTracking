<template>
        <v-layout row wrap class="py-4 justify-center ga-5">
            <v-flex >
                <input class="main-combobox" type="datetime-local" v-bind:value="startDateValue" v-on:change="changeStartDate" />
            </v-flex>
            <v-flex >
                <input class="main-combobox" type="datetime-local"  v-bind:value="endDateValue" v-on:change="changeEndDate" />
            </v-flex>
        </v-layout>
</template>
<script>
import moment from 'moment';

export default {
    props: {
        startDateValue: {
            type: String,
        },
        endDateValue: {
            type: String,
        },
        records: {
            type: Array,
            required: false,
            default: null
        }
    },
    data() {
        return {
        }
    },
    methods:{
        changeStartDate(event){
            var th = this;
            var startDate = moment(event.target.value);
            var endDate = moment(th.endDateValue);
            if (startDate.isAfter(endDate)) {
                event.target.value = th.endDateValue;
            }
            th.$emit('update:startDateValue', event.target.value);
      
            th.$emit('searched');
        },
        changeEndDate(event){
            var th = this;
            var startDate = moment(th.startDateValue);
            var endDate = moment(event.target.value);
            if (endDate.isBefore(startDate)) {
                event.target.value = th.startDateValue;
            }
            th.$emit('update:endDateValue', event.target.value);
      
            th.$emit('searched');
        }
    }

}

</script>