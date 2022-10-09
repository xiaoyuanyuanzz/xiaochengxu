import {mapGetters} from 'vuex'

//导出一个mixin对象
export default {
	computed:{
		...mapGetters('m_cart',['total'])
	},
	watch:{
		total(){
			this.setBadge()
		}
	},
	methods:{
		setBadge(){
			uni.setTabBarBadge({
				index:2,
				text:this.total + ''  //text必须为字符串
			})
		}
	},
	onShow(){
		this.setBadge()
	}
}