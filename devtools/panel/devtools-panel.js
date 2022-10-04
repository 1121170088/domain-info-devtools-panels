let infoseverInput = document.querySelector('#infosever');
let submseverInput = document.querySelector('#submsever');
let savebtn = document.querySelector('#e2');
let submitbtn = document.querySelector('#e1');
let msg = document.querySelector('#msg');

let gettingAllStorageItems = browser.storage.local.get(null);
gettingAllStorageItems.then((results) => {
    	infoseverInput.value = results.infosever
    	submseverInput.value = results.submsever
})

savebtn.addEventListener('click', function() {
	
	browser.storage.local.set(
	{ 
		infosever: infoseverInput.value,
		submsever: submseverInput.value
		
	});
	
});

submitbtn.addEventListener('click', function() {
	let cs = document.getElementsByClassName("check0");
	let count = 0;
	for (i = 0; i < cs.length; i++) {
		if (cs[i].checked) {
			
			let xhr = new XMLHttpRequest();
			xhr.open("GET", submsever.value + cs[i].value, false);
			xhr.onerror = function(v) {
				showMsg("提交错误")
			}
			xhr.send()
			
			count++;
		}
		
	}
	showMsg("共提交" + count + "个域名");
	
});


document.getElementById("ee").addEventListener("click", () => {

	let tables = document.getElementsByTagName('table')
	if (tables.length > 0) {
		document.body.removeChild(tables[0])
	}
	
	let getting = browser.devtools.network.getHAR()
	let o = {}
	getting.then((log)=>{
		
		log.entries.forEach(function(entry) {
			let url = entry.request.url
			let domain = ""
			let idx1 = url.indexOf('//')
			if (idx1 == -1) {
				return
			}
			let idx2 = url.indexOf('/', idx1 + 2)
			if (idx2 == -1) {
				domain = url.substring(idx1 + 2, url.length)
			} else {
				domain = url.substring(idx1 + 2, idx2)
			}
			var patt = /^\d+\.\d+\.\d+\.\d+$/;
			if (!patt.test(domain)) {
				o[domain] = ""
			}
		})
		
	}).then(()=>{
		let xhr = new XMLHttpRequest();
		xhr.open("POST", infosever.value, true);
		let jsonstr = JSON.stringify(Object.keys(o))
		
		xhr.onerror = function(v) {
				showMsg("查询出差")
			}
		xhr.send(jsonstr)
		xhr.onload = function () {
			if (xhr.readyState === xhr.DONE) {
				if (xhr.status === 200) {
					
					let res = JSON.parse(xhr.responseText)
		
					addTable(res)
					showMsg("共有" + Object.keys(o).length + "个域名")
				}
			}
		}
		
	});
	
});

function addTable(obj) {
	let table = document.createElement("table");
	table.setAttribute('class', 'gridtable')
	
	addTableHeader(table)
	let arr = Object.keys(obj)
	arr.forEach(function(domain) {
		let tr = document.createElement("tr");
		
		let td1 = document.createElement("td");
		let check = document.createElement("input");
		check.type="checkbox"
		check.value=domain
		check.setAttribute('class', 'check0')
		td1.appendChild(check)
		tr.appendChild(td1)
	
		let th2 = document.createElement("td");
		let text2 = document.createTextNode(domain);
		th2.appendChild(text2)
		tr.appendChild(th2)
		
		let th3 = document.createElement("td");
		let text3 = document.createTextNode(obj[domain].ip);
		th3.appendChild(text3)
		tr.appendChild(th3)
		
		let th4 = document.createElement("td");
		let text4 = document.createTextNode(obj[domain].continent);
		th4.appendChild(text4)
		tr.appendChild(th4)
		
		let th5 = document.createElement("td");
		let text5 = document.createTextNode(obj[domain].country);
		th5.appendChild(text5)
		tr.appendChild(th5)
		
		let th6 = document.createElement("td");
		let text6 = document.createTextNode(obj[domain].province);
		th6.appendChild(text6)
		tr.appendChild(th6)
		
		let th7 = document.createElement("td");
		let text7 = document.createTextNode(obj[domain].city);
		th7.appendChild(text7)
		tr.appendChild(th7)
		
		let th8 = document.createElement("td");
		let text8 = document.createTextNode(obj[domain].organization);
		th8.appendChild(text8)
		tr.appendChild(th8)
	
		table.appendChild(tr)
	})
	document.body.appendChild(table)
		
}

function addTableHeader(table) {
	let tr = document.createElement("tr");
	let th1 = document.createElement("th");
	let check = document.createElement("input");
	check.type="checkbox"
	check.onclick=function() {
		let cs = document.getElementsByClassName("check0");
		if (this.checked) {
			for (i = 0; i < cs.length; i++) {
				cs[i].checked=true
			}
		} else {
			for (i = 0; i < cs.length; i++) {
				cs[i].checked=false
			}
		}
	}
	th1.appendChild(check)
	tr.appendChild(th1)

	let th2 = document.createElement("th");
	let text2 = document.createTextNode("域名");
	th2.appendChild(text2)
	tr.appendChild(th2)
	
	let th3 = document.createElement("th");
	let text3 = document.createTextNode("ip");
	th3.appendChild(text3)
	tr.appendChild(th3)
	
	let th4 = document.createElement("th");
	let text4 = document.createTextNode("州");
	th4.appendChild(text4)
	tr.appendChild(th4)
	
	let th5 = document.createElement("th");
	let text5 = document.createTextNode("国家");
	th5.appendChild(text5)
	tr.appendChild(th5)
	
	let th6 = document.createElement("th");
	let text6 = document.createTextNode("省");
	th6.appendChild(text6)
	tr.appendChild(th6)
	
	let th7 = document.createElement("th");
	let text7 = document.createTextNode("城市");
	th7.appendChild(text7)
	tr.appendChild(th7)
	
	let th8 = document.createElement("th");
	let text8 = document.createTextNode("运营商");
	th8.appendChild(text8)
	tr.appendChild(th8)
	
	table.appendChild(tr)

}

function showMsg(newmsg) {
	msg.innerHTML = newmsg
}