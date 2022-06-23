function fillUserData(userData) {
  var innerHtml = document.querySelector('frame[name="frame_right"]').contentWindow.document.documentElement;
  // var innerHtml = document;

  // Modify to orderMemberName + "," + userData.receiverName, if orderMemberName == receiverName then just single name
  innerHtml.querySelector('input[name="p_cust_name"]').value = userData.receiverName;
  phoneSplitedList = userData.receiverTelNo1.split("-")
  innerHtml.querySelector('input[name="p_cust_cel1"]').value = phoneSplitedList[0];
  innerHtml.querySelector('input[name="p_cust_cel2"]').value = phoneSplitedList[1];
  innerHtml.querySelector('input[name="p_cust_cel3"]').value = phoneSplitedList[2];

  if (userData.receiverTelNo2) {
    telSplitedList = userData.receiverTelNo2.split("-")
    innerHtml.querySelector('input[name="p_cust_tel1"]').value = telSplitedList[0];
    innerHtml.querySelector('input[name="p_cust_tel2"]').value = telSplitedList[1];
    innerHtml.querySelector('input[name="p_cust_tel3"]').value = telSplitedList[2];  
  } else {
    innerHtml.querySelector('input[name="p_cust_tel1"]').value = "";
    innerHtml.querySelector('input[name="p_cust_tel2"]').value = "";
    innerHtml.querySelector('input[name="p_cust_tel3"]').value = "";  
  }
  innerHtml.querySelector('input[name="p_cust_post"]').value = userData.receiverZipCode;
  innerHtml.querySelector('input[name="p_set_to_call"]').checked = false;
  innerHtml.querySelector('input[name="p_set_to_call"]').click();
  innerHtml.querySelector('input[name="p_cust_addr1"]').value = "";
  innerHtml.querySelector('input[name="p_cust_addr2"]').value = "";
  addressCoding(userData.receiverAddress, innerHtml); 
}

// api document 
// https://developers.kakao.com/docs/latest/ko/local/dev-guide
function addressCoding(address_str, innerHtml) {
  // 정규식
  // [0] : ((.*((([가-힣]+(d|d(,|.)d|)+(읍|면|동|가|리))(^구|)((d(~|-)d|d)(가|리|)|))([ ](산(d(~|-)d|d))|).[\d-d]+))|(([가-힣]|(d(~|-)d)|d)+(로|길)))(.*) ~로 xxx
  // [length - 1] : (.*) 위에꺼 뺀 나머지
  addr_str = address_str.match(/((.*([가-힣A-Za-z·\d~\-\.]|(d(~|-)d)|d)+(로|길).[\d-d]+)|(((.*[가-힣]+(d|d(,|.)d|)+(읍|면|동|가|리))(^구|)((d(~|-)d|d)(가|리|)|))([ ](산(d(~|-)d|d))|).[\d-d]+))(.*)/);
// (([가-힣]+(d|d(,|.)d|)+(읍|면|동|가|리))(^구|)((d(~|-)d|d)(가|리|)|))([ ](산(d(~|-)d|d))|)|
    // (([가-힣]|(d(~|-)d)|d)+(로|길))
  
  // addressCoding(addr_str, innerHtml);
  addr1 = addr_str[1];
  addr2 = addr_str[addr_str.length - 1].trim();
  console.log(addr1);
  console.log(addr2);

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "KakaoAK 55a1753061ceb898e4466d77366514cf");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch("https://dapi.kakao.com/v2/local/search/address.json?query=" + addr1, requestOptions)
    .then(response => response.text())
    .then(result => {
      var parsedResult = JSON.parse(result)
      console.log(parsedResult)
      if (parsedResult.documents[0].road_address && parsedResult.documents[0].address) {
        newAddress = parsedResult.documents[0].road_address.address_name 
        oldAddress = parsedResult.documents[0].address.address_name  
        addr1 = newAddress + "(" + oldAddress + ")"
      }
      
      innerHtml.querySelector('input[name="p_cust_addr1"]').value = addr1;
      innerHtml.querySelector('input[name="p_cust_addr2"]').value = addr2;
    })
    .catch(error => console.log('error', error));
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "fillUserData") {
    console.log("fillUserData received")
    fillUserData(request.source);    
  } else if (request.action == "isAceBedControlLoaded") {
    console.log("isAceBedControlLoaded received");    
    sendResponse(true);
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "getSmartStoreSource") {
    sendResponse(DOMtoString(document))
  } else if (request.action == "isSmartStoreControlLoaded") {
    console.log("isSmartStoreControlLoaded received");    
    sendResponse(true);
  }
});
