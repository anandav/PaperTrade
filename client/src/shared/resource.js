const Resource = {
	addNewPortfolio: "New Portfolio",
	savePortfolio: "Save Portfolio",
	deletePortfolio: "Delete Portfolio",
	addNewStrategy: "New Strategy",
	editStrategy: "Edit Strategy",
	deleteStrategy: "Delete Strategy",
	saveStrategy: "Save Strategy",
	duplicateStrategy: "Duplicate Strategy",
	mergeStrategy: "Merge Strategy",
	moveStrategy: "Move Strategy",
	addTrade: "New Trade",
	editTrade : "Edit Trade",
	saveTrade : "Save Trade",
	exitTrade : "Exit Trade",
	deleteTrade : "Delete Trade",
	showStrategyDiagram: "Update Graph",
	getLiveData : "Get Live Data",
};

Resource.install = function (Vue) {
	Vue.prototype.$getConst = (key) => {
		return Resource[key];
	}
};
export default Resource;
