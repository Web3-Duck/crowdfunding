<template>
  <div class="home">
    <div class="top">
      <div>我的余额:{{ formatAmount(balance) }} ETH</div>
      <el-button class="pbtn mr10" type="default" @click="dialogFormVisible = true">添加新众筹项目</el-button>
    </div>
    <div class="tabs">
      <div class="tabItem" @click="handleTab(index)" :class="activeTab == index ? 'focus' : ''" v-for="(item, index) in tabs" :key="index">
        {{ item.name }}
      </div>
    </div>
    <div class="" v-for="(item, index) in depositList" :key="index">
      <div
        class="poolBox dBox"
        v-if="activeTab == 0 || (activeTab == 1 && item.status == 2) || (activeTab == 2 && item.status == 1) || (activeTab == 3 && item.status == 0) || (activeTab == 4 && item.user.toLowerCase() == account && account.toLowerCase())"
      >
        <div>众筹项目编号:{{ item.id }}</div>
        <div>项目状态:{{ item.status == 0 ? '停止众筹,已退款' : item.status == 1 ? '正在众筹中' : '众筹成功' }}</div>
        <div>众筹发起人:{{ item.user }}</div>
        <div>众筹收款人:{{ item.to }}</div>
        <div>当前众筹人数:{{ item.currentPeople }}</div>
        <div>当前众筹数量:{{ formatAmount(item.currentAmount) }} ETH</div>
        <div>众筹金额目标:{{ formatAmount(item.maxAmount) }} ETH</div>
        <div>众筹限制最大人数:{{ item.maxPeople }}</div>
        <div class="btnWrap" v-if="item.status == 1">
          <el-button class="pbtn mr10" type="default" @click="contribution(item, item.id)">捐款</el-button>
          <div class="inputBox mr10">
            <el-input v-model="item.inputAmount" class="mr10"></el-input>
            <el-button class="pbtn pbtnmax" type="default" @click="handlerMax(item, index)">MAX</el-button>
          </div>
          <el-button class="pbtn mr10" type="default" v-if="item.user.toLowerCase() == account && account.toLowerCase()" @click="closeProject(item.id)">关闭众筹</el-button>
        </div>
      </div>
    </div>

    <el-dialog title="项目" width="600px" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="发起人地址" :label-width="formLabelWidth">
          <el-input v-model="account" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收款人地址" :label-width="formLabelWidth">
          <el-input v-model="form.to" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="众筹目标金额" :label-width="formLabelWidth">
          <el-input v-model="form.maxAmount" autocomplete="off">
            <template slot="append">ETH</template>
          </el-input>
        </el-form-item>
        <el-form-item label="众筹限制最大人数" :label-width="formLabelWidth">
          <el-input v-model="form.maxPeople" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';
import { formatAmount, parseAmount, accMul, accDiv, toFixed, accAdd, accSub } from '@/utils/format.js';
import { formatTime } from '@/utils/time.js';
import { getCrowdfundingContract } from '@/utils/contractHelp';
import simpleRpcProvider from '@/utils/provider';

export default {
  name: 'Home',
  data() {
    return {
      depositList: [],
      balance: 0,
      dialogFormVisible: false,
      form: {
        to: '',
        maxAmount: '',
        maxPeople: ''
      },
      formLabelWidth: '130px',
      activeTab: 0,
      tabs: [{ name: '全部众筹' }, { name: '众筹完成' }, { name: '众筹中' }, { name: '众筹失败' }, { name: '我的众筹项目' }]
    };
  },
  components: {},
  computed: {
    ...mapState(['web3', 'account'])
  },
  created() {
    this.getBalance();
    this.getProjects();
  },
  watch: {
    async account() {
      this.getBalance();
    }
  },
  methods: {
    async getBalance() {
      if (!this.account) {
        return;
      }
      this.balance = await simpleRpcProvider.eth.getBalance(this.account);
    },

    async closeProject(index) {
      const myContract = getCrowdfundingContract(this.web3);
      myContract.methods
        .closeProject(index)
        .send({ from: this.account })
        .on('transactionHash', (hash) => {
          this.$notify({
            title: '关闭中,请稍后',
            type: 'success'
          });
        })
        .on('receipt', (receipt) => {
          this.getBalance();
          this.getProjects();
          this.$notify({
            title: '关闭成功',
            type: 'success'
          });
        })
        .on('error', (err) => {
          this.getBalance();
          this.getProjects();
          this.$notify({
            title: '关闭失败',
            message: err.message,
            type: 'error'
          });
        });
    },
    async contribution(item, index) {
      const myContract = getCrowdfundingContract(this.web3);
      const amount = parseAmount(item.inputAmount);
      myContract.methods
        .contribution(index)
        .send({ from: this.account, value: amount })
        .on('transactionHash', (hash) => {
          this.$notify({
            title: '捐款中,请稍后',
            type: 'success'
          });
        })
        .on('receipt', (receipt) => {
          this.getBalance();
          this.getProjects();
          this.$notify({
            title: '捐款成功',
            type: 'success'
          });
        })
        .on('error', (err) => {
          console.log(err, 'err');
          this.getBalance();
          this.getProjects();
          this.$notify({
            title: '捐款失败',
            message: err.message,
            type: 'error'
          });
        });
    },
    async getProjects() {
      const contract = getCrowdfundingContract();
      const length = await contract.methods.projectLength().call();
      let promiseArr = [];
      for (let i = 0; i < length; i++) {
        promiseArr.unshift(contract.methods.projects(i).call());
      }
      let depositList = await Promise.all(promiseArr);
      this.depositList = depositList.map((item) => {
        item.inputAmount = '';
        return item;
      });
    },
    handlerMax(item, index) {
      item.inputAmount = formatAmount(this.balance);
      this.depositList.splice(index, 1, item);
    },
    confirm() {
      const myContract = getCrowdfundingContract(this.web3);
      let { to, maxAmount, maxPeople } = this.form;
      maxAmount = parseAmount(maxAmount);
      myContract.methods
        .add(to, maxAmount, maxPeople)
        .send({ from: this.account })
        .on('transactionHash', (hash) => {
          this.$notify({
            title: '添加中,请稍后',
            type: 'success'
          });
          this.dialogFormVisible = false;
        })
        .on('receipt', (receipt) => {
          this.getBalance();
          this.getProjects();
          this.$notify({
            title: '添加成功',
            type: 'success'
          });
        })
        .on('error', (err) => {
          this.getBalance();
          this.getProjects();
          this.$notify({
            title: '添加失败',
            message: err.message,
            type: 'error'
          });
        });
    },
    handleTab(index) {
      this.activeTab = index;
    },
    formatAmount,
    accMul,
    accDiv,
    toFixed,
    accAdd,
    accSub,
    formatTime
  }
};
</script>

<style lang="less" scoped>
.home {
  max-width: 600px;
  padding: 0px 20px;
  font-size: 20px;
  margin: 0 auto;
  color: #333;
  .top {
    display: flex;
    justify-content: space-between;
    height: 40px;
  }
  .tabs {
    display: flex;
    justify-content: space-between;
    height: 40px;
    background: #fff;
    line-height: 40px;
    border: 5px;
    margin-top: 20px;
    .tabItem {
      cursor: pointer;
      padding: 0 10px;
    }
    .focus {
      background: #a3a4a7;
    }
  }
  .poolBox {
    border-radius: 8px;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    background: #fff;
    margin-top: 20px;
    overflow: hidden;
    .tilte {
      color: #333;
      font-size: 24px;
      font-weight: bold;
      line-height: 32px;
      padding-top: 12px;
    }

    .btnWrap {
      display: flex;
    }
    .btnWrap1 {
      height: 40px;
      display: flex;
      margin-top: 10px;
      margin-bottom: 20px;
    }

    .pbtnmax {
      height: 30px;
      padding: 0 10px;
    }
    .inputBox {
      display: flex;
      align-items: center;
      border-radius: 8px;
      // border: 2px solid rgb(54, 71, 79);
      box-sizing: border-box;
      padding: 4px;
      height: 40px;
      box-shadow: inset 0 0 0 2px #d7dadc;
      /deep/.el-input__inner {
        font-size: 16px;
        border: none !important;
        border-radius: 8px;
        height: 28px;
      }
    }
  }
}
.mr10 {
  margin-right: 10px !important;
}

.dBox {
  border-radius: 8px;
  background: #fff;
  padding: 10px;
  overflow: hidden;
}
.pbtn {
  max-width: 400px;
  cursor: pointer;
  background: linear-gradient(30deg, rgb(111 112 223), rgb(98 119 221)) !important;
  color: #fff;
  font-size: 14px;
  border-radius: 8px;
  margin: 0;
  padding: 0 25px;
}
</style>
