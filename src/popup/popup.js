window.onload = () => {

    let tabs = document.getElementsByClassName('tab');
    let tab_controls = document.getElementsByClassName('footer-menu-item');

    Array.from(tab_controls).map(tab_control => {
        tab_control.addEventListener('click', event => {
            let selected_tab = document.getElementById('tab-' + tab_control.getAttribute('data-tab-id'));

            Array.from(tabs).forEach(tab => {
                tab.classList.remove('tab-active');
            });

            Array.from(tab_controls).forEach(tab_control => {
                tab_control.classList.remove('footer-menu-item__active');
            });

            tab_control.classList.add('footer-menu-item__active')
            selected_tab.classList.add('tab-active');
        });
    })

}