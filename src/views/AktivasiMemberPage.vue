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
                        <v-tab href="/aktivasiMember" active>Aktivasi</v-tab>
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
                            <div style="margin-top: 5px" class="ml-auto">
                                <v-btn class="mx-2 mt-4 mb-4" color="#1428de" style="font-weight: bold; color: white"
                                    @click="dialog = true">
                                    Tambah Data
                                </v-btn>
                            </div>
                        </div>
                    </v-card>
                    <v-card v-else>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Cari Data" single-line hide-details
                            outlined style="margin-left: 15px; margin-right: 15px"></v-text-field>
                        <div style="margin-left: 15px; margin-right: 15px">
                            <v-btn class="mt-2 mb-2" color="primary" style="font-weight: bold; color: white; width: 100%"
                                @click="dialog = true">
                                Tambah Aktivasi
                            </v-btn>
                        </div>
                    </v-card>
                    <v-card style="margin-top: 20px">
                        <v-data-table :headers="headers" :items="aktivasiMembers" :search="search" :loading="load"
                            loading-text="Sedang mengambil data" no-data-text="Tidak ada Data">
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-btn color="success" class="mr-2" @click="editHandler(item)">
                                    <v-icon>
                                        mdi-clipboard-edit-outline
                                    </v-icon>
                                </v-btn>
                                <v-btn color="error" class="mr-2" @click="deleteHandler(item.id)">
                                    <v-icon>
                                        mdi-delete-forever
                                    </v-icon>
                                </v-btn>
                                <v-btn color="primary" class="mr-2" @click="resetPassword(item)">
                                    <v-icon>
                                        mdi-lock-reset
                                    </v-icon>
                                </v-btn>
                            </template>
                        </v-data-table>
                        <div style="text-align: center;">
                            <v-btn color="dark purple" class="mr-2"
                                style="font-weight: bold; color: white; margin-bottom: 20px;" to="/kasir">
                                Member
                            </v-btn>
                        </div>
                    </v-card>
                    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                        <v-card>
                            <v-card-title>
                                <div :style="!$vuetify.breakpoint.mobile ? 'display: flex;' : ''" style="width: 100%">
                                    <span class="headline">{{ formTitle }} Kativasi Member</span>
                                </div>
                            </v-card-title>
                            <hr />
                            <v-card-text>
                                <v-container style="width: 1000px;">
                                    <v-select class="my-2" :items="pegawais" v-model="form.id_pegawai" label="Pegawai"
                                        counter item-value="id_pegawai" item-text="nama_pegawai" outlined
                                        required></v-select>
                                    <v-select class="my-2" :items="members" v-model="form.id_member" label="Member" counter
                                        item-value="id_member" item-text="nama_member" outlined required></v-select>
                                    <v-text-field v-model="form.jumlah_bayar" label="Rp 3.000.000" required outlined
                                        :rules="error.jumlah_bayar" disabled></v-text-field>
                                    <v-btn color="error" @click="cancel"> Batal </v-btn>
                                    <v-btn style="margin-left: 15px" color="primary" @click="dialogConfirmEdit = true">
                                        Simpan
                                    </v-btn>
                                </v-container>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogConfirmEdit" persistent max-width="400px">
                        <v-card>
                            <v-card-title style="justify-content: center">
                                <img src="https://tse3.mm.bing.net/th?id=OIP.6T7rNxqug426VTy3vQQeZgHaHa&pid=Api&P=0"
                                    alt="warning" width="50" height="50" />
                            </v-card-title>
                            <v-card-text> Edit Data? </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="error" @click="cancel"> Batal</v-btn>
                                <v-btn color="success" @click="setForm"> Yakin </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
                        <v-card>
                            <v-card-title style="justify-content: center">
                                <img src="https://tse3.mm.bing.net/th?id=OIP.6T7rNxqug426VTy3vQQeZgHaHa&pid=Api&P=0"
                                    alt="warning" width="50" height="50" />
                            </v-card-title>
                            <v-card-text> Hapus Data? </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="error" @click="dialogConfirm = false"> Batal </v-btn>
                                <v-btn color="success" @click="deleteData"> Hapus </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-snackbar v-model="snackbar" :color="color" bottom>{{ error_message }}
                        <template v-slot:action="{ attrs }">
                            <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
                                Tutup
                            </v-btn>
                        </template>
                    </v-snackbar>
                </v-container>
            </v-sheet>
        </v-card>
    </v-main>
</template>
  
<script>
export default {
    data() {
        return {
            deleteId: "",
            editId: "",
            inputType: "Tambah",
            search: null,
            load: false,
            snackbar: false,
            aktivasiMembers: [],
            pegawais: [],
            members: [],
            aktivasiMember: new FormData(),
            error_message: "",
            dialog: false,
            color: "",
            dialogConfirm: false,
            dialogConfirmEdit: false,
            form: {
                id_pegawai: "",
                id_member: "",
                jumlah_bayar: "",
                jenis_bayar: ""
            },
            error: {
                jumlah_bayar: [(v) => !!v || "Field required"],
                jenis_bayar: [(v) => !!v || "Field required"],
            },
            items: [
                {
                    text: "...",
                    disabled: true,
                },
                {
                    text: "Aktivasi Member",
                    disabled: false,
                },
            ],
            headers: [
                {
                    text: "ID",
                    value: "id",
                },
                {
                    text: "Pegawai",
                    value: "nama_pegawai",
                },
                {
                    text: "Member",
                    value: "nama_member",
                },
                {
                    text: "Jumlah Bayar",
                    value: "jumlah_bayar",
                },
                {
                    text: "Aktivasi",
                    value: "status"
                },
                {
                    text: "Action",
                    value: "actions",
                    width: "500px",
                },
            ],
            namaPegawai: [
                {
                    text: "pegawais->nama_pegawai",
                    value: "nama_pegawai"
                }
            ],
        };
    },
    computed: {
        formTitle() {
            return this.inputType;
        },
    },
    mounted() {
        this.getDataAktivasi();
    },
    methods: {
        setForm() {
            if (this.inputType !== "Tambah") {
                this.updateAktivasi();
            } else {
                this.submitAktivasi();
            }
        },
        getDataAktivasi() {
            this.load = true;
            var url = this.$api + "/aktivasiMember";
            this.$http
                .get(url, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    this.aktivasiMembers = response.data.data;
                    this.pegawais = response.data.pegawai;
                    this.members = response.data.member;
                    this.load = false;
                });
            this.load = true;
        },
        submitAktivasi() {
            this.aktivasiMember.append("id_pegawai", this.form.id_pegawai);
            this.aktivasiMember.append("id_member", this.form.id_member);
            this.aktivasiMember.append("jumlah_bayar", 3000000);

            var url = this.$api + "/aktivasiMember";
            this.load = true;
            this.$http
                .post(url, this.aktivasiMember, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                })
                .then(() => {
                    this.error_message = "Berhasil menambahkan data";
                    this.color = "green";
                    this.snackbar = true;
                    this.load = true;
                    this.close();
                    this.getDataAktivasi();
                    this.resetForm();
                })
                .catch(() => {
                    this.error_message = "Tambah Aktivasi Member gagal!";
                    this.color = "red";
                    this.dialogConfirmEdit = false;
                    this.snackbar = true;
                    this.load = false;
                });
        },
        updateMember() {
            let newData = {
                id_pegawai: this.form.id_pegawai,
                id_member: this.form.id_member,
                jumlah_bayar: this.form.jumlah_bayar,
            };
            var url = this.$api + "/aktivasiMember/" + this.editId;
            this.load = true;
            this.$http
                .put(url, newData, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                })
                .then(() => {
                    this.error_message = "Berhasil memperbarui data";
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.getDataAktivasi();
                    this.resetForm();
                    this.inputType = "Tambah";
                })
                .catch(() => {
                    this.error_message = "Update Aktivasi Member gagal!" + this.editId;
                    this.color = "red";
                    this.dialogConfirmEdit = false;
                    this.snackbar = true;
                    this.load = false;
                });
        },
        deleteData() {
            var url = this.$api + "/aktivasiMember/" + this.deleteId;
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
                    this.getDataAktivasi(); //mengambil data
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
                id_pegawai: false,
                id_member: false,
                jumlah_bayar: false,
                jenis_bayar: false,
            }),
                this.resetForm();
            this.getDataAktivasi();
        },
        close() {
            this.dialog = false;
            this.inputType = "Tambah";
            this.dialogConfirm = false;
            this.dialogConfirmEdit = false;
            this.getDataAktivasi();
        },
        editHandler(item) {
            this.inputType = "Ubah";
            this.editId = item.id;
            this.form.id_pegawai = item.id_pegawai;
            this.form.id_member = item.id_member;
            this.form.jumlah_bayar = item.jumlah_bayar;
            this.form.jenis_bayar = item.jenis_bayar;
            this.dialog = true;
        },
        resetPassword(item) {
            let newData = {
                id_pegawai: item.id_pegawai,
                id_member: item.id_member,
                jumlah_bayar: item.jumlah_bayar,
                jenis_bayar: item.jenis_bayar
            };
            var url = this.$api + "/aktivasiMember/" + item.id;
            this.load = true;
            this.$http
                .put(url, newData, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                })
                .then(() => {
                    this.error_message = "Berhasil memperbarui password";
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.getDataAktivasi();
                    this.resetForm();
                    this.inputType = "Tambah";
                })
                .catch(() => {
                    this.error_message = "Silahkan periksa kembali";
                    this.color = "red";
                    this.dialogConfirmEdit = false;
                    this.snackbar = true;
                    this.load = false;
                });
        },
        deleteHandler(id) {
            this.deleteId = id;
            this.dialogConfirm = true;
        },
        resetForm() {
            this.form = {
                id_pegawai: "",
                id_member: "",
                jumlah_bayar: "",
                jenis_bayar: "",
            };
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
  