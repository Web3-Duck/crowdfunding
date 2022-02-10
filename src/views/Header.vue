<template>
  <div class="header">
    <el-row type="flex">
      <el-col :xs="12" :sm="12" class="elcol1">
        <div class="title" @click="handleRouter('/farm', 0)">众筹项目</div>
        <img src="@/assets/27.gif" alt="" class="gif27">
      </el-col>
      <el-col :xs="12" :sm="12">
        <div class="address">
          <div class="addressBox">
            <div class="walletBox">
              <img src="@/assets/wallet.png" alt="" class="wallet" />
            </div>
            <div class="account">
              {{ account }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Header",
  computed: {
    // mix the getters into computed with object spread operator
    ...mapState([
      "web3",
      "account",
      "net",
      // ...
    ]),
  },
};
</script>

<style lang="less" scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.header {
  //   width: 100%;
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
  padding: 10px;

  .leftContent {
    flex: 1;
  }
  .nav {
    width: 580px;
    display: flex;
    background: #fff;
    border-radius: 8px;
    padding: 0 10px;
    
    .title2 {
      font-size: 26px;
      line-height: 40px;
      cursor: pointer;
      color: #2196f3;
      padding: 5px 0px;
      border-bottom: 2px solid transparent;
      // flex: 1;
      width: 33%;
      text-align: center;
    }
  }
  .title {
    font-size: 30px;
    line-height: 40px;
    cursor: pointer;
  }

  .left {
    color: #fff;
    display: flex;
    height: 400px;
    width: 400px;
  }
  .focus {
    border-bottom: 2px solid #2196f3;
  }
  .address {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    .addressBox {
      max-width: 150px;
      line-height: 20px;
      font-size: 20px;
      padding: 5px;
      display: flex;
      align-items: center;
    }
    .walletBox {
      height: 40px;
      width: 40px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin-right: -5px;
      z-index: 10;
      .wallet {
        height: 30px;
        width: 30px;
      }
    }
    .account {
      font-family: Kanit, sans-serif;
      font-size: 16px;
      font-weight: bold;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: rgb(239, 244, 245);
      padding: 0 5px 0 10px;
      line-height: 28px;
      color: #333;
      border-radius: 0 10px 10px 0;
    }
  }
}
.elcol1{
  display: flex;
  // justify-content: center;
}
.elcol2{
  display: flex;
  justify-content: center;
}
.gif27{
  width: 40px;
  height: 40px;
}
</style>