<template>
<div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
        <div :style="{width : sidebarWidth}" class="content-spacer"></div>
        <div :style="{width : contentWidth}" class="content-body">
            <div class="content-wrapper">
                <div class="content-title">
                    <h2>Event #{{ this.$route.params.id }}</h2>
                </div>

                <button class="btn-primary" 
                        style="position: absolute;
                        top: 20px;right: 20px;">
                    <i class="ri-download-2-fill" style="font-size: 14pt;"></i>
                        
                    <span style="position: relative;
                    top: -2px;">
                        Download PDF
                    </span>
                </button>

                <div class="content">
                    <div style="width: 100%;margin-top: 20px;">
                        <div style="width: 100%;
                        border-bottom: 1px solid var(--light);">
                        </div>
                        
                        <div style="width: 100%;height: 25px;
                        border-bottom: 1px solid var(--light);
                        margin-top: 5px;display: flex;flex-direction: row;
                        font-family: 'Courier New', Courier, monospace;">
                            <span style="margin-left: 10px;">
                                Event Date {{ getMonth(new Date(events.date).getMonth()) }} 
                                {{   new Date(events.date).getDate()  }}, 
                                {{ new Date(events.date).getFullYear() }}
                            </span>
                        </div>

                        <div style="width: 100%;
                                    display: flex;
                                    flex-direction: row;
                                    flex-wrap: wrap;
                                    margin-top: 25px;">
                            <div style="width: 70%;">
                                <table class="table-responsive" aria-describedby="Reserved food data">
                                    <thead class="bg-theme">
                                        <th>
                                            <td>No</td>
                                            <td colspan="2">Food Name</td>
                                            <td>Quantity Order</td>
                                            <td>Total</td>
                                        </th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in events.food" :key="item.id">
                                            <td>{{ index + 1 }}</td>
                                            <td>
                                                <img :src="getFooImage(item.image)" style="width: 80px;" :alt="item.image">
                                            </td>
                                            <td style="text-align: left;">
                                                <span class="font-bold">{{ item.name }}</span><br>
                                                <span class="color-light">{{ item.category }}</span>
                                            </td>
                                            <td>{{ item.qty }}</td>
                                            <td style="text-align: end;">
                                                Rp. {{ formatPrice(item.price * item.qty) }}
                                            </td>
                                        </tr>

                                        <tr style="border-bottom: 1px solid gray;"></tr>
                                        <tr style="height: 50px;">
                                            <td colspan="4" style="text-align: start;">Subtotal</td>
                                            <td style="text-align: end;">Rp. {{ formatPrice(totalprice) }}</td>
                                        </tr>
                                        
                                        <tr style="height: 50px;">
                                            <td colspan="4" style="text-align: start;">Tax</td>
                                            <td style="text-align: end;">Rp. {{ formatPrice(totaltax) }}</td>
                                        </tr>

                                        <tr style="border-bottom: 1px solid gray;"></tr>
                                        <tr>
                                            <td colspan="4">
                                                <span class="event-title color-orange">
                                                    Total Price
                                                </span>
                                            </td>
                                            <td style="text-align: end;
                                                       font-size: 12pt;
                                                       font-weight: bold;">
                                                <span class="color-theme">
                                                    Rp. {{ formatPrice(totalprice + totaltax) }}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style="width: 30%;">
                                <div style="width: 80%;
                                            margin: 0 auto;
                                            background: var(--canvas);
                                            padding: 20px;
                                            font-size: 10pt;
                                            display: flex;
                                            flex-direction: column;
                                            color: #848484;
                                            font-family: 'Courier New', Courier, monospace;
                                            gap: 5px;">
                                    <span class="event-title">
                                        Customer Information
                                    </span>

                                    <span style="margin-top: 5px;">{{ events.name }}</span>
                                    <span>{{ events.customer }}</span>
                                    <span>{{ events.phone }}</span>
                                    <span>{{ events.address }}</span>

                                    <span class="event-title" style="margin-top: 50px;">
                                        Payment Information
                                    </span>
                                    <span>
                                        Pay using Card/Net banking acceptance subject to device availability.
                                    </span>

                                    <span class="event-title" style="margin-top: 50px;">
                                        Event Location
                                    </span>
                                    <span>Movenpick Pecenongan</span>
                                    <span>62 21-231-6008</span>
                                    <span>Jalan Pecenongan Kav 7-17, RT.2/RW.3, Kebon Kelapa Jakarta, Indonesia 10120</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import SidebarVue from '@/components/Sidebar.vue'
import NavbarVue from '@/components/Navbar.vue'

export default {
    name: 'EventDetailView',
    components: {
        SidebarVue,
        NavbarVue,
    },
    data(){
        return{
            sidebarWidth: '18%',
            contentWidth: '78%',
            allselected: false,
            showCreate: false,
            showEdit: false,
            event: [],
            events: {},
            foods: [],
            total_page: [],
            selectedPage: 0,
            selectedEvent: {},
            perpage: 10,
            totalprice: 0,
            totaltax: 0,
        }
    },
    mounted(){
        this.event = [...this.$store.state.event]
        this.getEvent()
    },
    methods: {
        setWidth(value){
            this.sidebarWidth = value
            if(value === '18%') this.contentWidth = '78%'
            else this.contentWidth = '92%'
        },
        getEvent(){
            this.events = {};
            this.totalprice = 0;
            this.totaltax = 0;
            this.event.forEach((data) => {
                if(data.id == this.$route.params.id){
                    this.events = data
                }
            })

            this.foods = [...this.events.food]
            this.foods.forEach((data) => {
                this.totaltax += (data.price * 10 / 100) * data.qty
                this.totalprice += data.price * data.qty
            })
        },
        getFooImage(filename){
            return '/images/foods/' + filename
        },
        setStatus(value){
            if(value) return 'Active'
            else return 'Not Active'
        },
        onClosedModal(value){
            this.showCreate = value
            this.showEdit = value
        },
        editModal(item){
            this.showEdit = true
            this.selectedFood = item
        },
        formatPrice(value){
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        getMonth(gmonth){
            let month;
            switch (gmonth) {
            case 0:
                month = "January";
                break;
            case 1:
                month = "February";
                break;
            case 2:
                month = "March";
                break;
            case 3:
                month = "April";
                break;
            case 4:
                month = "May";
                break;
            case 5:
                month = "June";
                break;
            case 6:
                month = "July";
                break;
            case 7:
                month = "August";
                break;
            case 8:
                month = "September";
                break;
            case 9:
                month = "October";
                break;
            case 10:
                month = "November";
                break;
            case 11:
                month = "December";
            }

            return month
        },
    }
}
</script>