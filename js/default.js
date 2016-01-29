/**
 * [控件基于jquery2.x 及underscorejs ]
 * @param  {[type]} $      [description]
 * @param  {[type]} window [description]
 * @return {[type]}        [description]
 *1、 iss.dialog({
 *      id:"id",//弹窗id非必需   在iss.list["id"].show();回掉显示该内容
 *      url:"http://www.baidu.com", //如果设置url则不需要设置content
 * 		title:"提示消息",
 * 		width:"400px",
 * 		height:"200px",
 * 		background:"#fff",//背景色
 * 		okVal:"确认或false",//默认显示    如果调整为false则不显示确认按钮
 * 		ok:function(){},//点击确认按钮后回掉
 *      cancelVal:"取消或false",//默认显示    如果调整为false则不显示取消按钮
 * 		cancel:function(){},//点击取消按钮后回掉
 * 		button:[{name:"自定义button",callback:function(){},disabled:""}], //name:"自定义按钮名称",callback:回掉函数,disabled:是否禁用
 * 		Load:"function(){}" ,//显示窗口后回掉
 * 		Close:function(){},//关闭窗口回掉函数
 * 		})
 * 1、 iss.alert("提示内容")
 * 2、 iss.alert("提示内容",function(){}) //确认后回掉
 *
 * 1、 iss.confirm("confirm",function(){},function(){})   // 你懂的
 */

;~function($,window){
	var $win = $(window),
		$doc = $(document);
	
	var iss = window["iss"] = {
		list:{}
	};
	function Dialog(opt){
		var th = this,
			_opt = {
			title:"标题",
			width:"600px",
			height:"400px",
			background:"rgba(0,0,0,0.7)",
			content:"显示内容",
			url:"",
			ok:$.noop,
			cancel:$.noop,
			okVal:"确认",
			cancelVal:"取消",
			button:null, //[{name:"",callback:"",disabled:""}]
			Button:null,
			id:new Date().getTime(),
			Load:$.noop,
			Close:$.noop,
			_tem:'<div class="modal" id="id_<%=id%>" style="min-width:<%=width%>;mins-height:<%=height%>;">'
				 +	'<div class="modal-dialog">'
				 +	 	'<div class="modal-content">'
      			/* +			'<div class="modal-header">'
      			 +				'<button type="button" class="close" data-dismiss="modal">'
      			 +					'<span aria-hidden="true">&times;</span>'
      			 +				'</button>'
      			 +				'<h4 class="modal-title"><%=title%></h4>'
      			 +			'</div>'*/
      			 +			'<div class="modal-body"><%=title%><div class="modal-txt"><%=content%></div>'
      			 +			'</div>'
      			 +			'<div class="modal-footer"><table width="100%"><tr><%=button%></tr></table>'
      			 +			'</div>'
      			 +		'<div>'
				 +	'</div>'
			     + '</div>'
		}
		$.extend(_opt,opt);
		if(_opt.url){
			_opt.content = '<iframe allowtransparency="true"  src="' + _opt["url"] + '"  width="100%" style="height:100%" frameborder="no" ></iframe>'
		}
		th.Clear();
		
		_opt = th.setButton(_opt);
		//console.log(_opt);
		iss["list"][_opt.id]=th._dom = $(_.template(_opt._tem)({title:'<h4 class="modal-title">'+_opt.title+'</h4>',id:_opt.id,content:_opt.content,button:_opt.Button,width:_opt.width,height:_opt.height})).appendTo("body .container");
		th._dom.on("shown.bs.modal",_opt.Load)
				 .on("hidden.bs.modal",_opt.Close)
				 .on("click.modal",".btn-ok,.btn-cancel,.btn-it-default",_opt,th.Event)
				 .modal({'show':true, 'keyboard': false,backdrop:"static"});
		return th._dom;
	}
	
	Dialog.prototype = {

		Clear:function(arg){
			if(_.has(iss.list,arg)){
                iss.list[arg].remove(); //清除数据
                delete  iss.list[arg];//清除内存
			}
		},
		setButton:function(_opt){
			var str = "";
			if(_opt.okVal){

				str+='<td><button type="button" class="btn btn-primary btn-ok" data-dismiss="modal">'+_opt.okVal+'</button></td>'
			}
			if(_opt.cancelVal){
				str+='<td><button type="button" class="btn btn-default btn-cancel" data-dismiss="modal">'+_opt.cancelVal+'</button></td>'
			}
			if(_opt.button){
				_opt.button.map(function(key,ind){
					
					str+='<td><button type="button" data-ind="'+ind+'" class="btn btn-default btn-it-default" '+key["disabled"]+'  data-dismiss="modal" >'+key.name+'</button></td>'
				})
			}
			_opt.Button = str;
			return _opt;
		},
		Event:function(ev){
			var th = $(this);
				da = ev.data;
			if(th.hasClass("btn-ok")){
				da["ok"]();//执行ok回调
				//da["Close"]();//关闭回调
			}
			if(th.hasClass("btn-cancel")){
				da["cancel"]();//执行cancel回调
				//da["Close"]();//关闭回调
			}
			if(th.hasClass("btn-it-default")){
				var ind = th.attr("data-ind");
				//console.log(da);
				(da.button[ind]["callback"]) && ( da.button[ind]["callback"]() ); //callback回调
				//da["Close"]();//关闭回调
			}
		}
	}
	//弹出窗口
	function Alert(arg,callback){
		//console.log(this.constractor)
		var _opts = {
				title:"提示",
				content:"没有需要提示的内容！",
				cancelVal:false,
				Close:$.noop
		}
		if(_.isObject(arg)){
			_.extend(_opts,arg);
		}else if(_.isString(arg)){
			_opts.content = arg
		}
		if(callback){ _opts.Close = callback; }
		this.dialog(_opts);
	}
	function Error(arg,callback){
		var _opts = {
				title:"失败",
				content:"没有需要提示的内容！",
				cancelVal:false,
				Close:$.noop
		}
		if(_.isObject(arg)){
			_.extend(_opts,arg);
			
		}else if(_.isString(arg)){
			_opts.content = arg
		}
		if(callback){ _opts.Close = callback; }
		_opts.title = "<img src='image/min/error.png' width='44' height='44' /><span>"+_opts.title+"</span>";
		this.dialog(_opts);
	}
	function Success(arg,callback){
			var _opts = {
				title:"成功",
				content:"没有需要提示的内容！",
				cancelVal:false,
				Close:$.noop
		}
		if(_.isObject(arg)){
			_.extend(_opts,arg);
			
		}else if(_.isString(arg)){
			_opts.content = arg
		}
		if(callback){ _opts.Close = callback; }
		_opts.title = "<img  src='image/min/sucess.png' width='44' height='44' ><span>"+_opts.title+"</span>";
		this.dialog(_opts);
	}
	function Confom(content,ok,cancel){
		var _opts = {
				title:"提示",
				content:"没有需要提示的内容！",
				ok:$.noop,
				cancel:$.noop
				
		}
		if(_.isObject(content)){
			_.extend(_opts,content);
		}else if(_.isString(content)){
			_opts.content = content
		}
		if(ok){ _opts.ok = ok; }
		if(cancel){_opts.cancel = cancel}
		this.dialog(_opts);
	}
	
	//浮动
	/*
		iss.float({
		    	content:"<ul class='DRC-select'><li>男</li><li>女</li></ul>", 
		    	cancelVal:"取消",                                             
		    	cancel:function(){ alert("取消")},
		    	okVal:"确定",
		    	ok:function(){alert("确定")},
		    	button:[{name:"自定义",callback:function(){alert("自定义")}}]


		    })
	 */
	function Float(arg){
		this.remove();
		var opt ={
			content:"",
			button:false,//[{name:"自定义",callback:$.noop},{name:"2",callback:$.noop}],
			ok:$.noop,
			okVal:false,
			cancel:$.noop,
			cancelVal:"取消"
		},
		_mod = '<section class="iss-Float"><div class="iss-Float-Box"><div class="iss-Float-content"><%=content%></div><footer class="iss-Float-button"><%=Button%></footer></div></section>';
		_.extend(opt,arg);
		this.create(opt,_mod);
	}
	Float.prototype ={
		create:function(opt,_mod){
			var btn = "",
				_opt={},
				_this = this;
			  if(opt.okVal){
			  		btn+='<a href="javascript:;" class="btn btn-warning J_issFloatBtn" data-num="ok">'+opt.okVal+'</a>'
				}
			  if(opt.cancelVal){btn+='<a href="javascript:;" class="btn btn-default J_issFloatBtn" data-num="cancel">'+opt.cancelVal+'</a>' }
			  if(opt.button){
			  	opt.button.forEach(function(key,ind){
			  		btn+='<a href="javascript:;" class="btn btn-default J_issFloatBtn" data-num="'+(ind+1)+'">'+key.name+'</a>';
			  	})
			  }
			  _opt["content"] = opt.content;
			  _opt["Button"]=btn;
			  _opt["origin"] = opt;
			  _opt["_this"] = _this;
			  $(_.template(_mod)(_opt))
			  .appendTo("body")
			  .on("touchend.DRC",".J_issFloatBtn",_opt,this.Event_Float)
			  .bind("touchend.DRC_SELF",_opt,this.Event_remove);
			  
			  
		},
		Event_Float:function(ev){

			var th = $(this),
				da = ev.data,
			    attr = th.attr("data-num");
		
			    //console.log(da);
			    if(th.hasClass("J_issFloatBtn")){
			    	var index = parseInt(attr)
			    	if(!index&&attr=="ok"){ ;~(da.origin.ok)(); }
			    	if(!index&&attr=="cancel"){;~(da.origin.cancel)();}
			    	if(index){
			    		;~(da.origin.button[index-1].callback)();
			    	}
			    	da._this.remove();
			    }
		},
		Event_remove:function(ev){
		       var closeE = $(ev.target).is(".iss-Float")
				if(closeE){
                   ev.data._this.remove();
				}
		},
		remove:function(){
			     
				$(".iss-Float").remove().off("touchend.DRC").unbind("touchend.DRC_SELF");//清理页面
			
		}
		
	}//proto

 //iss 页面统一调用接口
	_.extend(iss,{
		dialog:function(arg){return new Dialog(arg)},
		alert:Alert,
		Error:Error,
		Success:Success,
		confirm:Confom,
		float:function(arg){return new Float(arg)}
		
	});
	
// 页面统一调用入口
	
	$(function(){
		$doc.on("touchstart",".iss-placeholder,.J_Event_Select",function(){
			var th = $(this);
			(th.hasClass("iss-placeholder"))&&(!function(){
				if(th.nodeName=="textarea"){th.removeClass("iss-placeholder").html("").focus();;return;}
				th.removeClass("iss-placeholder").val("").focus();
			}());

		})
	})
	
//公共函数
	
}(jQuery,window)

 // 对Date的扩展，将 Date 转化为指定格式的String 
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
    // 例子： 
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
    window.Date.prototype.Format = function (fmt) { //author: meizz 
        (!fmt) && (fmt = "yyyy-mm-dd");
        var o = {
            "M+": this.getMonth() + 1,                 //月份 
            "d+": this.getDate(),                    //日 
            "h+": this.getHours(),                   //小时 
            "m+": this.getMinutes(),                 //分 
            "s+": this.getSeconds(),                 //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds()             //毫秒 
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    window.String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
        if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
            return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
        } else {
            return this.replace(reallyDo, replaceWith);
        }
    }
    //字符串截取
    window.String.prototype.overflow = function (int, replace, title) {
        var str = this.toString(),
            len = int || str.length,
            re = replace || "...",
            ti = title || str;
            
        txt = '<span title="' + str + '">' + str.substr(0, len) + (str.length <= int ? "" : re) + '</span>'
            return txt;
            
    }

    window.Number.prototype.FormatThousand = function (cent) {
        var num = this.toString().replace(/\$|\,/g, '');
        if (isNaN(num))//检查传入数值为数值类型.
            num = "0";
        if (isNaN(cent))//确保传入小数位为数值型数值.
            cent = 0;
        cent = parseInt(cent);
        cent = Math.abs(cent);//求出小数位数,确保为正整数.

        sign = (num == (num = Math.abs(num)));//获取符号(正/负数)
        //Math.floor:返回小于等于其数值参数的最大整数
        num = Math.floor(num * Math.pow(10, cent) + 0.50000000001);//把指定的小数位先转换成整数.多余的小数位四舍五入.
        cents = num % Math.pow(10, cent); //求出小数位数值.
        num = Math.floor(num / Math.pow(10, cent)).toString();//求出整数位数值.
        cents = cents.toString();//把小数位转换成字符串,以便求小数位长度.
        while (cents.length < cent) {//补足小数位到指定的位数.
            cents = "0" + cents;
        }

        //对整数部分进行千分位格式化.
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
            num = num.substring(0, num.length - (4 * i + 3)) + '’' +
            num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents);
    }

    window.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = location.search.substr(1).match(reg);
        if (r != null) return unescape(decodeURI(r[2])); return null;
    }


    window.getDateTime = function (str) {
        if (str != null && str != "" && str != undefined) {
            var d = new Date(parseInt(str.replace("/Date(", "").replace(")/", ""), 10));
            var time = '';
            var month = parseInt((d.getMonth() + 1)) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
            var day = parseInt(d.getDate()) < 10 ? '0' + d.getDate() : d.getDate();
            var hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
            var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
            var seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
            time = d.getFullYear() + '-' + month + '-' + day + ' ' + hours + ":" + minutes + ":" + seconds;
            return time;
        } else {
            return "";
        }
    }