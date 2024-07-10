<template>
  <div>
    <v-row class="ma-1">
      <v-col>
        <v-card elevation="1" class="rounded-2">
          <v-layout row class="px-5">
            <v-flex xs12 sm12 md12 lg3 xl3 class="d-flex justify-center align-center mt-1 mt-md-0 pa-1">
              <AgentComp v-bind:agentList="agentList" v-model="selectedAgentValue" v-on:searched="searched"></AgentComp>
            </v-flex>
            <v-flex xs12 sm12 md12 lg3 xl3 class="d-flex justify-center align-center">
              <div class="w-50">
                <StatusFilterComp v-bind:records="records" v-model="statusValue" v-on:searched="searched">
                </StatusFilterComp>
              </div>

            </v-flex>
            <v-flex xs12 sm12 md12 lg3 xl3 class="d-flex justify-center align-center">
              <DateRangeFilterComp v-bind:records="records" v-bind:startDateValue="startDateValue"
                v-bind:endDateValue="endDateValue" v-on:update:startDateValue="startDateValue = $event"
                v-on:update:endDateValue="endDateValue = $event" v-on:searched="searched">
              </DateRangeFilterComp>
            </v-flex>
            <v-flex xs12 sm12 md12 lg3 xl3 class="d-flex justify-center align-center mb-1 mb-md-0">
              <SearchComp v-bind:records="records" v-on:searched="searched" v-model="searchValue">
              </SearchComp>
            </v-flex>
          </v-layout>
        </v-card>
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
        <v-btn tile x-small color="primary" v-on:click="openActionDialog">new appointment
          <v-icon small right> mdi-plus </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-card flat>
          <v-overlay absolute v-bind:value="loading">
            <div class="loader"></div>
          </v-overlay>
          <v-row dense class="mouse-pointer" v-for="(item, index) in finallyRecords" v-bind:key="index"
            v-on:click="openUpdate(item)">
            <v-col>
              <v-card v-if="item.fields.contact_id?.length > 0" tile elevation="1" class="ma-3"
                v-bind:color="index % 2 == 0 ? 'blue-grey lighten-4' : 'blue-grey lighten-5'">
                <v-row>
                  <v-col cols="12" sm="12" md="3" lg="3" xl="3">
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
                  <v-col cols="12" sm="12" md="3" lg="3" xl="3" class="d-flex align-center justify-center">
                    <span class="caption">
                      <v-icon> mdi-home </v-icon>
                      {{ item.fields.appointment_address }}
                    </span>
                  </v-col>
                  <v-col cols="12" sm="12" md="3" lg="3" xl="3" class="d-flex align-center justify-center py-0">
                    <SingleAgentComp :agentList="item.AgentData">
                    </SingleAgentComp>
                  </v-col>
                  <v-col cols="12" sm="12" md="3" lg="3" xl="3" class="d-flex align-center justify-center">
                    <AppointmentStatusComp v-bind:IsCancel="item.fields.is_cancelled"
                      v-bind:AppointmentDate="item.fields.appointment_date">
                    </AppointmentStatusComp>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row dense class="justify-center">
            <v-col cols="6">
              <v-pagination circle color="purple" v-model="currentPage" v-bind:length="pagiSize"
                v-on:input="displayPage(currentPage)"></v-pagination>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog width="500" v-model="dialog">
      <v-card class="rounded-0">
        <v-system-bar dark color="blue-grey lighten-3">
          <v-spacer></v-spacer>
          <v-btn small icon v-on:click="dialog = false">
            <v-icon small> mdi-close </v-icon>
          </v-btn>
        </v-system-bar>
        <AppointmentActionComp v-if="dialog" v-bind:editData="editData" v-on:reload="reload"></AppointmentActionComp>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import "vuetify/dist/vuetify.min.css";
import axios from "axios";
import AppointmentStatusComp from "./AppointmentStatusComp.vue";
import SearchComp from "../FilterComps/SearchComp.vue";
import StatusFilterComp from "../FilterComps/StatusFilterComp.vue";
import DateRangeFilterComp from "../FilterComps/DateRangeFilterComp.vue";
import AgentComp from "@/components/Agents/AgentComp.vue";
import AppointmentActionComp from "../ActionComps/AppointmentActionComp.vue";
import SingleAgentComp from "@/components/Agents/SingleAgentComp.vue";
import moment from "moment";
export default {
  name: "AppointmentList",
  components: {
    AppointmentStatusComp,
    SearchComp,
    StatusFilterComp,
    DateRangeFilterComp,
    AgentComp,
    AppointmentActionComp,
    SingleAgentComp,
  },
  data() {
    return {
      records: [],
      tempRecords: [],
      finallyRecords: [],
      currentPage: 1,
      pagiSize: 0,
      isFiltered: false,
      searchValue: "",
      statusValue: "",
      startDateValue: "",
      endDateValue: "",
      selectedAgentValue: [],
      loading: false,
      dialog: false,
      agentList: [],
      editData: {},
    };
  },

  methods: {
    //#region Fetch Operations
    async fetchAllData() {
      var th = this;
      th.records = [];
      let offset = "";
      const baseId = process.env.VUE_APP_AIRTABLE_BASE_ID;
      const tableName = "Appointments";
      const apiKey = process.env.VUE_APP_AIRTABLE_API_KEY;

      const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
      th.loading = true;
      do {
        const response = await axios.get(`${url}?offset=${offset}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        const data = response.data.records.map((m) => {
          m.Status = th.$createStatus(
            m.fields.appointment_date,
            m.fields.is_cancelled
          );//Ana data içerisine status diye bir değişken oluşturup her bir değer için atama yaptım ki filtrelemede işimiz kolaylaşsın.
          m.AgentData = [];
          if (m.fields.agent_id) {
            m.AgentData = th.agentList.filter((f) =>
              f.id.includes(m.fields.agent_id)
            );
          }
          return m;
        });
        th.records = [...th.records, ...data].sort(
          (b, a) =>
            moment(b.fields.appointment_date).valueOf() -
            moment(a.fields.appointment_date).valueOf()
        );//Başvuru tarihini küçükten büyüğe doğru burada sıraladım.
        th.tempRecords = [...th.records];
        th.finallyRecords = [...th.tempRecords];
        
        offset = response.data.offset;//apiden tüm veriler tek bir seferde gelmiyor. offset değeri göndermek gerekliymiş. Bu yüzden api isteğini offset null gelene kadar tekrar ettiriyorum.
      } while (offset);
      th.loading = false;
      th.displayPage(th.currentPage);
    },
    getAgents(callback) {
      var th = this;
      const tableId = "tblejF2oJbI8ze105";
      const url = `https://api.airtable.com/v0/${process.env.VUE_APP_AIRTABLE_BASE_ID}/${tableId}`;
      th.loading = true;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_AIRTABLE_API_KEY}`,
          },
        })
        .then((response) => {
          th.loading = false;
          th.agentList = response.data.records.map((m) => {
            m.IsSelected = false;
            return m;
          });

          if (callback instanceof Function) {
            callback();
          }
        })
        .catch((error) => {
          console.error("Axios isteği gönderilirken hata oluştu!", error);
          th.loading = false;
        });
    },
    //#endregion
    //#region Display Operations
    paginationSize: function (pageSize) {
      var th = this;
      var length = 0;
      //Bu kısım da herhangi bir filtre uygulandıysa sayfalama sayısını hesaplatmayı filtrelenen veriye göre yaptırıyorum.
      //isFiltered alanı bunu kontrol ediyor. Eğer filtreleme varsa tempRecords yani filtreli veriden hesapla yoksa tüm veriden hesapla
      //Bu şekilde ayırmadığımda sayfalama yapısı biraz karıştı o yüzden böyle yapmayı tercih ettim.
      length = th.isFiltered ? Math.floor(th.tempRecords.length / pageSize) : Math.floor(th.records.length / pageSize);
      length = th.isFiltered ? th.tempRecords.length % pageSize != 0 ? length + 1: length : th.records.length % pageSize != 0 ? length + 1 : length;
      th.pagiSize = length;
    },
    displayPage(page) {
      var th = this;
      const pageSize = 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      th.paginationSize(pageSize);
      //Burayı da ayırdım çünkü isFiltered alanı olmadığında ve sayfalama işlemini tempRecords listesinde yaptığımda veri kırpılmış oluyor 
      //tekrardan sayfalamaya çalıştığımda elimde ilk veri olmadığından kırpılmış veri olduğundan sorun yaşadım.
      //bu nedenle filtre uygulandıysa tempRecords listesinde sayfalama yap uygulanmadıysa ana veride yap diye ayırdım.
      th.finallyRecords = th.isFiltered ? [...th.tempRecords.slice(startIndex, endIndex)] : [...th.records.slice(startIndex, endIndex)];
    },

    //#endregion
    //#region Filters
    searched() {
      var th = this;
      //Bu metod filtre componentlerinde yapılan arama değerlerine göre filtreleme yapıyor.
      //v-model sayesinde componentlerde yapılan filtrelemeleri alıp değişkenlere aktarıyorum.
      th.isFiltered = true;
      th.currentPage = 1;
      th.tempRecords = [...th.records];
      if (th.searchValue) {
        th.filterSearch();
      }
      if (th.statusValue) {
        th.filterStatus();
      }
      if (th.startDateValue && th.endDateValue) {
        th.filterDate();
      }
      if (th.selectedAgentValue.length > 0) {
        th.filterAgent();
      }
      th.finallyRecords = [...th.tempRecords];
      th.displayPage(th.currentPage);
    },
    filterSearch() {
      var th = this;
      var searchedArray = th.tempRecords.map((m) => {
        return {
          search_text:
            `${m.fields.contact_name}${m.fields.contact_surname}${m.fields.contact_email}${m.fields.contact_phone}${m.fields.appointment_address}`.toLowerCase(), //Arama yapılacak tüm alanları burada tek bir stringte topluyorum.
          search_id: m.id,
          data: m,
        };
      });
      var searchArr = searchedArray
        .filter((f) => {
          return f.search_text.includes(th.searchValue.toLowerCase());
        })
        .map((m) => m.data);
      th.tempRecords = [...searchArr];
    },
    filterStatus() {
      var th = this;
      var statusArr = th.tempRecords.filter((f) => {
        return th.statusValue == f.Status;
      });
      th.tempRecords = [...statusArr];
    },
    filterDate() {
      var th = this;
      var dateArr = th.tempRecords.filter((f) => {
        var momentAppointmentDate = moment(f.fields.appointment_date);
        return (
          momentAppointmentDate < moment(th.endDateValue) &&
          momentAppointmentDate > moment(th.startDateValue)
        );
      });
      th.tempRecords = [...dateArr];
    },
    filterAgent() {
      var th = this;
      var newArr = th.selectedAgentValue
        .map((m) => {
          return th.tempRecords.find((f) => {
            return f.fields.agent_id == m;
          });
        })
        .filter((f) => f != undefined);
      th.tempRecords = [...newArr];
    },
    //#endregion
    openActionDialog() {
      var th = this;
      th.editData = {};
      th.dialog = true;
    },
    openUpdate(item) {
      var th = this;
      //Bu kısım edit modalını açarken gelecek verilerin bind edildiği kısım.
      th.editData.appointment_address = item.fields.appointment_address;
      th.editData.appointment_date = item.fields.appointment_date;
      th.editData.id = item.id;
      th.editData.status = item.Status;
      th.editData.isCancel = item.fields.is_cancelled;
      th.editData.appointments = [...th.records];
      th.editData.contact = item.fields.contact_id.map((m, ix) => {
        return {
          ContactId: m,
          ContactName: item.fields.contact_name[ix],
          ContactSurname: item.fields.contact_surname[ix],
          ContactPhone: item.fields.contact_phone[ix],
        };
      });
      th.dialog = true;
    },
    reload() {
      var th = this;
      th.dialog = false;
      //Edit Modalında Bir Hareket Olduysa Filtreleme Temizlemelerini Aşağıda Yapıyorum.
      th.statusValue = "";
      th.searchValue = '';
      th.startDateValue = '';
      th.endDateValue = '';
      th.fetchAllData();
    },
  },
  beforeMount: function () {
    var th = this;
    th.getAgents(th.fetchAllData);
  },
};
</script>
