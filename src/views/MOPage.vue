<template>
  <v-main>
    <v-card class="overflow-hidden">
      <v-app-bar absolute color="#6A76AB" dark shrink-on-scroll prominent src="http://3.bp.blogspot.com/-NMvk7UyW_n8/UnhA_jPAmjI/AAAAAAAAARg/hCF2s23vRN0/s1600/urlwewe.gif"
        fade-img-on-scroll scroll-target="#scrolling-techniques-3">
        <template v-slot:img="{ props }">
          <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"></v-img>
        </template>
        <template v-slot:extension>
          <v-tabs align-with-title>
            <v-tab href="/jadwal">Jadwal</v-tab>
            <v-tab href="/instruktur" disabled>Instruktur</v-tab>
            <v-tab href="/dashboard" disabled>Member</v-tab>
            <v-tab href="/login">Logout</v-tab>
          </v-tabs>
        </template>
      </v-app-bar>
      <v-sheet id="scrolling-techniques-3" class="overflow-y-auto" max-height="1000">
        <v-container style="height: 1000px;">
          <v-card v-if="!$vuetify.breakpoint.mobile" style="margin-top: 300px;">
            <div style="display: flex">
              <v-col :cols="$vuetify.breakpoint.mobile ? '' : '1'" sm="3">
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Cari Data" single-line hide-details
                  outlined></v-text-field>
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
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Cari Data" single-line hide-details outlined
              style="margin-left: 15px; margin-right: 15px"></v-text-field>
            <div style="margin-left: 15px; margin-right: 15px">
              <v-btn class="mt-2 mb-2" color="primary" style="font-weight: bold; color: white; width: 100%"
                @click="dialog = true">
                Tambah Data
              </v-btn>
            </div>
          </v-card>
          <v-card style="margin-top: 20px">
            <v-data-table :headers="headers" :items="kelass" :datas="kelass" :search="search" :loading="load"
              loading-text="Sedang mengambil data" no-data-text="Tidak ada Data">
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn color="success" class="mr-2" @click="editHandler(item)">
                  Update
                </v-btn>
                <v-btn color="error" class="mr-2" @click="deleteHandler(item.id)">
                  Delete
                </v-btn>
                <v-btn color="primary" class="mr-2" @click="resetPassword(item)">
                  Reset Password
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
          <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
              <v-card-title>
                <div :style="!$vuetify.breakpoint.mobile ? 'display: flex;' : ''" style="width: 100%">
                  <span class="headline">{{ formTitle }} Member</span>
                </div>
              </v-card-title>
              <hr />
              <v-card-text>
                <v-container style="width: 1000px;">
                  <v-text-field v-model="form.nama_member" label="Nama Member" required outlined
                    :rules="error.nama_member"></v-text-field>
                  <v-text-field v-model="form.tanggal_lahir" label="Tanggal Lahir" required type="date" outlined
                    :rules="error.tgl_lahir"></v-text-field>
                  <v-text-field v-model="form.email" label="Email" required outlined
                    :rules="error.email_member"></v-text-field>
                  <v-text-field v-model="form.deposit_uang" label="Deposit Uang" required outlined
                    :rules="error.deposit"></v-text-field>
                  <v-text-field v-model="form.deposit_kelas" label="Deposit Kelas" required outlined
                    :rules="error.deposit"></v-text-field>
                  <v-text-field v-model="form.nomor_telepon" label="Nomor Telepon" required outlined
                    :rules="error.no_telp"></v-text-field>
                  <v-text-field v-model="form.gender" label="Gender" required outlined
                    :rules="error.no_telp"></v-text-field>
                  <v-select :items="statusAktif" v-model="form.status" label="Status " item-value="value" outlined
                    :rules="error.status" item-text="text"></v-select>
                  <v-text-field v-model="form.username" label="Username" required outlined :rules="error.username"
                    disabled></v-text-field>
                  <v-text-field v-model="form.password" label="Password" required outlined :rules="error.password"
                    disabled></v-text-field>
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
                <img src="https://tse3.mm.bing.net/th?id=OIP.6T7rNxqug426VTy3vQQeZgHaHa&pid=Api&P=0" alt="warning" width="50" height="50" />
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
                <img src="https://tse3.mm.bing.net/th?id=OIP.6T7rNxqug426VTy3vQQeZgHaHa&pid=Api&P=0" alt="warning" width="50" height="50" />
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
      jadwal_umums: [],
      kelass: [],
      jadwal_umum: new FormData(),
      error_message: "",
      dialog: false,
      color: "",
      dialogConfirm: false,
      dialogConfirmEdit: false,
      form: {
        id_kelas: "",
        tanggal: "",
        hari: "",
        sesi: "",
      },
      error: {
        id_kelas: [(v) => !!v || "Field required"],
        tanggal: [(v) => !!v || "Field required"],
        hari: [(v) => !!v || "Field required"],
        sesi: [(v) => !!v || "Field required"],
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
          text: "Jadwal",
          disabled: false,
        },
      ],
      headers: [
        {
          text: "Senin",
          value: "nama_kelas",
        },
        {
          text: "Selasa",
          value: "nama_kelas",
        },
        {
          text: "Rabu",
          value: "nama_kelas",
        },
        {
          text: "Kamis",
          value: "nama_kelas",
        },
        {
          text: "Jumat",
          value: "nama_kelas",
        },
        {
          text: "Sabtu",
          value: "nama_kelas",
        },
        {
          text: "Minggu",
          value: "nama_kelas",
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
    this.getDataJadwalUmum();
  },
  methods: {
    setForm() {
      if (this.inputType !== "Tambah") {
        this.updateJadwalUmum();
      } else {
        this.submitJadwalUmum();
      }
    },
    getDataJadwalUmum() {
      this.load = true;
      var url = this.$api + "/jadwal";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.jadwal_umums = response.data.data;
          this.kelass = response.data.kelas;
          this.load = false;
        });
      this.load = true;
    },
    submitJadwalUmum() {
      this.jadwal_umum.append("id_kelas", this.form.id_kelas);
      this.jadwal_umum.append("tanggal", this.form.tanggal);
      this.jadwal_umum.append("hari", this.form.hari);
      this.jadwal_umum.append("sesi", this.form.sesi);

      var url = this.$api + "/jadwal";
      this.load = true;
      this.$http
        .post(url, this.jadwal_umum, {
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
          this.getDataJadwalUmum();
          this.resetForm();
        })
        .catch(() => {
          this.error_message = "Tambah Jadwal Umum gagal!";
          this.color = "red";
          this.dialogConfirmEdit = false;
          this.snackbar = true;
          this.load = false;
        });
    },
    updateJadwalUmum() {
      let newData = {
        id_kelas: this.form.id_kelas,
        tanggal: this.form.tanggal,
        hari: this.form.hari,
        sesi: this.form.sesi,
      };
      var url = this.$api + "/jadwal/" + this.editId;
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
          this.getDataJadwalUmum();
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch(() => {
          this.error_message = "Update Jadwal Umum gagal!" + this.editId;
          this.color = "red";
          this.dialogConfirmEdit = false;
          this.snackbar = true;
          this.load = false;
        });
    },
    deleteData() {
      var url = this.$api + "/jadwal/" + this.deleteId;
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
          this.getDataJadwalUmum(); //mengambil data
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
        id_kelas: false,
        tanggal: false,
        hari: false,
        sesi: false,
      }),
        this.resetForm();
      this.getDataJadwalUmum();
    },
    close() {
      this.dialog = false;
      this.inputType = "Tambah";
      this.dialogConfirm = false;
      this.dialogConfirmEdit = false;
      this.getDataJadwalUmum();
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.id_kelas = item.id_kelas;
      this.form.tanggal = item.tanggal;
      this.form.hari = item.hari;
      this.form.sesi = item.sesi;
      this.dialog = true;
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
