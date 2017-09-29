<template>
	<div>
		<div>这里展示了rem的用法</div>
		<div class="f12">这里是12px的大小</div>
		<div class="f14">这里是14px的大小</div>
		<div class="f16">这里是16px的大小</div>
		<div class="box">
			这里的宽度是100px
			高度是200px
		</div>
	</div>

</template>

<style lang="scss" scoped="">
	@import "../../../style/scss/v";

	.f12 {
		font-size: px(12);
	}

	.f14 {
		font-size: px(14);
	}

	.f16 {
		font-size: px(16);
	}
	.box{
		width: px(100);
		height: px(200);
		background: red;
	}
</style>