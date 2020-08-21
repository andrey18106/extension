function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

window.onload = () => {

    let tabs = document.getElementsByClassName('tab');
    let tab_controls = document.getElementsByClassName('footer-menu-item');

    for (let tab_control of tab_controls) {
        tab_control.addEventListener('click', event => {
            let selected_tab = document.getElementById('tab-' + tab_control.getAttribute('data-tab-id'));

            for (let tab of tabs) {
                tab.classList.remove('tab-active');
            }

            for (let tab_contr of tab_controls) {
                tab_contr.classList.remove('footer-menu-item__active');
            }

            tab_control.classList.add('footer-menu-item__active')
            selected_tab.classList.add('tab-active');
        });
    }

    let active_tab_name_div = document.querySelector('.active-tab-name');

    chrome.tabs.query({ active: true, currentWindow: true }, tab => {
        console.log(tab);
        active_tab_name_div.innerHTML = extractHostname(tab[0].url);

        let img = document.createElement('img');
        img.alt = 'active tab icon';
        img.width = '32';
        img.height = '32';
        img.style.marginRight = '5px';
        if (tab[0].favIconUrl) {
            img.style.borderRadius = '50%';
            img.src = tab[0].favIconUrl;
        } else {
            img.src = '../images/empty.svg';
        }
        active_tab_name_div.parentNode.insertBefore(img, active_tab_name_div);
    })
}