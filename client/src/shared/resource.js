const Resource = {
	addNewPortfolio: "Add New Portfolio",
	savePortfolio: "Save Portfolio",
	addNewStrategy: "Add New Strategy",
	editStrategy: "Edit Strategy",
	saveStrategy: "Save Strategy",
	addTrade : "Add New Trade"
};

Resource.install = function (Vue) {
	Vue.prototype.$getConst = (key) => {
		return Resource[key];
	}
};
export default Resource;
