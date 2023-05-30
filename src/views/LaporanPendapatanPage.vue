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
                        <v-tab href="/laporanKelas">Laporan Kelas</v-tab>
                        <v-tab href="/dashboard">Member</v-tab>
                        <v-tab href="/jadwal">Jadwal</v-tab>
                        <v-tab href="/laporanInstruktur">Laporan Instruktur</v-tab>
                        <v-tab href="/instruktur" disabled>Instruktur</v-tab>
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
                                <v-btn color="success" dark @click="generatePDFChart">Generate Chart</v-btn>
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
                        <canvas id="chart"></canvas>
                    </v-card>
                </v-container>
            </v-sheet>
        </v-card>
    </v-main>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { Chart } from 'chart.js';
import { jsPDF } from 'jspdf';
import "blueimp-canvas-to-blob";

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
                    text: 'Bulan',
                    value: 'nama_bulan'
                },
                {
                    text: 'Aktivasi',
                    value: 'total_pendapatan_aktivasi'
                },
                {
                    text: 'Deposit',
                    value: 'total_pendapatan_deposit'
                },
                {
                    text: 'Total',
                    value: 'total_pendapatan'
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
        this.getDataJadwalPendapatanTahun();
    },
    methods: {
        printTable() {
            window.print();
        },
        async getImageData(img) {
            return new Promise((resolve) => {
                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob(function (blob) {
                        resolve(blob);
                    }, "image/png"); // Add the MIME type parameter

                    // Clean up
                    document.body.removeChild(canvas);
                };

                // Append the image to the document body
                document.body.appendChild(img);
            });
        },
        async generatePDFChart() {
            const canvas = document.getElementById("chart");
            const dataURL = canvas.toDataURL("image/png");

            const img = new Image();
            img.src = dataURL;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    const imgData = URL.createObjectURL(blob);
                    const pdf = new jsPDF("l", "pt", [canvas.width, canvas.height]);
                    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
                    pdf.save("chart.pdf");
                }, "image/png");

                // Clean up
                URL.revokeObjectURL(img.src);
            };
        },


        async printData() {
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
              <h1>Laporan Tahunan</h1>
              <h3>Tanggal Cetak: ${currentDate}</h3>
              <table>
                  <thead>
                      <tr>
                          <th>Bulan</th>
                          <th>Aktivasi</th>
                          <th>Deposit</th>
                          <th>Total</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${this.dataJadwal
                    .map(
                        row => `
                          <tr>
                              <td>${row.nama_bulan}</td>
                              <td>${row.total_pendapatan_aktivasi}</td>
                              <td>${row.total_pendapatan_deposit}</td>
                              <td>${row.total_pendapatan}</td>
                          </tr>
                      `
                    )
                    .join('')}
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
        async getDataJadwalPendapatanTahun() {
            const url = 'http://127.0.0.1:8000/api/laporanPendapatan';
            const request = await axios.get(url);
            console.log(request.data.data);
            this.dataJadwal = request.data.data;
            // this.calculateTotalM ember();
            this.renderChart();
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

        renderChart() {
            const ctx = document.getElementById('chart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: this.dataJadwal.map(row => row.nama_bulan),
                    datasets: [
                        {
                            label: 'Aktivasi',
                            data: this.dataJadwal.map(row => row.total_pendapatan_aktivasi),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Deposit',
                            data: this.dataJadwal.map(row => row.total_pendapatan_deposit),
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Total',
                            data: this.dataJadwal.map(row => row.total_pendapatan),
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            display: true,
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            display: true,
                            beginAtZero: true
                        }
                    }
                }
            });
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
