<template>
    <div>
        <div v-if="cmpStatus == $status.CANCEL">
            <v-chip small dark color="red">
                Canceled
            </v-chip>
        </div>
        <div v-if="cmpStatus == $status.ISCOMING">
            <v-chip small color="primary">
                <span>
                    Up Coming
                </span>
                <span class="ml-2 caption">
                    {{ cmpDays }} days
                </span>
            </v-chip>

        </div>

        <div v-if="cmpStatus == $status.COMPLETED">
            <v-chip small color="success">
                Completed
            </v-chip>
        </div>
        <div>
            <span small class="overline">
                {{ $moment(AppointmentDate).format('DD/MM/YYYY') }}
                <v-icon small>
                    mdi-calendar-range
                </v-icon>
            </span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AppointmentStatusComp',
    props: {
        IsCancel: {
            type: Boolean,
            required: false,
            default: false
        },
        AppointmentDate: {
            type: String,
            required: false,
            default: ''
        }
    },
    computed: {
        cmpStatus: function () {
            var th = this;
           return th.$createStatus(th.AppointmentDate,th.IsCancel);
        },
        cmpDays: function () {
            var th = this;
            var date1 = th.$moment(th.AppointmentDate);
            var date2 = th.$moment(new Date());
            
            return Math.abs(date2.diff(date1, 'days'));
        }
    },
    data() {
        return {

        }
    }
}
</script>