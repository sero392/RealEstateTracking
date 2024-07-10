import moment from 'moment'

export default {

    install(Vue) {
        //Okunması kolay olsun diye enum şeklinde oluşturdum.
        Vue.prototype.$status = {
            CANCEL: 1,
            ISCOMING: 2,
            COMPLETED: 3,
        };
        Vue.prototype.$createStatus = function (appointmentDate, isCancel) {
            //Plugin olarak oluşturdum çünkü bu şekilde çok fazla yerde kullanılıyor.
            var date1 = moment.utc(appointmentDate);
            var date2 = moment.utc(new Date());
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
