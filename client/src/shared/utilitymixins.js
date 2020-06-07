var utilitymixins = {
  methods: {
    foo: function() {
      console.log("foo");
    },
    conflicting: function() {
      console.log("from mixin");
    },
    ThisWeekExpiryDate: function() {
        var fromDate = new Date();
        var daystoNextThursday = (4-fromDate.getDay())%7;
        if(daystoNextThursday < 0){
            daystoNextThursday = daystoNextThursday + 7;
        }
        fromDate.setDate(fromDate.getDate() + daystoNextThursday);
        return fromDate;
    },
    NextWeekExpiryDate : function(){
        var nextExpryDate = this.ThisWeekExpiryDate();
        nextExpryDate.setDate(nextExpryDate.getDate() + 7);
        return nextExpryDate();
    }
  },
};
