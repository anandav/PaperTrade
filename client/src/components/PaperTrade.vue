<template>

    <!-- <AppHeader /> -->
    <div class="col-lg-12 row">
      <PortfolioMenu  />
    
      <PortfolioDetail  />
    </div>
  
</template>
<script>
//import { mapActions} from 'vuex';
import PortfolioMenu from "./PortfolioMenu";
import PortfolioDetail from "./PortfolioDetail";

//const axios = require("axios");
export default {
  name: "PaperTrade",
  components: {
    PortfolioMenu,
    PortfolioDetail
  },
  
  methods: {
    //...mapActions(['GetAllPortfolios']),
    // // slotSelectedPortfolio(item) {
    // //   this.getPortfolio(item._id.$oid);
    // // },
    // // getPortfoliosFromMongodb() {
    // //   axios
    // //     .get("/collectiondata.json")
    // //     .then(response => (this.Portfolios = response.data))
    // //     .catch(function(error) {
    // //       console.log(error);
    // //     });
    // // },
    // // getPortfolioByIdFromMongodb(_id) {
    // //   axios
    // //     .get("/collectiondata.json")
    // //     .then(response => {
    // //       ///TODO: Have to replace this login below
    // //       for (
    // //         let index = 0, ttlLength = response.data.length;
    // //         index < ttlLength;
    // //         index++
    // //       ) {
    // //         if (response.data[index]._id.$oid == _id) {
    // //           console.log(response.data[index]._id.$oid);
    // //           this.SelectedPortfolio = response.data[index];
    // //         }
    // //       }
    // //       ///TODO: Have to replace this login above
    // //     })
    // //     .catch(function(error) {
    // //       console.log(error);
    // //     });
    // // },
    // // getAllOptionDetailFromService() {
    // //   axios
    // //     .get("/OptionDataFormin16-Apr-2020 10_51_53.json")
    // //     .then(response => (this.OptionData = response.data))
    // //     .catch(function(error) {
    // //       console.log(error);
    // //     });
    // // },
    // // getWeeklyOptionDetailFromService(_weeklyName) {
    // //   axios
    // //     .get("/OptionDataFormin16-Apr-2020 10_51_53.json")
    // //     .then(response => {
    // //       if (_weeklyName) {
    // //         console.log("emp")
    // //       }
    // //       this.OptionData = response.data.data.filter(_=> _.expiryDate == _weeklyName);
    // //     })
    // //     .catch(function(error) {
    // //       console.log(error);
    // //     });
    // // },
    // // getPortfolios() {
    // //   this.getPortfoliosFromMongodb();
    // // },
    // // getPortfolio(_id) {
    // //   this.getPortfolioByIdFromMongodb(_id);
    // // },
    // // getAllOptionDetail() {
    // //   this.getAllOptionDetailFromService();
    // // },
    // // getWeeklyOptionDetail(_weeklyName) {
    // //   this.getWeeklyOptionDetailFromService(_weeklyName);
    // // }
  },
   created () {
    //this.GetAllPortfolios();
    // //this.getPortfolios();
    // //this.getWeeklyOptionDetailFromService("23-Apr-2020");
  },
  // computed:{
  //   ...mapState(['Portfolios'])

  // }
};
</script>


