var userDataList = [];

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


function handleSmartStoreData(userDataList) {
  this.userDataList = userDataList
  let table = document.createElement('table');
  let thead = document.createElement('thead');
  let tbody = document.createElement('tbody');

  table.appendChild(thead);
  table.appendChild(tbody);

  var tableQuery = document.querySelector('#table');
  removeAllChildNodes(tableQuery);
  tableQuery.appendChild(table);

  userDataList.forEach(function(element, index, array){
    // Creating and adding data to second row of the table
    let row = document.createElement('tr');
    let row_data_0 = document.createElement('td');
    row_data_0.innerHTML = element.orderNo;
    let row_data_1 = document.createElement('td');
    row_data_1.innerHTML = element.receiverName;
    let row_data_2 = document.createElement('td');
    row_data_2.innerHTML = element.receiverTelNo1;
    let row_data_3 = document.createElement('td');
    row_data_3.innerHTML = element.receiverTelNo2;
    let row_data_4 = document.createElement('td');
    row_data_4.innerHTML = element.receiverAddress;
    var btn = document.createElement('input');
    btn.type = "button";
    btn.className = "btn";
    btn.value = "선택";
    btn.onclick = function() {
      handleOnClick(index)
    };


    row.appendChild(row_data_0);
    row.appendChild(row_data_1);
    row.appendChild(row_data_2);
    row.appendChild(row_data_3);
    row.appendChild(row_data_4);
    row.appendChild(btn);
    tbody.appendChild(row);
  });
}

function handleOnClick(index) {
  message.innerText = userDataList[index].receiverName;

  chrome.tabs.query({
  }, (tabs) => {
    var founded = false;
    tabs.forEach(tb => {
      if (tb.title.includes('위탁 시스템')){      
        founded = true
        chrome.tabs.sendMessage(tb.id, {action: "fillUserData",source: userDataList[index]}, function(response) {console.log(response)})
      }    
    });
    if(!founded) {
      message.innerText = "에이스 위탁 시스템을 찾을 수 없습니다."
    }
  });
}

function onWindowLoad() {
  var message = document.querySelector('#message');
  document.getElementById("qoo10Button").addEventListener("click", qoo10ButtonClicked);
}

function qoo10ButtonClicked(){
  console.log('qoo10ButtonClicked');
  openQCoinLinkTab();
  checkAndLoadQoo10Control();
}

function checkAndLoadQoo10Control() {
  chrome.tabs.query({
  }, (tabs) => {
    var foundQoo10 = false;
    tabs.forEach(tb => {
      if (tb.title == 'Qoo10'){
        foundQoo10 = true
        loadQoo10Control(tb.id)
      } 
    });
    message.innerText = ""
    if(!foundQoo10) {
      message.innerText += "Qoo10 탭을 찾을 수 없습니다.\n"
    }
  });
}

function loadQoo10Control(tabId) {
  chrome.tabs.sendMessage(
    tabId, 
    {action: "isQoo10ControlLoaded"}, 
    function(response) {
      console.log("isQoo10ControlLoaded response " + response)
      if (response != true) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['assets/js/qoo10Control.js']
        })  
      } 
  })
}

function openQCoinLinkTab() {
  chrome.tabs.create({active: true, url: "https://www.qoo10.com/gmkt.inc/Goods/Goods.aspx?goodscode=705045258"});
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  // if (request.action == "initSmartStoreSource") {
  //   handleSmartStoreData(request.source);
  // }
});
window.onload = onWindowLoad;