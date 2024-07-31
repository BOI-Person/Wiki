// Create a container for the buttons using the footer element
var container = document.createElement('footer');
container.setAttribute('data-footer', ''); // 独自属性を設定
container.style.position = 'fixed';
container.style.bottom = '0px'; // フッターに配置するためにbottomを使用
container.style.left = '0px'; // leftを使用して位置を調整
container.style.width = '100%'; // 幅を100%に設定
container.style.backgroundColor = 'rgba(255, 255, 255, 0.6)'; // 半透明にする
container.style.borderTop = '0.2px solid black'; // 上部に境界線を追加
container.style.padding = '5px 0'; // 上下のパディングを小さく設定
container.style.zIndex = '10000';
container.style.boxSizing = 'border-box'; // ボックスサイズを設定
container.style.display = 'flex'; // フレックスボックスを使用して横並びにする
container.style.justifyContent = 'center'; // ボタンを中央に配置

// Create a toggle button to show/hide the container
var toggleButton = document.createElement('button');
toggleButton.innerText = '表示/非表示';
toggleButton.style.position = 'fixed';
toggleButton.style.bottom = '10px';
toggleButton.style.right = '10px';
toggleButton.style.padding = '5px 10px';
toggleButton.style.fontSize = '12px';
toggleButton.style.color = 'white';
toggleButton.style.backgroundColor = 'purple';
toggleButton.style.border = '1px solid black';
toggleButton.style.cursor = 'pointer';
toggleButton.style.zIndex = '10001'; // コンテナより前面に表示

toggleButton.onclick = function() {
    if (container.style.display === 'none') {
        container.style.display = 'flex';
        localStorage.setItem('footerDisplay', 'flex');
    } else {
        container.style.display = 'none';
        localStorage.setItem('footerDisplay', 'none');
    }
};

// function群
{
    // Function to create a button
    // 長押し対応
    function createButton(label, onClickFunction) {
        var button = document.createElement('button');
        button.innerText = label;
        button.style.margin = '0 5px'; // ボタン間のマージンを設定
        button.style.padding = '5px 10px'; // ボタンのパディングを小さく設定
        button.style.fontSize = '12px'; // フォントサイズを小さく設定
        button.style.color = 'white'; // 文字色を白に固定
        button.style.backgroundColor = 'purple'; // ボタンの背景色を設定
        button.style.border = '1px solid black'; // ボタンの境界線を設定
        button.style.cursor = 'pointer'; // カーソルをポインターに設定
        button.onclick = onClickFunction;
        container.appendChild(button);
    }

    // Function to save the current position to localStorage
    function savePosition() {
        localStorage.setItem('containerBottom', container.style.bottom);
        localStorage.setItem('containerLeft', container.style.left);
    }

    // Function to load the saved position from localStorage
    function loadPosition() {
        var savedBottom = localStorage.getItem('containerBottom');
        var savedLeft = localStorage.getItem('containerLeft');
        if (savedBottom !== null && savedLeft !== null) {
            container.style.bottom = savedBottom;
            container.style.left = savedLeft;
        }
    }

    function postApi(url, data) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'no-cors'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }
}

createButton('1:URLをコピー📄', function () {
    var title = document.title;
    var url = window.location.href;
    var formattedText = '▼' + title + '\n' + url;
    var dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = formattedText;
    dummy.select();
    navigator.clipboard.writeText(formattedText);
    document.body.removeChild(dummy);
    alert('タイトルとURLがコピーされました\n' + formattedText);
});

// BookMart2SS
createButton('2:ブクマ2SS📗', function () {
    var title = document.title;
    var url = window.location.href;
    postApi('https://script.google.com/macros/s/AKfycbzyDCJXbh6VIRPAZMCVEJkr7sqWVy_06J4ViBMhS7tYjUVxSV8Gz-0E8eMUkR8wpmRM/exec', { title: title, link: url });
});

// BookMart2SS
createButton('管理画面DEV', function () {
    window.open("https://develop.admin.koiniwa-boi.com/Master/MasterData", "②ウィンドウ名");
});

// Append the container and toggle button to the body
document.body.appendChild(container);
document.body.appendChild(toggleButton);

// Load the saved position
loadPosition();

// Load the saved display state
var savedDisplay = localStorage.getItem('footerDisplay');
if (savedDisplay !== null) {
    container.style.display = savedDisplay;
}
