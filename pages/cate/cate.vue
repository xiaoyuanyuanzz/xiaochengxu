<template>
	<view>
		<my-search @click="gotoSearch"></my-search>

		
		<view class="scroll-view-container">
			<!-- 左侧的滑动区域 -->
			<scroll-view class="left-scroll-view" scroll-y="true" :style="{height:wh+'px'}">
				<block v-for="(item,i) in cateList" :key="i" >
					<view :class="['left-scroll-view-item',i === active ? 'active' : '']" @click="activeChanged(i)"  >{{item.cat_name}}</view>
				</block>
				
			</scroll-view>
			<!-- 右侧的滑动区域 -->
			<scroll-view class="right-scroll-view" scroll-y="true" :style="{height:wh+'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2,i2) in cateLevel2" :key="i2">
					<view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
					<!-- 动态渲染三级分类列表 -->
					<view class="cate-lv3-list">
						<!-- 三级分类的item项 -->
						<view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
							<!-- 图片 -->
							<image :src="item3.cat_icon"></image>
							<!-- <image src="/images/paopao.jpg" mode="heightFix"></image> -->
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins:[badgeMix],
		data() {
			return {
				wh:0,
				cateList:[],
				active:0,
				cateLevel2:[],
				scrollTop:0
			};
		},
		methods:{
			gotoSearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			},
			gotoGoodsList(item3){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				})
			},
			activeChanged(i){
				this.active = i
				this.cateLevel2 = this.cateList[i].children
				
				//由于scrollTop值切换时没发生变化,会不改变,导致操作无效
				this.scrollTop = this.scrollTop ? 0 : 1
			},
			async getCateList(){
				const {data:res} = await uni.$http.get('/api/public/v1/categories')
				if(res.meta.status !== 200) return uni.$showMsg()
				this.cateList = res.message
				this.cateLevel2 = res.message[0].children
			}
		},
		onLoad(){
			const sysInfo = uni.getSystemInfoSync()
			this.wh = sysInfo.windowHeight - 50
			
			this.getCateList()
		}
	}
</script>

<style lang="scss">
.scroll-view-container{
	display: flex;
	.left-scroll-view{
		width: 120px;
		
		.left-scroll-view-item{
			background-color: #F7F7F7;
			line-height: 60px;
			text-align: center;
			font-size: 12px;
			
			&.active{
				background-color: #FFFFFF;
				position: relative;
				
				&::before{
					content: '';
					display: block;
					width: 3px;
					height: 30px;
					background-color: #C00000;
					position: absolute;
					top:50%;
					left: 0;
					transform: translateY(-50%);
				}
			}
		}
	}
	.right-scroll-view{
		.cate-lv2-title{
			font-size: 12px;
			font-weight: bold;
			text-align: center;
			padding: 15px 0;
		}
		
		.cate-lv3-list{
			display: flex;
			flex-wrap: wrap;
			
			.cate-lv3-item{
				width: 33.33%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-bottom: 10px;
				image{
					height: 60px;
					width: 60px;
				}
				
				text{
					font-size: 12px;
				}
			}
		}
	}
}


</style>
