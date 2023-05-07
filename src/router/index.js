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
            //Dashboard
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {title : 'dashboard'},
                component: importViewComponent('DashboardPegawaiPage'),
            },
            //jadwal
            {
              path: '/jadwal',
              name: 'jadwal',
              meta: {title : 'jadwal'},
              component: importViewComponent('JadwalInstrukturPage'),
            },
            //instruktur
            {
              path: '/instruktur',
              name: 'instruktur',
              meta: {title : 'instruktur'},
              component: importViewComponent('InstrukturPage'),
            },
            //pegawai
          ]
    },
    {
      path: '*',
      redirect: '/'
    },
  ]
})

export default router
