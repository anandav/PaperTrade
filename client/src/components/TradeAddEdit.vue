<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <div class="row">
        <div class="form-group col-2">
          <label>Example label</label>
          <div class="btn-group btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-outline-danger   active">
              <input type="radio" name="options" id="option1" checked /> Sell
            </label>
            <label class="btn btn-outline-success ">
              <input type="radio" name="options" id="option2" /> Buy
            </label>
          </div>
        </div>
        <div class="form-group col-3">
          <label>Test label</label>
          <div class="btn-group btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-outline-secondary   active">
              <input type="radio" name="options" id="option1" checked /> Call
            </label>
            <label class="btn btn-outline-secondary ">
              <input type="radio" name="options" id="option2" /> Put
            </label>
            <label class="btn btn-outline-secondary ">
              <input type="radio" name="options" id="option3" /> Future
            </label>
          </div>
        </div>
        <div class="form-group col-3">
          <label for="formControlRange">Strike Price</label>
          <input
            type="range"
            v-bind:min="9000"
            v-bind:max="12000"
            step="50"
            v-bind:value="this.myrangeValue"
            class="form-control-range"
            id="formControlRange"
          />
        </div>
        <div class="form-group col-2">
          <label for="">Price</label>
          <input
            type="text"
            class="text form-control"
            v-model="this.getLatestPrice"
          /><input
            type="text"
            class="text form-control"
            v-model="this.myrangeValue"
          />
        </div>
        <div class="form-group  col-2">
          <label for="">Action</label>
          <div class="btn-group">
            <button class="btn btn-outline-primary">Save</button>
            <button class="btn btn-outline-danger">Clear</button>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "TradeAddEdit",
  // prop : [myrangeValue],
 data(){return {myrangeValue : 10000}
 },
  methods: { ...mapActions(["GetInstrumentDetail"]) },
  created() {
    this.GetInstrumentDetail();
  },
  computed: {
    ...mapGetters(["getLatestPrice"]),
  },
};
</script>
<style scoped>
.btn.focus {
  outline: none !important;
  box-shadow: none !important;
}
.form-control-range {
  height: 35px;
}
</style>
