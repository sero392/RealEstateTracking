<template>
    <div>
        <v-overlay absolute v-bind:value="loading">
            <div class="loader"></div>
        </v-overlay>
        <v-container fluid>
            <v-row dense>
                <v-col>
                    <v-icon small>mdi-calendar</v-icon>
                    <span class="caption">Create An Appointment</span>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row v-if="!edit.contact || edit.contact.length == 0" dense class="mt-2">
                <v-col cols="12" class="d-flex flex-column align-start">
                    <fieldset class="w-100 pa-1">
                        <legend class="caption">Contacts</legend>
                        <div>
                            <input class="main-text-field" type="text" placeholder="Search"
                                v-on:keyup="searchInContacts" />
                            <v-icon small>mdi-magnify</v-icon>
                        </div>
                        <select id="contact-select" class="w-100 main-combobox mt-1">
                            <option v-for="(item, index) in tempContacts" v-bind:key="index" v-bind:value="index">
                                {{
            `${item.fields.contact_name} ${item.fields.contact_surname}`
        }}
                            </option>
                        </select>
                        <span v-if="errors.contact" class="caption red--text">{{
            errors.contact
        }}</span>
                    </fieldset>
                </v-col>
            </v-row>
            <v-row v-else class="mt-2" v-for="(item, index) in edit.contact" v-bind:key="index">
                <v-col cols="12">
                    <v-card tile elevation="1">
                        <v-system-bar>
                            <v-spacer></v-spacer>
                            <v-btn icon x-small v-on:click="deleteContact(index)">
                                <v-icon> mdi-close </v-icon>
                            </v-btn>
                        </v-system-bar>
                        <v-card-text class="pa-2">
                            <span class="caption">
                                {{ item.ContactName }}
                                {{ item.ContactSurname }}
                            </span>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row dense class="mt-2">
                <v-col cols="12" class="d-flex flex-column align-start">
                    <label for="address" class="caption"> Address </label>
                    <textarea name="address" class="main-text-field w-100" rows="5"
                        v-model="model.fields.appointment_address"></textarea>
                    <span v-if="errors.address" class="caption red--text">{{
            errors.address
        }}</span>
                </v-col>
            </v-row>
            <v-row dense class="mt-2">
                <v-col cols="12" class="d-flex flex-column align-start">
                    <label for="address" class="caption"> Appointment Date </label>
                    <input class="main-text-field w-100" type="datetime-local"
                        v-model="model.fields.appointment_date" />
                    <span v-if="errors.date" class="caption red--text">{{
            errors.date
        }}</span>
                </v-col>
            </v-row>

            <v-row v-if="edit.id" dense class="mt-2">
                <v-col cols="12" class="d-flex flex-column align-start">
                    <label for="address" class="caption"> Status </label>
                    <StatusFilterComp v-model="selectedStatus"></StatusFilterComp>
                    <span v-if="errors.status" class="caption red--text">{{
            errors.status
        }}</span>
                </v-col>
            </v-row>
            <v-row v-if="relatedAppointments.length > 0">
                <span class="caption text-uppercase ml-3">
                    Related Appointments
                </span>
                <v-col cols="12" v-for="(item, ix) in relatedAppointments" v-bind:key="ix">
                    <v-row>
                        <v-col>
                            <span class="overline">{{ item.ContactFullName }}</span>
                        </v-col>
                    </v-row>
                    <div class="d-flex overflow-x-auto ga-5 mh-200">
                        <v-card tile outlined min-width="200" v-for="(item2, ix2) in item.appointments" v-bind:key="ix2"
                            class="d-flex align-center">
                            <v-card-text>
                                <v-row dense class="justify-center">
                                    <v-col cols="auto" >
                                        <span>
                                            {{ item2.fields.appointment_address?.substr(0,20) }}
                                        </span>
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col>
                                        <span>
                                            <AppointmentStatusComp v-bind:IsCancel="item2.fields.is_cancelled"
                                                v-bind:AppointmentDate="item2.fields.appointment_date">
                                            </AppointmentStatusComp>
                                        </span>
                                    </v-col>
                                </v-row>

                            </v-card-text>
                        </v-card>
                    </div>

                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-btn tile small color="primary" v-on:click="appointmentAction">
                        Create
                        <v-icon small>mdi-check</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import StatusFilterComp from '../FilterComps/StatusFilterComp.vue'
import AppointmentStatusComp from "../ListComps/AppointmentStatusComp.vue";
export default {
    components: {
        StatusFilterComp,
        AppointmentStatusComp
    },
    data() {
        return {
            contacts: [],
            tempContacts: [],
            model: {
                id: "",
                fields: {
                    appointment_date: "",
                    appointment_address: "",
                    contact_id: [],
                },
            },
            loading: false,
            errors: {},
            isValid: false,
            edit: "",
            selectedStatus: '',
            relatedAppointments: [],
        };
    },
    watch: {
        editData: {
            handler(newValue) {
                this.edit = { ...newValue };
            },
            deep: true,
            immediate: true,
        },
    },
    props: {
        editData: {
            type: Object,
            required: false,
        },
    },
    methods: {
        //#region Contact Operations

        //Contact Bilgilerini Alıyor.
        fetchAllData() {
            var th = this;
            th.loading = true;
            const tableId = "tbl0TuknKqXHysejd";
            const url = `https://api.airtable.com/v0/${process.env.VUE_APP_AIRTABLE_BASE_ID}/${tableId}`;
            axios
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${process.env.VUE_APP_AIRTABLE_API_KEY}`,
                    },
                })
                .then((response) => {
                    th.loading = false;
                    th.contacts = response.data.records.map((m) => m);
                    th.createSearchString();
                    th.tempContacts = [...th.contacts];

                    if (th.edit.id) {
                        th.editFillInputs();
                    } else {
                        th.model.fields.appointment_date = "";
                        th.model.fields.appointment_address = "";
                    }
                })
                .catch((error) => {
                    th.loading = false;
                    console.error("Axios isteği gönderilirken hata oluştu!", error);
                });
        },
        //Aranan Contact bilgisini Buluyor.
        searchInContacts(event) {
            var th = this;
            th.tempContacts = [...th.contacts];
            if (event.target.value) {
                var val = event.target.value.toLowerCase().replace(" ", "").trim();
                th.tempContacts = th.tempContacts.filter((s) =>
                    s.SearchString.includes(val)
                );
            }
        },
        //Silinmek istenen contact bilgisini listeden siliyor.
        deleteContact(index) {
            var th = this;
            th.edit.contact.splice(index, 1);
        },
        //Seçili olan Contact bilgisini modele ekler.
        findSelectedContact() {
            var th = this;
            if (th.edit.contact && th.edit.contact.length > 0) {
                return;
            }
            th.model.fields.contact_id = [];
            var contactValue = document.getElementById("contact-select").value;
            if (!contactValue) return;
            var contact = th.tempContacts.find((i, x) => x == contactValue);
            th.model.fields.contact_id.push(contact.id);
        },
        createSearchString() {
            var th = this;
            th.contacts.map((m) => {
                m.SearchString =
                    `${m.fields.contact_name}${m.fields.contact_surname}`.toLowerCase();
                return m;
            });
        },

        //#endregion
        //#region Edit Operations
        editFillInputs() {
            var th = this;
            th.model.fields.appointment_address = th.edit.appointment_address;
            th.model.fields.appointment_date = moment
                .utc(th.edit.appointment_date)
                .format("YYYY-MM-DD HH:mm:ss");
            th.model.fields.contact_id = th.edit.contact.map((m) => {
                return m.ContactId;
            });
            th.model.id = th.edit.id;
            th.relatedAppointments = th.edit.contact.map(m => {
                const appointments = th.edit.appointments.filter(s => {
                    return s.fields.contact_id?.includes(m.ContactId)
                });
                return {
                    appointments,
                    ContactFullName: `${m.ContactName} ${m.ContactSurname}`
                };
            });
            th.selectedStatus = th.edit.status.toString();
        },
        //#endregion
        //#region Validate
        validate() {
            var th = this;
            th.errors = {};
            th.isValid = false;
            if (th.model.fields.contact_id.length == 0) {
                th.errors.contact = "Lütfen Kişi Seçiniz.";
            }
            if (!th.model.fields.appointment_address) {
                th.errors.address = "Lütfen Adres Giriniz.";
            }
            if (!th.model.fields.appointment_date) {
                th.errors.date = "Lütfen Tarih Seçiniz.";
            }
            if (th.edit) {
                var status = th.$createStatus(th.edit.appointment_date, th.edit.isCancel);
                if (status == th.$status.ISCOMING && th.selectedStatus == th.$status.COMPLETED) {
                    th.errors.status = "Henüz Randevu Tarihi Geçmemiş, Tamamlanmış Yapamazsınız!";
                }
                else if (!moment.utc(th.edit.appointment_date).isAfter(moment.utc(new Date())) && th.selectedStatus == th.$status.ISCOMING) {
                    th.errors.status = "Randevu Tarihi Geçmiştir, Beklemede Yapamazsınız!";
                }
            }
            if (Object.keys(th.errors).length == 0) {
                th.isValid = true;
            }
        },
        //#endregion
        //#region Post & Put
        async appointmentAction() {
            var th = this;
            th.findSelectedContact();
            th.validate();
            if (!th.isValid) {
                return;
            }

            th.loading = true;
            const baseId = process.env.VUE_APP_AIRTABLE_BASE_ID;
            const tableName = "Appointments";
            const apiKey = process.env.VUE_APP_AIRTABLE_API_KEY;
            const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
            var base = Object.assign({}, th.model.fields);
            var mdl = {
                records: [
                    {
                        fields: base,
                    },
                ],
            };
            let response = "";
            if (!th.model.id) {
                response = await axios.post(url, mdl, {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                });
            } else {
                base.is_cancelled = th.selectedStatus == th.$status.CANCEL ? true : false;
                mdl.records = [
                    {
                        id: th.model.id,
                        fields: base,
                    },
                ];
                response = await axios.put(url, mdl, {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                });
            }
            if (response.status == 200) {
                th.$emit("reload");
                Swal.fire({
                    icon: "success",
                    title: "Başarılı!",
                    html: "İşlem Başarılı",
                });
            }
            th.loading = false;
        },
        //#endregion
    },
    beforeMount: function () {
        var th = this;
        th.fetchAllData();
    },
};
</script>
