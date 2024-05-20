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
import MasterJenisView from '../views/MasterJenisView.vue'
import ManageGudangView from '../views/ManageGudangView.vue'
import ContractView from '../views/ContractView.vue'
import CreateContractView from '../views/CreateContractView.vue'
import ContractDetailView from '../views/ContractDetailView.vue'
import CreatePOView from '@/views/CreatePOView.vue'
import POPRView from '@/views/POPRView.vue'
import MasterBarangView from '@/views/MasterBarangView.vue'
import ReceivingView from '@/views/ReceivingView.vue'
import PODetailView from '@/views/PODetailView'
import CreatePOManualView from '@/views/CreatePOManualView'
import store from '../store'

const routes = [
  {path: '/', name: 'home', component: HomeView, meta: {login: true}},
  {path: '/login', name: 'login', component: LoginView, meta: {guest: true}},
  {path: '/pr', name: 'pr', component: PRView, meta: {login: true}},
  {path: '/pr-detail/:id', name: 'pr-detail', component: PRDetailView, meta: {login: true}},
  {path: '/contract', name: 'contract', component: ContractView, meta: {login: true}},
  {path: '/create-contract', name: 'create-contract', component: CreateContractView, meta: {login: true}},
  {path: '/contract-detail/:id', name: 'contract-detail', component: ContractDetailView, meta: {login: true}},
  {path: '/masterbarang', name: 'masterbarang', component: MasterBarangView, meta: {login: true}},
  {path: '/load', name: 'load', component: LoadView, meta: {login: true}},
  {path: '/jenis', name: 'jenis', component: MasterJenisView, meta: {login: true}},
  {path: '/import', name: 'import', component: ImportView, meta: {login: true}},
  {path: '/transfer', name: 'transfer', component: TransferView, meta: {login: true}},
  {path: '/food', name: 'food', component: MakananView, meta: {login: true}},
  {path: '/marketlist', name: 'marketlist', component: MarketlistView, meta: {login: true}},
  {path: '/stockfinance', name: 'stockfinance', component: StockFinanceView, meta: {login: true}},
  {path: '/event', name: 'event', component: EventView, meta: {login: true}},
  {path: '/event-detail/:id', name: 'event-detail', component: EventDetailView, meta: {login: true}},
  {path: '/approved-pr', name: 'approved-pr', component: POView, meta: {login: true}},
  {path: '/profile', name: 'profile', component: ProfileView, meta: {login: true}},
  {path: '/manage-warehouse', name: 'manage-warehouse', component: ManageGudangView, meta: {login: true}},
  {path: '/create-po/:id', name: 'create-po', component: CreatePOView, meta: {login: true}},
  {path: '/create-po-manual/:id', name: 'create-po-manual', component: CreatePOManualView, meta: {login: true}},
  {path: '/po/:id', name: 'po', component: POPRView, meta: {login: true}},
  {path: '/po-detail/:id', name: 'po-detail', component: PODetailView, meta: {login: true}},
  {path: '/receiving', name: 'receiving', component: ReceivingView, meta: {login: true}},
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
