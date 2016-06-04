<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8">
	<link href="/YyBizmaster/stylesheet/site-pc.css" rel="stylesheet" />
	<link href="/YyBizmaster/stylesheet/boss_stage.css" rel="stylesheet" />
</head>
<body>
	<jsp:include page="boss_header.jsp" />
	<jsp:include page="boss_side.jsp" />
	
	<div class="boss-box">
		<div class="boss-container">
			<div class="boss-time-data">
				<ul>
					<li class="color-default-bca" id="gettoday_data">当天统计数据</li>
					<li id="getweek_data">本周统计数据</li>
					<li id="getmonth_data">本月统计数据</li>
				</ul>
			</div>
			<div class="boss-data-item">
				<div class="data-item-detail">
					<div class="item-detail-header">
						<div class="detail-header-left">到店总人数：<span class="arrive-num">137</span>人</div>
						<div class="detail-header-right">总消费金额：<span>684500</span>元</div>
					</div>
					<div class="item-detail-content">
						<p>
							<span class="pline-left">预约数:
								<span class="pline-left-sty"><span id="booking_count">168</span>人</span>
							</span>
							<span class="pline-right">预约数=当天要到店的预约</span>
						</p>
						<p>
							<span class="pline-left">到店率:
								<span class="pline-left-sty"><span id="arrive_count_pecent">82.5</span>%</span>
							</span>
							<span class="pline-right">到店率=实际到店人数/预约人数</span>
						</p>
						<div class="button-click pline-click" id="pline-click">查看详情</div>
					</div>
					<div class="item-table" id="item-table">
						<ul>
							<li class="item-li1">预约创建者</li>
							<li class="item-li2">顾客昵称</li>
							<li class="item-li3">到店日期</li>
							<li class="item-li4">到店时间</li>
							<li class="item-li5">服务项目</li>
							<li class="item-li6">消费金额</li>
							<li class="item-li7">上钟员工</li>
							<li class="item-li8">工号</li>
						</ul>
						<table>
							<tbody>
							
							</tbody>
						</table>
					</div>
				</div>
				<!-- 新增预约订单 -->
				<div class="data-item-detail">
					<div class="item-detail-header">
						<div class="detail-header-left">
							新增预约订单
							<span id="add_new_deal"></span>
							次
						</div>
					</div>
					<div class="item-detail-content">
						<p>
							<span class="pline-left">本店创建的预约:
								<span class="pline-left-sty"><span id="self_shop_booking">--</span>次</span>
							</span>
							<span class="pline-right">占比:<span id="com_create_booking">--</span></span>
						</p>
						<p>
							<span class="pline-left">顾客创建的预约:
								<span class="pline-left-sty"><span id="cus_create_booking">--</span>次</span>
							</span>
							<span class="pline-right">占比：<span id="creat_book_rate">--</span></span>
						</p>
						<div class="button-click pline-click" id="newadd_booking">查看详情</div>
					</div>
					<div class="item-table" id="addnew_booking">
						<ul>
							<li class="item-li1">预约创建者</li>
							<li class="item-li2">顾客昵称</li>
							<li class="item-li3">预约日期</li>
							<li class="item-li4">预约时间</li>
							<li class="item-li5">服务项目</li>
							<li class="item-li6">金额</li>
							<li class="item-li7">被预约的员工</li>
							<li class="item-li8">工号</li>
						</ul>
						<table>
							<tbody>
							
							</tbody>
						</table>
					</div>
				</div>
				<!-- 员工服务统计 -->
				<div class="data-item-detail">
					<div class="item-detail-header">
						<div class="detail-header-left">
							员工服务统计							
						</div>
					</div>
					<div class="item-detail-content">
						<p>
							<span class="pline-left">员工服务总人数:
								<span class="pline-left-sty"><span id="ser_all_people">--</span>人</span>
							</span>
							<span class="pline-right">上钟率：= 单钟服务时长 / 一天满钟时长</span>
						</p>
						<p>
							<span class="pline-left">员工服务总时长:
								<span class="pline-left-sty"><span id="ser_job_time">--</span></span>
							</span>
						</p>
						<div class="button-click pline-click" id="cus_server">查看详情</div>
					</div>
					<div class="item-table" id="cus_server_stati">
						<ul>
							<li class="item-licus">工号</li>
							<li class="item-licus">员工姓名</li>
							<li class="item-licus">服务人数</li>
							<li class="item-licus">服务时长</li>
							<li class="item-licus">上钟率</li>
							<li class="item-licus">业绩总额</li>
						</ul>
						<table>
							<tbody>
							
							</tbody>
						</table>
					</div>
				</div>
				<!-- 员工新接预约订单 -->
				<div class="data-item-detail">
					<div class="item-detail-header">
						<div class="detail-header-left">
							员工新接预约订单					
						</div>
					</div>
					<div class="item-detail-content">
						<p>
							<span class="pline-left">三天预约率:
								<span class="pline-left-sty"><span id="tree_book_rate">83</span>%</span>
							</span>
							<span class="pline-right">预约率：= 被预约时长 / 工作时长</span>
						</p>
						<p>
							<span class="pline-left">七天预约率:
								<span class="pline-left-sty"><span id="seven_book_rate">67</span>%</span>
							</span>
						</p>
						<div class="button-click pline-click" id="cus_proba_click">查看详情</div>
					</div>
					<div class="item-table" id="cus_proba">
						<ul>
							<li class="item-licus">工号</li>
							<li class="item-licus">员工姓名</li>
							<li class="item-licus">新增预约</li>
							<li class="item-licus">今天预约率</li>
							<li class="item-licus">三天预约率</li>
							<li class="item-licus">七天预约率</li>
						</ul>
						<table>
							<tbody>
							
							</tbody>
						</table>
					</div>
				</div>
				
				
			</div>
			<div class="boss-big-data">
				<div class="bigdata-main">
					<h1>--</h1>
					<p>下辖分部：<span class="content-detail-shop">--</span>个</p>
					<p>区内管辖店铺：<span class="content-detail">--</span>个</p>
					<p>顾客到店总数：<span class="content-detail-people">--</span>人次</p>
					<p>顾客消费总额：<span class="content-detail-costs">--</span>元</p>
					<p>全区新增预约：<span class="content-detail-booking">--</span>单</p>
					<div class="chart-change">
						<div class="button-click" id="table_data">表格数据</div><!-- 
						 --><div class="button-click-nobg" id="chart_compare">图形比较</div>
					</div>
				</div>
				<div class="bigdata-table">
					<ul>
						<li>区域</li>
						<li>顾客到店</li>
						<li>顾客消费</li>
						<li>新增预约</li>
						<li>操作</li>
					</ul>
					<table>
						<tbody>
						
						</tbody>
					</table>
				</div>
				<div class="chartdata-show">
					<div class="chart-item">
						<h2>顾客到店情况比较</h2>
						<div class="chart-tree" id="Cus_tree">
						</div>
					</div>
					<div class="chart-item">
						<h2>顾客消费情况比较</h2>
						<div class="chart-tree" id="Cost_tree">
						</div>
					</div>
					<div class="chart-item">
						<h2>新增预约情况比较</h2>
						<div class="chart-tree" id="Booking_tree">
						</div>
					</div>
				</div>
			</div>
			<div class="circle-chart">
				<div class="circle-title">
					<div class="cus-title">
						<div>顾客到店总数:</div>
						<div class="custitle-detail" id="cus_arrive_num">---</div>
					</div><!-- 
					 --><div class="cost-title">
						<div>顾客消费总额:</div>
						<div class="custitle-detail" id="cus_cost_num">---</div>
					</div><!-- 
					 --><div class="book-title">
						<div>新增预约:</div>
						<div class="custitle-detail" id="new_add_book">---</div>
					</div>
				</div>
				<canvas class="circle circle-shop" width="320px" height="300px"></canvas>
				<canvas class="circle circle-book" width="320px" height="300px"></canvas>
				<canvas class="circle circle-cost" width="320px" height="300px"></canvas>
			</div>
		</div>
	</div>
	
	<jsp:include page="footercomm.jsp" />
	<script src="/YyBizmaster/js/canvas.js"></script>
  <script type="text/javascript" src="/YyBizmaster/js/common.js" charset="UTF-8"></script>
	<script type="text/javascript" src="/YyBizmaster/js/boss_stage.js" charset="UTF-8"></script>
	
</body>
</html>
