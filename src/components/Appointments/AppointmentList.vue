<template>
  <div>
    <v-row dense class="pa-4">
      <v-col>
        <v-row
          dense
          v-for="(item, index) in records"
          v-bind:key="index"
        >
          <v-col>
            <v-card tile>
              <v-row>
                <v-col>
                  <v-row
                    dense
                    v-for="(item2, index2) in item.fields.contact_id"
                    v-bind:key="index2"
                  >
                    <v-col cols="12">
                      {{ item2 }}
                    </v-col>
                    <v-col cols="12">
                      {{ item.fields.contact_name[index2] }}
                    </v-col>
                    <v-col cols="12">
                      {{ item.fields.contact_surname[index2] }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col>
                    <span class="caption">
                  {{ item.fields.appointment_address }}

                    </span>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <pre>
        {{ records }}
    </pre>
  </div>
</template>
<script>
import "../../assets/main.css";
import axios from "axios";
export default {
  name: "AppointmentList",
  data() {
    return {
      records: [],
    };
  },
  methods: {
    fetchAllData() {
      const baseId = "appkTtnhXACqj0kag";
      const tableName = "Appointments";
      const apiKey =
        "patNZrZi9AkEhr1Nx.fdd6bd6e2dc8908ac3e8c2851f5c5824f442a40ff75b5e2cd02a10bcceb27804";
      const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })
        .then((response) => {
          this.records = response.data.records;
        })
        .catch((error) => {
          console.error("Error fetching records:", error);
        });
    },
  },
  beforeMount: function () {
    var th = this;
    th.fetchAllData();
  },
};
</script>
