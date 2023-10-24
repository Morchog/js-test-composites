
let minNumber, maxNumber = 0;

(function () {
    document.body.innerHTML = `
    <title>Matrix Heatmap</title>
    <h1 id="tit" class="text-center">Matrix Heatmap</h1>
    <div class="d-flex flex-row justify-content-center mt-4">
    <div>
    <div class="d-flex justify-content-center mt-4">
        <input id="arr1" type="text" class="form-control m-1" style="width: 200px;" placeholder="Array 1">
        <input id="arr2" type="text" class="form-control m-1" style="width: 200px;" placeholder="Array 2">
    </div>
    <div class="d-flex justify-content-center mt-1">
        <button class="btn btn-primary m-1" style="width: 40px;" onclick="fillTestData()">
            <img src="https://Morchog.github.io/js-test-composites/input-cursor-text.svg" />
        </button>
        <button class="btn btn-outline-secondary m-1" style="width: 155px;" onclick="aggregateArrays()">Plot Unsorted</button>
        <button class="btn btn-outline-primary m-1" style="width: 200px;" onclick="aggregateArrays(true)">Plot Sorted</button>
    </div>
    <div class="d-flex justify-content-center mt-1">
        <input id="c1" class="form-control m-1 p-0 border-0" type="color" style="width: 130px; height: 15px;" value="#e0005a"/>
        <input id="c2" class="form-control m-1 p-0 border-0" type="color" style="width: 130px; height: 15px;" value="#1250b5"/>
        <input id="c3" class="form-control m-1 p-0 border-0" type="color" style="width: 130px; height: 15px;" value="#62e4ca"/>
    </div>
    <div class="d-flex align-items-center justify-content-center mt-3">
        <div id="grid-plot" style="width: fit-content"></div>
    </div>
    </div>
    <div class="l-50 d-flex justify-content-top align-items-top m-3">
        <span class="p-3 rounded border border-primary" style="width:300px">
        Two arrays of unspecified size, containing numbers are aggregated into a matrix. <b>In order</b> - the following operations are performed for <b>each</b> element in the first array with <b>every</b> element in the second array: 
        <b>multiplication, addition, subtraction, division</b>!</br>If the size of the arrays differ, the extra elements are ignored regardless of which array is longer/shorter.</br>
        The resulting matrix should have the option to be sorted in the following way:
        </br>- Highest to lowest numbers are displayed in a \"reverse-waterfall\" fashion.
        </br><img src="https://Morchog.github.io/js-test-composites/example.png" style="width: 200px">
        </br></br><b>Numbers in result have a numeric scale of 1!</b>
        </span>
    </div>
    </div>`;
})();

function aggregateArrays() {
    let [grid, table] = [
        document.getElementById('grid-plot'),
        zugZug(document.getElementById('arr1').value.split(',').map(x => +x), document.getElementById('arr2').value.split(',').map(x => +x), arguments[0])];
    maxNumber = Math.max(...table.join().split(',').map(Number));
    minNumber = Math.min(...table.join().split(',').map(Number));
    document.getElementById('tit').innerHTML = `Matrix Heatmap - ${table.length}x${table.length}`
    grid.innerHTML = '';
    for (let i = 0; i < table.length; i++) {
        let row = document.createElement('div');
        addClasses(row, ['row', 'g-0']);
        row.style.paddingTop = '1px';
        row.style.paddingBottom = '1px';
        grid.appendChild(row);
        for (let j = 0; j < table[i].length; j++) {
            let col = document.createElement('div');
            addClasses(col, ['col', 'g-0']);
            col.style.paddingLeft = '1px';
            col.style.paddingRight = '1px';
            col.appendChild(boxy(table[i][j], table.length));
            row.appendChild(col);
        }
    }
}

function addClasses(el, classes) {
    for (let cls of classes)
        el.classList.add(cls);
}

const boxy = (x, size) => {
    let div = document.createElement('div');
    addClasses(div, ['badge']);
    div.style.fontSize = `${15 - (size * 0.2) + 5}px`;
    div.style.height = `${45 - (size * 0.7) + 15}px`;
    div.style.maxHeight = `${45 - (size * 0.7) + 15}px`;
    div.style.width = `${45 - (size * 0.7) + 15}px`;
    div.style.maxWidth = `${45 - (size * 0.7) + 15}px`;
    div.style.display = 'table-cell';
    div.style.verticalAlign = 'middle';
    div.style.overflow = 'hidden';
    div.style.background = colorGradient(x);
    div.innerHTML = abreviateNum(x);
    return div;
}

function convertRange(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function colorGradient(num) {
    let [c1, c2, c3] = [hexToRgb(document.getElementById('c1').value), hexToRgb(document.getElementById('c2').value), hexToRgb(document.getElementById('c3').value)];
    let fade = convertRange(num, [minNumber, maxNumber], [0, 1]) * 2;
    if (fade >= 1) {
        fade -= 1;
        c1 = c2;
        c2 = c3;
    }
    let [diffRed, diffGreen, diffBlue] = [c2.r - c1.r, c2.g - c1.g, c2.b - c1.b];
    return 'rgb(' + parseInt(Math.floor(c1.r + (diffRed * fade)), 10) + ',' + parseInt(Math.floor(c1.g + (diffGreen * fade)), 10) + ',' + parseInt(Math.floor(c1.b + (diffBlue * fade)), 10) + ')';
}

function abreviateNum() {
    let x = Number(arguments[0]);
    if (x >= 1000 && x < 1_000_000)
        return `${(x / 1000).toFixed(1)}k`
    if (x >= 1_000_000)
        return `${(x / 1_000_000).toFixed(1)}m`
    return x.toFixed(0);
}

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
