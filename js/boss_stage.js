function BossData(){
    this.init();
    this.data_sid_lock = true;
    this.root_sid;  //根节点的id
    this.fistNode = true; //判断是否是侧边栏第一个节点
    this.currId;
    this.PchildrenTree = [];
    this.findFirst;
    this.colorArray=[
        '#FF4B4B',
        '#42CA82',
        '#428BCA',
        '#FF8A00',
        '#C88BE0',
        '#90CAF9'
    ];
};
BossData.prototype={
    init:function(){
        var p_testdata;
        var p_nodeDomTemplate = '<div class="node"></div>';
        var _this = this;
        var fatherTree;
        var childrenTree = [];
        function processTop(data) {
            var childElem = null;

            if ("undefined" == typeof(data.branches) || (0 >= data.branches.length)) {
                return null;
            }

            var i = 0;
            for (i = 0; i < data.branches.length; i++) {
                if ("undefined" == typeof(data.branches[i]) || (0 >= data.branches[i].length)) {
                    continue;
                }

                childElem = AnalyseNode(data.branches[i]);

                if (childElem) {
                    $(".pageside").append(childElem);
                    
                    _this.getChild(1);
                    
                }

            }
        };
        
        function AnalyseNode(in_node) {
            var nodeDom = $(p_nodeDomTemplate).clone(true);
            if(in_node.id){
                nodeDom.attr("data-sid",in_node.id);
                nodeDom.attr("id","dataSid"+in_node.id);
                if(_this.data_sid_lock){
                    _this.root_sid = in_node.id;
                    _this.currId = in_node.id;
                    _this.data_sid_lock = false;
                    _this.eleClick();
                }
            };           
            nodeDom.append(in_node.name);
            var childElem = null;

            console.log(in_node);
            
            if(in_node.companies && in_node.companies.length>0){
                AddCompany(in_node.companies,nodeDom);
            }
            
            if ("undefined" == typeof(in_node.child) || (0 >= in_node.child.length)) {
                return nodeDom;
            }
            
            var i = 0;
            for (i = 0; i < in_node.child.length; i++) {
                if ("undefined" == typeof(in_node.child[i]) || (0 >= in_node.child[i].length)) {
                    continue;
                }
                
                childElem = AnalyseNode(in_node.child[i]);

                nodeDom.append(childElem); 
            }
            
            return nodeDom;
        };
        function AddCompany(com,arg){
            console.log(arg);
            var aa = "";
            $.each(com,function(index,ele){
                aa += '<div class="node3" data-id="'+ele.company_id+'" id="dataSidC'+ele.company_id+'">'+ele.company_name+'</div>';
            });
            arg.append(aa);
        };
        
        $.ajax({
            type:"POST",
            url:"/YyBizmaster/bizmsvr",
            dataType:"json",
            data:{
                svrname:"QueryUserPrivs",
                user_id: CookieUtil.GetCookie("yyboss_userid")
            },
            beforeSend:function(){
                $(".loading-gif").show();
            },
            success:function(data){
                console.log(data);
                $(".boss-righttext").html(data.hq_name);
                p_testdata = data;
                processTop(p_testdata);
            },
            error:function(err){
                console.log(err);
            },
            complete:function(){
                $(".loading-gif").hide();
            }
        });
    },
    eleClick:function(){
        //-------查看详情和收起切换
        var _this = this;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var dateDay = date.getDate();
        var boss_userId = CookieUtil.GetCookie("yyboss_userid");
        var clientHeight;
        var jsonobj = [2];
        var storelist = JSON.stringify(jsonobj);
        var selectTime = "today"; //设置默认的日期区段，默认是select
        var sideSelectTime ="today"; //设置默认侧边栏选择日期
        var sideClickLock = true; //是否是点了侧边栏然后选择日期变化
        var sideClickId =_this.root_sid;   //记录点击侧边栏的this的id
        var rotateLock = true;
        if(month<10){
            month = "0"+month;
        };
        if(dateDay<10){
            dateDay = "0"+dateDay;
        }
        var nowDate = year+"-"+month+"-"+dateDay;
        var tomorrow = year+"-"+month+"-"+(dateDay+1);
        //点击注销
        $(".log-off").click(function(){
            console.log(window.CookieUtil);
           window.CookieUtil.DelCookie("yyboss_userid");
           location.href="/YyBizmaster/web/boss_login.jsp";
        });
        //点击左侧边栏
        $(".pageside").on("click",".node3",function(){
            jsonobj = $(this).attr("data-id")-0;
            storelist = JSON.stringify([jsonobj]);
            $(".pline-click").removeClass("pline-click-change");
            $(".pline-click").html("查看详情");
            $(".item-table").css("height","auto");
            $(".item-table").hide();
            
            $(".node3").removeClass("color-default-bca");
            $(this).addClass("color-default-bca");
        });
        //点击导航栏
        $(".boss-time-data li").click(function(){
            $(".boss-time-data li").removeClass("color-default-bca");
            $(this).addClass("color-default-bca");
        });
        //当天统计数据
        $("#gettoday_data").click(function(){
            selectTime = "today";
            sideSelectTime = "today";
            $(".pline-click").removeClass("pline-click-change");
            $(".pline-click").html("查看详情");
            $(".item-table").css("height","auto");
            $(".item-table").hide();
            if(sideClickLock){
                HavaChild()
            }else{
                ShopAjax();
            }
        });
        //本周统计数据
        $("#getweek_data").click(function(){
            selectTime = "week";
            sideSelectTime = "week";
            $(".pline-click").removeClass("pline-click-change");
            $(".pline-click").html("查看详情");
            $(".item-table").css("height","auto");
            $(".item-table").hide();
            if(sideClickLock){
                HavaChild()
            }else{
                ShopAjax();
            }
        });
        //本月统计数据
        $("#getmonth_data").click(function(){
            selectTime = "month";
            sideSelectTime = "month";
            $(".pline-click").removeClass("pline-click-change");
            $(".pline-click").html("查看详情");
            $(".item-table").css("height","auto");
            $(".item-table").hide();
            if(sideClickLock){
                HavaChild();
            }else{
                ShopAjax();
            }
        });
        //表格数据和图形比较切换
        $("#table_data").click(function(){
            $(this).addClass("button-click").removeClass("button-click-nobg");
            $("#chart_compare").addClass("button-click-nobg").removeClass("button-click");
            $(".bigdata-table").show();
            $(".chartdata-show").hide();
        });
        $("#chart_compare").click(function(){
            $(this).addClass("button-click").removeClass("button-click-nobg");
            $("#table_data").addClass("button-click-nobg").removeClass("button-click");
            $(".bigdata-table").hide();
            $(".chartdata-show").show();
        });
        
        clientHeight = document.documentElement.clientHeight - 68-20-40-160-40;
        
        $("#pline-click").click(function(){
            if($(this).hasClass("pline-click-change")){
                $(this).removeClass("pline-click-change").html("查看详情");
                $("#item-table").css({
                   "display":"none"
                });
            }else{
                $(this).addClass("pline-click-change").html("收起");
                $("#item-table").css({
                    "display":"block"
                 });
            }
        });
        //=-------新增预约订单查看详情按钮
        $("#newadd_booking").click(function(){
            if($(this).hasClass("pline-click-change")){
                $(this).removeClass("pline-click-change").html("查看详情");
                $("#addnew_booking").css({
                   "display":"none" 
                });
            }else{
                $(this).addClass("pline-click-change").html("收起");
                $("#addnew_booking").css({
                    "display":"block" 
                 });
            }
            
        });
        
        //------------员工服务统计
        $("#cus_server").click(function(){
            if($(this).hasClass("pline-click-change")){
                $(this).removeClass("pline-click-change").html("查看详情");
                $("#cus_server_stati").css({
                    "display":"none" 
                 });
            }else{
                $(this).addClass("pline-click-change").html("收起");
                $("#cus_server_stati").css({
                    "display":"block" 
                 });
            }
            
        });
        //----------员工新接预约订单
        $("#cus_proba_click").click(function(){
            if($(this).hasClass("pline-click-change")){
                $(this).removeClass("pline-click-change").html("查看详情");
                $("#cus_proba").css({
                    "display":"none" 
                 });
            }else{
                $(this).addClass("pline-click-change").html("收起");
                $("#cus_proba").css({
                    "display":"block" 
                 });
            }
            
        });
        
        //-------点击显示
        $(".pageside").on("click",".node,.node2",function(e){
            var that = this;
            var clickValue = null;
            sideClickLock = true;
            e.stopPropagation();
            
            if($(that).attr("data-sid") == _this.root_sid){
                $(".bigdata-main").hide();
                $(".circle-chart").show();
            }else{
                $(".bigdata-main").show();
                $(".circle-chart").hide();
            };
            $(this).children(".node").toggle();
            $(this).children(".node2").toggle();
            if($(this).hasClass("node") || $(this).hasClass("node2")){
                $(this).toggleClass("node").toggleClass("node2");
            };
            if($(this).children().hasClass("node3")){
                $(this).find(".node3").toggle();
            };
            $(this).children().each(function(index,ele){
                if($(ele).hasClass("node3")){
                    $(".bigdata-table li:first-child").html("店铺名称");
                }else{
                    $(".bigdata-table li:first-child").html("区域");
                }
            });
            //content显示内容    
            var text = $(this).html();
            var aab = text.replace(/<.+/,"");
            var first = 0,
                seccond = 0,
                third = 0,
                four = 0,
                shopNum = 0;
            var chartShopName = [],
                chartCus = [],
                chartCosts = [],
                chartBooking = [],
                placeName = [];
            var CusSum = 0,
                CostSum = 0,
                BookingSum = 0;
            var sideId = $(this).attr("data-sid");
            sideClickId = sideId;
            $(".bigdata-main h1").html(aab);
            _this.currId = sideClickId;
            $.ajax({
                type:"POST",
                url:"/YyBizmaster/bizmsvr",
                dataType:"json",
                data:{
                    svrname:"branchAbst",
                    user_id: boss_userId,
                    branch_idx: sideId,
                    query_type: sideSelectTime
                },
                beforeSend:function(){
                    $(".loading-gif").show();
                },
                success:function(data){
                    console.log(data);
                    
                    $(".boss-data-item").hide();
                    $(".boss-big-data").show();
                    $(".bigdata-table tbody").empty();
                    if(data.child.length>0){
                        $.each(data.child,function(index,ele){
                            first++;
                            seccond += ele.arrived_books;
                            third += ele.book_costs;
                            four += ele.new_books;
                            
                            chartShopName.push(ele.branch_name);
                            chartCus.push(ele.arrived_books);
                            chartCosts.push(ele.book_costs);
                            chartBooking.push(ele.new_books);
                            placeName.push(ele.branch_name);
                            clickValue += '<tr>';
                            clickValue += '<td>'+(index+1)+'</td>';
                            clickValue += '<td>'+ele.branch_name+'</td>';
                            clickValue += '<td>'+ele.arrived_books+'</td>';
                            clickValue += '<td>'+ele.book_costs+'</td>';
                            clickValue += '<td>'+ele.new_books+'</td>';
                            clickValue += '<td>查看详情</td>';
                            clickValue += '</tr>';
                        });
                    }else{
                        $.each(data.self.com_books,function(index,ele){
                            seccond += ele.arrived_books;
                            third += ele.book_costs;
                            four += ele.new_books;
                            
                            chartShopName.push(ele.com_name);
                            chartCus.push(ele.arrived_books);
                            chartCosts.push(ele.book_costs);
                            chartBooking.push(ele.new_books);
                            placeName.push(ele.branch_name);
                            clickValue += '<tr>';
                            clickValue += '<td>'+(index+1)+'</td>';
                            clickValue += '<td>'+ele.com_name+'</td>';
                            clickValue += '<td>'+ele.arrived_books+'</td>';
                            clickValue += '<td>'+ele.book_costs+'</td>';
                            clickValue += '<td>'+ele.new_books+'</td>';
                            clickValue += '<td>查看详情</td>';
                            clickValue += '</tr>';
                        });
                    }
                    //计算所有店铺数量
                    $.each(data.child,function(name,value){
                        shopNum += value.com_abst.length;
                    });
                    shopNum += data.self.com_books.length;
                    
                    $(".bigdata-table tbody").append(clickValue);
                    //给查看详情添加事件
                    $.each($(that).children("div"),function(name,value){
                        $(".bigdata-table tbody tr").eq(name).children().eq(5).addClass("operator"+$(value).data("sid"));   
                    });
                    if(first>0){
                        $(".content-detail-shop").html(first);
                    }else{
                        $(".content-detail-shop").parent().remove();
                    }
                    $(".content-detail").html(shopNum);
                    $(".content-detail-people").html(seccond);
                    $(".content-detail-costs").html(third);
                    $(".content-detail-booking").html(four);

                    //chart
                    //顾客到店情况比较
                     var Cusunit;
                    var CusSum = 0;
                    console.log(chartCus);
                    for(var i = 0;i<chartCus.length;i++){
                        CusSum += chartCus[i];
                    };
                    if(CusSum>0){
                        Cusunit = 200/CusSum;
                    }else{
                        Cusunit = 0;
                    }
                    var charEle = "";
                    $.each(chartShopName,function(index,ele){
                        var Cheight = 0;
                        Cheight = Cusunit*chartCus[index];
                        if(Cheight <= 0){
                            Cheight = 1;
                        };
                        if(Cusunit>0){
                            CusRate = Math.round(chartCus[index]/CusSum*100);
                        }else{
                            CusRate = 0;
                        }
                        charEle += '<div class="chart-list" style="height:'+Cheight+'px"><div class="textrate">'+CusRate+'%</div><div class="centerText">'+chartCus[index]+'人次</div><div class="footer-title" title="'+ele+'">'+ele+'</div></div>';
                    });
                    $(".chart-tree").empty();
                    $("#Cus_tree").append(charEle);
                    $("#Cus_tree .chart-list").each(function(index,ele){
                        $(ele).css({
                           'background':_this.colorArray[index] 
                        });
                    });
                  //顾客消费情况比较
                    var Costunit;
                
                    for(var i = 0;i<chartCosts.length;i++){
                        CostSum += chartCosts[i];
                    };
                    if(CostSum>0){
                        Costunit = 200/CostSum;
                    }else{
                        Costunit = 0;
                    }
                    var charEle = "";
                    $.each(chartShopName,function(index,ele){
                        var Cheight = 0;
                        Cheight = Costunit*chartCosts[index];
                        var CusRate;
                        if(Cheight <= 0){
                            Cheight = 1;
                        };
                        if(Costunit>0){
                            CusRate = Math.round(chartCosts[index]/CostSum*100);
                        }else{
                            CusRate = 0;
                        }
                        charEle += '<div class="chart-list" style="height:'+Cheight+'px"><div class="textrate">'+CusRate+'%</div><div class="centerText">'+chartCosts[index]+'元</div><div class="footer-title" title="'+ele+'">'+ele+'</div></div>';
                    });
                    $("#Cost_tree").empty();
                    $("#Cost_tree").append(charEle);
                    $("#Cost_tree .chart-list").each(function(index,ele){
                        $(ele).css({
                           'background':_this.colorArray[index] 
                        });
                    });
                  //新增预约情况比较
                    var Bookingunit;
                
                    for(var i = 0;i<chartBooking.length;i++){
                        BookingSum += chartBooking[i];
                    };
                    if(BookingSum>0){
                        Bookingunit = 200/BookingSum;
                    }else{
                        Bookingunit = 0;
                    }
                    var BookingEle = "";
                    $.each(chartShopName,function(index,ele){
                        var Cheight = 0;
                        Cheight = Bookingunit*chartBooking[index];
                        var CusRate;
                        if(Cheight <= 0){
                            Cheight = 1;
                        };
                        if(Bookingunit>0){
                            CusRate = Math.round(chartBooking[index]/BookingSum*100);
                        }else{
                            CusRate = 0;
                        }
                        BookingEle += '<div class="chart-list" style="height:'+Cheight+'px"><div class="textrate">'+CusRate+'%</div><div class="centerText">'+chartBooking[index]+'单</div><div class="footer-title" title="'+ele+'">'+ele+'</div></div>';
                    });
                    $("#Booking_tree").empty();
                    $("#Booking_tree").append(BookingEle);
                    $("#Booking_tree .chart-list").each(function(index,ele){
                        $(ele).css({
                           'background':_this.colorArray[index] 
                        });
                    });
                  //扇形图
                    _this.fistNode = false;
                    if($(that).attr("data-sid") == _this.root_sid){
                        _this.fistNode = true;
                        $(".bigdata-main").hide();
                        $(".circle-chart").show();
                        $(".bigdata-table").show();
                        $(".chartdata-show").hide();
                        $("#table_data").removeClass("button-click-nobg").addClass("button-click");
                        $("#chart_compare").removeClass("button-click").addClass("button-click-nobg");
                        var cuspx,
                            cospx,
                            bookpx;
                        if(CusSum>0){
                            cuspx = 360/CusSum;
                        }else{
                            cuspx = 0;
                        };
                        $("#cus_arrive_num").html(CusSum+"人次");
                        if(CostSum>0){
                            cospx = 360/CostSum;
                        }else{
                            cospx = 0; 
                        };
                        $("#cus_cost_num").html(CostSum+"元");
                        
                        if(BookingSum>0){
                            bookpx = 360/BookingSum;
                        }else{
                            bookpx = 0;
                        };
                        $("#new_add_book").html(BookingSum+"单");
                        var canvasEle = '<canvas class="circle circle-shop" width="320px" height="300px"></canvas><canvas class="circle circle-book" width="320px" height="300px"></canvas><canvas class="circle circle-cost" width="320px" height="300px"></canvas>';
                        $(".canvas-text").remove();
                        $("canvas").remove();
                        $(".circle-chart").append(canvasEle);
                        var unit1 = new UnitCanvas(chartCus,".circle-shop",placeName,CusSum);
                        var unit2 = new UnitCanvas(chartCosts,".circle-cost",placeName,CostSum);
                        var unit3 = new UnitCanvas(chartBooking,".circle-book",placeName,BookingSum);
                    }
                    
                },
                error:function(err){
                    consolo.log(err);
                },
                complete:function(){
                    $(".loading-gif").hide();
                }
            });
            
        });
        function ChildClick(e){
            var shopAjaxData;
            if(e){
                e.stopPropagation();
            }
            $(".boss-data-item").show();
            $(".boss-big-data").hide();
            sideClickLock = false;
            //第一项
            $.ajax({
                type:"POST",
                url:"/YyBizmaster/bizmsvr",
                data:{
                    svrname:"storesPerf",
                    query_type: selectTime, //"today",
                    user_id:boss_userId,
                    stores: storelist,
                    base_date: nowDate           
                },
                dataType:"json",
                beforeSend:function(){
                    $(".loading-gif").show();
                },
                success:function(data){
                    console.log(data);
                    shopAjaxData = data;
                    var itemValue = "";
                    console.log(data);
                    var arrived_counts1 = data.stores_perf[0]["booktimePerf"]["bookSums"]["arrived_counts"];
                    var counts1 = data.stores_perf[0]["booktimePerf"]["bookSums"]["counts"];
                    $(".detail-header-right span").html(data.stores_perf[0]["booktimePerf"]["bookSums"]["costs"]);
                    $(".arrive-num").html(arrived_counts1);
                    $("#booking_count").html(counts1);
                    if(counts1>0){
                        $("#arrive_count_pecent").html((Math.round(arrived_counts1/counts1*1000))/10);
                    }else{
                        $("#arrive_count_pecent").html("0.0");
                    }                   
                    var create_role = "";
                    var cus_name = "";
                    var choose_item = "";
                    var itemPrice = 0;
                    $.each(data.stores_perf[0]["booktimePerf"]["bookDatas"],function(index,ele){
                       choose_item = "";
                       itemPrice = 0
                       switch (ele["create_role"]){
                           case 1: 
                               create_role = "技师";
                               cus_name = ele.book_remark;
                               break;
                           case 2:
                               create_role = "顾客";
                               cus_name = ele.customer_nick_name;
                               break;
                           case 3:
                               create_role = "商家";
                               cus_name = ele.customer_name;
                               break;
                        };
                        $.each(ele["ary_choose_item"],function(ind,elem){
                            choose_item += '<div>'+elem.itemName+'</div>';
                            itemPrice += elem.itemPrice;
                        });
                        itemValue += '<tr>';
                        itemValue += '<td class="item-table1">'+(index+1)+'</td>';
                        itemValue += '<td class="item-table2">'+create_role+'</td>';
                        itemValue += '<td class="item-table3">'+cus_name+'</td>';
                        itemValue += '<td class="item-table4">'+ele.w_booked_begin.trim().substring(0,10)+'</td>';
                        itemValue += '<td class="item-table5">'+ele.w_booked_begin.trim().substring(11)+'</td>';
                        itemValue += '<td class="item-table6">'+choose_item+'</td>';
                        itemValue += '<td class="item-table7">'+itemPrice+'</td>';
                        itemValue += '<td class="item-table8">'+ele.com_staff_name+'</td>';
                        itemValue += '<td class="item-table9">'+ele.staff_id+'</td>';
                        itemValue += '</tr>';
                    });
                    $("#item-table tbody").empty();
                    $("#item-table tbody").append(itemValue);
                    var itemHeight = $("#item-table").css("height").replace("px","");
                    if(itemHeight > clientHeight){
                        $("#item-table").css("height",clientHeight);
                    }else{
                        $("#item-table").css("height",itemHeight);
                    }
                    
                  //第二项
                    itemValue = "";
                    $.each(shopAjaxData.stores_perf[0]["opertimePerf"]["bookDatas"],function(index,ele){
                       choose_item = "";
                       switch (ele["create_role"]){
                           case 1: 
                               create_role = "技师";
                               cus_name = ele.book_remark;
                               break;
                           case 2:
                               create_role = "顾客";
                               cus_name = ele.customer_nick_name;
                               break;
                           case 3:
                               create_role = "商家";
                               cus_name = ele.customer_name;
                               break;
                        };
                       var itemPrice = 0;
                        $.each(ele["ary_choose_item"],function(ind,elem){
                            choose_item += '<div>'+elem.itemName+'</div>';
                            itemPrice += elem.itemPrice;
                        });
                        itemValue += '<tr>';
                        itemValue += '<td class="item-table1">'+(index+1)+'</td>';
                        itemValue += '<td class="item-table2">'+create_role+'</td>';
                        itemValue += '<td class="item-table3">'+cus_name+'</td>';
                        itemValue += '<td class="item-table4">'+ele.w_booked_begin.trim().substring(0,10)+'</td>';
                        itemValue += '<td class="item-table5">'+ele.w_booked_begin.trim().substring(11,16)+'</td>';
                        itemValue += '<td class="item-table6">'+choose_item+'</td>';
                        itemValue += '<td class="item-table7">'+itemPrice+'</td>';
                        itemValue += '<td class="item-table8">'+ele.com_staff_name+'</td>';
                        itemValue += '<td class="item-table9">'+ele.staff_id+'</td>';
                        itemValue += '</tr>';
                    });
                    $("#addnew_booking tbody").empty();
                    $("#addnew_booking tbody").append(itemValue);
                    var bookSums_counts1 = shopAjaxData.stores_perf[0]["opertimePerf"]["bookSums"]["counts"];
                    var bookSums_counts2 = shopAjaxData.stores_perf[0]["opertimePerf"]["bookSums"]["bkByCust_cnts"];
                    var bookSums_counts3 = shopAjaxData.stores_perf[0]["opertimePerf"]["bookSums"]["bkByCom_cnts"];
                    $("#self_shop_booking").html(shopAjaxData.stores_perf[0]["opertimePerf"]["bookSums"]["bkByCom_cnts"]);
                    $("#cus_create_booking").html(bookSums_counts2);
                    if(bookSums_counts1>0){
                        $("#creat_book_rate").html(Math.round(bookSums_counts2/bookSums_counts1*1000)/10+"%");
                        $("#com_create_booking").html(Math.round(bookSums_counts3/bookSums_counts1*1000)/10+"%");
                    }else{
                        $("#creat_book_rate").html("0.0%");
                        $("#com_create_booking").html("0.0%");
                    }
                    //新增预约订单
                    $("#add_new_deal").html(bookSums_counts1);
                    
                    itemHeight = $("#addnew_booking").css("height").replace("px","");
                    if(itemHeight > clientHeight){
                        $("#addnew_booking").css("height",clientHeight);
                    }
                    //第三项
                    
                    itemValue = "";
                    var allTime = 0;
                    $.each(shopAjaxData.stores_perf[0]["waiterPerf"]["bookDatas"],function(index,ele){
                       var choose_item = "";
                       var itemPrice = 0;
                       allTime += ele["bookperf"]["workMins"];
                        itemValue += '<tr>';
                        itemValue += '<td class="item-table1">'+(index+1)+'</td>';
                        itemValue += '<td class="item-table-ser">'+ele.id+'</td>';
                        itemValue += '<td class="item-table-ser">'+ele["bookperf"]["waiterInfo"]["staff_name"]+'</td>';
                        itemValue += '<td class="item-table-ser">'+ele["bookperf"]["bookPerfStat"]["counts"]+'</td>';
                        itemValue += '<td class="item-table-ser">'+ TurnMinutesToHourmins(ele["bookperf"]["bookedMins"]) +'</td>';
                        itemValue += '<td class="item-table-ser">'+Math.round(ele["bookperf"]["bookRate"]*1000)/10+'%</td>';
                        itemValue += '<td class="item-table-ser">'+ele["bookperf"]["bookPerfStat"]["costs"]+'</td>';
                        itemValue += '</tr>';
                    });
                    $("#cus_server_stati tbody").empty();
                    $("#cus_server_stati tbody").append(itemValue);
                    $("#ser_all_people").html(shopAjaxData.stores_perf[0]["waiterPerf"]["bookSums"]["counts"]);
                    $("#ser_job_time").html( TurnMinutesToHourmins(shopAjaxData.stores_perf[0]["waiterPerf"]["bookSums"]["bookedMins"]) );
                    
                    var itemHeight = $("#cus_server_stati").css("height").replace("px","");
                    if(itemHeight > clientHeight){
                        $("#cus_server_stati").css("height",clientHeight);
                    }
                    
                    //第四项
                    itemValue = "";
                    $.each(shopAjaxData.stores_perf[0]["waiterPerf_today"]["bookDatas"],function(index,ele){
                        itemValue += '<tr>';
                        itemValue += '<td class="item-table1">'+(index+1)+'</td>';
                        itemValue += '<td class="item-table-ser staff-id-tips">'+ele["bookperf"]["waiterInfo"]["staff_id"]+'</td>';
                        itemValue += '<td class="item-table-ser">'+ele["bookperf"]["waiterInfo"]["staff_name"]+'</td>';
                        itemValue += '<td class="item-table-ser addnew-rate">'+ele["bookperf"]["bookPerfStat"]["counts"]+'</td>';
                        itemValue += '<td class="item-table-ser addtoday-rate">'+Math.round(ele["bookperf"]["bookRate"]*1000)/10+'%</td>';
                        itemValue += '<td class="item-table-ser addthird-rate">--</td>';
                        itemValue += '<td class="item-table-ser addseven-rate">--</td>';
                        itemValue += '</tr>';
                    });
                    $("#cus_proba tbody").empty();
                    $("#cus_proba tbody").append(itemValue);
                    //新增预约
                    $.each(shopAjaxData.stores_perf[0]["waiterPerf_todayNew"]["bookDatas"],function(indexs,eles){
                        $.each($(".staff-id-tips"),function(indexid,eleid){
                            if(eles["id"] == $(eleid).html()){
                                $(eleid).parent().find(".addnew-rate").html(Math.round(eles["bookperf"]["books"].length));
                            }
                        });
                    });
                    //3天预约率
                    $.each(shopAjaxData.stores_perf[0]["waiterPerf_3days"]["bookDatas"],function(indexs,eles){
                        $.each($(".staff-id-tips"),function(indexid,eleid){
                            if(eles["id"] == $(eleid).html()){
                                $(eleid).parent().find(".addthird-rate").html(Math.round(eles["bookperf"]["bookRate"]*1000)/10+"%");
                            }
                        });
                    });
                    //7天预约率
                    $.each(shopAjaxData.stores_perf[0]["waiterPerf_7days"]["bookDatas"],function(indexs,eles){
                        $.each($(".staff-id-tips"),function(indexid,eleid){
                            if(eles["id"] == $(eleid).html()){
                                $(eleid).parent().find(".addseven-rate").html(Math.round(eles["bookperf"]["bookRate"]*1000)/10+"%");
                            }
                        });
                    });
                    
                    $("#tree_book_rate").html(Math.round(shopAjaxData.stores_perf[0]["waiterPerf_3days"]["bookSums"]["bookRate"]*1000)/10);
                    $("#seven_book_rate").html(Math.round(shopAjaxData.stores_perf[0]["waiterPerf_7days"]["bookSums"]["bookRate"]*1000)/10);
                    var itemHeight = $("#cus_proba").css("height").replace("px","");
                    if(itemHeight > clientHeight){
                        $("#cus_proba").css("height",clientHeight);
                    }
                  //ajax尾
                },
                error:function(err){
                    console.log(err)
                },
                complete:function(){
                    $(".loading-gif").hide();
                }
             });  
        };
        $(".pageside").on("click",".node3",function(e){
            ChildClick(e);
        });
        //侧边栏有子点击
        
        HavaChild();
        //区域查看详情
        $(".bigdata-table tbody").on("click","tr td:last-child",function(){
           var argid = $(this).attr("class");
           console.log(argid);
           argid = argid.replace("operator","");
           _this.fistNode = false;
           _this.findFirst = $(this).parent().children().eq(1).html();
           _this.getChild(argid);
           
           if(isNaN(argid) == false){
               HavaChild(argid);
           }else{
               ChildClick();
           }           
           
           $(".circle-chart").hide();
           
        });
        
        
        function HavaChild(arg){
            var clickValue = null;
            sideClickLock = true;

            $(".bigdata-main").show();
            $(".circle-chart").hide();
     
            //content显示内容    
            var first = 0,
                seccond = 0,
                third = 0,
                four = 0,
                shopNum = 0;
            var chartShopName = [],
                chartCus = [],
                chartCosts = [],
                chartBooking = [],
                placeName = [];
            if(arg){
                sideClickId = arg;
            }
            console.log(boss_userId+":"+sideClickId+":"+sideSelectTime);
            
            $.ajax({
                type:"POST",
                url:"/YyBizmaster/bizmsvr",
                dataType:"json",
                data:{
                    svrname:"branchAbst",
                    user_id: boss_userId,
                    branch_idx: sideClickId,
                    query_type: sideSelectTime
                },
                beforeSend:function(){
                    $(".loading-gif").show();
                },
                success:function(data){
                    console.log(data);
                    $(".boss-data-item").hide();
                    $(".boss-big-data").show();
                    $(".bigdata-table tbody").empty();
                    if(data.child.length>0){
                        $.each(data.child,function(index,ele){
                            first++;
                            seccond += ele.arrived_books;
                            third += ele.book_costs;
                            four += ele.new_books;
                            
                            chartShopName.push(ele.branch_name);
                            chartCus.push(ele.arrived_books);
                            chartCosts.push(ele.book_costs);
                            chartBooking.push(ele.new_books);
                            placeName.push(ele.branch_name);
                            clickValue += '<tr>';
                            clickValue += '<td>'+(index+1)+'</td>';
                            clickValue += '<td>'+ele.branch_name+'</td>';
                            clickValue += '<td>'+ele.arrived_books+'</td>';
                            clickValue += '<td>'+ele.book_costs+'</td>';
                            clickValue += '<td>'+ele.new_books+'</td>';
                            clickValue += '<td class="">查看详情</td>';
                            clickValue += '</tr>';
                        });
                        $(".bigdata-table li:first-child").html("区域");
                            
                    }else{
                        $.each(data.self.com_books,function(index,ele){
                            seccond += ele.arrived_books;
                            third += ele.book_costs;
                            four += ele.new_books;
                            
                            chartShopName.push(ele.com_name);
                            chartCus.push(ele.arrived_books);
                            chartCosts.push(ele.book_costs);
                            chartBooking.push(ele.new_books);
                            placeName.push(ele.branch_name);
                            
                            clickValue += '<tr>';
                            clickValue += '<td>'+(index+1)+'</td>';
                            clickValue += '<td>'+ele.com_name+'</td>';
                            clickValue += '<td>'+ele.arrived_books+'</td>';
                            clickValue += '<td>'+ele.book_costs+'</td>';
                            clickValue += '<td>'+ele.new_books+'</td>';
                            clickValue += '<td>查看详情</td>';
                            clickValue += '</tr>';
                        });
                        $(".bigdata-table li:first-child").html("店铺名称");
                    }
                  //计算所有店铺数量
                    $.each(data.child,function(name,value){
                        shopNum += value.com_abst.length;
                    });
                    shopNum += data.self.com_books.length;
                    
                    $(".bigdata-table tbody").append(clickValue);
                    
                    _this.AddClassForDetail();

                    if(first>0){
                        $(".content-detail-shop").html(first);
                    }else{
                        $(".content-detail-shop").parent().remove();
                    }
                    $(".bigdata-main h1").html(_this.findFirst);
                    $(".content-detail").html(shopNum);
                    $(".content-detail-people").html(seccond);
                    $(".content-detail-costs").html(third);
                    $(".content-detail-booking").html(four);
                    
                    //chart
                    //顾客到店情况比较
                    var CusSum = 0,
                        Cusunit;
                    
                    for(var i = 0;i<chartCus.length;i++){
                        CusSum += chartCus[i];
                    };
                    if(CusSum>0){
                        Cusunit = 200/CusSum;
                    }else{
                        Cusunit = 0;
                    }
                    var charEle = "";
                    $.each(chartShopName,function(index,ele){
                        var Cheight = 0;
                        var CusRate = 0;
                        Cheight = Cusunit*chartCus[index];
                        if(Cheight <= 0){
                            Cheight = 1;
                        };
                        if(Cusunit>0){
                            CusRate = Math.round(chartCus[index]/CusSum*100);
                        }else{
                            CusRate = 0;
                        }
                        charEle += '<div class="chart-list" style="height:'+Cheight+'px"><div class="textrate">'+CusRate+'%</div><div class="centerText">'+chartCus[index]+'人次</div><div class="footer-title" title="'+ele+'">'+ele+'</div></div>';
                    });
                    $("#Cus_tree").empty();
                    $("#Cus_tree").append(charEle);
                    $("#Cus_tree .chart-list").each(function(index,ele){
                        $(ele).css({
                           'background':_this.colorArray[index] 
                        });
                    });
                  //顾客消费情况比较
                    var CostSum = 0,
                    Costunit;
                
                    for(var i = 0;i<chartCosts.length;i++){
                        CostSum += chartCosts[i];
                    };
                    if(CostSum>0){
                        Costunit = 200/CostSum;
                    }else{
                        Costunit = 0;
                    }
                    var charEle = "";
                    $.each(chartShopName,function(index,ele){
                        var Cheight = 0;
                        Cheight = Costunit*chartCosts[index];
                        var CusRate;
                        if(Cheight <= 0){
                            Cheight = 1;
                        };
                        if(Costunit>0){
                            CusRate = Math.round(chartCosts[index]/CostSum*100);
                        }else{
                            CusRate = 0;
                        }
                        charEle += '<div class="chart-list" style="height:'+Cheight+'px"><div class="textrate">'+CusRate+'%</div><div class="centerText">'+chartCosts[index]+'元</div><div class="footer-title" title="'+ele+'">'+ele+'</div></div>';
                    });
                    $("#Cost_tree").empty();
                    $("#Cost_tree").append(charEle);
                    $("#Cost_tree .chart-list").each(function(index,ele){
                        $(ele).css({
                           'background':_this.colorArray[index] 
                        });
                    });
                  //新增预约情况比较
                    var BookingSum = 0,
                    Bookingunit;
                
                    for(var i = 0;i<chartBooking.length;i++){
                        BookingSum += chartBooking[i];
                    };
                    if(BookingSum>0){
                        Bookingunit = 200/BookingSum;
                    }else{
                        Bookingunit = 0;
                    }
                    var BookingEle = "";
                    $.each(chartShopName,function(index,ele){
                        var Cheight = 0;
                        Cheight = Bookingunit*chartBooking[index];
                        var CusRate;
                        if(Cheight <= 0){
                            Cheight = 1;
                        };
                        if(Bookingunit>0){
                            CusRate = Math.round(chartBooking[index]/BookingSum*100);
                        }else{
                            CusRate = 0;
                        }
                        BookingEle += '<div class="chart-list" style="height:'+Cheight+'px"><div class="textrate">'+CusRate+'%</div><div class="centerText">'+chartBooking[index]+'单</div><div class="footer-title" title="'+ele+'">'+ele+'</div></div>';
                    });
                    $("#Booking_tree").empty();
                    $("#Booking_tree").append(BookingEle);
                    $("#Booking_tree .chart-list").each(function(index,ele){
                        $(ele).css({
                           'background':_this.colorArray[index] 
                        });
                    });
                  //扇形图
                    if(_this.fistNode){
                        $(".bigdata-main").hide();
                        $(".circle-chart").show();
                        $(".bigdata-table").show();
                        $(".chartdata-show").hide();
                        $("#table_data").removeClass("button-click-nobg").addClass("button-click");
                        $("#chart_compare").removeClass("button-click").addClass("button-click-nobg");
                        /*chartCus = [],
                        chartCosts = [],
                        chartBooking = [];*/
                        var cuspx,
                            cospx,
                            bookpx;
                        if(CusSum>0){
                            cuspx = 360/CusSum;
                        }else{
                            cuspx = 0;
                        };
                        $("#cus_arrive_num").html(CusSum+"人次");
                        
                        if(CostSum>0){
                            cospx = 360/CostSum;
                        }else{
                            cospx = 0; 
                        };
                        $("#cus_cost_num").html(CostSum+"元");
                        
                        if(BookingSum>0){
                            bookpx = 360/BookingSum;
                        }else{
                            bookpx = 0;
                        };
                        $("#new_add_book").html(BookingSum+"单");
                        $("canvas").remove();
                        var canvasEle = '<canvas class="circle circle-shop" width="320px" height="300px"></canvas><canvas class="circle circle-book" width="320px" height="300px"></canvas><canvas class="circle circle-cost" width="320px" height="300px"></canvas>';
                        $(".canvas-text").remove();
                        $(".circle-chart").append(canvasEle);
                        var unit1 = new UnitCanvas(chartCus,".circle-shop",placeName,CusSum);
                        var unit2 = new UnitCanvas(chartCosts,".circle-cost",placeName,CostSum);
                        var unit3 = new UnitCanvas(chartBooking,".circle-book",placeName,BookingSum);
                    }
                },
                error:function(err){
                    consolo.log(err);
                },
                complete:function(){
                    $(".loading-gif").hide();
                }
            });  
        };
        //具体店名请求ajax
        function ShopAjax(){
            $.ajax({
                type:"POST",
                url:"/YyBizmaster/bizmsvr",
                data:{
                    svrname:"storesPerf",
                    query_type: selectTime, //"today",
                    user_id:boss_userId,
                    stores: storelist,
                    base_date: nowDate           
                },
                dataType:"json",
                beforeSend:function(){
                    $(".loading-gif").show();
                },
                success:function(data){
                    console.log(data);
                    shopAjaxData = data;
                    var itemValue = "";
                    console.log(data);
                    var arrived_counts1 = data.stores_perf[0]["booktimePerf"]["bookSums"]["arrived_counts"];
                    var counts1 = data.stores_perf[0]["booktimePerf"]["bookSums"]["counts"];
                    $(".detail-header-right span").html(data.stores_perf[0]["booktimePerf"]["bookSums"]["costs"]);
                    $(".arrive-num").html(arrived_counts1);
                    $("#booking_count").html(counts1);
                    if(counts1>0){
                        $("#arrive_count_pecent").html((Math.round(arrived_counts1/counts1*1000))/10);
                    }else{
                        $("#arrive_count_pecent").html("0.0");
                    }                   
                    var create_role = "";
                    var cus_name = "";
                    var choose_item = "";
                    var itemPrice = 0;
                    $.each(data.stores_perf[0]["booktimePerf"]["bookDatas"],function(index,ele){
                       choose_item = "";
                       itemPrice = 0;
                       switch (ele["create_role"]){
                           case 1: 
                               create_role = "技师";
                               cus_name = ele.book_remark;
                               break;
                           case 2:
                               create_role = "顾客";
                               cus_name = ele.customer_nick_name;
                               break;
                           case 3:
                               create_role = "商家";
                               cus_name = ele.customer_name;
                               break;
                        };
                        $.each(ele["ary_choose_item"],function(ind,elem){
                            choose_item += '<div>'+elem.itemName+'</div>';
                            itemPrice += elem.itemPrice;
                        });
                        itemValue += '<tr>';
                        itemValue += '<td class="item-table1">'+(index+1)+'</td>';
                        itemValue += '<td class="item-table2">'+create_role+'</td>';
                        itemValue += '<td class="item-table3">'+cus_name+'</td>';
                        itemValue += '<td class="item-table4">'+ele.w_booked_begin.trim().substring(0,10)+'</td>';
                        itemValue += '<td class="item-table5">'+ele.w_booked_begin.trim().substring(11)+'</td>';
                        itemValue += '<td class="item-table6">'+choose_item+'</td>';
                        itemValue += '<td class="item-table7">'+itemPrice+'</td>';
                        itemValue += '<td class="item-table8">'+ele.com_staff_name+'</td>';
                        itemValue += '<td class="item-table9">'+ele.staff_id+'</td>';
                        itemValue += '</tr>';
                    });
                    $("#item-table tbody").empty();
                    $("#item-table tbody").append(itemValue);
                    var itemHeight = $("#item-table").css("height").replace("px","");
                    if(itemHeight > clientHeight){
                        $("#item-table").css("height",clientHeight);
                    }else{
                        $("#item-table").css("height",itemHeight);
                    }
                    
                  //第二项
                    itemValue = "";
                    $.each(shopAjaxData.stores_perf[0]["opertimePerf"]["bookDatas"],function(index,ele){
                       choose_item = "";
                       switch (ele["create_role"]){
                           case 1: 
                               create_role = "技师";
                               cus_name = ele.book_remark;
                               break;
                           case 2:
                               create_role = "顾客";
                               cus_name = ele.customer_nick_name;
                               break;
                           case 3:
                               create_role = "商家";
                               cus_name = ele.customer_name;
                               break;
                        };
                       var itemPrice = 0;
                        $.each(ele["ary_choose_item"],function(ind,elem){
                            choose_item += '<div>'+elem.itemName+'</div>';
                            itemPrice += elem.itemPrice;
                        });
                        itemValue += '<tr>';
                        itemValue += '<td class="item-table1">'+(index+1)+'</td>';
                        itemValue += '<td class="item-table2">'+create_role+'</td>';
                        itemValue += '<td class="item-table3">'+cus_name+'</td>';
                        itemValue += '<td class="item-table4">'+ele.w_booked_begin.trim().substring(0,10)+'</td>';
                        itemValue += '<td class="item-table5">'+ele.w_booked_begin.trim().substring(11,16)+'</td>';
                        itemValue += '<td class="item-table6">'+choose_item+'</td>';
                        itemValue += '<td class="item-table7">'+itemPrice+'</td>';
                        itemValue += '<td class="item-table8">'+ele.com_staff_name+'</td>';
                        itemValue += '<td class="item-table9">'+ele.staff_id+'</td>';
                        itemValue += '</tr>';
                    });
                    $("#addnew_booking tbody").empty();
                    $("#addnew_booking tbody").append(itemValue);
                    var bookSums_counts1 = shopAjaxData.stores_perf[0]["opertimePerf"]["bookSums"]["counts"];
                    var bookSums_counts2 = shopAjaxData.stores_perf[0]["opertimePerf"]["bookSums"]["bkByCust_cnts"];
                    var bookSums_counts3 = shopAjaxData.stores_perf[0]["opertimePerf"]["bookSums"]["bkByCom_cnts"];
                    $("#self_shop_booking").html(shopAjaxData.stores_perf[0]["opertimePerf"]["bookSums"]["bkByCom_cnts"]);
                    $("#cus_create_booking").html(bookSums_counts2);
                    if(bookSums_counts1>0){
                        $("#creat_book_rate").html(Math.round(bookSums_counts2/bookSums_counts1*1000)/10+"%");
                        $("#com_create_booking").html(Math.round(bookSums_counts3/bookSums_counts1*1000)/10+"%");
                    }else{
                        $("#creat_book_rate").html("0.0%");
                        $("#com_create_booking").html("0.0%");
                    }
                    $("#add_new_deal").html(bookSums_counts1);
                    itemHeight = $("#addnew_booking").css("height").replace("px","");
                    if(itemHeight > clientHeight){
                        $("#addnew_booking").css("height",clientHeight);
                    }
                    //第三项
                    
                    itemValue = "";
                    var allTime = 0;
                    $.each(shopAjaxData.stores_perf[0]["waiterPerf"]["bookDatas"],function(index,ele){
                       var choose_item = "";
                       var itemPrice = 0;
                       allTime += ele["bookperf"]["workMins"];
                        itemValue += '<tr>';
                        itemValue += '<td class="item-table1">'+(index+1)+'</td>';
                        itemValue += '<td class="item-table-ser">'+ele.id+'</td>';
                        itemValue += '<td class="item-table-ser">'+ele["bookperf"]["waiterInfo"]["staff_name"]+'</td>';
                        itemValue += '<td class="item-table-ser">'+ele["bookperf"]["bookPerfStat"]["counts"]+'</td>';
                        itemValue += '<td class="item-table-ser">'+Math.floor(ele["bookperf"]["bookedMins"]/60)+'小时'+ele["bookperf"]["bookedMins"]%60+'分钟</td>';
                        itemValue += '<td class="item-table-ser">'+Math.round(ele["bookperf"]["bookRate"]*1000)/10+'%</td>';
                        itemValue += '<td class="item-table-ser">'+ele["bookperf"]["bookPerfStat"]["costs"]+'</td>';
                        itemValue += '</tr>';
                    });
                    $("#cus_server_stati tbody").empty();
                    $("#cus_server_stati tbody").append(itemValue);
                    $("#ser_all_people").html(shopAjaxData.stores_perf[0]["waiterPerf"]["bookSums"]["counts"]);
                    $("#ser_job_time").html(shopAjaxData.stores_perf[0]["waiterPerf"]["bookSums"]["bookedMins"]);
                    
                    var itemHeight = $("#cus_server_stati").css("height").replace("px","");
                    if(itemHeight > clientHeight){
                        $("#cus_server_stati").css("height",clientHeight);
                    }
                    
                    //第四项
                    itemValue = "";
                    $.each(shopAjaxData.stores_perf[0]["waiterPerf_today"]["bookDatas"],function(index,ele){
                        itemValue += '<tr>';
                        itemValue += '<td class="item-table1">'+(index+1)+'</td>';
                        itemValue += '<td class="item-table-ser staff-id-tips">'+ele["bookperf"]["waiterInfo"]["staff_id"]+'</td>';
                        itemValue += '<td class="item-table-ser">'+ele["bookperf"]["waiterInfo"]["staff_name"]+'</td>';
                        itemValue += '<td class="item-table-ser addnew-rate">'+ele["bookperf"]["bookPerfStat"]["counts"]+'</td>';
                        itemValue += '<td class="item-table-ser addtoday-rate">'+Math.round(ele["bookperf"]["bookRate"]*1000)/10+'%</td>';
                        itemValue += '<td class="item-table-ser addthird-rate">--</td>';
                        itemValue += '<td class="item-table-ser addseven-rate">--</td>';
                        itemValue += '</tr>';
                    });
                    $("#cus_proba tbody").empty();
                    $("#cus_proba tbody").append(itemValue);
                  //新增预约
                    $.each(shopAjaxData.stores_perf[0]["waiterPerf_todayNew"]["bookDatas"],function(indexs,eles){
                        $.each($(".staff-id-tips"),function(indexid,eleid){
                            if(eles["id"] == $(eleid).html()){
                                $(eleid).parent().find(".addnew-rate").html(Math.round(eles["bookperf"]["books"].length));
                            }
                        });
                    });
                    //3天预约率
                    $.each(shopAjaxData.stores_perf[0]["waiterPerf_3days"]["bookDatas"],function(indexs,eles){
                        $.each($(".staff-id-tips"),function(indexid,eleid){
                            if(eles["id"] == $(eleid).html()){
                                $(eleid).parent().find(".addthird-rate").html(Math.round(eles["bookperf"]["bookRate"]*1000)/10+"%");
                            }
                        });
                    });
                    //7天预约率
                    $.each(shopAjaxData.stores_perf[0]["waiterPerf_7days"]["bookDatas"],function(indexs,eles){
                        $.each($(".staff-id-tips"),function(indexid,eleid){
                            if(eles["id"] == $(eleid).html()){
                                $(eleid).parent().find(".addseven-rate").html(Math.round(eles["bookperf"]["bookRate"]*1000)/10+"%");
                            }
                        });
                    });
                    
                    $("#tree_book_rate").html(Math.round(shopAjaxData.stores_perf[0]["waiterPerf_3days"]["bookSums"]["bookRate"]*1000)/10);
                    $("#seven_book_rate").html(Math.round(shopAjaxData.stores_perf[0]["waiterPerf_7days"]["bookSums"]["bookRate"]*1000)/10);
                    var itemHeight = $("#cus_proba").css("height").replace("px","");
                    if(itemHeight > clientHeight){
                        $("#cus_proba").css("height",clientHeight);
                    }
                  //ajax尾
                },
                error:function(err){
                    console.log(err)
                },
                complete:function(){
                    $(".loading-gif").hide();
                }
             }); 
        };
        
    },
    AddClassForDetail: function(){
        var _this = this;
        $(".bigdata-table tr").each(function(index,ele){
            console.log(_this.PchildrenTree[index]);
           $(ele).children("td").eq(5).addClass("operator"+_this.PchildrenTree[index]);
        });
    },
    getChild:function(argum){
        var childrenTree = [];
        $.each($("#dataSid"+argum).children("div"),function(i,e){
            var aa = $(e).attr("id").replace("dataSid","");
            childrenTree.push(aa);
         });
        this.PchildrenTree = childrenTree;
    }
};

var bossData = new BossData();




























