<template>
  <div
    class="min-h-screen mt-16 border-r border-gray-300 dark:border-gray-800 "
    role="menu"
    @dragover.prevent
    @dragenter.prevent
  >
    <div class="flex items-center mt-5 invisible sm:visible">
      <div>
        <input
          class="
            px-1
            py-2
            ml-2
            w-48
            bg-gray-200
            dark:bg-gray-600
            focus:outline-none
            rounded
          "
          :placeholder="txtAddNewPortfolio"
          v-model="portfolioName"
          @keyup.enter="onAddNewPortfolio()"
        />
      </div>
    </div>
    <div class="mt-5 " @drop="onDrop($event)">
      <!-- <div class="">
        <div v-show="isLoading" class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div> -->
      <div
        class="   border-b border-gray-200 dark:border-gray-800 "
        draggable="true"
        v-for="(item, index) in Portfolios"
        :key="item._id"
        :data-order="item.order"
       
        :data-id="item._id"
        :class="{ isPortfolioEdit: item == editPortfolio }"
        @dragover="onDragOver($event, index)"
        @dragstart="onDragStart($event, item, index)"
      >
        <div
          class=" leading-10 rounded-sm cursor-pointer "
          role="menuitem"
          tabindex="0"
          @click="onMenuSelectedPortfolio(item)"
          @keydown.enter="onMenuSelectedPortfolio(item)"
          @keydown.f2="onInlineEditPortfolio(item)"
         
          :class="{
            'border-l-2  border-yellow-500':
              Portfolio && item._id == Portfolio._id,
          }"
        >
          <div class="p-2" tabindex="0">
            <div class="inline-block">
              <div
                class="view"
                :class="{
                  'font-black': Portfolio && item._id == Portfolio._id,
                }"
              >
                <svg
                  class="
                    inline-block
                    cursor-move
                    pb-1
                    view
                    fill-current
                    text-gray-400
                    dark:text-gray-500
                  "
                  width="10"
                  height="15"
                  viewBox="0 0 2 5"
                  version="1.1"
                >
                  <path
                    id="rect2026"
                    style=""
                    d="M 1.7134726,6.3056817 H 2.4866974 V 7.0479501 H 1.7134726 Z m -1.48504562,0 H 1.0016518 V 7.0479501 H 0.22842698 Z M 1.7134726,5.1017156 H 2.4866974 V 5.8439839 H 1.7134726 Z m -1.48504562,0 H 1.0016518 V 5.8439839 H 0.22842698 Z M 1.7067486,3.9151924 H 2.4799734 V 4.6574607 H 1.7067486 Z m -1.48504561,0 H 0.99492782 V 4.6574607 H 0.22170299 Z M 1.7067486,2.7112265 H 2.4799734 V 3.4534948 H 1.7067486 Z m -1.48504561,0 H 0.99492782 V 3.4534948 H 0.22170299 Z M 1.704524,1.4995462 H 2.4777489 V 2.2418146 H 1.704524 Z m -1.48504551,0 H 0.99270332 V 2.2418146 H 0.21947849 Z M 1.704524,0.29558012 H 2.4777489 V 1.0378485 H 1.704524 Z m -1.48504551,0 H 0.99270332 V 1.0378485 H 0.21947849 Z"
                  />
                </svg>

                {{ item.name }}
              </div>
              <input
                class="
                  edit
                  ml-2
                  pl-2
                  py-1
                  bg-gray-200
                  dark:bg-gray-700
                  focus:outline-none
                  rounded
                "
                placeholder="Edit Portfolio Name"
                type="text"
                v-model="item.name"
                @keyup.enter="onInlineSavePortfolio(item)"
              />
            </div>
            <!-- <div class="float-right ">
            <div class="space-x-1">
              <a class="btn tooltip view " @click="onInlineEditPortfolio(item)">
                <i class="material-icons">edit</i>
                <tooltip Value="Edit" />
              </a>
              <a class="btn edit tooltip " @click="onInlineSavePortfolio(item)">
                <i class="material-icons">save</i>
                <tooltip Value="Save Portfilio" />
              </a>
              <a
                class="btn ml-2 tooltip text-red-700 dark:text-red-700 "
                @dblclick="onDeletePortfolio(item)"
              >
                <i class="material-icons">delete</i>
                <tooltip Value="Delete Portfilio" />
              </a>
            </div>
          </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "PortfolioMenu",
  methods: {
    ...mapActions({
      GetAllPortfolios: "portfolioModule/GetAllPortfolios",
      GetPortfolioById: "portfolioModule/GetPortfolioById",
      SavePortfolio: "portfolioModule/SavePortfolio",
      SaveAllPortfolio: "portfolioModule/SaveAllPortfolio",
      DeletePortfolio: "portfolioModule/DeletePortfolio",
      GetAllStrategies: "strategyModule/GetAllStrategies",
    }),
    onMenuSelectedPortfolio: function (item) {
      this.GetPortfolioById(item);
      this.GetAllStrategies(item);
    },
    onAddNewPortfolio: function () {
      if (this.portfolioName) {
        this.SavePortfolio({
          _id: 0,
          name: this.portfolioName,
          exchange: "NSE",
          description: "",
          updateui: true,
        });
        this.portfolioName = "";
      }
    },

    onDragStart: function (e) {
      console.clear();
      ///Ref:// https://github.com/WebDevSimplified/Drag-And-Drop
      const row = e.target;
      row.classList.add("dragging");
    },
    onDragOver: function (e) {
      const row = e.target.parentElement.parentElement;
      if (row.classList.contains("table-row")) {
        const container = row.parentElement;
        const afterElement = this.getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector(".dragging");
        if (afterElement == null) {
          container.appendChild(draggable);
        } else {
          container.insertBefore(draggable, afterElement);
        }
      }
    },
    onDrop: function (e) {
      e.preventDefault();
      const row = document.querySelector(".dragging");
      row.classList.remove("dragging");
      const tableRowsGroup = row.closest(".table-row-group");
      const tableRows = tableRowsGroup.querySelectorAll(".table-row");
      let i = 0;
      tableRows.forEach((row) => {
       console.log("row :>> ", row);
        this.Portfolios.forEach((y) => {
          const x = row.getAttribute("data-id");
          if (x == y._id) {
            y.order = i;
          }
        });
        i += 1;
      });
      this.SaveAllPortfolio(this.Portfolios);
    },
    getDragAfterElement: function (container, y) {
      const draggableElements = [
        ...container.querySelectorAll(".table-row:not(.dragging)"),
      ];

      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    },
  },
  data: function () {
    return {
      portfolioName: "",
      txtAddEditPortfolio: this.$getConst("savePortfolio"),
      txtAddNewPortfolio: this.$getConst("addNewPortfolio"),
      isLoading: true,
      editPortfolio: null,
    };
  },

  mounted() {
    this.GetAllPortfolios().then(() => {
      this.isLoading = false;
    });
  },
  computed: {
    ...mapGetters({
      Portfolio: "portfolioModule/Portfolio",
      Portfolios: "portfolioModule/Portfolios",
    }),
  },
};
</script>
<style scoped>
[v-cloak] {
  display: none;
}
.form-control {
  width: 200px;
}
.edit {
  display: none;
}
.isPortfolioEdit .edit {
  display: inline-block;
}
.isPortfolioEdit .view {
  display: none;
}
</style>
