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
            <v-tab href="/instruktur">Instruktur</v-tab>
            <v-tab href="/dashboard" disabled>Member</v-tab>
            <v-tab href="/jadwal" disabled>Jadwal</v-tab>
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
            <v-data-table :headers="headers" :items="instrukturs" :search="search" :loading="load"
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
                  <span class="headline">{{ formTitle }} Instruktur</span>
                </div>
              </v-card-title>
              <hr />
              <v-card-text>
                <v-container style="width: 1000px;">
                  <v-text-field v-model="form.nama_instruktur" label="Nama Instruktur" required outlined
                    :rules="error.nama_instruktur"></v-text-field>
                  <v-text-field v-model="form.tanggal_lahir" label="Tanggal Lahir" required type="date" outlined
                    :rules="error.tgl_lahir"></v-text-field>
                  <v-text-field v-model="form.nomor_telepon" label="Nomor Telepon" required outlined
                    :rules="error.nomor_telepon"></v-text-field>
                  <v-text-field v-model="form.email" label="Email" required outlined :rules="error.email"></v-text-field>
                  <v-text-field v-model="form.status" label="Status" required outlined
                    :rules="error.status"></v-text-field>
                  <v-text-field v-model="form.gender" label="Gender" required outlined
                    :rules="error.gender"></v-text-field>
                  <v-text-field v-model="form.password" label="Password" required outlined
                    :rules="error.password"></v-text-field>
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
      instrukturs: [],
      instruktur: new FormData(),
      error_message: "",
      dialog: false,
      color: "",
      dialogConfirm: false,
      dialogConfirmEdit: false,
      form: {
        nama_instruktur: "",
        tanggal_lahir: "",
        nomor_telepon: "",
        email: "",
        status: "",
        gender: "",
        password: "",
      },
      error: {
        nama_instruktur: [(v) => !!v || "Field required"],
        tanggal_lahir: [(v) => !!v || "Field required"],
        nomor_telepon: [(v) => !!v || "Field required"],
        email: [(v) => !!v || "Field required"],
        status: [(v) => !!v || "Field required"],
        gender: [(v) => !!v || "Field required"],
        password: [(v) => !!v || "Field required"],
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
          text: "Instruktur",
          disabled: false,
        },
      ],
      headers: [
        {
          text: "Nomor Instruktur",
          value: "id",
        },
        {
          text: "Nama Instruktur",
          value: "nama_instruktur",
        },
        {
          text: "Tanggal Lahir",
          value: "tanggal_lahir",
        },
        {
          text: "Nomor Telepon",
          value: "nomor_telepon",
        },
        {
          text: "Email",
          value: "email",
        },
        {
          text: "Status",
          value: "status",
        },
        {
          text: "Gender",
          value: "gender",
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
    this.getDataInstruktur();
  },
  methods: {
    setForm() {
      if (this.inputType != "Tambah") {
        this.updateInstruktur();
      } else {
        this.submitInstruktur();
      }
    },
    getDataInstruktur() {
      this.load = true;
      var url = this.$api + "/instruktur";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.instrukturs = response.data.data;
          this.load = false;
        });
      this.load = true;
    },
    submitInstruktur() {
      this.instruktur.append("nama_instruktur", this.form.nama_instruktur);
      this.instruktur.append("tanggal_lahir", this.form.tanggal_lahir);
      this.instruktur.append("nomor_telepon", this.form.nomor_telepon);
      this.instruktur.append("email", this.form.email);
      this.instruktur.append("status", this.form.status);
      this.instruktur.append("gender", this.form.gender);
      this.instruktur.append("password", this.form.password);

      var url = this.$api + "/instruktur";
      this.load = true;
      this.$http
        .post(url, this.instruktur, {
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
          this.getDataInstruktur();
          this.resetForm();
        })
        .catch(() => {
          this.error_message = "Tambah Instruktur gagal!";
          this.color = "red";
          this.dialogConfirmEdit = false;
          this.snackbar = true;
          this.load = false;
        });
    },
    updateInstruktur() {
      let newData = {
        nama_instruktur: this.form.nama_instruktur,
        tanggal_lahir: this.form.tanggal_lahir,
        nomor_telepon: this.form.nomor_telepon,
        email: this.form.email,
        status: this.form.status,
        gender: this.form.gender,
        password: this.form.password,
      };
      var url = this.$api + "/instruktur/" + this.editId;
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
          this.getDataMember();
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch(() => {
          this.error_message = "Update Instruktur gagal!";
          this.color = "error";
          this.dialogConfirmEdit = false;
          this.snackbar = true;
          this.load = false;
        });
    },
    deleteData() {
      var url = this.$api + "/instruktur/" + this.deleteId;
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
        nama_instruktur: false,
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
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.nama_instruktur = item.nama_instruktur;
      this.form.nomor_telepon = item.nomor_telepon;
      this.form.deposit_uang = item.deposit_uang;
      this.form.deposit_kelas = item.deposit_kelas;
      this.form.email = item.email;
      this.form.tanggal_lahir = item.tanggal_lahir;
      this.form.status = item.status;
      this.form.gender = item.gender;
      this.form.username = item.username;
      this.form.password = item.password;
      this.dialog = true;
    },
    resetPassword(item) {
      let newData = {
        nama_instruktur: item.nama_instruktur,
        tanggal_lahir: item.tanggal_lahir,
        nomor_telepon: item.nomor_telepon,
        email: item.email,
        status: item.status,
        gender: item.gender,
        password: item.password,
      };
      var url = this.$api + "/instruktur/" + item.id;
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
          this.getDataMember();
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
        nama_instruktur: "",
        tanggal_lahir: "",
        nomor_telepon: "",
        email: "",
        status: "",
        gender: "",
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
