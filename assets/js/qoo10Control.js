
// function download(link) {
//   var element = document.createElement('a');
//   element.setAttribute('href', link);

//   element.style.display = 'none';
//   document.body.appendChild(element);

//   element.click();

//   document.body.removeChild(element);
// }

// function readTextFile(file)
// {
//     var rawFile = new XMLHttpRequest();
//     rawFile.open("GET", file, false);
//     rawFile.onreadystatechange = function ()
//     {
//         if(rawFile.readyState === 4)
//         {
//             if(rawFile.status === 200 || rawFile.status == 0)
//             {
//                 var allText = rawFile.responseText;
//                 alert("rawFile");
//             }
//         }
//     }
//     rawFile.send(null);
// }

// // function DOMtoString() {
// //     download("https://sell.smartstore.naver.com/b/v3/excel/order/api/merchants/510862020/deliveries/excel?merchantNo=510862020&serviceType=MP&paging.page=1&paging.size=100&sort.type=RECENTLY_ORDER_YMDT&sort.direction=DESC&summaryInfoType=NEW_ORDERS&filename=ace_bed_smartstore.xlsx")
// //     readTextFile("~/Downloads/ace_bed_smartstore.xlsx")
// // }

// function DOMtoString() {
//     // ${root}/o/v3/iframe/n/sale/delivery가 inner iframe document로 이루어져있기 때문에 해당 element를 getElementById를 사용하여 취득
//     console.log("DOMtoString called")
//     var innerHtml = document.getElementById('__delegate').contentWindow.document.documentElement;
//     // var userDataText = "새로운 데이터가 없거나 조회에 실패하였습니다.";
//     var userDataText = [];

//     var scripts = innerHtml.getElementsByTagName("script")
//     for (var i = 0; i < scripts.length; ++i) {
//         if (scripts[i].innerText.indexOf("__APOLLO_STATE__") !== -1) {
//             rootJsonText = scripts[i].innerText;
//             rootJsonData = JSON.parse(rootJsonText.split("=")[1].split(";")[0])
//             newOrderArray = rootJsonData["$ROOT_QUERY.smartstoreFindDeliveriesBySummaryInfoType_ForSaleDelivery({\"merchantNo\":\"510862020\",\"paging_page\":1,\"paging_size\":100,\"serviceType\":\"MP\",\"sort_direction\":\"DESC\",\"sort_type\":\"RECENTLY_ORDER_YMDT\",\"summaryInfoType\":\"NEW_ORDERS\"})"].elements
//             newOrderArray.forEach(function(element){
//                 // userDataText += JSON.stringify(element.id)
//                 userJsonData = rootJsonData[element.id]
//                 // userDataText += JSON.stringify(userJsonData)
//                 // userDataText += userJsonData.receiverAddress + "\n"
//                 userDataText.push(userJsonData)
//                 // userDataText += convertToUserData(userJsonData)
//             });

//         }
//     }
//     return userDataText;
// }

function hello() {
    console.log("hello")
}

hello();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "isQoo10ControlLoaded") {
    console.log("isQoo10ControlLoaded received");    
    sendResponse(true);
  }
});