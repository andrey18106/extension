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

}