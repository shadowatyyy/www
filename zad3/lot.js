function bestPassenger() {
    var passengers = document.querySelectorAll('.osoba');
    var best = passengers[0];
    for (var i = 1; i < passengers.length; i++) {
        var bestId = best.getAttribute('data-identyfikator-pasazera');
        var currId = passengers[i].getAttribute('data-identyfikator-pasazera');
        if (currId > bestId)
            best = passengers[i];
    }
    return best;
}
console.log(bestPassenger().textContent);
setTimeout(function () {
    console.log('No już wreszcie.');
}, 2000);
