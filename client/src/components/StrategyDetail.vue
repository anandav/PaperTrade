<template>
  <!-- @click="SelectedStrategy(PropStrategy)" -->
  <div>
    <div class="card mb-2 bg-grey-custom">
      <div class="card-header">
        <div class="d-flex">
          <div class="">
            <div v-show="!this.isNameEdit">
              {{ PropStrategy.name }}
            </div>

            <input
              class="input-sm"
              placeholder="Strategy Name"
              v-show="this.isNameEdit"
              v-model="PropStrategy.name"
              @keydown.enter="addEditStrategy()"
            />
          </div>

          <div class="ml-auto">
            <div v-show="!this.isNameEdit">
              {{ PropStrategy.symbol }}
            </div>

            <input
              class=""
              placeholder="Symbol"
              v-show="this.isNameEdit"
              v-model="PropStrategy.symbol"
              @keydown.enter="addEditStrategy()"
            />
          </div>
          <div class="ml-auto">
            Created On:
            {{ PropStrategy.CreatedOn }}
          </div>
        </div>
      </div>

      <div class="card-body text-dark">
        <div class="row">
          <div class="col-sm">
            <TradeAddEdit :ParentStrategy="PropStrategy"   />
          </div>
        </div>
      </div>
      <div class="card-footer text-dark">
        <div class="p-2 float-left">
          <a class="btn btn-danger ml-2" @click="deleteStrategy()">
            <i class="bi bi-trash"></i>
          </a>
        </div>
        <div class="float-right">
          <a class="btn btn-warning" @click="addEditStrategy()">
            <i
              class="bi"
              :class="this.isNameEdit ? 'bi-save' : 'bi-pencil'"
            ></i>
            Edit Strategy
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import TradeAddEdit from "./TradeAddEdit";
export default {
  name: "StrategyDetail",
  components: { TradeAddEdit },
  props: { PropStrategy: { type: Object } },
  methods: {
    ...mapActions(["AddEditStrategy", "DeleteStrategy"]),
    addEditStrategy() {
      this.isNameEdit = !this.isNameEdit;
      if (!this.isNameEdit && this.PropStrategy.name) {
        this.AddEditStrategy(this.PropStrategy);
      }
    },
    deleteStrategy() {
      this.DeleteStrategy({ _id: this.PropStrategy._id });
    },
    bindAddEditTrade(){
      this.BindAddEditTrade(this.PropStrategy);
    }
  },
  created: function () {
    // this.PropTrade =   {
    //     BuyOrSell: "Sell",
    //     Type: "Put",
    //     SelectedStrikePrice: 16300,
    //     SpotPrice: 50,
    //   }
  },
  data: function () {
    return {
      isNameEdit: false,
    };
  },
};
</script>
