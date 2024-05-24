import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import LoginView from '../views/LoginView.vue'
import LoadView from '../views/LoadView.vue'
import PRView from '../views/PRView.vue'
import PRDetailView from '../views/PRDetailView.vue'
import POView from '../views/POView.vue'
import ProfileView from '../views/ProfileView.vue'
import MasterJenisView from '../views/MasterJenisView.vue'
import ContractView from '../views/ContractView.vue'
import CreateContractView from '../views/CreateContractView.vue'
import ContractDetailView from '../views/ContractDetailView.vue'
import CreatePOView from '@/views/CreatePOView.vue'
import POPRView from '@/views/POPRView.vue'
import MasterBarangView from '@/views/MasterBarangView.vue'
import PODetailView from '@/views/PODetailView'
import CreatePOManualView from '@/views/CreatePOManualView'
import PageNotFound from '@/views/PageNotFoundView'
import SignInView from '@/views/SignInView.vue'
import store from '../store'

const routes = [
  {path: '/home', name: 'home', component: HomeView, meta: {login: true}},
  {path: '/', name: 'login', component: SignInView, meta: {guest: true}},
//   {path: '/login', name: 'signin', component: SignInView, meta: {guest: true}},
  {path: '/pr', name: 'pr', component: PRView, meta: {login: true}},
  {path: '/pr-detail/:id', name: 'pr-detail', component: PRDetailView, meta: {login: true}},
  {path: '/contract', name: 'contract', component: ContractView, meta: {login: true}},
  {path: '/create-contract', name: 'create-contract', component: CreateContractView, meta: {login: true}},
  {path: '/contract-detail/:id', name: 'contract-detail', component: ContractDetailView, meta: {login: true}},
  {path: '/masterbarang', name: 'masterbarang', component: MasterBarangView, meta: {login: true}},
  {path: '/load', name: 'load', component: LoadView, meta: {login: true}},
  {path: '/jenis', name: 'jenis', component: MasterJenisView, meta: {login: true}},
  {path: '/approved-pr', name: 'approved-pr', component: POView, meta: {login: true}},
  {path: '/profile', name: 'profile', component: ProfileView, meta: {login: true}},
  {path: '/create-po/:id', name: 'create-po', component: CreatePOView, meta: {login: true}},
  {path: '/create-po-manual/:id', name: 'create-po-manual', component: CreatePOManualView, meta: {login: true}},
  {path: '/po/:id', name: 'po', component: POPRView, meta: {login: true}},
  {path: '/po-detail/:id', name: 'po-detail', component: PODetailView, meta: {login: true}},
  {path: '/:pathMatch(.*)*', name: 'error', component: PageNotFound },
  {path: '/error/page-not-found', name: 'not-found', component: PageNotFound },
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
        name: 'not-found'
      })
    } else {
      next()
    }
  } else if(to.matched.some(record => record.meta.guest)){
    if (store.getters.GET_AUTH_TOKEN) {
      next({
        name: 'home'
      })
    } else {
      next()
    }
  } else {
    next()
  }
});

export default router
