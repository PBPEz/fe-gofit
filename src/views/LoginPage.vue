<template>
  <main>
    <v-card class="mx-auto my-12" max-width="374" elevation="8">
      <v-img height="250"
        src="https://img.freepik.com/free-vector/tablet-login-concept-illustration_114360-7883.jpg"></v-img>
      <v-form v-model="valid" ref="form">
        <v-text-field label="Username" v-model="nama_pegawai" :rules="usernameRules" required outlined style="margin-top: 20px;
        margin-inline: 20px;"></v-text-field>
        <v-text-field label="Password" v-model="password" type="password" :rules="passwordRules" required outlined
          style="margin-inline: 20px;">
        </v-text-field>
        <v-layout justify-center>
          <!-- <router-link to="/dashboard">
            <v-btn class="mr-2" style="margin-bottom: 20px;" @click="submit">Login
            </v-btn>
          </router-link> -->
          <v-btn class="mr-2" style="margin-bottom: 20px" @click="submit()">Login</v-btn>
          <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{ error_message }}
          </v-snackbar>
        </v-layout>
      </v-form>
    </v-card>
  </main>
</template>

<script>
export default {
  data() {
    return {
      load: false,
      snackbar: false,
      error_message: "",
      color: '',
      valid: false,
      password: "",
      posisi: "",
      passwordRules: [(v) => !!v || "Password tidak boleh kosong"],
      nama_pegawai: "",
      usernameRules: [(v) => !!v || "Username tidak boleh kosong"],
    };
  },
  methods: {
    submit() {
      let url = this.$api + "/pegawai/login";
      this.$http
        .post(url, {
          nama_pegawai: this.nama_pegawai,
          password: this.password,
        })
        .then((response) => {
          if (response.data.data.id != null) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("id", response.data.data.id);
            localStorage.setItem(
              "nama_pegawai",
              response.data.data.nama_pegawai
            );
            localStorage.setItem("role", response.data.data.role);

            if(response.data.data.role == "MO"){
              this.$router.push("/mo");
            }
            else if(response.data.data.role == "Kasir"){
              this.$router.push("/kasir")
            }
            else if(response.data.data.role == "Admin"){
              this.$router.push("/admin")
            }

            this.error_message = response.data.message;
            this.color = "blue";
            this.snackbar = true;
            this.clear();
            this.load = false;
          } else {
            this.$router.push("/login");
          }
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          localStorage.removeItem("token");
          this.load = false;
        });
    },
  },
};
</script>