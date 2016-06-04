<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<link href="/YyBizmaster/stylesheet/site-pc.css" rel="stylesheet" />
</head>
<body>
	<jsp:include page="headcomm.jsp" />
	
	<div class="layers-container">
		<form action="return false">
			<h1>BOSS登录</h1>
			<div class="username inputmessage">
				<input id="username" type="text"  placeholder="用户名">
			</div>
			<div class="password inputmessage">
				<input autocomplete="off" style="display:none">
				<input id="signuppass" type="password" placeholder="登录密码">
			</div>
			<div class="txtalg" style="margin-bottom:50px;">
				<div class="button-click" id="signin">登录</div>
			</div>
		</form>
	</div>
	
	<jsp:include page="footercomm.jsp" />
	<script>
	$("#signin").click(function(){
	    if($("#username").val().trim().length>0 && $("#signuppass").val().trim().length>0){
	        $.ajax({
	           type:"POST",
	           url:"/YyBizmaster/bizmsvr",
	           dataType:"json",
	           data:{
	               svrname:"userlogin",
	               user_id: $("#username").val().trim(),
	               pwd: $("#signuppass").val().trim()
	           },
	           success:function(data){
	               console.log(data);
	               if(data.errcode == "00000"){
	               		CookieUtil.SetCookie("yyboss_userid",$("#username").val().trim());
	       	        	location.href="/YyBizmaster/web/boss_stage.jsp";
	               }else{
	                   alert("用户名或密码错误");
	               }
	           },
	           error:function(err){
	               console.log(err)
	           }
	        });
	    }
	})
	</script>
</body>
</html>
