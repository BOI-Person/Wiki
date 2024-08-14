// スタイルを設定する関数
function setStyles(element, styles) {
    for (var property in styles) {
        if (styles.hasOwnProperty(property)) {
            element.style[property] = styles[property];
        }
    }
}

// Create a container for the buttons using the footer element
var container = document.createElement('footer');
container.setAttribute('data-footer', ''); // 独自属性を設定

setStyles(container, {
    position: 'fixed',
    bottom: '0px',
    right: '100px',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '5px 0',
    zIndex: '10000',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'right',
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    transform: 'translateY(100%)',
    opacity: '0'
});

// Create a toggle button to show/hide the container
var toggleButton = document.createElement('button');
toggleButton.innerText = '表示/非表示';

setStyles(toggleButton, {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    padding: '5px 10px',
    fontSize: '12px',
    color: 'white',
    backgroundColor: 'purple',
    border: '1px solid black',
    cursor: 'pointer',
    zIndex: '10001'
});

toggleButton.addEventListener('pointerdown', function () {
    if (container.style.transform === 'translateY(0%)') {
        container.style.transform = 'translateY(100%)';
        container.style.opacity = '0';
        localStorage.setItem('footerDisplay', 'hidden');
    } else {
        container.style.transform = 'translateY(0%)';
        container.style.opacity = '1';
        localStorage.setItem('footerDisplay', 'visible');
    }
});

// Function to create a button
function createButton(label, onClickFunction) {
    var button = document.createElement('button');
    button.innerText = label;

    setStyles(button, {
        margin: '0 5px',
        padding: '5px 10px',
        fontSize: '12px',
        color: 'white',
        backgroundColor: 'purple',
        border: '1px solid black',
        cursor: 'pointer'
    });

    button.addEventListener('pointerdown', onClickFunction);
    container.appendChild(button);
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

createButton('2:ブクマ2SS📗', function () {
    var title = document.title;
    var url = window.location.href;
    postApi('https://script.google.com/macros/s/AKfycbzyDCJXbh6VIRPAZMCVEJkr7sqWVy_06J4ViBMhS7tYjUVxSV8Gz-0E8eMUkR8wpmRM/exec', { title: title, link: url });
});

createButton('管理画面DEV', function () {
    window.open("https://develop.admin.koiniwa-boi.com/Master/MasterData", "②ウィンドウ名");
});

createButton('行末にスペース追加', function () {
    var input = document.activeElement;
    if (input.value !== undefined) {
        var lines = input.value.split('\n');
        for (var i = 0; i < lines.length; i++) {
            lines[i] += '  ';
        }
        input.value = lines.join('\n');
    }
});

createButton('MD形式に変換', function () {
    const input = document.activeElement; // 現在フォーカスされている要素を取得
    if (input.value !== undefined) { // フォーカスされている要素が値を持っているか確認
        const lines = input.value.split('\n') // 入力値を改行で分割して行ごとの配列にする
            .filter(line => line.trim() !== '') // 空行を除外
            .map(line => {
                const indentCount = (line.match(/　/g) || []).length; // 行内の全角スペースの数をカウント
                line = line.replace(/　/g, '  '); // 全角スペースを半角スペース二つに置換
                // 行が「#」、「<」、または「恋」で始まる場合
                if (['#', '<', '恋'].includes(line.trim()[0])) {
                    return line; // そのまま返す
                }

                // 行が「 」(半角スペース)、「[」、「"」、または「-」で始まる場合
                if ([' ', '[', '"', '-'].includes(line.trim()[0])) {
                    return line; // そのまま返す
                }

                // 上記の条件に当てはまらない場合、行頭にインデントを追加して返す
                return '  '.repeat(indentCount) + '- ' + line.trim();
            });

        input.value = lines.join('\n'); // 処理した行を改行で結合して、入力値を更新
    }
});

// Append the container and toggle button to the body
document.body.appendChild(container);
document.body.appendChild(toggleButton);

// Load the saved position
loadPosition();

// Load the saved display state
var savedDisplay = localStorage.getItem('footerDisplay');
if (savedDisplay === 'visible') {
    container.style.transform = 'translateY(0%)';
    container.style.opacity = '1';
}
