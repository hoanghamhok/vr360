const playBtn = document.getElementById('playBtn');
const placeholder = document.getElementById('videoPlaceholder');
const youtubeFrame = document.getElementById('youtubeFrame');

playBtn.addEventListener('click', function () {
    // Thay VIDEO_ID bằng ID video YouTube của bạn
    const videoId = "lOgGZoUX-P0&list=RDlOgGZoUX-P0&start_radio=1";
    youtubeFrame.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1";

    placeholder.style.display = "none";
    youtubeFrame.style.display = "block";
});

document.addEventListener('DOMContentLoaded', function () {
    // Khởi tạo viewer Pannellum
    var viewer = pannellum.viewer('panorama', {
        type: 'equirectangular',
        panorama: 'assets/vr360_1.jpg',  // đường dẫn ảnh 360 hiện bạn đang dùng
        autoLoad: true,
        autoRotate: -2,        // quay chậm
        hfov: 100,             // góc zoom
        minHfov: 50,
        maxHfov: 120,
        pitch: 0,
        yaw: 0,
        compass: false,
        showZoomCtrl: false,   // tắt nút zoom default (mình sẽ dùng nút custom của bạn)
        hotSpotDebug: true,
        hotSpots: [
            {
                pitch: 2.0627381163212184,      // góc dọc
                yaw: -40.565665478347256,      // góc ngang
                type: 'info',
                text: 'View Beach',
                createTooltipFunc: hotspotTooltip,
                createTooltipArgs: {
                    titleEn: 'View Beach Windown',
                    titleCn: 'Windown that direct to Beach,beautiful view',
                    img: 'images/caimep.jpg'

                }
            },
            {
                pitch: -2.7617492758444753,
                yaw: 101.69560722211475,
                type: 'custom',
                createTooltipFunc: createCustomHotspot,
                createTooltipArgs: {
                    titleEn: 'Coconut tree',
                    titleCn: 'The bigggest coconut tree',
                    image: 'images/caydua.png'
                }
            }
        ]
    });

    // --- GÁN NÚT ĐIỀU KHIỂN (ZOOM/PAN) VÀO PANNELLUM ---

    // Zoom in
    document.getElementById('zoomInBtn').addEventListener('click', function () {
        var hfov = viewer.getHfov();
        viewer.setHfov(hfov - 5); // zoom in
    });

    // Zoom out
    document.getElementById('zoomOutBtn').addEventListener('click', function () {
        var hfov = viewer.getHfov();
        viewer.setHfov(hfov + 5); // zoom out
    });

    // Pan left
    document.getElementById('panLeftBtn').addEventListener('click', function () {
        var yaw = viewer.getYaw();
        viewer.setYaw(yaw - 10);
    });

    // Pan right
    document.getElementById('panRightBtn').addEventListener('click', function () {
        var yaw = viewer.getYaw();
        viewer.setYaw(yaw + 10);
    });
});
function hotspotTooltip(hotSpotDiv, args) {
    // class để CSS
    hotSpotDiv.classList.add('pannellum-hotspot');

    // Nội dung tooltip
    var titleEn = document.createElement('div');
    titleEn.className = 'pannellum-tooltip-title-en';
    titleEn.innerText = args.titleEn || '';

    var titleCn = document.createElement('div');
    titleCn.className = 'pannellum-tooltip-title-cn';
    titleCn.innerText = args.titleCn || '';

    hotSpotDiv.appendChild(titleEn);
    hotSpotDiv.appendChild(titleCn);

    // Nếu muốn click mở panel lớn (popup HTML)
    hotSpotDiv.addEventListener('click', function () {
        openDetailPanel(args);
    });
}

// Panel chi tiết dạng popup HTML
function openDetailPanel(args) {
    // Tạo/hiện 1 popup HTML bên ngoài (dùng CSS định vị ở giữa màn)
    var panel = document.getElementById('detail-panel-html');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'detail-panel-html';
        panel.className = 'detail-panel-html';

        panel.innerHTML = `
            <div class="detail-panel-inner">
                <button class="detail-close-html">✕</button>
                <h3 class="detail-title-en"></h3>
                <h4 class="detail-title-cn"></h4>
                <img class="detail-img" src="" alt="">
            </div>
        `;
        document.body.appendChild(panel);
    }

    panel.querySelector('.detail-title-en').innerText = args.titleEn || '';
    panel.querySelector('.detail-title-cn').innerText = args.titleCn || '';
    panel.querySelector('.detail-img').src = args.img || 'images/default.jpg';

    panel.style.display = 'flex';

    panel.querySelector('.detail-close-html').onclick = function () {
        panel.style.display = 'none';
    };
}
function createCustomHotspot(container, args) {
    // Thêm class để style
    container.classList.add('hotspot-custom-wrapper');

    // Tạo icon
    var icon = document.createElement('div');
    icon.className = 'hotspot-custom-icon';
    container.appendChild(icon);

    // Tooltip (hover)
    var tooltip = document.createElement('div');
    tooltip.className = 'hotspot-custom-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-title-en">${args.titleEn}</div>
        <div class="tooltip-title-cn">${args.titleCn}</div>
    `;
    container.appendChild(tooltip);

    // Panel chi tiết (click)
    var panel = document.createElement('div');
    panel.className = 'hotspot-custom-panel';
    panel.innerHTML = `
        <div class="panel-header">
            <span class="panel-icon">●</span>
            <div class="panel-titles">
                <div class="panel-title-en">${args.titleEn}</div>
                <div class="panel-title-cn">${args.titleCn}</div>
            </div>
            <span class="panel-close">&times;</span>
        </div>
        <div class="panel-body">
            <img src="${args.image}" alt="" />
        </div>
    `;
    document.body.appendChild(panel);

    var closeBtn = panel.querySelector('.panel-close');

    // HOVER
    container.addEventListener('mouseenter', function () {
        tooltip.classList.add('visible');
    });

    container.addEventListener('mouseleave', function () {
        tooltip.classList.remove('visible');
    });

    // CLICK: mở panel
    container.addEventListener('click', function () {
        panel.classList.add('show');
    });

    // CLICK nút đóng
    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        panel.classList.remove('show');
    });
}
