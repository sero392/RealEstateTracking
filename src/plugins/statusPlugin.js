import moment from 'moment'

export default {

    install(Vue) {
        Vue.prototype.$status = {
            CANCEL: 1,
            ISCOMING:2,
            COMPLETED: 3,
        };
        Vue.prototype.$createStatus = function (appointmentDate, isCancel) {
            var date1 = moment(appointmentDate);
            var date2 = moment(new Date());
            if (isCancel) {
                return Vue.prototype.$status.CANCEL;
            }
            else if (date1.isAfter(date2)) {
                return Vue.prototype.$status.ISCOMING;
            }
            else if (date2.isAfter(date1)) {
                return Vue.prototype.$status.COMPLETED;
            }
            return 0;
        };
    }
}
