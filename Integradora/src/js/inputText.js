document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector(".inp");
    const label = document.querySelector(".label");

    input.addEventListener("input", function () {
        console.log("Hey")
        if (this.value.trim() !== "") {
            label.style.opacity = "0";
            label.style.visibility = "hidden";
        } else {
            label.style.opacity = "1";
            label.style.visibility = "visible";
        }
    });
});

