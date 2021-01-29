document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#home-btn').onclick = function() {
        this.parentElement.parentElement.classList.add('hide');
        document.querySelector('.background-dark').classList.add('hide');
    };

    document.querySelectorAll('area').forEach(area => {
        area.onclick = function() {
            let http = new XMLHttpRequest();

            const _ = this;
            let rideName = _.getAttribute('id');

            http.open('GET', window.location.origin + `/reserve-spot/${rideName}`);

            http.onreadystatechange = () => {
                if (http.readyState == 4 && http.status == 200) {
                    let data = JSON.parse(http.response);
                    let parent = document.querySelector('.popover');
                    console.log(data, data.description);

                    parent.querySelector('.title').textContent = rideName;
                    parent.querySelector('.description').textContent = data.description;
                    parent.querySelector('.price').textContent = 'Price: ' + data.price;
                    console.log(
                        parent.querySelector('.title'),
                        parent.querySelector('.description'),
                        parent.querySelector('.price')
                    );

                    parent.classList.remove('hide');
                    document.querySelector('.background-dark').classList.remove('hide');
                }
            };

            http.send(
                JSON.stringify({
                    rideName : rideName
                })
            );
        };
    });
});
