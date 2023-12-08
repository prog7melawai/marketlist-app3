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

const routes = [
  {path: '/', name: 'home', component: HomeView},
  {path: '/import', name: 'import', component: ImportView},
  {path: '/login', name: 'login', component: LoginView},
  {path: '/transfer', name: 'transfer', component: TransferView},
  {path: '/food', name: 'food', component: MakananView},
  {path: '/marketlist', name: 'marketlist', component: MarketlistView},
  {path: '/stockfinance', name: 'stockfinance', component: StockFinanceView},
  {path: '/event', name: 'event', component: EventView},
  {path: '/event-detail/:id', name: 'event-detail', component: EventDetailView},
  {path: '/load', name: 'load', component: LoadView},
  {path: '/pr', name: 'pr', component: PRView},
  {path: '/pr-detail/:id', name: 'pr-detail', component: PRDetailView},
  {path: '/po', name: 'po', component: POView},
  {path: '/profile', name: 'profile', component: ProfileView},
  {path: '/satuan-jenis', name: 'satuan-jenis', component: SatuanJenisView},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
