import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { auth } from './auth'

export default createStore({
  state: {
    menu: [
        { path: '/', name: 'Home' },
        { path: '/import', name: 'Load Master' },
        { path: '/marketlist', name: 'Marketlist' },
        { path: '/stockfinance', name: 'Stockfinance' },
        { path: '/load', name: 'Load PR' },
        { path: '/pr', name: 'Purchase Requisition' },
        { path: '/pr-detail/:id', name: 'PR Detail' },
        { path: '/po', name: 'Purchase Order' },
        { path: '/po-detail/:id', name: 'PO Detail' },
        { path: '/profile', name: 'Profile' },
        { path: '/pr', name: 'Manage User' },
        { path: '/pr', name: 'Approve PR' },
        { path: '/pr', name: 'Reject PR' },
        { path: '/pr', name: 'Revision PR' },
    ],
    food: [
        {no: 0, id: 'FG0001', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0002', name: 'Australian Tender Minutes Steak', category: 'Western', price: 248000, stock: 8, active: true, image: 'aust-tender.png'},
        {no: 0, id: 'FG0003', name: 'Caesar Salad', category: 'Soup & Salad', price: 45000, stock: 16, active: true, image: 'caesar.png'},
        {no: 0, id: 'FG0004', name: 'Creamy Mushroom Soup', category: 'Soup & Salad', price: 55000, stock: 11, active: true, image: 'creamy-mushroom.png'},
        {no: 0, id: 'FG0005', name: 'Chicken Steak', category: 'Western', price: 108000, stock: 17, active: true, image: 'chicken-steak.png'},
        {no: 0, id: 'FG0006', name: 'Tom Yum', category: 'Asia', price: 70000, stock: 18, active: true, image: 'tomyum.png'},
        {no: 0, id: 'FG0007', name: 'Jajangmyeon', category: 'Asia', price: 80000, stock: 14, active: true, image: 'jajangmyeon.png'},
        {no: 0, id: 'FG0008', name: 'Bulgogi', category: 'Asia', price: 88000, stock: 19, active: true, image: 'bulgogi.png'},
        {no: 0, id: 'FG0009', name: 'Kimchi', category: 'Asia', price: 50000, stock: 8, active: false, image: 'kimchi.png'},
        {no: 0, id: 'FG0010', name: 'Fish and Chips', category: 'Western', price: 90000, stock: 24, active: true, image: 'fish-chips.png'},
        {no: 0, id: 'FG0011', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0012', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0013', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0014', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0015', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0016', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0017', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0018', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0019', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0020', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0021', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0022', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0023', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0024', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0025', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0026', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0027', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0001', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0002', name: 'Australian Tender Minutes Steak', category: 'Western', price: 248000, stock: 8, active: true, image: 'aust-tender.png'},
        {no: 0, id: 'FG0003', name: 'Caesar Salad', category: 'Soup & Salad', price: 45000, stock: 16, active: true, image: 'caesar.png'},
        {no: 0, id: 'FG0004', name: 'Creamy Mushroom Soup', category: 'Soup & Salad', price: 55000, stock: 11, active: true, image: 'creamy-mushroom.png'},
        {no: 0, id: 'FG0005', name: 'Chicken Steak', category: 'Western', price: 108000, stock: 17, active: true, image: 'chicken-steak.png'},
        {no: 0, id: 'FG0006', name: 'Tom Yum', category: 'Asia', price: 70000, stock: 18, active: true, image: 'tomyum.png'},
        {no: 0, id: 'FG0007', name: 'Jajangmyeon', category: 'Asia', price: 80000, stock: 14, active: true, image: 'jajangmyeon.png'},
        {no: 0, id: 'FG0008', name: 'Bulgogi', category: 'Asia', price: 88000, stock: 19, active: true, image: 'bulgogi.png'},
        {no: 0, id: 'FG0009', name: 'Kimchi', category: 'Asia', price: 50000, stock: 8, active: false, image: 'kimchi.png'},
        {no: 0, id: 'FG0010', name: 'Fish and Chips', category: 'Western', price: 90000, stock: 24, active: true, image: 'fish-chips.png'},
        {no: 0, id: 'FG0011', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0012', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0013', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0014', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0015', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0016', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0017', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0018', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0019', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0020', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0021', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0022', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0023', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0024', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0025', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0026', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0027', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0001', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0002', name: 'Australian Tender Minutes Steak', category: 'Western', price: 248000, stock: 8, active: true, image: 'aust-tender.png'},
        {no: 0, id: 'FG0003', name: 'Caesar Salad', category: 'Soup & Salad', price: 45000, stock: 16, active: true, image: 'caesar.png'},
        {no: 0, id: 'FG0004', name: 'Creamy Mushroom Soup', category: 'Soup & Salad', price: 55000, stock: 11, active: true, image: 'creamy-mushroom.png'},
        {no: 0, id: 'FG0005', name: 'Chicken Steak', category: 'Western', price: 108000, stock: 17, active: true, image: 'chicken-steak.png'},
        {no: 0, id: 'FG0006', name: 'Tom Yum', category: 'Asia', price: 70000, stock: 18, active: true, image: 'tomyum.png'},
        {no: 0, id: 'FG0007', name: 'Jajangmyeon', category: 'Asia', price: 80000, stock: 14, active: true, image: 'jajangmyeon.png'},
        {no: 0, id: 'FG0008', name: 'Bulgogi', category: 'Asia', price: 88000, stock: 19, active: true, image: 'bulgogi.png'},
        {no: 0, id: 'FG0009', name: 'Kimchi', category: 'Asia', price: 50000, stock: 8, active: false, image: 'kimchi.png'},
        {no: 0, id: 'FG0010', name: 'Fish and Chips', category: 'Western', price: 90000, stock: 24, active: true, image: 'fish-chips.png'},
        {no: 0, id: 'FG0011', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0012', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0013', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0014', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0015', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0016', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0017', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0018', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0019', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0020', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0021', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0022', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0023', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0024', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0025', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0026', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0027', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0001', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0002', name: 'Australian Tender Minutes Steak', category: 'Western', price: 248000, stock: 8, active: true, image: 'aust-tender.png'},
        {no: 0, id: 'FG0003', name: 'Caesar Salad', category: 'Soup & Salad', price: 45000, stock: 16, active: true, image: 'caesar.png'},
        {no: 0, id: 'FG0004', name: 'Creamy Mushroom Soup', category: 'Soup & Salad', price: 55000, stock: 11, active: true, image: 'creamy-mushroom.png'},
        {no: 0, id: 'FG0005', name: 'Chicken Steak', category: 'Western', price: 108000, stock: 17, active: true, image: 'chicken-steak.png'},
        {no: 0, id: 'FG0006', name: 'Tom Yum', category: 'Asia', price: 70000, stock: 18, active: true, image: 'tomyum.png'},
        {no: 0, id: 'FG0007', name: 'Jajangmyeon', category: 'Asia', price: 80000, stock: 14, active: true, image: 'jajangmyeon.png'},
        {no: 0, id: 'FG0008', name: 'Bulgogi', category: 'Asia', price: 88000, stock: 19, active: true, image: 'bulgogi.png'},
        {no: 0, id: 'FG0009', name: 'Kimchi', category: 'Asia', price: 50000, stock: 8, active: false, image: 'kimchi.png'},
        {no: 0, id: 'FG0010', name: 'Fish and Chips', category: 'Western', price: 90000, stock: 24, active: true, image: 'fish-chips.png'},
        {no: 0, id: 'FG0011', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0012', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0013', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0014', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0015', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0016', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0017', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0018', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0019', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0020', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0021', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0022', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0023', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0024', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0025', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0026', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0027', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0001', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0002', name: 'Australian Tender Minutes Steak', category: 'Western', price: 248000, stock: 8, active: true, image: 'aust-tender.png'},
        {no: 0, id: 'FG0003', name: 'Caesar Salad', category: 'Soup & Salad', price: 45000, stock: 16, active: true, image: 'caesar.png'},
        {no: 0, id: 'FG0004', name: 'Creamy Mushroom Soup', category: 'Soup & Salad', price: 55000, stock: 11, active: true, image: 'creamy-mushroom.png'},
        {no: 0, id: 'FG0005', name: 'Chicken Steak', category: 'Western', price: 108000, stock: 17, active: true, image: 'chicken-steak.png'},
        {no: 0, id: 'FG0006', name: 'Tom Yum', category: 'Asia', price: 70000, stock: 18, active: true, image: 'tomyum.png'},
        {no: 0, id: 'FG0007', name: 'Jajangmyeon', category: 'Asia', price: 80000, stock: 14, active: true, image: 'jajangmyeon.png'},
        {no: 0, id: 'FG0008', name: 'Bulgogi', category: 'Asia', price: 88000, stock: 19, active: true, image: 'bulgogi.png'},
        {no: 0, id: 'FG0009', name: 'Kimchi', category: 'Asia', price: 50000, stock: 8, active: false, image: 'kimchi.png'},
        {no: 0, id: 'FG0010', name: 'Fish and Chips', category: 'Western', price: 90000, stock: 24, active: true, image: 'fish-chips.png'},
        {no: 0, id: 'FG0011', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0012', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0013', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0014', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0015', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0016', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0017', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0018', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0019', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0020', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0021', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0022', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0023', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0024', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0025', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0026', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0027', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0001', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0002', name: 'Australian Tender Minutes Steak', category: 'Western', price: 248000, stock: 8, active: true, image: 'aust-tender.png'},
        {no: 0, id: 'FG0003', name: 'Caesar Salad', category: 'Soup & Salad', price: 45000, stock: 16, active: true, image: 'caesar.png'},
        {no: 0, id: 'FG0004', name: 'Creamy Mushroom Soup', category: 'Soup & Salad', price: 55000, stock: 11, active: true, image: 'creamy-mushroom.png'},
        {no: 0, id: 'FG0005', name: 'Chicken Steak', category: 'Western', price: 108000, stock: 17, active: true, image: 'chicken-steak.png'},
        {no: 0, id: 'FG0006', name: 'Tom Yum', category: 'Asia', price: 70000, stock: 18, active: true, image: 'tomyum.png'},
        {no: 0, id: 'FG0007', name: 'Jajangmyeon', category: 'Asia', price: 80000, stock: 14, active: true, image: 'jajangmyeon.png'},
        {no: 0, id: 'FG0008', name: 'Bulgogi', category: 'Asia', price: 88000, stock: 19, active: true, image: 'bulgogi.png'},
        {no: 0, id: 'FG0009', name: 'Kimchi', category: 'Asia', price: 50000, stock: 8, active: false, image: 'kimchi.png'},
        {no: 0, id: 'FG0010', name: 'Fish and Chips', category: 'Western', price: 90000, stock: 24, active: true, image: 'fish-chips.png'},
        {no: 0, id: 'FG0011', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0012', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0013', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0014', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0015', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0016', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0017', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0018', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0019', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0020', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0021', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0022', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0023', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0024', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0025', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0026', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
        {no: 0, id: 'FG0027', name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, stock: 22, active: true, image: 'wagyu-hm.png'},
    ],
    event: [
        {
          no: 1,
          id: 'EV0001', 
          name: 'Family Gathering', 
          date: '2023-12-03', 
          customer: 'PT. Indonesia Raya',
          person: 120,
          status: 'Upcoming',
          phone: '089611113456',
          address: "Jl. KS Tubun 31, Petamburan, Jakarta Pusat",
          food: [
              {id: "FG0001", name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, qty: 120, image: 'wagyu-hm.png'},
              {id: 'FG0003', name: 'Caesar Salad', category: 'Western', price: 45000, qty: 60, image: 'caesar.png'},
              {id: 'FG0004', name: 'Creamy Mushroom Soup', category: 'Soup & Salad', price: 55000, qty: 60, image: 'creamy-mushroom.png'},
          ]
        },
        {
          no: 2,
          id: 'EV0002', 
          name: 'Birthday', 
          date: '2023-12-05', 
          customer: 'John Doe',
          person: 50,
          status: 'Upcoming',
          phone: '089623237890',
          address: "Jl. KS Tubun 72, Petamburan, Jakarta Pusat",
          food: [
            {id: "FG0001", name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, qty: 120, image: 'wagyu-hm.png'},
            {id: 'FG0003', name: 'Caesar Salad', category: 'Western', price: 45000, qty: 60, image: 'caesar.png'},
            {id: 'FG0004', name: 'Creamy Mushroom Soup', category: 'Soup & Salad', price: 55000, qty: 60, image: 'creamy-mushroom.png'}
          ]
        },
        {
          no: 3,
          id: 'EV0003', 
          name: 'Workshop', 
          date: '2023-12-11', 
          customer: 'PT. Indonesia OK',
          person: 80,
          status: 'Upcoming',
          phone: '089622334455',
          address: "Jl. KS Tubun 64, Petamburan, Jakarta Pusat",
          food: [
            {id: "FG0001", name: 'Wagyu Sirloin Steak HM', category: 'Western', price: 350000, qty: 120, image: 'wagyu-hm.png'},
            {id: 'FG0003', name: 'Caesar Salad', category: 'Western', price: 45000, qty: 60, image: 'caesar.png'},
            {id: 'FG0004', name: 'Creamy Mushroom Soup', category: 'Soup & Salad', price: 55000, qty: 60, image: 'creamy-mushroom.png'}
          ]
        },
    ],
    pr: [
       {
          id: 'PR00001', 
          date: '2023-11-24', 
          supplier: 'PT. Sayur Segar', 
          address: 'Jl. Ks Tubun 31, Petamburan, Jakarta Pusat',
          contact: '021 12312 1212',
          company: 'Movenpick',
          department: 'Food & Beverage',
          status: 'Pending',
          step: 1,
          total_items: 10,
          logo: 'company-1.jpg',
          items: [
              {id: 1, kdbrg: 'AX00001', name: 'Fesh Salmon', tipe: 'RM', sbeli: "Kg", qtybeli: 20, kdjenis: 1, no: 1, image: 'fresh-salmon.png'},
              {id: 2, kdbrg: 'AX00002', name: 'Telur Ayam', tipe: 'RM', sbeli: "Peti", qtybeli: 10, kdjenis: 1, no: 2, image: 'telur-ayam.png'},
              {id: 3, kdbrg: 'AX00003', name: 'Bawang Merah', tipe: 'RM', sbeli: "Karung", qtybeli: 5, kdjenis: 1, no: 3, image: 'bawang-merah.png'},
              {id: 4, kdbrg: 'AX00004', name: 'Bawang Putih', tipe: 'RM', sbeli: "Karung", qtybeli: 5, kdjenis: 1, no: 4, image: 'bawang-putih.png'},
              {id: 5, kdbrg: 'AX00005', name: 'Garam', tipe: 'RM', sbeli: "Kg", kdjenis: 2, qtybeli: 20, no: 5, image: 'garam.png'},
              {id: 6, kdbrg: 'AX00006', name: 'Gula', tipe: 'RM', sbeli: "Kg", kdjenis: 2, qtybeli: 20, no: 6, image: 'gula.png'},
              {id: 7, kdbrg: 'AX00007', name: 'Beras Raja', tipe: 'RM', sbeli: "Karung", qtybeli: 6, kdjenis: 2, no: 7, image: 'beras-raja.png'},
              {id: 8, kdbrg: 'AX00008', name: 'Cabe Rawit', tipe: 'RM', sbeli: "Kg", qtybeli: 20, kdjenis: 1, no: 8, image: 'cabe-rawit.png'},
              {id: 9, kdbrg: 'AX00009', name: 'Merica Putih', tipe: 'RM', sbeli: "Kg", qtybeli: 20, kdjenis: 1, no: 9, image: 'merica-putih.png'},
              {id: 10, kdbrg: 'AX00010', name: 'Gula Aren', tipe: 'RM', sbeli: "Kg", qtybeli: 20, kdjenis: 1, no: 10, image: 'gula-aren.png'},
            ] 
        },
        {
          id: 'PR00002', 
          date: '2023-11-23', 
          supplier: 'PT. Fresh Market', 
          address: 'Jl. Ks Tubun 72, Petamburan, Jakarta Pusat',
          contact: '021 12312 1212',
          company: 'Movenpick',
          department: 'Food & Beverage',
          status: 'Approved PR',
          step: 2,
          total_items: 15,
          logo: 'company-2.jpg',
          items: [
              
            ] 
        },
        {
          id: 'PR00003', 
          date: '2023-11-24', 
          supplier: 'PT. Sembako Subur', 
          address: 'Jl. Ks Tubun 64, Petamburan, Jakarta Pusat',
          contact: '021 12312 1212',
          company: 'Movenpick',
          department: 'Food & Beverage',
          status: 'Rejected',
          step: 0,
          total_items: 17,
          logo: 'company-3.jpg',
          items: [
              
            ] 
        },
        {
          id: 'PR00004', 
          date: '2023-11-23', 
          supplier: 'PT. Makin Kesana Makin Kesini', 
          address: 'Jl. Ks Tubun 89, Petamburan, Jakarta Pusat',
          contact: '021 12312 1212',
          company: 'Movenpick',
          department: 'Food & Beverage',
          status: 'Approved PO',
          step: 3,
          total_items: 15,
          logo: 'company-4.jpg',
          items: [
              {id: 1, kdbrg: 'AX00001', name: 'Fesh Salmon', tipe: 'RM', sbeli: "Kg", qtybeli: 20, kdjenis: 1, no: 1, image: 'fresh-salmon.png'},
              {id: 2, kdbrg: 'AX00002', name: 'Telur Ayam', tipe: 'RM', sbeli: "Peti", qtybeli: 10, kdjenis: 1, no: 2, image: 'telur-ayam.png'},
              {id: 3, kdbrg: 'AX00003', name: 'Bawang Merah', tipe: 'RM', sbeli: "Karung", qtybeli: 5, kdjenis: 1, no: 3, image: 'bawang-merah.png'},
              {id: 4, kdbrg: 'AX00004', name: 'Bawang Putih', tipe: 'RM', sbeli: "Karung", qtybeli: 5, kdjenis: 1, no: 4, image: 'bawang-putih.png'},
              {id: 5, kdbrg: 'AX00005', name: 'Garam', tipe: 'RM', sbeli: "Kg", kdjenis: 2, qtybeli: 20, no: 5, image: 'garam.png'},
              {id: 6, kdbrg: 'AX00006', name: 'Gula', tipe: 'RM', sbeli: "Kg", kdjenis: 2, qtybeli: 20, no: 6, image: 'gula.png'},
              {id: 7, kdbrg: 'AX00007', name: 'Beras Raja', tipe: 'RM', sbeli: "Karung", qtybeli: 6, kdjenis: 2, no: 7, image: 'beras-raja.png'},
              {id: 8, kdbrg: 'AX00008', name: 'Cabe Rawit', tipe: 'RM', sbeli: "Kg", qtybeli: 20, kdjenis: 1, no: 8, image: 'cabe-rawit.png'},
              {id: 9, kdbrg: 'AX00009', name: 'Merica Putih', tipe: 'RM', sbeli: "Kg", qtybeli: 20, kdjenis: 1, no: 9, image: 'merica-putih.png'},
              {id: 10, kdbrg: 'AX00010', name: 'Gula Aren', tipe: 'RM', sbeli: "Kg", qtybeli: 20, kdjenis: 1, no: 10, image: 'gula-aren.png'},
              {id: 11, kdbrg: 'AX00011', name: 'Kecap Bango', tipe: 'RM', sbeli: "Box", qtybeli: 10, kdjenis: 2, no: 11, active: true, image: 'kecap-bango.png'},
              {id: 12, kdbrg: 'AX00012', name: 'Kecap ABC', tipe: 'RM', sbeli: "Box", qtybeli: 10, kdjenis: 2, no: 12, active: true, image: 'kecap-abc.png'},
              {id: 13, kdbrg: 'AX00013', name: 'Sauce Tomat Belibis', tipe: 'RM', sbeli: "Box", qtybeli: 10, kdjenis: 2, no: 13, active: true, image: 'tomat-belibis.png'},
              {id: 14, kdbrg: 'AX00014', name: 'Saori Saus Tiram', tipe: 'RM', sbeli: "Box", qtybeli: 10, kdjenis: 2, no: 14, active: true, image: 'saori-saus-tiram.png'},
              {id: 15, kdbrg: 'AX00015', name: 'Kaldu Jamur', tipe: 'RM', sbeli: "Box", qtybeli: 10, kdjenis: 2, no: 15, active: true, image: 'kaldu-jamur.png'},
            ] 
        },
    ]
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth
  },

  plugins: [createPersistedState({
    paths: ['auth']
  })]
})
