/**
 * [控件基于jquery2.x 及underscorejs ]
 * @param  {[type]} $      [description]
 * @param  {[type]} window [description]
 * @return {[type]}        [description]
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
			width:"100%",
			height:"100%",
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
			_tem:'<div class="modal fade" id="id_<%=id%>">'
				 +	'<div class="modal-dialog">'
				 +	 	'<div class="modal-content">'
      			 +			'<div class="modal-header">'
      			 +				'<button type="button" class="close" data-dismiss="modal">'
      			 +					'<span aria-hidden="true">&times;</span>'
      			 +				'</button>'
      			 +				'<h4 class="modal-title"><%=title%></h4>'
      			 +			'</div>'
      			 +			'<div class="modal-body"><%=content%>'
      			 +			'</div>'
      			 +			'<div class="modal-footer"><%=button%>'
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
		iss["list"][_opt.id]=th._dom = $(_.template(_opt._tem)({title:_opt.title,id:_opt.id,content:_opt.content,button:_opt.Button})).appendTo("body .container");
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
				str+='<button type="button" class="btn btn-primary btn-ok" data-dismiss="modal">'+_opt.okVal+'</button>'
			}
			if(_opt.cancelVal){
				str+='<button type="button" class="btn btn-default btn-cancel" data-dismiss="modal">'+_opt.cancelVal+'</button>'
			}
			if(_opt.button){
				_opt.button.map(function(key,ind){
					
				    str+='<button type="button" data-ind="'+ind+'" class="btn btn-default btn-it-default" '+key["disabled"]+'  data-dismiss="modal" >'+key.name+'</button>'
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
 //iss 页面统一调用接口
	_.extend(iss,{
		dialog:function(arg){ new Dialog(arg)},
		alert:Alert,
		confirm:Confom
	});
	
// 页面统一调用入口
	
	$(function(){
		$doc.on("mousedown",".iss-placeholder",function(){
			var th = $(this);
			(th.hasClass("iss-placeholder"))&&(!function(){
				th.removeClass("iss-placeholder").val("").focus();
			}());
		})
	})
	
//公共函数
	
}(jQuery,window)