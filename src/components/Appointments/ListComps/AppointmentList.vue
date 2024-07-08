<template>
  <div>
    <v-row class="ma-1">
      <v-col>
        <v-app-bar elevation="2">
          <StatusFilterComp v-bind:records="records" v-model="statusValue" v-on:searched="searched">
          </StatusFilterComp>
          <v-spacer></v-spacer>
          <DateRangeFilterComp v-bind:records="records" v-bind:startDateValue="startDateValue"
            v-bind:endDateValue="endDateValue" v-on:update:startDateValue="startDateValue = $event"
            v-on:update:endDateValue="endDateValue = $event" v-on:searched="searched">

          </DateRangeFilterComp>
          <v-spacer></v-spacer>
          <SearchComp v-bind:records="records" v-on:searched="searched" v-model="searchValue">
          </SearchComp>

        </v-app-bar>
      </v-col>
    </v-row>
    <v-row class="ma-3">
      <v-col cols="auto">
        <span class="caption">
          {{ tempRecords.length }} kadar kayıt bulundu..
        </span>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn tile small color="primary">Yeni Başvuru
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-row dense v-for="(item, index) in tempRecords" v-bind:key="index">
          <v-col>
            <v-card tile elevation="1" class="ma-3">
              <v-row>
                <v-col>
                  <v-row dense v-for="(item2, index2) in item.fields.contact_id" v-bind:key="index2">
                    <v-col cols="12">
                      <span class="caption">
                        <v-icon small>mdi-account</v-icon>
                        {{ item.fields.contact_name[index2] }}
                        {{ item.fields.contact_surname[index2] }}
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <v-icon small>mdi-email</v-icon>
                      <span class="caption">
                        {{ item.fields.contact_email[index2] }}
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <v-icon small>mdi-phone</v-icon>
                      <span class="caption">
                        {{ item.fields.contact_phone[index2] }}
                      </span>
                    </v-col>


                  </v-row>
                </v-col>
                <v-col class="d-flex align-center justify-center">
                  <span class="caption">
                    <v-icon>
                      mdi-home
                    </v-icon>
                    {{ item.fields.appointment_address }}

                  </span>
                </v-col>

                <v-col class="d-flex align-center justify-center">
                  <AppointmentStatusComp v-bind:IsCancel="item.fields.is_cancelled"
                    v-bind:AppointmentDate="item.fields.appointment_date">
                  </AppointmentStatusComp>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

  </div>
</template>
<script>
import 'vuetify/dist/vuetify.min.css';
import axios from "axios";
import AppointmentStatusComp from './AppointmentStatusComp.vue';
import SearchComp from '../FilterComps/SearchComp.vue';
import StatusFilterComp from '../FilterComps/StatusFilterComp.vue';
import DateRangeFilterComp from '../FilterComps/DateRangeFilterComp.vue';
import moment from 'moment';
export default {
  name: "AppointmentList",
  components: {
    AppointmentStatusComp,
    SearchComp,
    StatusFilterComp,
    DateRangeFilterComp
  },
  data() {
    return {
      records: [],
      tempRecords: [],
      searchValue: '',
      statusValue: '',
      startDateValue: '',
      endDateValue: ''
    };
  },
  methods: {
    fetchAllData() {
      var th = this;
      const baseId = process.env.VUE_APP_AIRTABLE_BASE_ID;
      const tableName = "Appointments";
      const apiKey = process.env.VUE_APP_AIRTABLE_API_KEY;
      console.log(baseId,apiKey)
      const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })
        .then((response) => {
          th.records = response.data.records.map(m => {
            m.Status = th.$createStatus(m.fields.appointment_date, m.fields.is_cancelled)
            return m;
          });
          th.tempRecords = [...th.records];
          console.log(th.records)
        })
        .catch((error) => {
          console.error("Axios isteği gönderilirken hata oluştu!", error);
        });
    },
    searched() {
      var th = this;
      th.tempRecords = [...th.records];
      if (th.searchValue) {
        var searchedArray = th.tempRecords.map(m => {
          return {
            search_text: `${m.fields.contact_name}${m.fields.contact_surname}${m.fields.contact_email}${m.fields.contact_phone}`.toLowerCase(),
            search_id: m.id,
            data: m,
          }
        });
        var searchArr = searchedArray.filter(f => {
          return f.search_text.includes(th.searchValue.toLowerCase());
        }).map(m => m.data);
        th.tempRecords = [...searchArr];
      }
      if (th.statusValue) {
        var statusArr = th.tempRecords.filter(f => {
          return th.statusValue == f.Status
        });
        th.tempRecords = [...statusArr];
      }
      if (th.startDateValue && th.endDateValue) {
        var dateArr = th.tempRecords.filter(f => {
          var momentAppointmentDate = moment(f.fields.appointment_date);
          return ((momentAppointmentDate < moment(th.endDateValue)) && (momentAppointmentDate > moment(th.startDateValue)))
        })
        th.tempRecords = [...dateArr];
      }
    }
  },
  beforeMount: function () {
    var th = this;
    th.fetchAllData();
  },
};
</script>
