<template>
  <!-- @click="SelectedStrategy(PropStrategy)" -->
  <div>
    <div class="card mb-2 bg-grey-custom">
      <div class="card-header">
        <div class="d-flex justify-content-between bd-highlight">
          <div class="">
            <span v-show="!this.isNameEdit">
              {{ PropStrategy.name }}
            </span>

            <input
              class="form-control"
              placeholder="Strategy Name"
              v-show="this.isNameEdit"
              v-model="PropStrategy.name"
              @keydown.enter="addEditStrategy()"
            />
          </div>

          <div class="" v-if="!PropStrategy.ismultiplesymbol">
            <span v-show="!this.isNameEdit">
              {{ PropStrategy.symbol }}
            </span>

            <input
              class="form-control"
              placeholder="Symbol"
              v-show="this.isNameEdit"
              v-model="PropStrategy.symbol"
              @keydown.enter="addEditStrategy()"
            />
          </div>
          <div class="">
            <label>
              <input
                type="checkbox"
                v-model="PropStrategy.ismultiplesymbol"
                @click="addEditStrategy()"
              />
              Is Multiple Symbol
            </label>
          </div>
          <div class="">
            Created On:
            {{ PropStrategy.CreatedOn }}
          </div>
        </div>
      </div>

      <div class="card-body text-dark">
        <div class="row">
          <TradeList :PropStrategy="PropStrategy" />
        </div>
        <div class="row">
          <TradeAddEdit
            :StrategyID="PropStrategy._id"
            :PropStrategy="PropStrategy"
          />
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
import TradeList from "./TradeList";
export default {
  name: "StrategyDetail",
  components: { TradeAddEdit, TradeList },
  props: { PropStrategy: { type: Object }, PropTrade: { type: Object } },
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
  },
  created: function () {},
  data: function () {
    return {
      isNameEdit: false,
    };
  },
};
</script>
