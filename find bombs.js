   window.onload= function(){
   document.gameform.reset();
}
//选定级别的游戏初始化
function init( max_r, max_c, number){
	//游戏 默认9*9
	var max_r= arguments[0] || 9; 	//arguments[1] ? arguments[1]:9;
	var max_c= arguments[1] || 9; 	//arguments[2] ? arguments[2]:9;
	//雷数
	var number= arguments[2] || 10;	//arguments[3] ? arguments[3]:10;
	var m_number = number;
	document.getElementById("minesCount").value = number;
	//方块点击数，第一次点击时在布雷，即测试counter==1
	var counter=0;
	//游戏主数组。保存雷及其状态，还有扫后状态
	var tbArray=new Array(max_r);
	//对每块周边雷数进行统计的数组，每个元素存储了每块一周有的雷数
	var minesArray=new Array(max_r);
	//存储方块被标记了小旗及问号的数组。标记了小旗，此块左键将禁用，直到小旗被取消
	var squareArray = new Array(max_r);
	
	//初始化游戏表格及各数组
	var table=document.getElementById("gameplay");
	var tbody=document.createElement("tbody");
	table.appendChild(tbody);
	for(var i=0; i<max_r; i++){
		tbody.insertRow(i);
		tbArray[i]=new Array(max_c);
		minesArray[i]=new Array(max_c);
		squareArray[i] = new Array(max_c);
		for(var j=0; j<max_c; j++){
			tbody.rows[i].insertCell(j);
			tbArray[i][j]=0;
			minesArray[i][j]=0;
			squareArray[i][j]=0;
		}
	}
	
	//计时
	var time=0;
	var timeCount = document.getElementById("timeCount");
	//开始计时
	function startTime(){
		time=time+1;
		document.getElementById("timeCount").innerHTML=time;
	}
	//清除计时
	function stopTime(){
		clearInterval(t);
	}

	//布雷 (while函数与自减运算符妙用)
	function createMines( event, number){
		//获取被点击的单元格位置，用于第一次点击后布雷
		var target = getEventTarget(event);
		//行数target.parentElement.rowIndex
		var r= target.parentElement.rowIndex;
		//列数target.cellIndex
		var c= target.cellIndex;
		while(number>0){ 
			var i=Math.floor(Math.random()*100%max_r);
			var j=Math.floor(Math.random()*100%max_c);
			//保证第一点击那格及其四周无雷
			if(firstClickCheck( r, c, i, j)){
				//设置不重复的，规定数目的雷
				if(tbArray[i][j]!=-1){
					tbArray[i][j]=-1;
					number--;
				}
			}
		}
	}

	//分情况调用函数检测，保证第一点击那格及其四周无雷
	function firstClickCheck( i, j, r, c){
		var result;
		//先对四个角判断，每个角周围有三格
		if(i==0 && j==0){
			result = checkAroundMines( 0, 1, 0, 1, r, c);
		}else if(i==0 && j == (max_c-1)){
			result = checkAroundMines( 0, 1, j-1, j, r, c);
		}else if(i== (max_r-1) && j==0){
			result = checkAroundMines( i-1, i, 0, 1, r, c);
		}else if(i == (max_r-1) && j == (max_c-1)){
			result = checkAroundMines( i-1, i, j-1, j, r, c);
		}else if( i==0){	//第一行 周围有5格
			result = checkAroundMines( 0, 1, j-1, j+1, r, c);
		}else if( i == (max_r-1)){	//最后一行
			result = checkAroundMines( i-1, i, j-1, j+1, r, c);
		}else if( j==0){	//第一列
			result = checkAroundMines( i-1, i+1, j, j+1, r, c);
		}else if( j == (max_c-1)){	//最后一列
			result = checkAroundMines( i-1, i+1, j-1, j, r, c);
		}else{	//周围有八个格
			result = checkAroundMines( i-1, i+1, j-1, j+1, r, c);
		}
		
		return result;
	}
	
	//循环判断，该(r,c)格四周有雷返回false，无雷返回true
	function checkAroundMines( x1, x2, y1, y2, r, c ){
		for( var i=x1; i<=x2; i++){
			if( i==r){
				for (var j=y1; j<=y2; j++){
					if( j==c){
						return false;
					}
				}
			}
		}
		return true;
	}

	//显示游戏界面
	function show(){
		for(var i=0; i<max_r; i++){
			for(var j=0; j<max_c; j++){
				if(tbArray[i][j] == -1){				
					//初始布好的雷的显示，可以并到最后，此处单独写出便于测试
					//tbody.rows[i].cells[j].className = "mines";
					tbody.rows[i].cells[j].className = "square";
				}else if(tbArray[i][j] ==-2){	//被点击了的雷
					tbody.rows[i].cells[j].className = "mines_b";
				}else if(tbArray[i][j] == -3){	
					//结束时没有排除的雷显示（包括成功结束游戏但没插旗情况）
					tbody.rows[i].cells[j].className = "mines";
				}else if(tbArray[i][j] == -4){	
					//失败结束时被排错的地方显示(被标错地方)
					tbody.rows[i].cells[j].className = "mines_x";
				}else if(tbArray[i][j] == -5){	
					//失败结束时已排除雷显示（旗插对了地方）
					tbody.rows[i].cells[j].className = "mines_flag";
				}else if(tbArray[i][j] == -6){	
					//失败结束时 问号标记的是雷（问号下面是雷）
					tbody.rows[i].cells[j].className = "mines_mark";
				}else if(tbArray[i][j] == 1){
					//点开后无雷的区域（实际也没标数字）
					tbody.rows[i].cells[j].className = "noMines";
				}else if(tbArray[i][j] ==0){
					//未点击的区域（仍被盖住的）
					tbody.rows[i].cells[j].className = "square";
				}
				
				//插入周围雷的数字（点开后无雷，但其周围有雷）
				if(minesArray[i][j] !=0 && tbArray[i][j] ==1 && squareArray[i][j] !=1){
					tbody.rows[i].cells[j].innerHTML = minesArray[i][j];
					tbody.rows[i].cells[j].className = "color" + minesArray[i][j];
				}
				
				//显示方块被标记小旗 及 问号
				if(squareArray[i][j] == 1){
					tbody.rows[i].cells[j].className = "flag";
				} else if(squareArray[i][j] == 2){
					tbody.rows[i].cells[j].className = "mark";
				}
			}
		}
	}

	/*扩展显示无雷区域,释出空白
	*(被点击格及其周围，还有周围格的周围也都没有雷的，就全显示)
	*/
	function showClick(event){
		var target = getEventTarget(event);
		//列数target.cellIndex
		//行数target.parentElement.rowIndex
		checknoMines( target.parentElement.rowIndex, target.cellIndex);
	}

	//对表格分情况 检查
	function checknoMines( i, j){
		//先对四个角检查
		if(i==0 && j==0){
			if(checkAroundNoMines( 0, 1, 0, 1) == true){
				respondNoMines( 0, 1, 0, 1);
			}
		}else if(i==0 && j == (max_c-1)){
			if(checkAroundNoMines( 0, 1, j-1, j) == true){
				respondNoMines( 0, 1, j-1, j);
			}
		}else if(i== (max_r-1) && j==0){
			if(checkAroundNoMines( i-1, i, 0, 1) == true){
				respondNoMines( i-1, i, 0, 1);
			}
		}else if(i == (max_r-1) && j == (max_c-1)){
			if(checkAroundNoMines( i-1, i, j-1, j) == true){
				respondNoMines( i-1, i, j-1, j);
			}
		}else if( i==0){	//依次对第一行列，最后一行列进行检查
			if(checkAroundNoMines( 0, 1, j-1, j+1) == true){
				respondNoMines( 0, 1, j-1, j+1);
			}
		}else if( i == (max_r-1)){
			if(checkAroundNoMines( i-1, i, j-1, j+1) == true){
				respondNoMines( i-1, i, j-1, j+1);
			}
		}else if( j==0){
			if(checkAroundNoMines( i-1, i+1, j, j+1) == true){
				respondNoMines( i-1, i+1, j, j+1);
			}
		}else if( j == (max_c-1)){
			if(checkAroundNoMines( i-1, i+1, j-1, j) == true){
				respondNoMines( i-1, i+1, j-1, j);
			}
		}else{	//可以对四周检查的
			if(checkAroundNoMines( i-1, i+1, j-1, j+1) == true){
				respondNoMines( i-1, i+1, j-1, j+1);
			}
		}
	}

	//检查被点击格子四周没有雷返回true，有雷返回false
	function checkAroundNoMines( x1, x2, y1, y2){
		for( var i=x1; i<=x2; i++){
			for (var j=y1; j<=y2; j++){
				if(tbArray[i][j] ==-1 || tbArray[i][j] ==-2){
					return false;
				}
			}
		}
		return true;
	}
	
	//没雷，释出空白，然后递归的对四周的四周进行检查
	function respondNoMines( x1, x2, y1, y2){
		for( var i=x1; i<=x2; i++){
			for (var j=y1; j<=y2; j++){
				if(tbArray[i][j] ==0 && squareArray[i][j] !=1){
					if(squareArray[i][j] ==2){
						squareArray[i][j] = 0;
					}
					tbArray[i][j] = 1;
					checknoMines( i, j);
				}
			}
		}
	}

	//分情况讨论，对周边雷数的统计
	function statistics(){
		for(var i=0; i<max_r; i++){
			for (var j=0; j<max_c; j++){
				//先对四个角统计
				if(i==0 && j==0){
					minesArray[i][j] = statisticsEachAround( 0, 1, 0, 1);
				}else if(i==0 && j == (max_c-1)){
					minesArray[i][j] = statisticsEachAround( 0, 1, j-1, j);
				}else if(i == (max_r-1) && j==0){
					minesArray[i][j] = statisticsEachAround( i-1, i, 0, 1);
				}else if(i == (max_r-1) && j == (max_c-1)){
					minesArray[i][j] = statisticsEachAround( i-1, i, j-1, j);
				}else if( i==0){
					minesArray[i][j] = statisticsEachAround( 0, 1, j-1, j+1);
				}else if( i == (max_r-1)){
					minesArray[i][j] = statisticsEachAround( i-1, i, j-1, j+1);
				}else if( j==0){
					minesArray[i][j] = statisticsEachAround( i-1, i+1, j, j+1);
				}else if( j == (max_c-1)){
					minesArray[i][j] = statisticsEachAround( i-1, i+1, j-1, j);
				}else{
					minesArray[i][j] = statisticsEachAround( i-1, i+1, j-1, j+1);
				}
			}
		}
	}
	
	//统计一个格子的四周的雷数，返回该雷数
	function statisticsEachAround( x1, x2, y1, y2){
		var num=0;
		for( var i=x1; i<=x2; i++){
			for (var j=y1; j<=y2; j++){
				if(tbArray[i][j]==-1){
					num++;
				}
			}
		}
		return num;
	}

	// 右键 切换方块，小旗及问号
	function switchSquare(event){
		var target = getEventTarget(event);
		//列数target.cellIndex
		//行数target.parentElement.rowIndex
		if(squareArray[target.parentElement.rowIndex][target.cellIndex]== 0){
			//方块变小旗
			squareArray[target.parentElement.rowIndex][target.cellIndex] = 1;
			m_number = m_number-1;
			document.getElementById("minesCount").value=m_number;
		}else if(squareArray[target.parentElement.rowIndex][target.cellIndex]==1){
			//小旗变问号
			squareArray[target.parentElement.rowIndex][target.cellIndex] = 2;
			m_number = m_number +1;
			document.getElementById("minesCount").value=m_number;
		}else if(squareArray[target.parentElement.rowIndex][target.cellIndex]==2){
			//问号变方块
			squareArray[target.parentElement.rowIndex][target.cellIndex] = 0;
		}
	}

	//判断是否踩雷
	function check(event){
		var target = getEventTarget(event);
		//列数target.cellIndex
		//行数target.parentElement.rowIndex
		//踩雷
		if(tbArray[target.parentElement.rowIndex][target.cellIndex]==-1){
			tbArray[target.parentElement.rowIndex][target.cellIndex]=-2;
			//对已排除的雷 和未排除的进行区分
			for(var i=0; i<max_r; i++){
				for(var j=0; j<max_c; j++){
					if (tbArray[i][j] == 0 && squareArray[i][j]==1){
						tbArray[i][j] = -4;
						squareArray[i][j] = 0;
					} else if (tbArray[i][j] == -1 && squareArray[i][j] ==1){
						tbArray[i][j] = -5;
						squareArray[i][j] = 0;
					} else if (tbArray[i][j] == -1 && squareArray[i][j] ==2){
						tbArray[i][j] = -6;
						squareArray[i][j] = 0;
					} else if (tbArray[i][j] ==-1){
						tbArray[i][j] = -3;
					}
				}
			}
			EventUtil.removeHandler(tbody, "mouseup", operate);
			//显示结束画面
			show();
			//停止计时
			stopTime();
			alert("不好意思,下面有雷，您输了！");
		}else if(tbArray[target.parentElement.rowIndex][target.cellIndex]==0 && squareArray[target.parentElement.rowIndex][target.cellIndex] !=1){
			//没有踩雷
			tbArray[target.parentElement.rowIndex][target.cellIndex]=1;
			if(squareArray[target.parentElement.rowIndex][target.cellIndex]==2){
				squareArray[target.parentElement.rowIndex][target.cellIndex]=0;
			}
			checknoMines( target.parentElement.rowIndex, target.cellIndex);
		}
	}
	
	//判断是否扫完雷
	function checkEnd(){
		for(var i=0; i<max_r; i++){
			for(var j=0; j<max_c; j++){
				if (tbArray[i][j]==0){
					return false;
				}
			}
		}
		//显示全部的雷
		for(var i=0; i<max_r; i++){
			for(var j=0; j<max_c; j++){
				if (tbArray[i][j] < 0){
					tbArray[i][j] = -3;
				}
			}
		}
		return true;
	}
	
	//游戏成功结束
	function result(){
		if (checkEnd()==true){
			EventUtil.removeHandler(tbody, "mouseup", operate);
			stopTime();
			alert("恭喜你，扫雷成功!");
		}
	}
	
	//检测目标元素，即被点击的元素
	function getEventTarget(event){
		var e= event|| window.event;
		return e.target || e.srcElement;
	}

	//第一次点击后开始布雷及统计及定时
	function start(event){
		counter++;
		if(counter==1){
			//初始化
			createMines( event, number );
			statistics();
			t=setInterval(startTime,1000);
		}
	}

	function operate(event){
		switch(event.button){
			//左击 排雷
			case 0:
			case 1: start(event);
					check(event);
					result();
					showClick(event);
					show();	
					break;
			//右击 标记
			case 2: 
					switchSquare(event);
					show();
					break;
		}
	}

	EventUtil.addHandler(tbody, "mouseup", operate);
	document.oncontextmenu = function(){
			return false;
	}
	
	//重新开始新游戏
	function restart(){
		stopTime();
		document.getElementById("timeCount").innerHTML=0;
		var tableChild = table.childNodes;
		if(tableChild.length>0){
			table.removeChild(tableChild[tableChild.length-1]);
		}
		switchVersion();
	}

	//添加重新开始游戏按钮
	var res = document.getElementById("restart");
	EventUtil.addHandler( res, "click", restart);
	
	//游戏预先初始化
	show();
}

//兼容各浏览器的通用事件处理对象
var EventUtil= {
	addHandler:function(element, type, handler){
		if(element.addEventListener){
			//Firefox, Chrome, Safari, Opera
			element.addEventListener(type , handler, false);
		}else if (element.attachEvent){
			//IE, Opera
			element.attachEvent("on"+type, handler);
		} else {
			//default
			element["on"+type] = handler;
		}
	},
	removeHandler: function(element, type, handler){
		if (element.removeEventListener){
			element.removeEventListener(type, handler, false);
		}else if (element.detachEvent){
			element.detachEvent("on"+type, handler);
		}else {
			element["on"+type] = null;
		}
	}
}

//选择游戏的级别
function switchVersion(){
	var minesDef = document.getElementById("minesDef").value;
	//匹配正整数
	var regular = /^[1-9]+[0-9]*$/;
	var version = document.getElementsByName("version");
	for( var i=0; i < version.length; i++){
		if( version[i].checked == true){
			if( version[i].value == 1){
				if( regular.test( minesDef )== false || minesDef>30){
					minesDef = 10;
				}
				init( 9, 9, minesDef);
			}else if ( version[i].value == 2){
				// 16*16网格 默认40个雷
				if( regular.test( minesDef )== false || minesDef>100){
					minesDef = 40;
				}
				init( 16, 16, minesDef);
			}else if ( version[i].value == 3){
				//16*30网格 默认99个雷
				if( regular.test( minesDef )== false || minesDef>200){
					minesDef = 99;
				}
				init( 16, 30, minesDef);
			}
		}
	}
}

//清除时用的计时标记
var t;
//游戏级别
var version = document.getElementsByName("version");
//初始游戏
switchVersion();
	
//游戏级别单选按钮的检测
EventUtil.addHandler( version[0], "click", radioClick );
EventUtil.addHandler( version[1], "click", radioClick );
EventUtil.addHandler( version[2], "click", radioClick );
function radioClick(){
	clearInterval(t);
	var table = document.getElementById("gameplay");
	document.getElementById("timeCount").innerHTML=0;
	var tableChild = table.childNodes;
	if(tableChild.length>0){
		table.removeChild(tableChild[tableChild.length-1]);
	}
	switchVersion();
}
