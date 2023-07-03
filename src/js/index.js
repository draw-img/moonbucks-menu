/**
 * step1. 요구사항 구현을 위한 전략
 * TODO메뉴 추가
 * [ ] 메뉴의 이름을 입력 받고 엔터키 입력으로 추가한다
 * [ ] 추가되는 메뉴의 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>`안에 삽입해야한다
 * [ ] 총 메뉴 갯수를 count하여 상단에 보여준다
 * [ ] 메뉴가 추가되고 나면 input은 빈 값으로 초기화 한다
 * [ ] 사용자 입력값이 빈 값이라면 추가되지 않는다.
 */

const $ = (selector) => document.querySelector(selector)

function App() {

  const updateMenuCount = () => {
    //추가된 메뉴 카운팅
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;
  } 
  $("#espresso-menu-list").addEventListener("click", (e) => {
    // console.log(e.target)
    //메뉴수정
    if(e.target.classList.contains("menu-edit-button")) {
      // console.log(e.target)
      const $menuName = e.target.closest("li").querySelector(".menu-name");
      const updatedManuName = prompt("메뉴명을 수정하세요", $menuName.innerText);

      $menuName.innerText = updatedManuName;
    }

    if(e.target.classList.contains("menu-remove-button")) {
      if(confirm("삭제하시겠습니까?")) {
        e.target.closest("li").remove();
        updateMenuCount();
      }
      
    }
  })
  //form 태그가 자동으로 전송되는걸 막아준다
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
    })

  //확인버튼을 눌러 메뉴를 추가한다

  const addMenuName = () => {
    //사용자 입력값이 빈 값이라면 추가되지 않게
    if($("#espresso-menu-name").value === "") {
      alert("값을 입력해 주세요");
      return 
    }

    const espressoMenuName = $("#espresso-menu-name").value
    //console.log(espressoMenuName);
    const menuItemTemplate = (espressoMenuName) => {
      return `
        <li class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
    };

    //console.log(menuItemTemplate(espressoMenuName))
    $("#espresso-menu-list").insertAdjacentHTML(
      'beforeend',
      menuItemTemplate(espressoMenuName));

      //메뉴갯수 카운팅
      updateMenuCount();

      //추가된 메뉴 카운팅
      const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
      $(".menu-count").innerText = `총 ${menuCount} 개`;
      
      //메뉴 추가되고 나면 input 빈값
      $("#espresso-menu-name").value = '';
  }

  $("#espresso-menu-submit-button").addEventListener("click", () => {
    addMenuName();
  })

 
  //메뉴의 이름을 입력받는
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
     //엔터키가 아닐경우 리턴
     if(e.key !== 'Enter') {
      return
     }
     addMenuName();
  })
}

App();