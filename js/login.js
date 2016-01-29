define(function(require, exports, module) {
	//找店页面公用js

	module.exports={
		//DRC_SELECT:Event_select
		  DRC_getphone:DRC_getphone
	}

	function DRC_getphone(){
           
		$(document).on("touchend",".DRC_getPhone",function(){
			var th = $(this);

			if(th.hasClass("DRC_getPhone")){
				var tt = th.hide(0)
				  			  .next(".DRC_time")
				  			  .show(0);

				  var setT = 59, //初始化时间
				  	  times = tt.find(".time_mm"),
				  	  setTimeFun = function(arg){
				  	  	 if(arg<0){
				  	  	 	tt.hide(0)
				  	 	  	  .prev(".DRC_getPhone")
				  	 	      .show(0);
				  	  	 	return;
				  	  	 }
				  	  	 
						  times.html(arg--); 
						  var setTimeFun = arguments.callee;
						  setTimeout(function(){ setTimeFun(arg--); },1000)
				  	  }(setT);

				  


			}
		})
	}
	
})//END