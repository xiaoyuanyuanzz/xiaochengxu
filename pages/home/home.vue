<template>
	<view>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		
		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,i) in navList" :key="i">
				<image :src="item.image_src" class="nav-image"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//轮播图的数据列表，默认为空
				swiperList:[],
				//分类导航的数据列表
				navList:[]
			};
		},
		methods:{
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
				console.log(this.navList)
			}
		},
		onLoad(){
			//在小程序页面刚加载时，调用获取轮播图数据的方法
			this.getSwiperList()
			this.getNavList()
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
</style>
