const squaresContainer = document.getElementById('squares-container');
let squaresData = [];

// Tải dữ liệu từ tệp JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        squaresData = data;
        displaySquares(squaresData);
    });

// Thêm event listener cho radio buttons
document.querySelectorAll('input[name="priceType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        // Mở khóa select box giá khi đã chọn loại giá
        document.getElementById('price').disabled = false;
    });
});

function displaySquares(data) {
    squaresContainer.innerHTML = "";
    data.forEach(item => {
        const col = document.createElement('div');
        col.classList.add('col-6', 'col-sm-4', 'col-md-3', 'col-lg-2');
        
        const square = document.createElement('div');
        square.classList.add('square');
        square.addEventListener('click', () => showDetails(item));
        
        const squareContent = document.createElement('div');
        squareContent.classList.add('square-content');
        squareContent.textContent = item.name;
        
        square.appendChild(squareContent);
        col.appendChild(square);
        squaresContainer.appendChild(col);
    });
}

function applyFilters() {
    const areaFilter = document.getElementById('area').value;
    const priceFilter = document.getElementById('price').value;
    const priceTypeFilter = document.querySelector('input[name="priceType"]:checked')?.value;
    const peopleFilter = document.getElementById('people').value;
    const viewFilter = document.getElementById('view').value;

    const filteredData = squaresData.filter(item => {
        const areaMatch = (!areaFilter || item.area === areaFilter);
        
        let priceMatch = true;
        if (priceTypeFilter && priceFilter) {
            const selectedPrice = item[priceTypeFilter];
            priceMatch = (priceFilter === 'under_1_million' && selectedPrice < 1000000) ||
            (priceFilter === '1_to_3_million' && selectedPrice >= 1000000 && selectedPrice <= 3000000) ||
                        (priceFilter === '3_to_5_million' && selectedPrice > 3000000 && selectedPrice <= 5000000) ||
                        (priceFilter === '5_to_7_million' && selectedPrice > 5000000 && selectedPrice <= 7000000);
        }
        
        const peopleMatch = (!peopleFilter || (peopleFilter === '10' ? item.people > 10 : item.people == peopleFilter));
        const viewMatch = (!viewFilter || item.view === viewFilter);

        return areaMatch && priceMatch && peopleMatch && viewMatch;
    });

    displaySquares(filteredData);
}

function showDetails(item) {
    const viewMapping = {
        "no_view": "Không view",
        "sea_view": "View Biển",
        "mountain_view": "View Núi",
        
    };

    const areaMapping = {
        "xom_chai": "Xóm Chài",
        "xom_luoi": "Xóm Lưới",
        "villa": "Villa",
        "homestay_lamer": "Homestay Lamer",
        "homestay_lang_chai": "Làng Chài",
        "santo_villa": "Santo Villa"

    };

    document.getElementById('modal-name').textContent = `Tên: ${item.name}`;
    document.getElementById('modal-area').textContent = `Khu vực: ${areaMapping[item.area]}`;
    document.getElementById('modal-people').textContent = `Số người: ${item.people}`;
    document.getElementById('modal-view').textContent = `View: ${viewMapping[item.view]}`;
    document.getElementById('modal-weekday-price').textContent = `Giá ngày thường: ${item.weekday_price.toLocaleString('vi-VN')} VND`;
    document.getElementById('modal-weekend-price').textContent = `Giá cuối tuần: ${item.weekend_price.toLocaleString('vi-VN')} VND`;
    document.getElementById('modal-holiday-price').textContent = `Giá lễ tết: ${item.holiday_price.toLocaleString('vi-VN')} VND`;
    document.getElementById('modal-note').textContent = `Ghi chú: ${item.note}`;

    const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
    detailModal.show();
}