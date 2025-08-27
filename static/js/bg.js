   const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');

        // 设置Canvas尺寸为窗口大小
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // 粒子数组
        let particles = [];
        const particleCount = 150;

        // 鼠标位置
        const mouse = {
            x: null,
            y: null,
            radius: 100
        };

        // 监听鼠标移动
        window.addEventListener('mousemove', function(event) {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        // 粒子类
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
            }

            update() {
                // 粒子移动
                this.x += this.speedX;
                this.y += this.speedY;

                // 边界检查
                if (this.x < 0 || this.x > canvas.width) {
                    this.speedX = -this.speedX;
                }
                if (this.y < 0 || this.y > canvas.height) {
                    this.speedY = -this.speedY;
                }

                // 鼠标互动
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    const tx = this.x + Math.cos(angle) * force * 5;
                    const ty = this.y + Math.sin(angle) * force * 5;

                    this.speedX += (tx - this.x) * 0.05;
                    this.speedY += (ty - this.y) * 0.05;
                }

                // 绘制粒子
                this.draw();
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();

                // 绘制粒子光晕
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 180, 216, ${this.size * 0.1})`;
                ctx.fill();
            }
        }

        // 初始化粒子
        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        // 连接粒子
        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        const opacity = 1 - distance / 100;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 180, 216, ${opacity * 0.1})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // 动画循环
        function animate() {
            // 创建半透明背景以实现拖尾效果
            ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 更新并绘制所有粒子
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }

            // 连接粒子
            connectParticles();

            requestAnimationFrame(animate);
        }

        // 窗口大小调整处理
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        // 初始化并启动动画
        initParticles();
        animate();