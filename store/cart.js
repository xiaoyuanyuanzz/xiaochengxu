/* 在当前模块中，开启命名空间 */

export default {
	//为当前模块开启命名空间
	namespaced:true,
	
	//模块的state数据
	state:{
		cart:JSON.parse(uni.getStorageSync('cart') || '[]')
	},
	
	mutations:{
		addToCart(state,goods){
			//根据提交的商品的Id，查询购物车中是否存在这物品
			//不存在，findResult为undefined，否则为查找到的商品信息对象
			const findResult = state.cart.find(x=>x.goods_id === goods.goods_id)
			if(!findResult){
				state.cart.push(goods)
			}else{
				findResult.goods_count++
			}
			
			this.commit('m_cart/saveToStorage')
		},
		saveToStorage(state){
			uni.setStorageSync('cart',JSON.stringify(state.cart))
		},
		//更新购物车中商品的勾选状态
		updateGoodsState(state,goods){
			const findResult = state.cart.find(x=>x.goods_id === goods.goods_id)
			
			// 有对应的商品信息对象
			if(findResult){
				//更新勾选状态
				findResult.goods_state = goods.goods_state
				//持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		updateGoodsCount(state,goods){
			const findResult = state.cart.find(x=>x.goods_id === goods.goods_id)
			
			// 有对应的商品信息对象
			if(findResult){
				//更新商品数量
				findResult.goods_count = goods.goods_count
				//持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		//根据Id从购物车中删除对应的商品信息
		removeGoodsById(state,goods_id){
			//使用数组的filter进行过滤
			state.cart = state.cart.filter(x=>x.goods_id !== goods_id)
			//持久化存储到本地
			this.commit('m_cart/saveToStorage')
		},
		updateAllGoodsState(state,newState){
			state.cart.forEach(x=>x.goods_state = newState)
			
			this.commit('m_cart/saveToStorage')
		}
		
	},
	
	getters:{
		total(state){
			return state.cart.reduce((total,item) => total += item.goods_count,0)
		},
		//勾选商品的总数量
		checkedCount(state){
			//先过滤已勾选，再累加
			return state.cart.filter(x=>x.goods_state).reduce((total,item)=>total += item.goods_count,0)
		},
		//已勾选商品的总价
		checkedGoodsAmount(state){
			return state.cart.filter(x=>x.goods_state).reduce((total,item)=>total +=item.goods_count * item.goods_price,0).toFixed(2)
		}
	}
}