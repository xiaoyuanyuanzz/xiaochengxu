<template>
	<view>
		<view class="search-box">
			<uni-search-bar @confirm="search" @input="input" cancelButton="none" ></uni-search-bar>
		</view>
		
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 搜索历史标题 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17"></uni-icons>
			</view>
			<!-- 搜索列表 -->
			<view class="history-list">
				<uni-tag v-for="(item,i) in historys" :key="i" :text="item"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//延时器的timerid
				timer:null,
				kw:'',
				searchResults:[],
				historyList:[]
			};
		},
		methods:{
			input(e){
				//清除timer对应的延时器
				clearTimeout(this.timer)
				
				this.timer = setTimeout(()=>{
					this.kw = e
					this.getSearchList()
				},500)
			},
			async getSearchList(){
				if(this.kw === ''){
					this.searchResults = []
					return
				}
				const {data:res} = await uni.$http.get('/api/public/v1/goods/qsearch?query='+this.kw)
				if(res.meta.status !== 200) return uni.$showMsg()
				this.searchResults = res.message
				
				this.saveSearchHistory()
			},
			gotoDetail(id){
				console.log(id)
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id='+id
				})
			},
			saveSearchHistory(){
				//通过集合值唯一的特点添加唯一元素
				const set = new Set(this.historyList)
				
				set.delete(this.kw)
				
				set.add(this.kw)
				
				this.historyList = Array.from(set)
			}
		},
		computed:{
			historys(){
				return [...this.historyList].reverse()
			}
		}
	}
</script>

<style lang="scss">
.search-box{
	position: sticky;
	top: 0;
	z-index: 999;
	
	.uni-searchbar__cancel{
		color: #fff;
	}
}

.sugg-list{
	padding: 0 5px;
	.sugg-item{
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.goods-name{
			//单行文本
			white-space: nowrap;
			//溢出部分隐藏
			overflow: hidden;
			text-overflow: ellipsis;
			margin-right: 3px;
		}
	}
}

.history-box{
	padding: 0 5px;
	.history-title{
		display: flex;
		justify-content: space-between;
		height: 40px;
		align-items: center;
		font-size: 13px;
		border-bottom: 1px solid #efefef;
	}
	
	.history-list{
		display: flex;
		flex-wrap: wrap;
		.uni-tag{
			margin-top: 5px;
			margin-right: 5px;
		}

	}
}
</style>
