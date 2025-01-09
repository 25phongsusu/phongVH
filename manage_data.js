// manage_data.js

// Hàm để lấy dữ liệu từ Local Storage
function fetchData() {
    const data = localStorage.getItem('roomData');
    return data ? JSON.parse(data) : [];
}

// Hàm để lưu dữ liệu vào Local Storage
function saveData(data) {
    localStorage.setItem('roomData', JSON.stringify(data));
}

// Hàm để hiển thị dữ liệu JSON
function displayJson() {
    const data = fetchData();
    const jsonOutput = document.getElementById('json-output');
    jsonOutput.innerHTML = '';  // Clear previous content

    data.forEach((room, index) => {
        const roomElement = document.createElement('div');
        roomElement.textContent = JSON.stringify(room, null, 2) + (index < data.length - 1 ? ',' : '');
        roomElement.classList.add('room-entry');
        roomElement.dataset.index = index;
        roomElement.addEventListener('click', () => handleRoomClick(index));
        jsonOutput.appendChild(roomElement);
    });
}

// Hàm để thêm phòng
function addRoom() {
    const name = document.getElementById('name').value;
    const area = document.getElementById('area').value;
    const people = document.getElementById('people').value;
    const view = document.getElementById('view').value;
    const weekday_price = document.getElementById('weekday_price').value;
    const weekend_price = document.getElementById('weekend_price').value;
    const holiday_price = document.getElementById('holiday_price').value;
    const note = document.getElementById('note').value;

    const room = {
        name,
        area,
        people,
        view,
        weekday_price,
        weekend_price,
        holiday_price,
        note
    };

    let data = fetchData();
    data.push(room);
    saveData(data);
    displayJson();
    document.getElementById('data-form').reset();
    showAlert('Thêm thành công!', 'alert-add');
}

// Hàm để cập nhật phòng
function updateRoom() {
    const name = document.getElementById('name').value;
    const area = document.getElementById('area').value;
    const people = document.getElementById('people').value;
    const view = document.getElementById('view').value;
    const weekday_price = document.getElementById('weekday_price').value;
    const weekend_price = document.getElementById('weekend_price').value;
    const holiday_price = document.getElementById('holiday_price').value;
    const note = document.getElementById('note').value;

    const room = {
        name,
        area,
        people,
        view,
        weekday_price,
        weekend_price,
        holiday_price,
        note
    };

    let data = fetchData();
    const index = data.findIndex(r => r.name === name);
    if (index !== -1) {
        data[index] = room; // Cập nhật phòng nếu đã tồn tại
    }

    saveData(data);
    displayJson();
    document.getElementById('data-form').reset();
    showAlert('Cập nhật thành công!', 'alert-update');
    document.getElementById('update-btn').disabled = true;
    document.getElementById('delete-btn').disabled = true;
}

// Hàm để xóa phòng
function deleteRoom() {
    const name = document.getElementById('name').value;
    let data = fetchData();
    data = data.filter(r => r.name !== name);
    saveData(data);
    displayJson();
    document.getElementById('data-form').reset();
    showAlert('Xóa thành công!', 'alert-delete');
    document.getElementById('update-btn').disabled = true;
    document.getElementById('delete-btn').disabled = true;
}

// Hàm để đổ dữ liệu lên form khi click vào đoạn dữ liệu JSON
function loadRoomToForm(index) {
    const data = fetchData();
    const room = data[index];

    document.getElementById('name').value = room.name;
    document.getElementById('area').value = room.area;
    document.getElementById('people').value = room.people;
    document.getElementById('view').value = room.view;
    document.getElementById('weekday_price').value = room.weekday_price;
    document.getElementById('weekend_price').value = room.weekend_price;
    document.getElementById('holiday_price').value = room.holiday_price;
    document.getElementById('note').value = room.note;

    document.getElementById('update-btn').disabled = false;
    document.getElementById('delete-btn').disabled = false;
}

// Hàm để xử lý sự kiện click vào đoạn dữ liệu JSON
function handleRoomClick(index) {
    const entry = document.querySelector(`.room-entry[data-index='${index}']`);
    if (entry.classList.contains('selected')) {
        entry.classList.remove('selected');
        document.getElementById('data-form').reset();
        document.getElementById('update-btn').disabled = true;
        document.getElementById('delete-btn').disabled = true;
    } else {
        document.querySelectorAll('.room-entry').forEach(entry => entry.classList.remove('selected'));
        entry.classList.add('selected');
        loadRoomToForm(index);
    }
}

// Hàm để hiển thị thông báo
function showAlert(message, className) {
    const alertBox = document.getElementById('alert-box');
    alertBox.innerHTML = `<div class="alert ${className}">${message}</div>`;
    setTimeout(() => alertBox.innerHTML = '', 3000);  // Tự động ẩn sau 3 giây
}

// Hàm để sao chép JSON vào clipboard
function copyToClipboard() {
    const jsonOutput = document.getElementById('json-output');
    const range = document.createRange();
    range.selectNode(jsonOutput);
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand('copy');
    window.getSelection().removeAllRanges(); // to deselect
    showAlert('Đã sao chép vào clipboard!', 'alert-info');
}

// Thêm sự kiện cho các nút
document.getElementById('add-btn').addEventListener('click', addRoom);
document.getElementById('update-btn').addEventListener('click', updateRoom);
document.getElementById('delete-btn').addEventListener('click', deleteRoom);
document.getElementById('copy-btn').addEventListener('click', copyToClipboard);

// Hiển thị dữ liệu JSON khi tải trang
displayJson();