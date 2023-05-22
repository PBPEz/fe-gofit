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
