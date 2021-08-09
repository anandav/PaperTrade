<template>
  <div class="card mb-2 bg-grey-custom">
    <!-- @click="SelectedStrategy(PropStrategy)" -->
    <div class="card-header">
      <div class="d-flex">
        <div class="p-2 align-self-center">
          <h5 v-show="!this.isNameEdit">{{ PropStrategy.name }}</h5>
          <input
            class="form-control"
            v-show="this.isNameEdit"
            v-model="PropStrategy.name"
          />
        </div>

        <div class="p-2">
          <a class="btn btn-warning" @click="addEditStrategy()">
            <i
              class="bi"
              :class="this.isNameEdit ? 'bi-save' : 'bi-pencil'"
            ></i>
          </a>
          <a class="btn btn-danger ml-2" @click="deleteStrategy()">
            <i class="bi bi-trash"></i>
          </a>
        </div>
        <div class="p-2 ml-auto">
          {{ PropStrategy.symbol }}
        </div>
        <div class="ml-auto p-2">
          <h5 class="float-right">
            Created On:
            {{ PropStrategy.CreatedOn }}
          </h5>
        </div>
      </div>
    </div>

    <div class="card-body">
      <ul v-if="PropStrategy.trades" class="list-group list-group-flush">
        <li
          :key="Trade._id"
          v-for="Trade in PropStrategy.Trades"
          class="list-group-item"
        >
          <button
            class="btn btn-dark"
            @click="deleteTrade(PropStrategy, Trade)"
          >
            {{ Trade.Name }}
          </button>
        </li>
      </ul>
      <div class="TradeAddEditPlaceholder">
        <TradeAddEdit
          v-if="this.isAddEditTrade"
          :ParentStrategy="PropStrategy"
        />
      </div>
    </div>
    <div class="card-footer text-dark">
      <div class="col-lg-12">
        <a class="btn btn-warning float-right" @click="addEditTrade()">
          <i class="bi bi-plus-square"></i>
          <!-- <i v-show="isEdit" class="bi bi-save"></i> -->
          Add New Trade
        </a>
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
    ...mapActions([
      "AddEditStrategy",
      "AddEditTrade",
      "DeleteStrategy",
      "RemoveTrade",
    ]),
    addEditStrategy() {
      this.isNameEdit = !this.isNameEdit;
      if (this.isNameEdit) {
        console.log("Edit clicked");
      } else {
        console.log("Save clicked");
        this.AddEditStrategy(this.PropStrategy);
      }
    },
    deleteStrategy() {
      this.DeleteStrategy({ _id: this.PropStrategy._id });
    },
    addEditTrade() {
      this.isAddEditTrade = !this.isAddEditTrade;
    },
    deleteTrade(_strategy, _trade) {
      this.RemoveTrade({ _strategy, _trade });
    },
  },
  created: function () {
    //this.isNameEdit =  this.PropStrategy.isNameEdit;
    //console.log("created");
  },
  data: function () {
    return {
      isAddEditTrade: false,
      isNameEdit: false,
    };
  },
};
</script>
