/**
 * step1. 요구사항 구현을 위한 전략
 * TODO메뉴 추가
 * [ ] 메뉴의 이름을 입력 받고 엔터키 입력으로 추가한다
 * [ ] 추가되는 메뉴의 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>`안에 삽입해야한다
 * [ ] 총 메뉴 갯수를 count하여 상단에 보여준다
 * [ ] 메뉴가 추가되고 나면 input은 빈 값으로 초기화 한다
 * [ ] 사용자 입력값이 빈 값이라면 추가되지 않는다.
 */

import { $ } from './utils/dom.js';
import MenuApi from './api/index.js';


function App() {
  //상태(변하는 데이터) - 메뉴이름
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: []
  };  //상태값 선언

  this.currentCategory = "espresso";

  this.init = async () => {

    //this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
    initEventListeners();
  }

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    const template = this.menu[this.currentCategory].map((menuItem) => {
      return `
        <li data-menu-id="${menuItem.id}" class="menu-list-item d-flex items-center py-2">
        <span class="${menuItem.isSoldOut ? 'sold-out' : ''} w-100 pl-2 menu-name">${menuItem.name}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
          품절
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>`
    }).join('')

    $("#menu-list").innerHTML = template;
    //메뉴갯수 카운팅
    updateMenuCount();
  }
  const updateMenuCount = () => {
    //추가된 메뉴 카운팅
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;
  } 
  
  const addMenuName = async () => {
    //사용자 입력값이 빈 값이라면 추가되지 않게
    if($("#menu-name").value === "") {
      alert("값을 입력해 주세요");
      return 
    }

    const duplicatedItem = this.menu[this.currentCategory].find(menuItem => menuItem.name === $("#menu-name").value)
    console.log(duplicatedItem)
    if(duplicatedItem) {
      alert("이미 등록된 메뉴입니다");
      $("#menu-name").value = "";
      return
    }

    const menuName = $("#menu-name").value;
    await MenuApi.createMenu(this.currentCategory, menuName);
    //this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
    $("#menu-name").value = "";

  }
  //수정버튼
  const updateManuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);

    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    //this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);

    // this.menu[this.currentCategory][menuId].name = updatedMenuName;
    // store.setLocalStorage(this.menu);

    //$menuName.innerText = updatedMenuName;
    render()
  }
  //삭제버튼
  const removeMenuName = async (e) => {
    if(confirm("삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.removeMenu(this.currentCategory, menuId);
      //this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
      render();
      updateMenuCount();
    }
  }

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    //this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
  }

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name")
    if(isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴관리`;
      render()
    }
  }

  const initEventListeners = () => {
    $("#menu-list").addEventListener("click", (e) => {
      // console.log(e.target)
      //메뉴수정
      if(e.target.classList.contains("menu-edit-button")) {
        // console.log(e.target)
        updateManuName(e);
        return
      }
  
      //메뉴삭제
      if(e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e)
        return
      }
  
      if(e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return
      }
    })
    //form 태그가 자동으로 전송되는걸 막아준다
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    })
  
    //확인버튼을 눌러 메뉴를 추가한다
    $("#menu-submit-button").addEventListener("click", addMenuName);
  
    //메뉴의 이름을 입력받는
    $("#menu-name").addEventListener("keypress", (e) => {
       //엔터키가 아닐경우 리턴
      if(e.key !== 'Enter') {
        return
      }
      addMenuName();
    })

    $("nav").addEventListener("click", changeCategory)
  }
  
}

const app = new App();
app.init();
