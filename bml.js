    // Create a container for the buttons
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.6)'; // 半透明にする
    container.style.border = '0.2px solid black';
    container.style.padding = '3px';
    container.style.zIndex = '10000';
    container.style.boxSizing = 'border-box'; // ボックスサイズを設定
    container.style.width = '140px'; // 幅を固定
    container.style.height = 'auto'; // 高さを自動調整

    // Function to create a button
    // 長押し対応
    function createButton(label, onClickFunction) {
        var button = document.createElement('button');
        button.innerText = label;
        button.style.margin = '2px';
        button.style.padding = '3px 3px'; // ボタンのパディングを設定
        button.style.fontSize = '12px'; // フォントサイズを設定
        button.style.color = 'black'; // 文字色を黒に固定
        button.style.cursor = 'pointer'; // カーソルをポインターに設定
        button.onclick = onClickFunction;
        container.appendChild(button);
    }

    // Function to save the current position to localStorage
    function savePosition() {
        localStorage.setItem('containerTop', container.style.top);
        localStorage.setItem('containerRight', container.style.right);
    }

    // Function to load the saved position from localStorage
    function loadPosition() {
        var savedTop = localStorage.getItem('containerTop');
        var savedRight = localStorage.getItem('containerRight');
        if (savedTop !== null && savedRight !== null) {
            container.style.top = savedTop;
            container.style.right = savedRight;
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
        fetch('https://script.google.com/macros/s/AKfycbzyDCJXbh6VIRPAZMCVEJkr7sqWVy_06J4ViBMhS7tYjUVxSV8Gz-0E8eMUkR8wpmRM/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: title, link: url }),
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
    });

    //　改行htmlを追加
    container.appendChild(document.createElement('br'));

    const ADD_POS_Y = 100;
    // Add buttons to change Y coordinate
    createButton(' ↑ ', function () {
        var currentTop = parseInt(container.style.top);
        var newTop = currentTop - ADD_POS_Y;
        if (newTop <= 0) {
            container.style.top = '0px';
            alert('最上部です');
        } else {
            container.style.top = newTop + 'px';
        }
        savePosition();
    });
    createButton(' ↓ ', function () {
        var currentTop = parseInt(container.style.top);
        var newTop = currentTop + ADD_POS_Y;
        //　最下部
        if (newTop >= window.innerHeight - container.clientHeight) {
            container.style.top = window.innerHeight - container.clientHeight + 'px';
            alert('最下部です');
        } else {
            container.style.top = newTop + 'px';
        }
        savePosition();
    });

    // Append the container to the body
    document.body.appendChild(container);

    // Load the saved position
    loadPosition();
