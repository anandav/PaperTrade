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
          <div class="col-sm border-right">
            placehosder
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
          </div>

          <div class="col-sm">
            testging
            <TradeAddEdit
              v-if="this.isAddEditTrade"
              :ParentStrategy="PropStrategy"
            />
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
          <a class="btn btn-warning ml-2" @click="addEditTrade()">
            <i class="bi bi-plus-square"></i>
            Add New Trade
          </a>

          <button
            type="button"
            class="btn btn-primary"
            data-toggle="modal"
            data-target="#exampleModal"
          >
            Launch demo modal
          </button>
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
    ...mapActions([
      "AddEditStrategy",
      "AddEditTrade",
      "DeleteStrategy",
      "RemoveTrade",
    ]),
    addEditStrategy() {
      this.isNameEdit = !this.isNameEdit;
      if (!this.isNameEdit && this.PropStrategy.name) {
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
