
function fillTestData() {
    let [arr1, arr2, seed, subseed, limit] = [[], [], getRandomInclusive(0, 100), 0, 0];
    limit = seed > 95 ? getRandomInclusive(5, 10, true) : getRandomInclusive(2, 4, true);
    while (arr1.length < limit) {
        subseed = getRandomInclusive(0, 100);
        arr1.push(Number((subseed > 95 ? getRandomInclusive(0, 50) : getRandomInclusive(0, 50, true)).toFixed(1)));
        subseed = getRandomInclusive(0, 100);
        arr2.push(Number((subseed > 95 ? getRandomInclusive(0, 50) : getRandomInclusive(0, 50, true)).toFixed(1)));
    }
    document.getElementById('arr1').value = arr1;
    document.getElementById('arr2').value = arr2;
}

function getRandomInclusive(min, max, ceil) {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    let randomNumber = randomBuffer[0] / (0xffffffff + 1);
    min = Math.ceil(min);
    max = Math.floor(max);
    return ceil ? Math.ceil(randomNumber * (max - min + 1) + min) : randomNumber * (max - min + 1) + min;
}
