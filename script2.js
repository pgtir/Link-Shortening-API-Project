const input = document.querySelector(".link-input");
const shortBtn = document.querySelector(".short-btn");
const shortenParent = document.querySelector(".shorten-parent");
const cardsCol = document.querySelector(".cards-column");
const menu = document.querySelector(".menu-lines");
const navigation = document.querySelector(".navigation");
// localStorage.clear();
renderCopyCard();
function manageStorage(inputLink, outputLink) {
  setArrOfLinks(inputLink, "inputs");
  setArrOfLinks(outputLink, "outputs");
}

function setArrOfLinks(link, typeOfLinks) {
  let arr = JSON.parse(localStorage.getItem(`${typeOfLinks}`));
  if (arr == null) {
    arr = [link];
    localStorage.setItem(`${typeOfLinks}`, JSON.stringify(arr));
  } else {
    arr.push(link);
    localStorage.setItem(`${typeOfLinks}`, JSON.stringify(arr));
  }
  return arr;
}
function renderCopyCard() {
  let arrOrig = JSON.parse(localStorage.getItem(`inputs`));
  let arrNew = JSON.parse(localStorage.getItem(`outputs`));
  if (arrNew != null) {
    let html = "";
    for (let i in arrNew) {
      html += `<article class="shorten copy-cards container">
        <div class="orig-link">
           ${arrOrig[i]}
        </div>
        <div class="copy-link">
          <div class="short-link">${arrNew[i]}</div>
          <div class="copy-btn btn">Copy</div>
        </div>
      </article> `;
    }
    // shortenParent.insertAdjacentHTML("beforeend", html);
    cardsCol.innerHTML = html;
    const copyBtn = document.querySelectorAll(".copy-btn");
    copyBtn.forEach((copy) => {
      copy.addEventListener("click", (e) => {
        const item = e.target;
        const linkTextToCopy = item.previousElementSibling.innerText;
        console.log(linkTextToCopy);
        copyUrl(item, linkTextToCopy);
      });
    });
  }
  //   const html = `<article class="shorten copy-cards container">
  //     <div class="orig-link">
  //        ${input.value}
  //     </div>
  //     <div class="copy-link">
  //       <div class="short-link">${shortUrl}</div>
  //       <div class="copy-btn btn">Copy</div>
  //     </div>
  //   </article> `;
}

function renderError(errMsg) {
  let html = `<span class="error">${errMsg}</span>`;
  input.insertAdjacentHTML("afterend", html);
  input.classList.add("err-input");
  input.addEventListener("click", () => {
    if (input.nextElementSibling) {
      input.nextElementSibling.remove();
    }
    input.classList.remove("err-input");
  });
}
function copyUrl(item, shortUrl) {
  navigator.clipboard.writeText(shortUrl);
  item.innerText = "Copied!";
  item.classList.add("copied");
  setTimeout(() => {
    item.classList.remove("copied");
    item.innerText = "Copy";
  }, 1000);
}

const shortenLink = async function (originalUrl) {
  try {
    const response = await fetch(
      `https://api.shrtco.de/v2/shorten?url=${originalUrl}`
    );
    const data = await response.json();
    console.log(data);
    if (data.error_code === 1) {
      throw new Error("Please add a link");
    } else if (data.error_code === 2) {
      throw new Error("Please enter a valid URL");
    } else if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    manageStorage(input.value, data.result.full_short_link);
    renderCopyCard();
  } catch (err) {
    renderError(`${err.message}`);
  } finally {
    input.value = "";
    shortBtn.style.pointerEvents = "auto";
  }
};
shortBtn.addEventListener("click", () => {
  shortBtn.style.pointerEvents = "none";
  shortenLink(input.value);
});


let flag = false;

menu.addEventListener("click", () => {
  
  if(!flag) {
    navigation.style.display = "block";
    navigation.style.transform = "translateY(120%)"
    flag = true;
  }
  else {
    // navigation.style.display = "none";
    navigation.style.transform = "translateY(-120%)"
     flag = false;
   }
})
