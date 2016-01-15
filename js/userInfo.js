define(function(require, exports, module) {
	//找店页面公用js
  	require.async("../js/default.js",function(){


  		
  		var doc = $(document),
  			day = $(".J_Event_day"),
  			d_txt=$("#info-day");
  			day.datepicker({format: 'yyyy-mm-dd'})
  			   .on('changeDate.datepicker.amui', function(ev) { //修改完日期后应该回掉
                         //console.log(ev.date);
  			   			d_txt.html(new Date(ev.date.valueOf()).Format("yyyy-MM-dd"));

                     
  			   });
				doc.on("touchend",".J_Event_sex,.J_Event_img",function(){
					var th = $(this);

						if(th.hasClass("J_Event_sex")){ //点击性别
						
								iss.float({
									content: "<ul class='DRC-select'><li>男</li><li>女</li></ul>",
									cancelVal: "取消",
									cancel: function() {
										//setVal(th,"#info-sex",)
									}
								
								})
						}

					if(th.hasClass("J_Event_img")){ //点击图像

						iss.float({
									content: "<ul class='DRC-select'><li>拍照</li><li>从相册选择</li></ul>",
									cancelVal: "取消",
									cancel: function() {
										
									}
								
								})

					}

					

					
				})

  	});//引入弹出
	module.exports={
		
	}
	

	function setVal(th,id,val){
		th.siblings().removeClass("on");
		th.addClass("on");
		$(id).html(val);
	}

	
})//end