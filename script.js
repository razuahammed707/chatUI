const userID=getAllUrlParams().userid||Math.random()
let rating = "";


if(!getAllUrlParams().userid){
  alert("Please provide the user parameter")
}



document.addEventListener("keypress",event=>{
 if( event.keyCode === 13){
  send_message()
}
})


const convertRating=(data)=>{
  if(data=="1"){
    return "ONE"
  }
  if(data=="2"){
    return "TWO"
  }
  if(data=="3"){
    return "THREE"
  }
  if(data=="4"){
    return "FOUR"
  }
  if(data=="5"){
    return "FIVE"
  }
}

const sendToRasa = async (data)=>{
  const rawRes= await fetch("http://localhost:5005/webhooks/rest/webhook", { 
          method: "POST", 
          body: JSON.stringify(data), 
  }) ;

  return await rawRes.json()
};

const MultiSelectValue=[]

const addData=(item)=>{
  let data = item.name
  const isValueExists=MultiSelectValue.includes(data)
  if(isValueExists===true){
    var dataIndex = MultiSelectValue.indexOf(data);
    MultiSelectValue.splice(dataIndex, 1);
  }else{
    MultiSelectValue.push(data)
  }
}





const renderMutiSelect=(data)=>{
  data.map(item=>{
    const history = document.getElementById("chatHistory");
    const input = document.createElement("input")
    const label = document.createElement("label");
    label.className="multi_select_opt"
    input.value=item.payload;
    input.name=item.payload;
    input.type="checkbox"
    label.innerHTML=item.payload;

    input.addEventListener("click", ()=>{
      addData(input)
    });
    label.append(input);
    history.append(label)
  })
};

const renderClickAbleBTN=(data)=>{
  data.map(item=>{
    const history = document.getElementById("chatHistory");
    let button = document.createElement("button");
    let div= document.createElement("div")
    button.innerHTML=item.payload;
    div.classList="clickAble";
    div.append(button)
    button.onclick=async()=>{

      userRes(item.payload);
      const res = await sendToRasa({
        "sender":userID,
        "message":item.payload
      });
      RenderBotMessage(res)

    }
    history.append(div)
    
    
  })
}

const printStart=()=>{
  const data = `
  <span onclick="starmark(this)" id="1one"  class="fa fa-star"></span>
  <span onclick="starmark(this)" id="2one"  class="fa fa-star "></span>
  <span onclick="starmark(this)" id="3one"  class="fa fa-star "></span>
  <span onclick="starmark(this)" id="4one"  class="fa fa-star"></span>
  <span onclick="starmark(this)" id="5one"  class="fa fa-star"></span>`

  let starBox= document.createElement("div");
  starBox.innerHTML=data
  starBox.classList="startBox"
  const history = document.getElementById("chatHistory");
  history.append(starBox)
};

const printAnotherStar=()=>{
  const data = `
  <span  onclick="AnotherStar(this)" id="1star"  class="fa fa-star"></span>
  <span  onclick="AnotherStar(this)" id="2star"  class="fa fa-star "></span>
  <span  onclick="AnotherStar(this)" id="3star"  class="fa fa-star "></span>
  <span  onclick="AnotherStar(this)" id="4star"  class="fa fa-star"></span>
  <span  onclick="AnotherStar(this)" id="5star"  class="fa fa-star"></span>`

  let starBox= document.createElement("div");
  starBox.innerHTML=data
  starBox.classList="startBox"
  const history = document.getElementById("chatHistory");
  history.append(starBox)
}

const userRes=(data)=>{
  const history = document.getElementById("chatHistory");
  const userRes = document.createElement("p");
  const container = document.createElement("div");
  container.className="userRes"
  userRes.innerHTML=data
  container.append(userRes)
  history.append(container)
}

const printFeedBack=()=>{
  let html =`
  <div class="thankYou">
      <div class="topLogo">
                    <img src="http://pro.tuneem.com/cavinsurvey/web/cfsurvey/images/cavinkare-logo.svg">
      </div>
    <img src="done.gif"/>
    <h2>Thank you for your valuable feedback!<br> We sincerely appreciate that you could spend your valuable time in <br> helping make your Just Mine! shampoo, the best ever!</h2>
  </div>
  `
  document.getElementById("mainContainer").innerHTML=html
}



const RenderBotMessage=(data)=>{

  console.log(data)

  if(data[0].text=="Highly delighted to hear that!"){
    localStorage.setItem("userStatus",true);
    printFeedBack()

  }

  if(data[0].text=="Thank you for your valuable feedback! We sincerely appreciate that you could spend your valuable time in helping make your Just Mine! shampoo, the best ever!"){
    localStorage.setItem("userStatus",true);
    printFeedBack()

  }

  if(data){
    data.map(item=>{
      const history = document.getElementById("chatHistory");
      const botReply = document.createElement("p");
      const botMsgContainer = document.createElement("div");
      botReply.innerHTML=item.text
      botMsgContainer.append(botReply);
      botMsgContainer.className="botReply"
      history.append(botMsgContainer)
      

      if(item.buttons){
        if(item.buttons.length==5){
          if(item.buttons[0].title==="FIVE"){
            printStart()
          }else if(item.buttons[0].title==="5star"){
            printAnotherStar()
          }
         
        }else if(item.buttons.length>2){
          renderMutiSelect(item.buttons)
        }else if(item.buttons.length===2){
          renderClickAbleBTN(item.buttons)
        }
      };
    })
  }
  rating=""
  let historBox = document.getElementById("chatHistory");
  historBox.scrollTop=historBox.scrollHeight

}



const send_message= async ()=>{
  
    if(rating!=""){
      const res = await sendToRasa({
        "sender":userID,
        "message":rating
      });
      userRes(rating)
      RenderBotMessage(res)
      rating=""
      return(1)

    }if(MultiSelectValue.length!=0){

      userRes(MultiSelectValue.toString());
      const res = await sendToRasa({
        "sender":userID,
        "message":MultiSelectValue.toString()
      });
      RenderBotMessage(res)
      MultiSelectValue.length=0
      return(1)

    }else{


      let userInput = document.getElementById("userInput").value;
      userRes(userInput);
      const res = await sendToRasa({
        "sender":userID,
        "message":userInput
      });
      RenderBotMessage(res)
      document.getElementById("userInput").value=""

    }
    return(1)
}

const init=async()=>{
  userRes("Hi");
  const res = await sendToRasa({
    "sender":userID,
    "message":"Hi"
  });
  RenderBotMessage(res)

}

function starmark(item)
{
count=item.id[0];
rating=convertRating(count);

sessionStorage.starRating = count;
var subid= item.id.substring(1);
for(var i=0;i<5;i++)
{
if(i<count)
{
document.getElementById((i+1)+subid).style.color="orange";
}
else
{
document.getElementById((i+1)+subid).style.color="black";
}


}

}

function AnotherStar(item){
  
  count=item.id[0];
  rating=item.id;

  sessionStorage.starRating = count;
  var subid= item.id.substring(1);
  for(var i=0;i<5;i++)
  {
  if(i<count)
  {
  document.getElementById((i+1)+subid).style.color="orange";
  }
  else
  {
  document.getElementById((i+1)+subid).style.color="black";
  }
  }
}



if(localStorage.getItem("userStatus")=="true"){
  printFeedBack()
}


function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}
