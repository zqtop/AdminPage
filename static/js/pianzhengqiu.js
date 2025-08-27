 // 主变量
        let scene, camera, renderer, sphere, sceneGroup;
        let polarizations = [];
        let animationId;
        let rotating = true;
        const rotationSpeed = 0.003;

        // 容器尺寸
        const containerWidth = 360;
        const containerHeight = 250;

        // 拖拽变量
        let isDragging = false;
        let previousMousePosition = {
            x: 0,
            y: 0
        };

        // 旋转状态变量
        let rotationVelocity = {
            x: 0,
            y: 0
        };
        const friction = 0.95; // 摩擦系数
        const maxVelocity = 0.1; // 最大旋转速度

        // 初始化场景
        function init() {
            // 创建场景
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x050a18);

            // 创建相机
            camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
            camera.position.set(0, 0, 5);

            // 创建渲染器
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(containerWidth, containerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            const canvas = renderer.domElement;
            document.getElementById('canvas-container').appendChild(canvas);

            // 添加光源
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);

            const pointLight = new THREE.PointLight(0x00b3ff, 1, 20);
            pointLight.position.set(3, 3, 3);
            scene.add(pointLight);

            const backLight = new THREE.PointLight(0x0055ff, 0.8, 30);
            backLight.position.set(-5, -3, -5);
            scene.add(backLight);

            // 创建场景组 - 所有对象将添加到这个组中
            sceneGroup = new THREE.Group();
            scene.add(sceneGroup);

            // 创建坐标轴
            createAxes();

            // 创建偏振球
            createPoincareSphere();

            // 添加控制按钮事件
            document.getElementById('rotate-btn').addEventListener('click', toggleRotation);
            // 添加拖拽事件
            canvas.addEventListener('mousedown', onMouseDown);
            canvas.addEventListener('mousemove', onMouseMove);
            canvas.addEventListener('mouseup', onMouseUp);
            canvas.addEventListener('mouseleave', onMouseUp);

            // 开始动画
            MyAimate();
        }

        // 创建坐标轴
        function createAxes() {
            const axesHelper = new THREE.AxesHelper(1.8);

            // 自定义轴颜色
            const axesMaterial = new THREE.LineBasicMaterial({
                vertexColors: true,
                linewidth: 2
            });

            // 创建颜色缓冲区属性
            const axesColors = [];

            // X轴 (红色)
            axesColors.push(1, 0, 0); // 起点颜色
            axesColors.push(1, 0, 0); // 终点颜色

            // Y轴 (绿色)
            axesColors.push(0, 1, 0);
            axesColors.push(0, 1, 0);

            // Z轴 (蓝色)
            axesColors.push(0, 0.3, 1);
            axesColors.push(0, 0.3, 1);

            axesHelper.geometry.setAttribute('color', new THREE.Float32BufferAttribute(axesColors, 3));
            axesHelper.material = axesMaterial;

            sceneGroup.add(axesHelper);

            // 添加坐标轴标签
            addAxisLabels();
        }

        // 添加坐标轴标签
        function addAxisLabels() {
            // 创建X轴标签
            const xLabel = createAxisLabel('X', 0xff0000);
            xLabel.position.set(1.9, 0, 0);
            sceneGroup.add(xLabel);

            // 创建Y轴标签
            const yLabel = createAxisLabel('Y', 0x00ff00);
            yLabel.position.set(0, 1.9, 0);
            sceneGroup.add(yLabel);

            // 创建Z轴标签
            const zLabel = createAxisLabel('Z', 0x0080ff);
            zLabel.position.set(0, 0, 1.9);
            sceneGroup.add(zLabel);
        }

        // 创建坐标轴标签
        function createAxisLabel(text, color) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const size = 64;

            canvas.width = size;
            canvas.height = size;

            // 绘制背景
            context.fillStyle = 'rgba(0, 0, 0, 0.7)';
            context.beginPath();
            context.arc(size/2, size/2, size/2, 0, Math.PI * 2);
            context.fill();

            // 绘制文本
            context.font = 'bold 30px Arial';
            context.fillStyle = `rgb(${color >> 16}, ${(color >> 8) & 0xff}, ${color & 0xff})`;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text, size/2, size/2);

            // 创建纹理
            const texture = new THREE.CanvasTexture(canvas);

            // 创建精灵材质
            const material = new THREE.SpriteMaterial({
                map: texture,
                transparent: true
            });

            // 创建精灵
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(0.2, 0.2, 1);

            return sprite;
        }

        // 创建庞加莱球
        function createPoincareSphere() {
            // 球体参数
            const radius = 1.3;
            const segments = 48;

            // 创建球体几何
            const sphereGeometry = new THREE.SphereGeometry(radius, segments, segments);

            // 使用半透明材质
            const sphereMaterial = new THREE.MeshPhongMaterial({
                color: 0x143a7d,
                transparent: true,
                opacity: 0.25,
                wireframe: false,
                side: THREE.DoubleSide
            });

            sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sceneGroup.add(sphere);

            // 创建线框
            const wireframe = new THREE.LineSegments(
                new THREE.WireframeGeometry(sphereGeometry),
                new THREE.LineBasicMaterial({
                    color: 0x00b3ff,
                    linewidth: 1,
                    transparent: true,
                    opacity: 0.8
                })
            );
            sphere.add(wireframe);

            // 添加赤道线（线偏振）
            const equatorGeometry = new THREE.RingGeometry(radius, radius+0.01, 64);
            const equatorMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7
            });
            const equator = new THREE.Mesh(equatorGeometry, equatorMaterial);
            equator.rotation.x = Math.PI / 2;
            sceneGroup.add(equator);

            // 添加网格地面
            const gridHelper = new THREE.GridHelper(4, 12, 0x00aaff, 0x004477);
            gridHelper.position.y = -1.5;
            sceneGroup.add(gridHelper);

            // 添加偏振点
            addPolarizationPoints(radius);

            // 添加经线和纬线
            addMeridiansAndParallels(radius);
        }

        // 添加偏振点
        function addPolarizationPoints(radius) {
            // 定义偏振点
            polarizations = [
                // 线偏振点（赤道上）
                { type: 'horizontal', position: new THREE.Vector3(radius, 0, 0), color: new THREE.Color(0xff5252), name: '水平偏振' },
                { type: 'vertical', position: new THREE.Vector3(-radius, 0, 0), color: new THREE.Color(0xff5252), name: '垂直偏振' },
                { type: '45deg', position: new THREE.Vector3(0, radius, 0), color: new THREE.Color(0xff5252), name: '45°偏振' },
                { type: '135deg', position: new THREE.Vector3(0, -radius, 0), color: new THREE.Color(0xff5252), name: '135°偏振' },

                // 圆偏振点（南北极）
                { type: 'right_circular', position: new THREE.Vector3(0, 0, radius), color: new THREE.Color(0x00bcd4), name: '右旋圆偏振' },
                { type: 'left_circular', position: new THREE.Vector3(0, 0, -radius), color: new THREE.Color(0x00bcd4), name: '左旋圆偏振' },

                // 椭圆偏振点
                { type: 'elliptical', position: new THREE.Vector3(1.0, 0.8, 1.0).normalize().multiplyScalar(radius), color: new THREE.Color(0x66ff66), name: '椭圆偏振1' },
                { type: 'elliptical', position: new THREE.Vector3(-1.0, 0.6, -0.8).normalize().multiplyScalar(radius), color: new THREE.Color(0x66ff66), name: '椭圆偏振2' },
                { type: 'elliptical', position: new THREE.Vector3(0.5, -1.2, 0.7).normalize().multiplyScalar(radius), color: new THREE.Color(0x66ff66), name: '椭圆偏振3' }
            ];

            // 添加标注球
            polarizations.forEach(p => {
                // 标记球
                const sphereGeometry = new THREE.SphereGeometry(0.06, 12, 12);
                const sphereMaterial = new THREE.MeshPhongMaterial({
                    color: p.color,
                    emissive: p.color.clone().multiplyScalar(0.3),
                    shininess: 90
                });
                const marker = new THREE.Mesh(sphereGeometry, sphereMaterial);
                marker.position.copy(p.position);
                sceneGroup.add(marker);

                // 连接线
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), p.position]);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: p.color,
                    transparent: true,
                    opacity: 0.5
                });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                sceneGroup.add(line);
            });
        }

        // 添加经线和纬线
        function addMeridiansAndParallels(radius) {
            // 添加经线
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                const points = [];

                for (let j = 0; j <= 15; j++) {
                    const phi = (j / 15) * Math.PI;
                    const theta = angle;
                    const x = radius * Math.sin(phi) * Math.cos(theta);
                    const y = radius * Math.sin(phi) * Math.sin(theta);
                    const z = radius * Math.cos(phi);
                    points.push(new THREE.Vector3(x, y, z));
                }

                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0x0088ff,
                    transparent: true,
                    opacity: 0.4
                });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                sceneGroup.add(line);
            }

            // 添加纬线
            for (let i = 0; i < 4; i++) {
                const height = -radius + (i * 0.5) + 0.3;
                const circleRadius = Math.sqrt(radius * radius - height * height);
                const points = [];

                for (let j = 0; j <= 24; j++) {
                    const angle = (j / 24) * Math.PI * 2;
                    points.push(new THREE.Vector3(
                        circleRadius * Math.cos(angle),
                        circleRadius * Math.sin(angle),
                        height
                    ));
                }

                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0x0088ff,
                    transparent: true,
                    opacity: 0.4
                });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                sceneGroup.add(line);
            }
        }

        // 鼠标事件处理
        function onMouseDown(event) {
            isDragging = true;
            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
            document.getElementById('canvas-container').classList.add('dragging');

            // 停止自动旋转
            rotating = false;
            document.getElementById('rotate-btn').textContent = '开始旋转';
        }

        function onMouseMove(event) {
            if (isDragging) {
                const deltaMove = {
                    x: event.clientX - previousMousePosition.x,
                    y: event.clientY - previousMousePosition.y
                };

                // 根据鼠标移动计算旋转速度
                rotationVelocity.y = deltaMove.x * 0.01;
                rotationVelocity.x = deltaMove.y * 0.01;

                // 限制最大旋转速度
                rotationVelocity.x = Math.max(-maxVelocity, Math.min(maxVelocity, rotationVelocity.x));
                rotationVelocity.y = Math.max(-maxVelocity, Math.min(maxVelocity, rotationVelocity.y));

                // 应用旋转 - 旋转整个场景组
                sceneGroup.rotation.y += rotationVelocity.y;
                sceneGroup.rotation.x += rotationVelocity.x;

                previousMousePosition = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.getElementById('canvas-container').classList.remove('dragging');
        }

        // 控制函数
        function toggleRotation() {
            rotating = !rotating;
            document.getElementById('rotate-btn').textContent = rotating ? '暂停旋转' : '开始旋转';
        }

        function resetView() {
            sceneGroup.rotation.set(0, 0, 0);
            camera.position.set(0, 0, 5);
            rotationVelocity = {x: 0, y: 0};
        }

        // 动画循环
        function MyAimate() {
            animationId = requestAnimationFrame(MyAimate);

            // 自动旋转 - 旋转整个场景组
            if (rotating && !isDragging) {
                sceneGroup.rotation.y += rotationSpeed;
                sceneGroup.rotation.x += rotationSpeed * 0.3;
            }

            // 惯性旋转（当拖拽释放后）
            if (!rotating && !isDragging && (Math.abs(rotationVelocity.x) > 0.001 || Math.abs(rotationVelocity.y) > 0.001)) {
                sceneGroup.rotation.y += rotationVelocity.y;
                sceneGroup.rotation.x += rotationVelocity.x;

                // 应用摩擦力减速
                rotationVelocity.x *= friction;
                rotationVelocity.y *= friction;
            }

            // 轻微缩放效果
            const time = Date.now() * 0.001;
            const scale = 1 + Math.sin(time * 2) * 0.002;
            sphere.scale.set(scale, scale, scale);

            renderer.render(scene, camera);
        }

        // 初始化应用
        window.addEventListener('load', init);