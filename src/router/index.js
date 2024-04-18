import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ImportView from '../views/ImportView.vue'
import LoginView from '../views/LoginView.vue'
import TransferView from '../views/TransferGudangView.vue'
import MakananView from '../views/MakananView.vue'
import MarketlistView from '../views/MarketlistView.vue'
import StockFinanceView from '../views/StockFinanceView.vue'
import EventView from '../views/EventView.vue'
import EventDetailView from '../views/EventDetailView.vue'
import LoadView from '../views/LoadView.vue'
import PRView from '../views/PRView.vue'
import PRDetailView from '../views/PRDetailView.vue'
import POView from '../views/POView.vue'
import ProfileView from '../views/ProfileView.vue'
import SatuanJenisView from '../views/SatuanJenisView.vue'
import ManageGudangView from '../views/ManageGudangView.vue'
import store from '../store'

const routes = [
  {path: '/', name: 'home', component: HomeView, meta: {login: true}},
  {path: '/import', name: 'import', component: ImportView, meta: {login: true}},
  {path: '/login', name: 'login', component: LoginView, meta: {guest: true}},
  {path: '/transfer', name: 'transfer', component: TransferView, meta: {login: true}},
  {path: '/food', name: 'food', component: MakananView, meta: {login: true}},
  {path: '/marketlist', name: 'marketlist', component: MarketlistView, meta: {login: true}},
  {path: '/stockfinance', name: 'stockfinance', component: StockFinanceView, meta: {login: true}},
  {path: '/event', name: 'event', component: EventView, meta: {login: true}},
  {path: '/event-detail/:id', name: 'event-detail', component: EventDetailView, meta: {login: true}},
  {path: '/load', name: 'load', component: LoadView, meta: {login: true}},
  {path: '/pr', name: 'pr', component: PRView, meta: {login: true}},
  {path: '/pr-detail/:id', name: 'pr-detail', component: PRDetailView, meta: {login: true}},
  {path: '/po', name: 'po', component: POView, meta: {login: true}},
  {path: '/profile', name: 'profile', component: ProfileView, meta: {login: true}},
  {path: '/satuan-jenis', name: 'satuan-jenis', component: SatuanJenisView, meta: {login: true}},
  {path: '/manage-warehouse', name: 'manage-warehouse', component: ManageGudangView, meta: {login: true}},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  if(to.matched.some(record => record.meta.login)){
    if (!store.getters.GET_AUTH_TOKEN){
      next({
        name: 'login'
      })
    } else {
      next()
    }
  } else if(to.matched.some(record => record.meta.guest)){
    if (store.getters.GET_AUTH_TOKEN) {
      next({
        name: 'import'
      })
    } else {
      next()
    }
  } else {
    next()
  }
});

export default router
