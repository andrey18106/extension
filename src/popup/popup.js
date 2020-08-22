function extractHostname(url) {
    let hostname;
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

function removeSiteFromList(event) {
    event.target.parentNode.parentNode.removeChild(event.target.parentNode);
    chrome.storage.sync.get('site_list', (result) => {
        let current_site_list = result.site_list;
        if (delete current_site_list[event.target.getAttribute('data-site')]) {
            chrome.storage.sync.set({ site_list: current_site_list }, () => {
                console.log('Site successfully removed from list');
                let hide_history_btn = document.querySelector('.hide-history-btn');
                hide_history_btn.removeAttribute('disabled');
                hide_history_btn.innerHTML = 'Hide history of this site';
            });
        }
    })
}

function siteExists(url, callback) {
    chrome.storage.sync.get('site_list', (result) => {
        if (result.site_list) {
            if (url in result.site_list) {
                callback(true);
            }
        }
    });
}

function createListItem(site) {
    let list_item = document.createElement('li');
    let site_info = document.createElement('div');
    let site_icon = document.createElement('img');
    let site_domain = document.createElement('span');
    let remove_button = document.createElement('button');

    list_item.classList.add('site-list-item');
    list_item.appendChild(site_info);
    list_item.appendChild(remove_button);

    site_info.classList.add('site-info');
    site_info.appendChild(site_icon);
    site_info.appendChild(site_domain);

    site_icon.src = site.favIconUrl;
    site_icon.alt = site.url;
    site_icon.width = '16';
    site_icon.height = '16';

    site_domain.classList.add('site-domain');
    site_domain.innerHTML = site.url;

    remove_button.classList.add('remove-site-btn');
    remove_button.setAttribute('data-site', site.url);
    remove_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px"
        y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="100%"
        height="100%">
        <g>
            <path
                d="M452.923,98.462h-98.462C354.462,44.081,310.38,0,256,0s-98.462,44.081-98.462,98.462H59.077 c-13.598,0-24.615,11.018-24.615,24.615s11.018,24.615,24.615,24.615h9.846V448c0.059,35.328,28.672,63.941,64,64h246.154  c35.328-0.059,63.941-28.672,64-64V147.692h9.846c13.598,0,24.615-11.018,24.615-24.615S466.521,98.462,452.923,98.462z M256,49.231 c27.185,0,49.231,22.046,49.231,49.231h-98.462C206.769,71.276,228.815,49.231,256,49.231z M393.846,448  c0,8.153-6.617,14.769-14.769,14.769H132.923c-8.153,0-14.769-6.617-14.769-14.769V147.692h275.692V448z"
                data-original="#FF485A" data-old_color="#FF485A" />
            <g>
                <path
                    d="M201.846,379.077c-13.598,0-24.615-11.018-24.615-24.615V256c0-13.598,11.018-24.615,24.615-24.615 s24.615,11.018,24.615,24.615v98.462C226.462,368.059,215.444,379.077,201.846,379.077z"
                    data-original="#FFBBC0" class="" data-old_color="#FFBBC0" />
                <path
                    d="M310.154,379.077c-13.598,0-24.615-11.018-24.615-24.615V256c0-13.598,11.018-24.615,24.615-24.615 c13.598,0,24.615,11.018,24.615,24.615v98.462C334.769,368.059,323.751,379.077,310.154,379.077z"
                    data-original="#FFBBC0" class="" data-old_color="#FFBBC0" />
            </g>
        </g>
    </svg>`;
    remove_button.addEventListener('click', removeSiteFromList);
    return list_item;
}

window.onload = () => {

    // Tab "Add" handlers

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
    let hide_history_btn = document.querySelector('.hide-history-btn');

    hide_history_btn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, tab => {
            chrome.storage.sync.get('site_list', (result) => {
                let current_site_list = result.site_list ? result.site_list : {};
                let new_site = {
                    'favIconUrl': tab[0].favIconUrl,
                    'url': extractHostname(tab[0].url)
                }
                current_site_list[extractHostname(tab[0].url).toString()] = new_site;
                chrome.storage.sync.set({ site_list: current_site_list }, () => {
                    console.log('Site successfully added to storage');
                    site_list.appendChild(createListItem({
                        'favIconUrl': tab[0].favIconUrl,
                        'url': extractHostname(tab[0].url)
                    }));
                    hide_history_btn.setAttribute('disabled', 'disabled');
                    hide_history_btn.innerHTML = 'History of this site is hidden'; 
                });
            });
        });
    });

    // Get active tab info (url, favicon)
    chrome.tabs.query({ active: true, currentWindow: true }, tab => {

        let img = document.createElement('img');
        img.alt = 'active tab icon';
        img.width = '32';
        img.height = '32';
        if (tab[0].favIconUrl) {
            img.src = tab[0].favIconUrl;
        } else {
            img.src = '../images/empty.svg';
        }

        active_tab_name_div.innerHTML = extractHostname(tab[0].url);
        active_tab_name_div.parentNode.insertBefore(img, active_tab_name_div);

        siteExists(extractHostname(tab[0].url), (result) => {
            if (result == true) {
                console.log('Site exists in list');
                hide_history_btn.setAttribute('disabled', 'disabled');
                hide_history_btn.innerHTML = 'History of this site is hidden';
            }
        });
    });

    // ------------------


    // Tab "List" handlers

    let site_list = document.querySelector('.site-list');
    chrome.tabs.query({ active: true, currentWindow: true }, tab => {
        chrome.storage.sync.get('site_list', (result) => {
            if (result.site_list) {
                for (let key in result.site_list) {
                    site_list.appendChild(createListItem(result.site_list[key]));
                }
            }
        });
    });

    // -------------------


    // Tab "Settings" handlers

    let clear_storage_btn = document.querySelector('.clear-storage-btn');
    clear_storage_btn.addEventListener('click', () => {
        chrome.storage.sync.clear(error => {
            console.error(error);
        });
        alert('Storage successfully cleaned!');
    });

    // -----------------------
}