import Vue from "vue";
import Vuex from "vuex";
import Web3 from "web3";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    web3: {},
    account: "",
    net: 0,
  },
  mutations: {
    SETWEBPROVIDER: (state, web3js) => {
      state.web3 = web3js;
    },
    SETACCOUNTS: (state, account) => {
      state.account = account;
    },

    SETNET: (state, net) => {
      state.net = net;
    },
  },
  actions: {
    setWebProvider({ commit }) {
      var web3Provider;
      if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
          // 请求用户授权
          window.ethereum.enable();
          const web3js = new Web3(web3Provider); //web3js就是你需要的web3实例
          web3js.eth.net.getId(function (error, result) {
            if (!error) {
              console.log(result, "网络"); //授权成功后result能正常获取到账号了
              commit("SETNET", result);
            }
          });
          web3js.eth.getAccounts(function (error, result) {
            if (!error) {
              console.log(result, "账号"); //授权成功后result能正常获取到账号了
              commit("SETACCOUNTS", result[0]);
            }
          });
          commit("SETWEBPROVIDER", web3js);
          web3Provider.on("networkChanged", function (networkIDstring) {
            commit("SETNET", networkIDstring);
          });
          web3Provider.on("accountsChanged", function (accounts) {
            commit("SETACCOUNTS", accounts[0]);
          });
        } catch (error) {
          // 用户不授权时
          console.error("User denied account access");
        }
      }
    },
  },
  modules: {},
});
