// https://github.com/BOI-Person/Wiki/edit/main/bml_v001.js

// スタイルを設定する関数
function setStyles(element, styles) {
    Object.keys(styles).forEach(property => {
        element.style[property] = styles[property];
    });
}

// ボタンを格納するコンテナを作成
const container = document.createElement('footer');
container.setAttribute('data-footer', ''); // 独自属性を設定

setStyles(container, {
    position: 'fixed',
    bottom: '0px',
    right: '100px',
    width: '100%',
    height: '40px',
    backgroundColor: 'rgba(155, 255, 255, 0.4)',
    padding: '5px 0',
    zIndex: '10000',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'right',
    transition: 'transform 0.1s ease, opacity 0.1s ease',
    transform: 'translateY(100%)',
    opacity: '0',
});

// 表示/非表示トグルボタンを作成
const toggleButton = document.createElement('button');
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

let isContainerVisible = false;

toggleButton.addEventListener('mouseover', () => {
    if (!isContainerVisible) {
        container.style.transform = 'translateY(0%)';
        container.style.opacity = '1';
        isContainerVisible = true;
        localStorage.setItem('footerDisplay', 'visible');
    }
});

document.addEventListener('mousemove', (event) => {
    if (isContainerVisible &&
        event.clientY < toggleButton.getBoundingClientRect().top - 50) {
        container.style.transform = 'translateY(100%)';
        container.style.opacity = '0';
        isContainerVisible = false;
        localStorage.setItem('footerDisplay', 'hidden');
    }
});

// ボタンを作成する関数
function createButton(label, onClickFunction) {
    const button = document.createElement('button');
    button.innerText = label;

    setStyles(button, {
        margin: '0 3px',
        padding: '5px 10px',
        fontSize: '10px',
        color: 'white',
        backgroundColor: 'purple',
        border: '1px solid black',
        cursor: 'pointer'
    });

    button.addEventListener('pointerdown', onClickFunction);
    container.appendChild(button);
}

function postApi(url, data ,callback) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        mode: 'no-cors'
    })
        .then(response => {
            if(callback !== undefined) {
                callback();
            }
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

createButton('1:URLをコピー📄', () => {
    const title = document.title;
    const url = window.location.href;
    const formattedText = `▼${title}\n${url}`;
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = formattedText;
    dummy.select();
    navigator.clipboard.writeText(formattedText);
    document.body.removeChild(dummy);
    alert(`タイトルとURLがコピーされました\n${formattedText}`);
});

createButton('2:ブクマ2SS📗', () => {
    const title = document.title;
    const url = window.location.href;
    postApi('https://script.google.com/macros/s/AKfycbzyDCJXbh6VIRPAZMCVEJkr7sqWVy_06J4ViBMhS7tYjUVxSV8Gz-0E8eMUkR8wpmRM/exec',
         { title, link: url }, () => {  alert('ブクマ2SSしました'); });     
    
});

createButton('管理画面DEV', () => {
    window.open("https://develop.admin.koiniwa-boi.com/Master/MasterData", "②ウィンドウ名");
});

createButton('行末にスペース追加', () => {
    const input = document.activeElement;
    if (input.value !== undefined) {
        input.value = input.value.split('\n').map(line => line + '  ').join('\n');
    }
});

createButton('MD形式に変換', () => {
    const input = document.activeElement;
    if (input.value !== undefined) {
        const lines = input.value.split('\n')
            .filter(line => line.trim() !== '')
            .map(line => {
                // > を含んでいる場合は末尾に改行を追加
                if (line.includes('>')) {
                    return line + '\n';
                }
                const indentCount = (line.match(/　/g) || []).length;
                line = line.replace(/　/g, '  ');
                if (['#', '<', '恋', ' ', '[', '"', '-'].includes(line.trim()[0])) {
                    return line;
                }
                return '  '.repeat(indentCount) + '- ' + line.trim();
            });

        input.value = lines.join('\n');

        // input.valueの先頭と末尾がもし"であれば削除する
        if (input.value.startsWith('"')) {
            input.value = input.value.slice(1);
        }
        if (input.value.endsWith('"')) {
            input.value = input.value.slice(0, -1);
        }
    }
});

// コンテナとトグルボタンをボディに追加
document.body.appendChild(container);
document.body.appendChild(toggleButton);

// 保存された表示状態を読み込む
const savedDisplay = localStorage.getItem('footerDisplay');
if (savedDisplay === 'visible') {
    container.style.transform = 'translateY(0%)';
    container.style.opacity = '1';
    isContainerVisible = true;
}
