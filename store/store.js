import Vue from 'vue'
import Vuex from 'vuex'

//导入购物车的vuex模块
import moduleCart from '@/store/cart.js'
//导入用户的vuex模块
import moduleUser from './user.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	//挂载store模块
	modules:{
		//挂载购物车的vuex模块，模块内成员的访问路径被调整为m_cart,如
		//购物车模块中的cart数组的访问路径为 m_cart/cart
		m_cart:moduleCart,
		//挂载用户的vuex模块，访问路径为 m_user
		m_user:moduleUser
	},
})

export default store