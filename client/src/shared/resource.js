const Resource = {
	addNewPortfolio : "Add New Portfolio",
	savePortfolio : "Save Portfolio"
};

Resource.install = function(Vue){
	Vue.prototype.$getConst= (key)=> {
		return Resource[key];	
	}
};
export default Resource;
