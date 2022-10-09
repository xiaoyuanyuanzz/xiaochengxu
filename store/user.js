export default {
	//为当前模块开启命名空间
	namespaced:true,
	state:{
		//读取本地的收货地址数据，初始化address对象
		address:JSON.parse(uni.getStorageSync('address') || '{}')
	},
	//方法
	mutations:{
		//更新收货地址
		updateAddress(state,address){
			state.address = address
			//更新收货地址时，同步到本地存储
			this.commit('m_user/saveAddressToStorage')
		},
		//定义将address持久化存储到本地的方法
		saveAddressToStorage(state){
			uni.setStorageSync('address',JSON.stringify(state.address))
		}
	},
	//为了提高代码的复用性，可以把收货地址的详细地址抽离为getters，方便在多个页面和组件之间实现复用
	getters:{
		//收货地址详细信息的计算属性
		addstr(state){
			if(!state.address.provinceName) return ''
			
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		}
	}
}