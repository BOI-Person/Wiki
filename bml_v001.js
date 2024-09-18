// プロパティ
let isOpenFolder = false;

// スタイルを設定する関数
function setStyles(element, styles) {
    Object.assign(element.style, styles);
}

// コンテナを作成する関数
function createContainer() {
    const container = document.createElement('footer');
    container.setAttribute('data-footer', '');
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
    return container;
}

// トグルボタンを作成する関数
function createToggleButton(container) {
    const toggleButton = document.createElement('button');
    toggleButton.innerText = '表示';

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
            event.clientY < toggleButton.getBoundingClientRect().top - 50 &&
            isOpenFolder === false) {
            container.style.transform = 'translateY(100%)';
            container.style.opacity = '0';
            isContainerVisible = false;
            localStorage.setItem('footerDisplay', 'hidden');
        }
    });

    document.body.appendChild(toggleButton);
    return toggleButton;
}

// ボタンを作成する関数
function createButtons(container, buttonDataList) {
    buttonDataList.forEach(buttonData => {
        if (buttonData.type === 'folder') {
            createFolder(container, buttonData.label, buttonData.folderButtonData);
        } else {
            const button = document.createElement('button');
            button.innerText = buttonData.label;

            setStyles(button, {
                margin: '0 3px',
                padding: '5px 10px',
                fontSize: '10px',
                color: 'white',
                backgroundColor: 'purple',
                border: '1px solid black',
                cursor: 'pointer'
            });

            button.addEventListener('pointerdown', buttonData.onClick);
            container.appendChild(button);
        }
    });
}

// フォルダ風UI要素を作成する関数
function createFolder(container, label, folderButtonData) {
    const folder = document.createElement('button');
    folder.innerText = label;
    const folderContainer = document.createElement('div');

    setStyles(folder, {
        margin: '0 3px',
        padding: '5px 10px',
        fontSize: '10px',
        color: 'white',
        backgroundColor: 'darkblue',
        border: '1px solid black',
        cursor: 'pointer'
    });

    folderButtonData.forEach(buttonData => {
        const button = document.createElement('button');
        button.innerText = buttonData.label;
        setStyles(button, {
            width: '250%',
            margin: '2px 0',
            padding: '5px 10px',
            fontSize: '10px',
            color: 'white',
            backgroundColor: 'purple',
            border: '1px solid black',
            cursor: 'pointer'
        });

        button.addEventListener('pointerdown', buttonData.onClick);
        folderContainer.appendChild(button);
    });

    folder.appendChild(folderContainer);
    folderContainer.style.display = 'none';
    folderContainer.style.position = 'absolute';
    folderContainer.style.bottom = folder.style.top - folderContainer.clientHeight + 35 + 'px';

    folder.addEventListener('mouseenter', () => {
        folderContainer.style.display = 'block';
        isOpenFolder = true;
    });

    folder.addEventListener('mouseleave', () => {
        folderContainer.style.display = 'none';
        isOpenFolder = false;
    });

    container.appendChild(folder);
}

// APIをPOSTする関数
function postApi(url, data, callback) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        mode: 'no-cors'
    })
    .then(response => {
        if (callback) callback();
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
}

// UIを初期化する関数
function initializeUI() {
    const container = createContainer();
    createToggleButton(container);

    const buttonDataList = [
        {
            label: '1:URLをコピー📄',
            onClick: () => {
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
            }
        },
        {
            label: '2:ブクマ2SS📗',
            onClick: () => {
                const title = document.title;
                const url = window.location.href;
                postApi('https://script.google.com/macros/s/AKfycbzyDCJXbh6VIRPAZMCVEJkr7sqWVy_06J4ViBMhS7tYjUVxSV8Gz-0E8eMUkR8wpmRM/exec',
                    { title, link: url }, () => { alert('ブクマ2SSしました'); });
            }
        },
        {
            label: '行末にスペース追加',
            onClick: () => {
                const input = document.activeElement;
                if (input.value !== undefined) {
                    input.value = input.value.split('\n').map(line => line + '  ').join('\n');
                }
            }
        },
        {
            label: 'MD形式に変換',
            onClick: () => {
                const input = document.activeElement;
                if (input.value !== undefined) {
                    const lines = input.value.split('\n')
                        .filter(line => line.trim() !== '')
                        .map(line => {
                            if (line.includes('>')) return line + '\n';
                            const indentCount = (line.match(/　/g) || []).length;
                            line = line.replace(/　/g, '  ');
                            if (['#', '<', '恋', ' ', '[', '"', '-'].includes(line.trim()[0])) return line;
                            return '  '.repeat(indentCount) + '- ' + line.trim();
                        });

                    input.value = lines.join('\n');

                    if (input.value.startsWith('"')) input.value = input.value.slice(1);
                    if (input.value.endsWith('"')) input.value = input.value.slice(0, -1);
                }
            }
        },
        {
            label: 'LinkList',
            type: 'folder',
            folderButtonData: [
                { label: '管理画面DEV', onClick: () => window.open("https://develop.admin.koiniwa-boi.com/Master/MasterData", "②ウィンドウ名") },
                { label: 'Button 2', onClick: () => alert('Button 2 clicked!') }
                // 他のボタンデータを追加
            ]
        }
    ];

    createButtons(container, buttonDataList);

    document.body.appendChild(container);
}

// UIを初期化
initializeUI();
