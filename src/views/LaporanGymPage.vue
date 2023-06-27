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
                        <v-tab href="/laporanGym">Laporan Gym</v-tab>
                        <v-tab href="/laporanInstruktur">Laporan Instruktur</v-tab>
                        <v-tab href="/laporanPendapatan">Laporan Pendapatan</v-tab>
                        <v-tab href="/laporanKelas">Laporan Kelas</v-tab>
                        <v-tab href="/dashboard">Member</v-tab>
                        <v-tab href="/instruktur" disabled>Instruktur</v-tab>
                        <v-tab href="/jadwal" disabled>Jadwal</v-tab>
                        <v-tab href="/presensiGym">Presensi Gym</v-tab>
                        <v-tab href="/presensiKelas">Presensi Kelas</v-tab>
                        <v-tab href="/">Logout</v-tab>
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
                                <v-btn color="#00695C" dark @click="printData">Print</v-btn>
                            </div>
                        </div>
                    </v-card>
                    <v-card v-else>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Cari Data" single-line hide-details
                            outlined style="margin-left: 15px; margin-right: 15px"></v-text-field>
                    </v-card>
                    <v-card style="margin-top: 20px">
                        <v-data-table :headers="headers" :items="dataJadwal" :search="search" :loading="load"
                            loading-text="Sedang mengambil data" no-data-text="Tidak ada Data">
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-btn v-if="cekTanggal(item) == 1" color="error" class="mr-2" @click="printStruk(item)">
                                    <v-icon>
                                        mdi-printer-pos-check
                                    </v-icon>
                                </v-btn>
                                <v-btn v-if="cekTanggal(item) == 0" color="error" class="mr-2" @click="printStruk(item)"
                                    disabled>
                                    <v-icon>
                                        mdi-printer-pos-check
                                    </v-icon>
                                </v-btn>
                                <v-btn v-if="cekTanggal(item) == 1" color="primary" class="mr-2"
                                    @click="presensiGym(item.id)">
                                    <v-icon>
                                        mdi-calendar-check
                                    </v-icon>
                                </v-btn>
                                <v-btn v-if="cekTanggal(item) == 0" color="primary" class="mr-2"
                                    @click="presensiGym(item.id)" disabled>
                                    <v-icon>
                                        mdi-calendar-check
                                    </v-icon>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-container>
            </v-sheet>
        </v-card>
    </v-main>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
export default {
    data() {
        return {
            editId: "",
            selectedDate: new Date().toISOString().substr(0, 10),
            search: null,
            load: false,
            snackbar: false,
            totalMember: 0,
            deleteId: '',
            dataJadwal: ref([]),
            headers: [
                {
                    text: 'Tanggal',
                    value: 'tanggal'
                },
                {
                    text: 'Jumlah Member',
                    value: 'count'
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
        this.getDataJadwalGymBulanan();
    },
    methods: {
        printTable() {
            window.print();
        },

        printData() {
            // Membuka jendela baru untuk mencetak konten
            const printWindow = window.open('', '', 'width=800,height=600');
            const currentDate = new Date().toISOString().substr(0, 10);
            printWindow.document.open();
            printWindow.document.write(`
      <html>
      <head>
          <style>
          @media print {
              /* Gaya untuk menyembunyikan elemen yang tidak perlu dicetak */
              #printable {
                  visibility: visible;
              }
              /* Gaya khusus lainnya sesuai kebutuhan Anda */
          }
      table {
          border-collapse: collapse;
          width: 100%;
      }
      
      th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
      }
      
      th {
          background-color: #f2f2f2;
      }
      </style>
      </head>
      <body>
          <h1>Laporan Gym Bulanan</h1>
          <h3>Tanggal Cetak: ${currentDate}</h3>
          <table>
              <thead>
                  <tr>
                      <th>Tanggal</th>
                      <th>Jumlah Member</th>
                  </tr>
              </thead>
              <tbody>
                  ${this.dataJadwal.map(row => `
                      <tr>
                          <td>${row.tanggal}</td>
                          <td>${row.count}</td>
                      </tr>
                  `).join('')}
                    <tr>
                      <td>Total</td>  
                      <td>${this.totalMember}</td>  
                    </tr>
              </tbody>
          </table>
      </body>
      </html>
  `);
            printWindow.document.close();

            // console.log(printWindow);
            // Tunggu beberapa saat sebelum mencetak untuk memastikan konten dimuat
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        },
        calculateTotalMember() {
            this.totalMember = this.dataJadwal.reduce((total, row) => total + row.count, 0);
        },
        async getDataJadwalGymBulanan() {
            const url = "http://127.0.0.1:8000/api/laporanGym";
            const request = await axios.get(url)
            console.log(request.data.data)
            this.dataJadwal = request.data.data
            this.calculateTotalMember();
        },

        editHandler(item) {
            // this.dialogConfirm = true;
            console.log('Gagal')
            console.log(item)
            this.$router.push({ name: 'Mo-Jadwal-UmumViewEdit', query: item })
        },

        deleteHandler(id) {
            this.deleteId = id;
            this.dialogConfirm = true;
        },
    },
};
</script>

<style>
@media print {

    /* Hide unnecessary elements when printing */
    /* * v-data-table {
  visibility: visible !important;
}
body * {
  visibility: hidden; */
    body>*:not(#printable) {
        display: none
    }
}

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
