
// function getRaspberryIP()
// {
// 	//http://127.0.0.1:8000/index?pii=192.168.11.3
// 	url = window.location.href;
// 	url = url.split("pii=")[1];
// 	RaspberryIP = url;
// 	Controller_ServerURL = "http://" + RaspberryIP + ":8001"
// 	Console_ServerURL = "http://" + RaspberryIP + ":8000"
// 	console.log(url);
// }


var socket;
$(document).ready(function(){
	socket = io.connect();
	
	socket.on('Combine_Response', function(msg) {
		alert("合併完成");
	});

	document.querySelector('#Download_Result').addEventListener('click', function() {
		var a = document.createElement("a");
		a.href = "/static/combine.xlsx";
		a.download = 'combine.xlsx';
		a.click();
	});


	document.querySelector('#Combine').addEventListener('click', function() {
		socket.emit('Start_Combine', {data: "Start Combine"});
	});

	
	document.querySelector('#drop-zone').addEventListener('dragover', function (event)
	{
		// 取消拖拉時開啟檔案
		event.preventDefault();
	});
	
	document.querySelector('#drop-zone').addEventListener('drop', function (event) 
	{
		// 取消拖拉時開啟檔案
		event.preventDefault();
		
		// 取得拖拉的檔案清單
		let filelist = event.dataTransfer.files;
		fileDataList_bytes=[]
		fileNameList=[]
		socket.emit('Clear_History', {data: 'clear'});
		for (let i = 0; i < filelist.length; i++)
		{
			// 檔案名稱
			console.log(filelist[i].name);
			fileNameList.push(filelist[i].name);
			// 透過 FileReader 取得檔案內容
			let reader = new FileReader();
		
			reader.readAsArrayBuffer(filelist[i]);
			// 設定檔案讀取完畢時觸發的事件
			reader.onload = function(){
				binary = this.result;

				// 上傳檔案到伺服器端
				// upload(file);
				// 判斷是否為圖片
				if (filelist[i].type.match('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')==null)
				{
					alert ("檔案格式錯誤");
					return;
				}
				socket.emit('Upload_Stream', {filename:filelist[i].name,data: binary});
			}
		}
		
		document.getElementById("Upload_Result").innerText = fileNameList.join("\n")
		
	});
	

	
});