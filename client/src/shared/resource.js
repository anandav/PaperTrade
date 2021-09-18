const Resource = {
	addNewPortfolio: "New Portfolio",
	savePortfolio: "Save Portfolio",
	addNewStrategy: "New Strategy",
	editStrategy: "Edit Strategy",
	saveStrategy: "Save Strategy",
	duplicateStrategy : "Duplicate Strategy",
	addTrade : "New Trade",
	showStrategyDiagram : "Strategy Graph",
};

Resource.install = function (Vue) {
	Vue.prototype.$getConst = (key) => {
		return Resource[key];
	}
};
export default Resource;
