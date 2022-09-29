<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryObj:{
					query:'',	//查询关键词
					cid:'',		//商品分类id
					pagenum:1,	//页码值
					pagesize:10
				},
				//商品列表的数据
				goodsList:[],
				//总数量，用于实现分页
				total:0,
				//定义节流阀，判断是否正在请求数据
				isloading:false
			};
		},
		onLoad(options){
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			console.log(this.queryObj)
			this.getGoodsList()
		},
		methods:{
			gotoDetail(goods){
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id='+goods.goods_id
				})
			},
			async getGoodsList(cb){
				//打开节流阀
				this.isloading = true
				//发起请求
				const {data:res} = await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
				if(res.meta.status !== 200) return uni.$showMsg()
				
				//请求成功后，关闭节流阀
				this.isloading = false
				//只要数据请求完毕，就立即按需调用cb回调函数
				cb && cb()
				
				this.goodsList = [...this.goodsList,...res.message.goods]
				this.total = res.message.total
				console.log(this.goodsList)
				console.log(this.total)
			}
		},
		onReachBottom(){
			//判断是否还有下一页数据
			//公式：当前的页码值 * 每页显示多少条数据 >= 总数条数
			if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total){
				return uni.$showMsg('数据加载完毕！')
			}
			//判断是否正在请求数据
			if(this.isloading) return
			
			this.queryObj.pagenum++
			//重新渲染
			this.getGoodsList()
		},
		onPullDownRefresh(){
			// 1.重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []
			
			/* 2.重新发起请求 */
			this.getGoodsList(()=>uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">
	

</style>
