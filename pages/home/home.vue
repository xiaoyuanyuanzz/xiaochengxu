<template>
	<view>
		
		<view class="search_box">
			<my-search @click="gotoSearch"></my-search>
		</view>
		
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		
		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,i) in navList" :key="i" @click="nav_handler(item)">
				<image :src="item.image_src" class="nav-image"></image>
			</view>
		</view>
		
		<!-- 楼层区域 -->
		<view class="floor-list">
			<!-- 楼层Item项 -->
			<view class="floor-item" v-for="(item,i) in floorList" :key="i">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" :style="'width:'+item.product_list[0].image_width+'rpx'" mode="widthFix"></image>
					</navigator>
					<!-- 右侧 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2,i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item.product_list[i2].url">
							<image :src="item2.image_src" mode="widthFix" :style="'width:'+item2.image_width + 'rpx'"></image>
						</navigator>
					</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins:[badgeMix],
		data() {
			return {
				//轮播图的数据列表，默认为空
				swiperList:[],
				//分类导航的数据列表
				navList:[],
				floorList:[]
			};
		},
		methods:{
			gotoSearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			},
			nav_handler(item){
				if(item.name === '分类'){
					uni.switchTab({
						url:'/pages/cate/cate'
					})
				}
			},
			async getSwiperList(){
				const {data:res} = await uni.$http.get('/api/public/v1/home/swiperdata')
				if(res.meta.status !== 200){
					return uni.$showMsg()
				}
				this.swiperList = res.message
				uni.$showMsg('数据请求成功')
			},
			async getNavList(){
				const {data:res} = await uni.$http.get('/api/public/v1/home/catitems')
				if(res.meta.status !== 200){
					return uni.$showMsg()
				}
				this.navList = res.message
			},
			async getFloorList(){
				const {data:res} = await uni.$http.get('/api/public/v1/home/floordata')
				if(res.meta.status !== 200){
					return uni.$showMsg()
				}
				//处理url地址，替换为自己的路径
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})
				this.floorList = res.message
				console.log(this.floorList)
			}

		},
		onLoad(){
			//在小程序页面刚加载时，调用获取轮播图数据的方法
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		}
	}
</script>

<style lang="scss">
	swiper{
		height: 330rpx;
		.swiper-item,image{
			width: 100%;
			height: 100%;
		}

	}
	.nav-list{
		display: flex;
		justify-content: space-around;
		margin: 15px;
		image{
			width: 128rpx;
			height: 140rpx;
		}
	}
	.floor-title{
		height: 60rpx;
		width: 100%;
		display: flex;
	}
	.floor-img-box{
		display: flex;
		padding-left: 10rpx;
	}
	.right-img-box{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	
.search_box{
	position: sticky;
	top: 0;
	z-index: 999;
}
</style>
