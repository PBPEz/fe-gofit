<template>
  <div class="dashboard">
    <div class="fullheigh pa-2">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      items: [
        {
          icon: "mdi-view-dashboard",
          title: "Dashboard",
          to: "/dashboard",
        },
        {
          icon: "mdi-account-multiple",
          title: "Jadwal",
          to: "/jadwal",
        },
        {
          icon: "mdi-account-multiple",
          title: "Instruktur",
          to: "/instruktur",
        },
        {
          icon: "mdi-account-multiple",
          title: "Promo",
          to: "/promo",
        },
        {
          icon: "mdi-account-multiple",
          title: "Member",
          to: "/member",
        },
        {
          icon: "mdi-account-multiple",
          title: "Pegawai",
          to: "/pegawai",
        },
      ],
      kasir: [
        {
          icon: "mdi-account-multiple",
          title: "Member",
          to: "/member",
        },
      ],
      admin: [
        {
          icon: "mdi-account-multiple",
          title: "Instruktur",
          to: "/instruktur",
        },
      ],
      manageroperasional: [
        {
          icon: "mdi-account-multiple",
          title: "Jadwal",
          to: "/jadwal",
        },
      ],
      mini: true,
    };
  },
  methods: {
    btnLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("id_pegawai");
      localStorage.removeItem("nama_pegawai");
      localStorage.removeItem("role");
      this.$router.push("/");
    },
    btnProfile() {
      this.$router.push("/profile");
    },
    getName() {
      if (localStorage.getItem("id_pegawai") != null) {
        return localStorage.getItem("nama_pegawai");
      } else {
        return localStorage.getItem("nama_member");
      }
    },
    getRole() {
      return localStorage.getItem("role");
    },
  },
  computed: {
    loggedIn() {
      return localStorage.getItem("token") != null;
    },
    loggedInAdmin() {
      return localStorage.getItem("role") == "admin";
    },
    loggedInMO() {
      return localStorage.getItem("role") == "manager operasional";
    },
    loggedInKasir() {
      return localStorage.getItem("role") == "kasir";
    },
  },
  mounted() {
    this.getName();
    this.getRole();
  },
};
</script>
<style scoped>
.fullheight {
  min-height: 100vh !important;
}

.router {
  text-decoration: none;
  color: black;
}

.dashboard {
  color: black;
  text-align: left;
}

.title {
  color: white;
  text-align: left;
}

.subtitle {
  color: white;
  text-align: left;
}
</style>
