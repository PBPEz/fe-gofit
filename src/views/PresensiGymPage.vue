<template>
    <v-main>
        <v-card class="overflow-hidden">
            <v-app-bar absolute color="#6A76AB" dark shrink-on-scroll prominent
                src="http://3.bp.blogspot.com/-NMvk7UyW_n8/UnhA_jPAmjI/AAAAAAAAARg/hCF2s23vRN0/s1600/urlwewe.gif"
                fade-img-on-scroll scroll-target="#scrolling-techniques-3">
                <template v-slot:img="{ props }">
                    <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"></v-img>
                </template>
                <template v-slot:extension>
                    <v-tabs align-with-title>
                        <v-tab href="/dashboard" active>Member</v-tab>
                        <v-tab href="/instruktur" disabled>Instruktur</v-tab>
                        <v-tab href="/jadwal" disabled>Jadwal</v-tab>
                        <v-tab href="/presensiGym">Presensi Gym</v-tab>
                        <v-tab @click="btnLogout">Logout</v-tab>
                    </v-tabs>
                </template>
            </v-app-bar>
            <v-sheet id="scrolling-techniques-3" class="overflow-y-auto" max-height="1000">
                <v-container style="height: 1000px;">
                    <v-card v-if="!$vuetify.breakpoint.mobile" style="margin-top: 300px;">
                        <div style="display: flex">
                            <v-col :cols="$vuetify.breakpoint.mobile ? '' : '1'" sm="3">
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Cari Data" single-line
                                    hide-details outlined></v-text-field>
                            </v-col>
                        </div>
                    </v-card>
                    <v-card v-else>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Cari Data" single-line hide-details
                            outlined style="margin-left: 15px; margin-right: 15px"></v-text-field>
                    </v-card>
                    <v-card style="margin-top: 20px">
                        <v-data-table :headers="headers" :items="bookingGym" :search="search" :loading="load"
                            loading-text="Sedang mengambil data" no-data-text="Tidak ada Data">
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-btn color="error" class="mr-2" @click="printStruk(item)">
                                    <v-icon>
                                        mdi-printer-pos-check
                                    </v-icon>
                                </v-btn>
                                <v-btn color="primary" class="mr-2" @click="presensiGym(item.id)">
                                    <v-icon>
                                        mdi-calendar-check
                                    </v-icon>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card>
                    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                        <v-card class="mx-auto my-12" max-width="374">
                            <v-card-title>
                                <div :style="!$vuetify.breakpoint.mobile ? 'display: flex;' : ''" style="width: 100%">
                                    <span class="headline">Struk Presensi Gym</span>
                                </div>
                            </v-card-title>
                            <hr />
                            <v-card-text>
                                <v-container style="width: 600px; ">
                                    <v-card-title :items="bookingGym">Nama Member : {{ nama_member }}</v-card-title>
                                </v-container>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </v-container>
            </v-sheet>
        </v-card>
    </v-main>
</template>
  
<script>
import { jsPDF } from "jspdf";
export default {
    data() {
        return {
            editId: "",
            search: null,
            load: false,
            snackbar: false,
            bookingGym: [],
            error_message: "",
            dialog: false,
            color: "",
            dialogConfirm: false,
            dialogConfirmEdit: false,
            form: {
                jam_presensi: "",
            },
            statusAktif: [
                {
                    text: "Aktif",
                    value: "aktif",
                },
                {
                    text: "Tidak Aktif",
                    value: "tidak aktif",
                },
            ],
            items: [
                {
                    text: "...",
                    disabled: true,
                },
                {
                    text: "Member",
                    disabled: false,
                },
            ],
            headers: [
                {
                    text: "Nomor Struk",
                    value: "id"
                },
                {
                    text: "Nama Member",
                    value: "nama_member",
                },
                {
                    text: "Tanggal",
                    value: "tanggal",
                },
                {
                    text: "Sesi",
                    value: "sesi",
                },
                {
                    text: "Jam Presensi",
                    value: "jam_booking"
                },
                {
                    text: "Action",
                    value: "actions",
                    width: "500px",
                },
            ],
        };
    },
    computed: {
        formTitle() {
            return this.inputType;
        },
    },
    mounted() {
        this.getDataBookingGyms();
    },
    methods: {
        getDataBookingGyms() {
            this.load = true;
            var url = this.$api + "/bookingGym";
            this.$http
                .get(url)
                .then((response) => {
                    this.bookingGym = response.data.data;
                    this.load = false;
                });
            this.load = true;
        },
        submitMember() {
            this.member.append("nama_member", this.form.nama_member);
            this.member.append("nomor_telepon", this.form.nomor_telepon);
            this.member.append("deposit_uang", this.form.deposit_uang);
            this.member.append("deposit_kelas", this.form.deposit_kelas);
            this.member.append("email", this.form.email);
            this.member.append("username", this.form.username);
            this.member.append("password", this.form.password);
            this.member.append("tanggal_lahir", this.form.tanggal_lahir);
            this.member.append("status", this.form.status);
            this.member.append("gender", this.form.gender);

            var url = this.$api + "/member";
            this.load = true;
            this.$http
                .post(url, this.member, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                })
                .then(() => {
                    this.error_message = "Berhasil menambahkan data";
                    this.color = "green";
                    this.snackbar = true;
                    this.load = true;
                })
                .catch(() => {
                    this.error_message = "Tambah Member gagal!";
                    this.color = "red";
                    this.dialogConfirmEdit = false;
                    this.snackbar = true;
                    this.load = false;
                });
        },
        printStruk(item){
            this.editId = item.id;

            const doc = new jsPDF();

            doc.text("Gofit",10,10);
            doc.text("Jl.Centralpark No.10 Yogyakarta",10,20);
            doc.text("STRUK PRESENSI KELAS",10,30);
            doc.text(`Nomor Struk   : ${item.id}`,10,50);
            doc.text(`Tanggal           : ${item.tanggal} ${item.jam_booking}`,10,60);
            doc.text(`Member        : ${item.id_member} / ${item.nama_member}`,10,80);
            doc.text(`Sesi              : ${item.sesi}`,10,90);
            doc.save("gofit.pdf")
        },
        presensiGym(editId) {
            var url = this.$api + "/bookingGym/" + editId;
            this.load = true;
            this.$http
                .put(url)
                .then((response) => {
                    this.snackbar = true;
                    this.error_message = response.data.data;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.getDataBookingGyms();
                    this.dialog = true;
                    location.reload();
                })
                .catch(() => {
                    this.error_message = "Update Member gagal!" + this.editId;
                    this.color = "red";
                    this.dialogConfirmEdit = false;
                    this.snackbar = true;
                    this.load = false;
                });
        },
        deleteData() {
            var url = this.$api + "/member/" + this.deleteId;
            this.$http
                .delete(url, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.getDataMember(); //mengambil data
                    this.resetForm();
                    location.reload();
                    this.inputType = "Tambah";
                })
                .catch((error) => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        cancel() {
            this.dialog = false;
            this.dialogConfirmEdit = false;
            this.inputType = "Tambah";
            (this.error = {
                nama_member: false,
                no_telp: false,
                alamat: false,
                deposit: false,
                masa_berlaku: false,
                tgl_lahir: false,
                status: false,
                email_member: false,
                username: false,
                password: false,
            }),
                this.resetForm();
            this.getDataMember();
        },
        close() {
            this.dialog = false;
            this.inputType = "Tambah";
            this.dialogConfirm = false;
            this.dialogConfirmEdit = false;
            this.getDataMember();
        },
        deleteHandler(id) {
            this.deleteId = id;
            this.dialogConfirm = true;
        },
        resetForm() {
            this.form = {
                nama_member: "",
                nomor_telepon: "",
                deposit_uang: "",
                deposit_kelas: "",
                tanggal_lahir: "",
                status: "",
                email: "",
                gender: "",
                username: "",
                password: "",
            };
        },
        btnLogout() {
            localStorage.removeItem("token");
            localStorage.removeItem("id_pegawai");
            localStorage.removeItem("nama_pegawai");
            localStorage.removeItem("role");
            this.$router.push("/");
        },
    },
};
</script>
  
<style>
#app {
    margin-top: -10px;
    background-color: #ffffff;
}

@media screen {
    .v-data-table>.v-data-table__wrapper>table>tbody>tr:nth-child(odd) {
        border-left: 6px solid #1428de;
    }

    .v-data-table>.v-data-table__wrapper>table>tbody>tr:nth-child(even) {
        border-left: 6px solid #ffffff;
    }
}
</style>
  