function UnitCanvas(data,element,placeName,detailSum){
	var data = data;
	var sum,
		deg = 0, //转过了多少角度
		angle = 0;
	var port = {  //求偏移量
		aa:0,
		bb:0
	};
	var colorArray=[
		'#FF4B4B',
		'#42CA82',
		'#428BCA',
		'#FF8A00',
		'#C88BE0',
		'#90CAF9'
	];
	function canvas (arg,ind){
		var x = 150,
			y = 150,
			r = 100;
		var current = {
			X:0,
			Y:0
		};
		var point;
		if(arg<=0){
		    return false;
		}
		var adeg = deg + arg/sum * 2*Math.PI/2;
		angle = deg + arg/sum * 2*Math.PI;

		point = portMove(x,y,2,adeg);
		console.log(point);

		current.X = point.x;
		current.Y = point.y;
		var canvas = document.querySelector(element);
		var ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(current.X,current.Y);
		
		ctx.arc(current.X,current.Y,r,deg,angle);
		if(ind<5){
			ctx.fillStyle = colorArray[ind];
		}else{
			ctx.fillStyle = colorArray[colorArray.length-1];
		}
		ctx.fill();	
		ctx.closePath();
		
//		ctx.beginPath();
//		ctx.fillStyle="rgb(0,0,0)";
//		ctx.font="12px Arial";
//		ctx.fillText(placeName[ind],(current.X-x)*60+x,(current.Y-y)*65+y);
//		ctx.closePath();
		
		ctx.beginPath();
		ctx.moveTo((current.X-x)*30+x,(current.Y-y)*30+y);
		ctx.lineTo((current.X-x)*60+x,(current.Y-y)*60+y);
		ctx.strokeStyle="#ff0000";
		ctx.stroke();
		ctx.closePath();
		deg += arg/sum * 2*Math.PI;
		var moveX,
        moveY,
        suf;
		
        switch (element){
            case ".circle-shop":
                moveX = 0;
                moveY = 37;
                suf = '人次';
                break;
            case ".circle-cost":
                moveX = 339;
                moveY = 37;
                suf = '元';
                break;
            case ".circle-book":
                moveX = 678;
                moveY = 37;
                suf = '单';
                break;
                
        }
		var classname = element.replace(/./,'');
		var pct = Math.round(data[ind]/detailSum*1000)/10 + '%';
		var textContent = textFill(placeName[ind],classname,ind,data[ind],pct,suf);
		
		$(".circle-chart").append(textContent);
		console.log($(element+ind));
		
		var rotdeg = adeg/Math.PI*180;
		if(rotdeg>=180){
		    rotdeg -=180;
		}
		$((element+ind).replace(/./,"#")).css({
		   left:(current.X-x)*60+x+moveX+"px",
		   top:(current.Y-y)*60+y+moveY+"px"
		});
		console.log((current.X-x)*60+x+moveX);
		console.log((current.Y-y)*60+y+moveY);
	};
	function textFill(arg,classname,ind,del,pct,suf){
	    var box = "";
	    box += '<div class="canvas-text" id="'+classname+ind+'">'+del+suf+'<br/>'+pct+'<br/>'+arg+'</div>';
	    return box;
	}
	function arraySum(){
		var sum = 0;
		return (function(){
			data.map(function(value,index){
				sum += value;
			});
			return sum;
		}());
		
	}
	function portMove(arx,ary,arr,aradeg){
		var point = {
			x:0,
			y:0
		};
		point.x = arx + arr * Math.cos(aradeg);
		point.y = ary + arr * Math.sin(aradeg);
		return point ;
	}
	
	if(detailSum == 0){
        var canvas = document.querySelector(element);
        var ctx = canvas.getContext('2d');
        ctx.arc(150,150,100,0,2*Math.PI);
        ctx.fillStyle = "rgb(204,204,204)";
        ctx.fill();
        ctx.font = '20px Arial';
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillText("0%",150,150);
        return false;
	}
	
	sum = arraySum();
	data.map(function(ele,index){
		canvas(ele,index);
	});
}


