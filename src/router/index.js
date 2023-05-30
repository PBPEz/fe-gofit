import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)
Vue.use(VueRouter)
function importViewComponent(path) {
  return () => import(`../views/${path}.vue`)
}
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: importViewComponent('LoginPage'),
    },
    {
      path: '/',
        component: importViewComponent('DashboardLayout'),
        children: [
            //Kasir
            {
                path: '/kasir',
                name: 'kasir',
                meta: {title : 'kasir'},
                component: importViewComponent('KasirPage'),
            },
            //MO
            {
              path: '/mo',
              name: 'mo',
              meta: {title : 'mo'},
              component: importViewComponent('MOPage'),
            },
            //Admin
            {
              path: '/admin',
              name: 'admin',
              meta: {title : 'admin'},
              component: importViewComponent('AdminPage'),
            },
            //Aktivasi
            {
              path: '/aktivasiMember',
              name: 'aktivasi member',
              meta: {title: 'aktivasi member'},
              component: importViewComponent('AktivasiMemberPage')
            },
            {
              path: '/presensiGym',
              name: 'presensi gym',
              meta: {title: 'presensi gym'},
              component: importViewComponent('PresensiGymPage')
            },
            {
              path: '/presensiKelas',
              name: 'presensi kelas',
              meta: {title: 'presensi kelas'},
              component: importViewComponent('PresensiKelasPage')
            },
            {
              path: '/laporanGym',
              name: 'laporan gym page',
              meta: {title: 'laporan gym page'},
              component: importViewComponent('LaporanGymPage')
            },
            {
              path: '/laporanKelas',
              name: 'laporan kelas page',
              meta: {title: 'laporan kelas page'},
              component: importViewComponent('LaporanKelasPage')
            },
            {
              path: '/laporanInstruktur',
              name: 'laporan instruktur page',
              meta: {title: 'laporan instruktur page'},
              component: importViewComponent('LaporanInstrukturPage')
            },
            {
              path: '/laporanPendapatan',
              name: 'laporan pendapatan page',
              meta: {title: 'laporan pendapatan page'},
              component: importViewComponent('LaporanPendapatanPage')
            }             
          ]
    },
    {
      path: '*',
      redirect: '/'
    },
  ]
})

export default router
