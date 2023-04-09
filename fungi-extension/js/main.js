const menuItem = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

//Toggle menu items function
function toggleMenuActive(mItem) {
  menuItem.forEach((item) => {
    item.children[2].style.height = "0px";  
    if (item.children[2].innerHTML === mItem) {
      if (item.classList.contains("active"))
        // verify if item is active
        item.children[2].style.height = "15px";
	  
    }
  });
}

function formatNumber(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "m";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "k";
  } else {
    return number.toFixed(1);
  }
}



var Added=false;
function formatVolume(volume) {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(2)}M`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K`;
  } else {
    return `${volume}`;
  }
}

function AddNotifications(){
	var div = document.querySelector("#alertsList");
	
	chrome.storage.sync.get("alerts",function(items){
		console.log("here are all the alerts:");
		console.log(items);
		var counter=items.alerts.length;
		if (counter!=0){
			div.innerHTML='';
		};
		items.alerts.forEach(function(item,index){
			
			var div_item=document.createElement("div");
			div_item.className='card-product';
			div_item.id=`alert ${item.id}`;
			
			url = `https://api-mainnet.magiceden.dev/v2/collections/${item.symbol}`;
			fetch(url)
				.then(
					response => response.json()
				)

				.then(response => {
					div_item.innerHTML=`<div class="img">
								<img src="${response.image}" alt="" />
								<div class="img-info">
									<span>${item.symbol}</span>
									<span>Type: ${item.type}</span>
									<span>Price Limit: ${item.limit}</span>
								</div>
								</div>

								<div class="right">
									<div class="createAmint" id="addAlert">
										
										<button value="${item.id}" style="background-color:#ca1515;"><b><span>-</span></b>Discard</button>
									</div>
								</div>`
					var discard_button = div_item.getElementsByClassName("right")[0].getElementsByClassName("createAmint")[0].children[0];
					discard_button.addEventListener("click",function(){
						discard_button.parentNode.parentNode.parentNode.remove();
						chrome.storage.sync.get("alerts",function(items){
							var counter = items.alerts.length;
							var arr=[];
							items.alerts.forEach(item=>{
								counter--;
								if (item.id<parseInt(discard_button.value)){
									arr.push(item);
								}
								else if (item.id>parseInt(discard_button.value)){
									item.id--;
									arr.push(item);
								}
								if (counter==0){
									chrome.storage.sync.set({"alerts":arr});
								}
							})
						});
					})
					div.appendChild(div_item);
					counter--;
					if (counter==0){
						var emp_div=document.createElement("div");
						emp_div.style='height:60px;'
						div.appendChild(emp_div);
					}
				}
				)
			
			
		})
		

	})



}



chrome.storage.onChanged.addListener(function(changes, namespace) {
	if (Added){
		AddNotifications();
		Added=false;
	}
});





document
  .querySelector(".trending-heading")
  .addEventListener("click", function () {
    document.querySelector(".home.nav-link").classList.remove("active");
    document.querySelector(".trending.nav-link").click();
  });
document.querySelector("#see-all").addEventListener("click", function () {
  document.querySelector(".home.nav-link").classList.remove("active");
  document.querySelector(".active-mints.nav-link").click();
});
menuItem.forEach((item) => {
  //Display menu name if item is selected/active
  if (item.classList.contains("active")) item.children[2].style.height = "15px";
  item.addEventListener("click", () => {
    menuItem.forEach((ele) => {
      ele.classList.remove("active");
    });

    pages.forEach((page) => {
      page.classList.add("d-none");
    });

    item.classList.add("active");

    if (item.children[2].innerHTML == "Home") {
      document.querySelector(".home").classList.remove("d-none");
      toggleMenuActive("Home"); // Calling the function above passing the span' innerHTML content as argument.
    } else if (item.children[2].innerHTML == "Trendings") {
      document.querySelector(".Trendings").classList.remove("d-none");
      toggleMenuActive("Trendings");
    } else if (item.children[2].innerHTML == "active-mints") {
      document.querySelector(".active-mints").classList.remove("d-none");
      toggleMenuActive("Active mints");
    } else if (item.children[2].innerHTML == "Portfolio") {
      document.querySelector(".Portfolio").classList.remove("d-none");
      toggleMenuActive("Portfolio");
    } else if (item.children[2].innerHTML == "Discounts") {
      document.querySelector(".Discounts01").classList.remove("d-none");
      toggleMenuActive("Discounts");
    } else if (item.children[2].innerHTML == "Notifiers") {
      document.querySelector(".notifications").classList.remove("d-none");
      toggleMenuActive("Notifiers");
    }
  });
  item.addEventListener("mouseenter", () => {
    const overlayText = item.children[2].innerHTML;
    if (!item.classList.contains("active")) {
      const popup = document.createElement("p");
      popup.classList.add("popup");
      popup.innerHTML = overlayText;
      item.appendChild(popup);
    }
  });
  item.addEventListener("mouseleave", () => {
    const popup = document.querySelectorAll(".popup");
    popup.forEach((pop) => {
      item.removeChild(pop);
    });
  });
});

// dark mode
const bodyBg = document.querySelector(".body-bg");
const btnDark = document.querySelectorAll(".btnDark");

/*--- GET TOP 10 - HTTP CALL ---*/

fetch("http://13.48.31.193/api/top10")
  .then((x) => x.json())
  .then((data) =>
    data.forEach((element) => {
      const div = document.createElement("div");

      div.className = "card-item";
      div.innerHTML = `<div class="card-item">
		<img src=${element["avatar"]} alt="">
		
		<span class="span-bottom">${element["floor"]}</span>
		<h4>${element["collection"]}</h4>
	</div>`;
	div.addEventListener("click",function(event){
		get_collection(element);
	})
      document.getElementById("top10card").appendChild(div);
    })
  );

/*--- GET MINTIN SOON DATA - HTTP CALL ---*/
fetch("http://13.48.31.193/api/mintingsoon")
  .then((x) => x.json())
  .then((data) =>
    data.forEach((element) => {
      const div = document.createElement("div");

      div.className = "card-product";
      div.innerHTML = `
		<div class="img">
				<img src="${element["mintSample"]["imageUrl"]}" alt="">
				<div class="img-info">
					<h4>${element["mintSample"]["mintName"]}</h4>
					<span class="lmnft">
						<span class="text-rounded">M</span>
						<span>LMNFT</span>
					</span>
					<span class="price"> <img class="solana-icon" src="./icons/solana-sol-logo 4.svg" alt=""> ${(
            element["price"] * 0.000000001
          ).toFixed(3)}</span>
				</div>
			</div>

			<div class="right">
				<h4 class="prc">${
          100 *
          (element["itemsRedeemed"] / element["itemsAvailable"]).toFixed(2)
        }%</h4>
				<span>2 min ago</span>
			</div>`;
      document.getElementById("mintingsoon").appendChild(div);
	  
    })
  );

const select1 = document.getElementById("all_platforms");
const platform = select1.options[select1.selectedIndex].value;

const select2 = document.getElementById("mint_state");
const mint_state = select2.options[select2.selectedIndex].value;

const select3 = document.getElementById("min_mint_price");
const min_mint_price = select3.value;

const select4 = document.getElementById("max_mint_price");
const max_mint_price = select4.value;

const select5 = document.getElementById("percentage_minted");
const percentage_minted = select5.value;

// FETCH ACTIVE MNITS - ON  PAGE LOAD
(async function () {
  await fetch(`http://13.48.31.193/api/activemints`)
    .then((x) => x.json())
    .then((data) =>
      data.forEach((element) => {
        const div = document.createElement("div");

        div.className = "card-product";
        div.innerHTML = `<div class="img">
			<img src="${element["mintSample"]["imageUrl"]}" alt="">
			<div class="img-info">
				<h4>${element["mintSample"]["mintName"]}</h4>
				<span class="lmnft">
					<span class="text-rounded">M</span>
					<span>${element["mintType"]}</span>
				</span>
				<span class="price"><span class="total">Total:${
          element["itemsAvailable"]
        } </span><img class="solana-icon" src="./icons/solana-sol-logo 4.svg" alt="">${(
          element["price"] * 0.000000001
        ).toFixed(3)}</span>
			</div>
		</div>
		<div class="right">
			<h4 class="prc">
				<span class="min">
					<span>${element["itemsRemaining"]}</span>
				</span>
				<span>(${((100 * element["itemsRedeemed"]) / element["itemsAvailable"]).toFixed(
          2
        )}%)</span></h4>
			<div class="progress" style="width:120px;float:right;">
				<div class="progress-bar" style="width: ${
          (100 * element["itemsRedeemed"]) / element["itemsAvailable"]
        }%;"></div> 
				<span>${((100 * element["itemsRedeemed"]) / element["itemsAvailable"]).toFixed(
          2
        )}%</span>
			</div>
			<span>2 min ago</span>
		</div>`;
        document.getElementById("activemints").appendChild(div);
      })
    );
})();

// FILTER BTN ID
const filterBtn = document.getElementById("filter-mint-btn");

filterBtn.addEventListener("click", async () => {
  document.getElementById("activemints").innerHTML = "";
  var platform=document.getElementById("all_platforms")[document.getElementById("all_platforms").selectedIndex].value
  var orderSort=document.getElementById("mint_state")[document.getElementById("mint_state").selectedIndex].value
  var percentage_minted=document.getElementById("percentage_minted").value
  var min_mint_price=document.getElementById('min_mint_price').value
  var max_mint_price=document.getElementById('max_mint_price').value

  await fetch(
    `http://13.48.31.193/api/activemints?filter=${platform}&sort=${orderSort}&minted=${percentage_minted}&min_price=${min_mint_price}&max_price=${max_mint_price}`
  )
    .then((x) => x.json())
    .then((data) =>
      data.forEach((element) => {
        const div = document.createElement("div");

        div.className = "card-product";
        div.innerHTML = `<div class="img">
			<img src="${
        element["mintSample"]["imageUrl"] !== null
          ? element["mintSample"]["imageUrl"]
          : null
      }" alt="">
			<div class="img-info">
				<h4>${element["mintSample"]["mintName"]}</h4>
				<span class="lmnft">
					<span class="text-rounded">M</span>
					<span>${element["mintType"]}</span>
				</span>
				<span class="price"><span class="total">Total:${
          element["itemsAvailable"]
        } </span><img class="solana-icon" src="./icons/solana-sol-logo 4.svg" alt="">${(
          element["price"] * 0.000000001
        ).toFixed(3)}</span>
			</div>
		</div>
		<div class="right">
			<h4 class="prc">
				<span class="min">
					<span>${element["itemsRemaining"]}</span>
				</span>
				<span>(${((100 * element["itemsRedeemed"]) / element["itemsAvailable"]).toFixed(
          2
        )}%)</span></h4>
			<div class="progress" style="width:120px;float:right;">
				<div class="progress-bar" style="width: ${
          (100 * element["itemsRedeemed"]) / element["itemsAvailable"]
        }%;"></div> 
				<span>${((100 * element["itemsRedeemed"]) / element["itemsAvailable"]).toFixed(
          2
        )}%</span>
			</div>
			<span>2 min ago</span>
		</div>`;
		div.addEventListener("click",function(event){
			get_collection(element);
		})

        document.getElementById("activemints").appendChild(div);
      })
    );
});

fetch("http://13.48.31.193/api/discounts")
  .then((x) => x.json())
  .then((data) =>
    data.forEach((element) => {
      const div = document.createElement("div");
      //div.style = "width:170px;"
      div.className = "card";
      div.innerHTML = `<span class="prc clr1">
		${(((element["old"] - element["new"]) / element["old"]) * 100).toFixed(1)}%
	</span>
	<img src="${element["magicEdenCollection"]["image"]}" alt="">
	<div class="card-info">
		<div class="title">
			<span>${element["magicEdenCollection"]["name"]}</span>
		</div>

		<div>
			<span>FP</span>
			<span>
				<strike class="fp-danger">${element["old"]}</strike>
				<span class="fp-success">${element["new"]}</span>
			</span>
			</div>
		<div>
			<span>Volume</span>
			<span>${element["magicEdenCollection"]["volume"]}</span>
		</div>
		<div>
			<span>24H vol</span>
			<span>${element["magicEdenCollection"]["volume_1d"]}</span>
		</div>
		<a href=${
      "https://magiceden.io/marketplace/" + element.magicEdenCollectionId
    }  target="_blank" class="Puchase">Purchase</a>
	</div>`;
      document.getElementById("deals").appendChild(div);
    })
  );
document.addEventListener("DOMContentLoaded", function () {
  var link = document.getElementById("1d_trending");
  // onClick's logic below:
  link.addEventListener("click", function () {
    document.getElementById("trending collections").innerHTML = `<div style="display: flex;width:100%;height:100%;flex-direction: column;align-items: center;justify-content: center;">
	<div style="background-image: url(/images/astromoon.png);height: 380px;width: 380px;background-size: cover;"></div>
	
</div>`;
    fetch("http://13.48.31.193/api/trending/1")
      .then((x) => x.json())
      .then((data) =>{
		document.getElementById("trending collections").innerHTML = "";
        data.forEach((element) => {
          const div = document.createElement("div");

          div.className = "card-product";
          div.innerHTML = `<div class="img">
                    <img src="${element["avatar"]}" alt="">
                    <div class="img-info">
                        <h4>${element["collection"]}</h4>
                        
                        <span class="price"><img class="solana-icon" src="./icons/solana-sol-logo 4.svg" alt="">${
                          element["floor"]
                        }</span>
                    </div>
                </div>
			
                <div class="right">
                    <div style>
					<span class="price img-info card-product"><img class="solana-icon" src="./icons/solana-sol-logo 4.svg" alt="">${
            element["volume"]
          }</span>
					</div>
                    <a id="firstCollection${element["floor"].toFixed(0)}" href="#">See more</a>
                </div>`;
          div
            .querySelector(`#firstCollection${element["floor"].toFixed(0)}`)
            .addEventListener("click", function () {
              get_collection(element);
            });
		
          document.getElementById("trending collections").appendChild(div);
        })
	});
  });


  link = document.getElementById("deals_filter");
  // onClick's logic below:
  link.addEventListener("click", function () {
    document.getElementById("deals").innerHTML = "";
    var select = document.getElementById("off_floor");
    var off_floor = select.options[select.selectedIndex].value;

    select = document.getElementById("discount_price_range");
    var discount_price_range = select.options[select.selectedIndex].value;

    select = document.getElementById("discount_1h_volume");
    var discount_1h_volume = select.options[select.selectedIndex].value;

    select = document.getElementById("discount_volume");
    var discount_volume = select.options[select.selectedIndex].value;

	select=document.getElementById("dealstextinput")
	var symbol=select.value

    fetch(
      `http://13.48.31.193/api/discounts?off_floor=${off_floor}&twentyfour=${discount_1h_volume}&price_range=${discount_price_range}&volume=${discount_volume}&symbol=${symbol}`
    )
      .then((x) => x.json())
      .then((data) =>
        data.forEach((element) => {
          const div = document.createElement("div");
          div.style = "width:170px;";
          div.className = "card";
          div.innerHTML = `<span class="prc clr1">
				${(((element["old"] - element["new"]) / element["old"]) * 100).toFixed(1)}%
			</span>
			<img src="${element["magicEdenCollection"]["image"]}" alt="">
			<div class="card-info">
				<div class="title">
					<span>${element["magicEdenCollection"]["name"]}</span>
				</div>
		
				<div>
					<span>FP</span>
					<span>
						<strike class="fp-danger">${element["old"]}</strike>
						<span class="fp-success">${element["new"]}</span>
					</span>
					</div>
				<div>
					<span>Volume</span>
					<span>${element["magicEdenCollection"]["volume"]}</span>
				</div>
				<div>
					<span>24H vol</span>
					<span>${element["magicEdenCollection"]["volume_1d"]}</span>
				</div>
				<a href="" class="Puchase">Purchase</a>
			</div>`;
			
          document.getElementById("deals").appendChild(div);
        })
      );
  });
  document.getElementById("dealstextinput").addEventListener("keydown", function (event) {
	if (event.key !== 'Enter'){
		return;
	};
    document.getElementById("deals").innerHTML = "";
    var select = document.getElementById("off_floor");
    var off_floor = select.options[select.selectedIndex].value;

    select = document.getElementById("discount_price_range");
    var discount_price_range = select.options[select.selectedIndex].value;

    select = document.getElementById("discount_1h_volume");
    var discount_1h_volume = select.options[select.selectedIndex].value;

    select = document.getElementById("discount_volume");
    var discount_volume = select.options[select.selectedIndex].value;

	select=document.getElementById("dealstextinput");
	var symbol=select.value;

    fetch(
      `http://13.48.31.193/api/discounts?off_floor=${off_floor}&twentyfour=${discount_1h_volume}&price_range=${discount_price_range}&volume=${discount_volume}&symbol=${symbol}`
    )
      .then((x) => x.json())
      .then((data) =>
        data.forEach((element) => {
          const div = document.createElement("div");
          div.style = "width:170px;";
          div.className = "card";
          div.innerHTML = `<span class="prc clr1">
				${(((element["old"] - element["new"]) / element["old"]) * 100).toFixed(1)}%
			</span>
			<img src="${element["magicEdenCollection"]["image"]}" alt="">
			<div class="card-info">
				<div class="title">
					<span>${element["magicEdenCollection"]["name"]}</span>
				</div>
		
				<div>
					<span>FP</span>
					<span>
						<strike class="fp-danger">${element["old"]}</strike>
						<span class="fp-success">${element["new"]}</span>
					</span>
					</div>
				<div>
					<span>Volume</span>
					<span>${element["magicEdenCollection"]["volume"]}</span>
				</div>
				<div>
					<span>24H vol</span>
					<span>${element["magicEdenCollection"]["volume_1d"]}</span>
				</div>
				<a href="" class="Puchase">Puchase</a>
			</div>`;
          document.getElementById("deals").appendChild(div);
        })
      );
  });

  link = document.getElementById("PortfolioSearch");
  // onClick's logic below:
  link.addEventListener("keypress", function (e) {
    if (e.key !== "Enter") return;
    var link2 = document.getElementById("PortfolioSearch");
    fetch("http://13.48.31.193/api/portfolio/" + link2.value)
      .then((x) => x.json())
      .then((data) => {
        document.getElementById("PortfolioTotalFloor").innerText =
          data["floorTotal"].toFixed(2);
        document.getElementById("PortfolioTotalFloorUSD").innerText =
          data["floorTotalUSD"].toFixed(2);
        document.getElementById("PortfolioSOLBalance").innerText =
          data["solBalance"].toFixed(2);
        document.getElementById("PortfolioSOLBalanceUSD").innerText =
          data["solBalanceUSD"].toFixed(2);
        document.getElementById("PortfolioVerifiedNFTs").innerText =
          data["verifiedCount"];
        document.getElementById("PortfolioTotalNFTs").innerText =
          data["totalCount"];
        document.getElementById("PortfolioAddress").innerText = link2.value;
        document.getElementById("PortfolioProfileImage").src =
          data["nfts"][0]["collection_image"];
        data["nfts"].forEach((element) => {
          console.log(element);
          try {
            const div = document.createElement("div");
            div.className = "card";
            div.style.width = "170px";
            div.innerHTML = `
							<img src="${element["collection_image"]}" alt="">
							<div class="card-info">
								<div class="title">
									<span>${element["name"]}</span>
								</div>
								<a href="">view collection</a>
								<div><span>Floor</span><span>${element["collection_floor"]}</span></div>
								<div><span>Floor USD</span><span>${element["collection_floor_usd_value"]}</span></div>
								<div><span>Total Vol</span><span>${element["collection_volume"]}</span></div>
								<div><span>24H vol</span><span>${element["collection_volume_1d"]}</span></div>
							</div>`;

            document.getElementById("portfolio_nfts").appendChild(div);
          } catch {
            return;
          }
        });
      });
  });

  link = document.getElementById("1w_trending");
  // onClick's logic below:
  link.addEventListener("click", function () {
    document.getElementById("trending collections").innerHTML = `<div style="display: flex;width:100%;height:100%;flex-direction: column;align-items: center;justify-content: center;">
	<div style="background-image: url(/images/astromoon.png);height: 380px;width: 380px;background-size: cover;"></div>
	
</div>`;
    fetch("http://13.48.31.193/api/trending/2")
      .then((x) => x.json())
      .then((data) =>{
		document.getElementById("trending collections").innerHTML = "";
        data.forEach((element) => {
          const div = document.createElement("div");

          div.className = "card-product";
          div.innerHTML = `<div class="img">
                    <img src="${element["avatar"]}" alt="">
                    <div class="img-info">
                        <h4>${element["collection"]}</h4>
                        
                        <span class="price"><img class="solana-icon" src="./icons/solana-sol-logo 4.svg" alt="">${
                          element["floor"]
                        }</span>
                    </div>
                </div>

                <div class="right">
                    <div style>
					<span class="price img-info card-product"><img class="solana-icon" src="./icons/solana-sol-logo 4.svg" alt="">${
            element["volume"]
          }</span>
					</div>
                    <a id="secondCollection${element["floor"].toFixed(
                      0
                    )}" href="#">See more</a>
                </div>`;
          div
            .querySelector(`#secondCollection${element["floor"].toFixed(0)}`)
            .addEventListener("click", function () {
              get_collection(element);
            });
          document.getElementById("trending collections").appendChild(div);
        })
	});
  });
  link = document.getElementById("1m_trending");
  // onClick's logic below:
  link.addEventListener("click", function () {
    document.getElementById("trending collections").innerHTML = `<div style="display: flex;width:100%;height:100%;flex-direction: column;align-items: center;justify-content: center;">
	<div style="background-image: url(/images/astromoon.png);height: 380px;width: 380px;background-size: cover;"></div>
	
</div>`;
    fetch("http://13.48.31.193/api/trending/3")
      .then((x) => x.json())
      .then((data) =>{
		document.getElementById("trending collections").innerHTML = "";
        data.forEach((element) => {
          const div = document.createElement("div");

          div.className = "card-product";
          div.innerHTML = `<div class="img">
                    <img src="${element["avatar"]}" alt="">
                    <div class="img-info">
                        <h4>${element["collection"]}</h4>
                        <span class="price"><img class="solana-icon" src="./icons/solana-sol-logo 4.svg" alt="">${
                          element["floor"]
                        }</span>
                    </div>
                </div>

                <div class="right">
                    <div style>
					<span class="price img-info card-product"><img class="solana-icon" src="./icons/solana-sol-logo 4.svg" alt="">${
            element["volume"]
          }</span>
					</div>
                    <a id="thirdCollection${element["floor"].toFixed(
                      0
                    )}" href="#">See more</a>
                </div>`;
          div
            .querySelector(`#thirdCollection${element["floor"].toFixed(0)}`)
            .addEventListener("click", function () {
              get_collection(element);
            });
          document.getElementById("trending collections").appendChild(div);
        })
	});
  });

  document.getElementById("1d_trending").click();
});

/*--- GET PORTFOLIO BY ADDRESS ---*/
function get_portfolio(address) {
  fetch(`http://13.48.31.193/api/portolio?address=${address}`)
    .then((x) => x.json())
    .then((data) => {
      return data;
    });
}

document.getElementById("percentage_minted").addEventListener("input",function(event){
	console.log("ONINPUT!");
	document.getElementById('rangevalue').value=document.getElementById("percentage_minted").value;
	
})

/*--- GET COLLECTION BY ADDRESS ---*/
function get_collection(element) {
  console.log(element, "element is here");
  let active;
  pages.forEach((page) => {
    if (page.classList.contains("nft-trend-displayer")) {
      active = page;
      page.classList.remove("d-none");
    } else {
      page.classList.add("d-none");
    }
  });
  active.querySelector(
    ".nft-content-label"
  ).textContent = `${element["collection"]}`;
  const values = active.querySelectorAll(".stats-value");
  console.log(values, "values");
  values[0].textContent = formatVolume(element["floor"]);
  values[1].textContent = formatVolume(element["volume"]);
  active.querySelector(".nft-poster").src = `${element["avatar"]}`;
  fetch(`http://13.48.31.193/api/collection/${element["collectionSymbol"]}`)
    .then(x => x.json())
    .then(data => {
      console.log(data);
      values[4].textContent = `${data["data"]["listed"]}`;
      values[5].textContent = `${isNaN(parseFloat(data["data"]["volume_1d"])) ? "" : parseFloat(data["data"]["volume_1d"]).toFixed(1)}`;
      let dailyPercent = 100*(parseFloat(data["data"]["floor_price"]).toFixed(1)-parseFloat(data["data"]["floor_price_1d"]).toFixed(1))/parseFloat(data["data"]["floor_price_1d"]).toFixed(1);
      let weeklyPercent = 100*(parseFloat(data["data"]["floor_price"]).toFixed(1)-parseFloat(data["data"]["floor_price_7d"]).toFixed(1))/parseFloat(data["data"]["floor_price_7d"]).toFixed(1);
      active.querySelector(".daily").innerHTML=`Daily<br><span style="color:${dailyPercent >= 0 ? "green" : "red"};">${!isNaN(dailyPercent) ? dailyPercent.toFixed(1) : ""}%</span>`;
      active.querySelector(".weekly").innerHTML=`Weekly<br><span style="color:${weeklyPercent >= 0 ? "green" : "red"};">${!isNaN(weeklyPercent) ? weeklyPercent.toFixed(1) : ""}%</span>`;
      values[6].textContent = `${isNaN(parseFloat(data["data"]["unique_holders"])) ? "" : parseFloat(data["data"]["unique_holders"]).toFixed(1)}`;
      let marketCap = parseFloat(data["data"]["market_cap"]);
      values[7].textContent = `${isNaN(marketCap) ? "" : (marketCap >= 1000000 ? (marketCap/1000000).toFixed(1) + "m" : (marketCap >= 1000 ? (marketCap/1000).toFixed(1) + "k" : marketCap.toFixed(1)))}`;
      values[2].textContent = `${data["data"]["copies"]}`;
      values[3].textContent = `${isNaN(parseFloat(data["data"]["average_price"])) ? "" : parseFloat(data["data"]["average_price"]).toFixed(1)}`;
    })
    .catch(error => {
      console.error(error);
    })
  
}
//get_collection("ABnHrTbSTit5DcxnjzmtwtaUoqsB4uvZXAZR1vAwdDHU")
document.getElementById('info-page-close').addEventListener("click",function(event){
	pages.forEach((page) => {
		if (page.classList.contains("nft-trend-displayer")) {
		  page.classList.add("d-none");
		} 
		else if (page.classList.contains("Trendings")){
			page.classList.remove("d-none")
		}
		else {
		  page.classList.add("d-none");
		}
	  });
})

document.getElementById("NotifcationMintButton").addEventListener("click",function(event){
	document.getElementById("notifier_item").click();
})



btnDark.forEach((btn) => {
  console.log(document.URL);
  btn.addEventListener("click", () => {
	
    bodyBg.classList.toggle("body-dark");
	let theme = "";
	if (bodyBg.classList.contains("body-dark")) {
		theme = "DARK";
	  } else {
		theme = "LIGHT";
	  }
	theme_dict={"theme":theme}
	chrome.storage.sync.set(theme_dict);
    document.querySelector(".menu").classList.toggle("menuDark");
    document.querySelector(".menu").classList.toggle("colorNavMenu");
    try{

		document.querySelectorAll(".fa-moon").classList.toggle("d-none");
	}catch(exception){
		return;
	}
	document.querySelector(".fa-lightbulb-on").classList.toggle("d-none");
    document.querySelector(".popup").classList.toggle("popDark");
    document.querySelectorAll(".fa-moon").forEach((element) => {
      element.classList.toggle("d-none");
    });
	
    
	

    document.querySelectorAll(".fa-lightbulb-on").forEach((element) => {
      element.classList.toggle("d-none");
      element.classList.toggle("filter-img-white");
    });

    
    console.log(theme);
    
  });
});

chrome.storage.sync.get("theme",function(response){
	if (response==null){
		response={}
		response['theme']="LIGHT"
		chrome.storage.sync.set({"theme": "LIGHT"});
	}
	var pageTheme=response["theme"];
	if (pageTheme === "DARK") {
		console.log(document.URL);
		bodyBg.classList.add("body-dark");
		document.querySelector(".menu").classList.add("menuDark");
		document.querySelector(".menu").classList.add("colorNavMenu");
		document.querySelector(".fa-moon").classList.add("d-none");
		document.querySelector(".fa-lightbulb-on").classList.remove("d-none");
		document.querySelector(".btn-filter").classList.add("filter-img-white");
		}
})

const btnAddAlert = document.querySelector("#addAlert");
const FilterPopUp = document.querySelector("#alert_parameters");
const FilterClosePopUp = document.querySelector("#AlertPopUpClose");
const btnFilterAlert = document.querySelector("#filter-alert-btn");

btnAddAlert.addEventListener("click", () => {
	console.log(document.URL);
	console.log("dd");
	FilterPopUp.style.display = "flex";
});

FilterClosePopUp.addEventListener("click", () => {
	console.log(document.URL);
	console.log("dd");
	FilterPopUp.style.display = "none";
});

btnFilterAlert.addEventListener("click", () => {
	chrome.storage.sync.get(['alerts'],function(elements){
		var type = document.getElementById("OverUnder");
		var symbol = document.getElementById("collect_symbol");
		var price = document.getElementById("collection_price");
		
		item={ 'symbol': symbol.value, 'type': type.value, 'limit': parseFloat(price.value),'id':elements.alerts.length };
		elements['alerts'].push(item);
		chrome.storage.sync.set(elements);
		Added=true;
	})
		
	FilterClosePopUp.click();
});


const btnFilter = document.querySelector(".btn-filter");
const btnCloseDis = document.querySelector(".btn-close");
const boxFilterDis = document.querySelector(".filter");

btnFilter.addEventListener("click", () => {
  console.log(document.URL);
  console.log("dd");
  boxFilterDis.style.display = "flex";
});

btnCloseDis.addEventListener("click", () => {
  console.log(document.URL);
  boxFilterDis.style.display = "none";
});
AddNotifications();
const btnClose = document.querySelector(".btnNot-close");
const boxFilter = document.getElementById("filterNot");
const btnSeeAll = document.querySelector(".SeeAll");

btnClose.addEventListener("click", () => {
  console.log(document.URL);
  btnClose.parentNode.parentNode.style.display = "none";
});

btnSeeAll.addEventListener("click", () => {
  console.log(document.URL);
  console.log(boxFilter);
  boxFilter.style.display = "flex";
});
