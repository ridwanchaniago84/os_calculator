$(document).ready(function () {
    $('.sidenav').sidenav();

    const input = (index) => {
        return `
            <div>
                <div class="col s12">
                    <h6>Proses ${index}</h6>
                </div>
                <div class="input-field col s12">
                    <input id="proses-${index}" type="text" class="validate">
                    <label for="proses-${index}">Proses</label>
                </div>
                <div class="input-field col s12">
                    <input id="tunggu-${index}" type="text" class="validate">
                    <label for="tunggu-${index}">Waktu Tunggu</label>
                </div>
                <div class="col s12">
                    <hr />
                </div>
            </div>
        `
    };

    $('#add-input').click(() => {
        const totalProcess = $('#input-container').children().length;

        $('#input-container').append(input(totalProcess + 1))
        console.log(totalProcess)
    });

    $('#remove-input').click(() => {
        const totalProcess = $('#input-container').children().length;

        if (totalProcess > 1) {
            $('#input-container').children().last().remove();
        }
    });
});
