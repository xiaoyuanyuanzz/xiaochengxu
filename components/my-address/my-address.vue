<template>
	<view>
		<!-- 选择收货地址的盒子 -->
		<view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
			<button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
		</view>
		
		<!-- 渲染收货信息的盒子 -->
		<view class="address-info-box" v-else @click="chooseAddress">
			<view class="row1">
				<view class="row1-left">
					<view class="username">收货人:{{address.userName}}</view>
				</view>
				<view class="row1-right">
					<view class="phone">电话:{{address.telNumber}}</view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			
			<view class="row2">
				<view class="row2-left">收货地址:</view>
				<view class="row2-right">{{addstr}}</view>
			</view>
		</view>
		
		<!-- 底部的边框线 -->
		<image src="/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	import {mapState,mapMutations,mapGetters} from 'vuex'
	export default {
		name:"my-address",
		data() {
			return {
			};
		},
		methods:{
			//把 m_user模块中的updateAddress映射到当前组件
			...mapMutations('m_user',['updateAddress']),
			
			//选择收货地址
			async chooseAddress(){
				//1. 调用小程序提供的chooseAddress()方法，即可使用选择收货地址功能
				//返回值是一个数组，第一项为错误对象，第二项为成功后的收货地址对象
				 const [err,succ] = await uni.chooseAddress().catch(err=>err)
				 console.log(succ)

				//若用户成功的选择了收货地址
				if(err === null && succ.errMsg === 'chooseAddress:ok'){
					//为vuex里面的收货地址对象赋值
					this.updateAddress(succ)
				}
				
				
				//用户授权被清除导致的问题
				if(err && err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response'){
					//通过调用这个方法，让用户重新授权
					this.reAuth()
				}
			},
			//调用此方法，重新发起收货地址的授权,现在无此问题
			async reAuth(){
				//提示用户对地址进行授权
				const [err2,confirmResult] = await uni.showModal({
					content:'检测到您没有打开地址权限，是否设置去打开？',
					confirmText:'确认',
					cancelText:'取消'
				})
				
				//如果出现弹框异常，直接退出
				if(err2) return
				
				//如果用户点击了 取消 按钮，提示用户 您取消了授权
				if(confirmResult.cancel) return uni.$showMsg('您取消了地址授权！')
				//如果用户点击了 确认 ， 让用户重新授权
				if(confirmResult.confirm) return uni.openSetting({
					//授权结束，需要对授权的结果进一步判断
					success:(settingResult)=>{
						//地址授权 = true
						if(settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功，请选择地址')
						//地址授权 = false
						if(!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
					}
					
				})
			}
		},
		computed:{
			...mapState('m_user',['address']),
			...mapGetters('m_user',['addstr'])
		}
	}
</script>

<style lang="scss">
.address-border{
	display: block;
	width: 100%;
	height: 5px;
}

.address-choose-box{
	height: 90px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.address-info-box{
	font-size: 12px;
	height: 90px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 5px;
	
	.row1{
		display: flex;
		justify-content: space-between;
		.row1-left{
			.username{
				
			}
		}
		
		.row1-right{
			display: flex;
			justify-content: space-between;
			.phone{
				
			}
		}
	}
	
	.row2{
		display: flex;
		align-items: center;
		margin-top: 10px;
		.row2-left{
			white-space: nowrap;
		}
		
		.row2-right{
			padding: 0 5px;
		}
	}
}
</style>