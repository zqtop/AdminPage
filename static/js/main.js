let timer = null;
let chartObj = null;
let currentColor = {
    main: '#8a2be2',
    secondary: '#4b00e0',
    light: '#a0a0ff',
    gradient: ['#8a2be2', '#4b00e0']
};
window.onload = function () {
    initPingPuTu();
    initShiPoQi();
    initFirstLineChart();
    initSecondLineChart();
    initZhuZhuangTu();
    initFirstGaGue();
    initSecondGaGue();
    if (!timer) {
          timer = setInterval(function () {
               let timeStr = getFormattedDateTime();
              $('#time').empty().text(timeStr);

          } ,1000);
          UpdateChart();

    }

}


function getFormattedDateTime() {
    const now = new Date();

    // 获取各时间组件
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // 组合成目标格式
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 模拟频谱数据


function initPingPuTu()
{
     // 获取Canvas元素及其上下文
    const spectrumData = Array.from({length: 100}, () => Math.random() * 100);
    const canvas = document.getElementById('spectrumChart');
    const ctx = canvas.getContext('2d');

    // 创建一个线性渐变
    const gradientFill = ctx.createLinearGradient(0, canvas.height, 0, 0);
    gradientFill.addColorStop(0, "rgba(75, 192, 192, 0.5)"); // 渐变起始颜色
    gradientFill.addColorStop(1, "rgba(153, 255, 153, 0.5)"); // 渐变结束颜色
     chartObj = new Chart(ctx, {
        type: 'bar', // 或者 'line' 用于线图
        data: {
            labels: spectrumData.map((_, index) => index),
            datasets: [{
                label: 'Frequency Magnitude',
                data: spectrumData,
                backgroundColor: gradientFill, // 使用渐变填充颜色
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function UpdateChart()
{
    const tempData = Array.from({length: 100}, () => Math.random() * 100);
    chartObj.data.datasets.data = tempData; // 新的数据集数组
    chartObj.data.labels = tempData.map((_, index) => index);      // 新的标签数组（如果需要更新的话）
    chartObj.update();
}

function initShiPoQi()
{
      const canvas = document.getElementById('oscilloscope');
        const ctx = canvas.getContext('2d');

        // 设置画布大小为窗口大小
        canvas.width = 710;
        canvas.height = 200;

        // 创建数据点数组
        const dataPoints = [];
        const numPoints = 2000; // 点的数量
        for (let i = 0; i < numPoints; i++) {
            dataPoints.push(Math.cos(i * 0.1) * canvas.height / 4 + canvas.height / 2); // 初始化正弦波数据
        }

        let x = 0;

        function draw() {
            // 清除画布
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 更新数据点
            dataPoints.push(Math.sin(x * 0.1) * canvas.height / 4 + canvas.height / 2);
            dataPoints.shift();

            // 绘制线条
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#0f0'; // 绿色线表示信号
            ctx.beginPath();
            dataPoints.forEach((y, index) => {
                const xPos = index - numPoints / 2; // 居中显示
                ctx.lineTo(xPos, y);
            });
            ctx.stroke();

            // 移动x轴位置
            x += 0.5;

            // 循环调用draw函数
            requestAnimationFrame(draw);
        }

        // 开始绘制
        draw();

        // 处理窗口调整大小
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
}

function  initFirstLineChart()
{
     const ctx = document.getElementById('firstGradientChart').getContext('2d');

        // 生成时间标签（过去12个月）
        const months = ['一月', '二月', '三月', '四月', '五月', '六月',
                       '七月', '八月', '九月', '十月', '十一月', '十二月'];

        // 初始数据
        let data = [65, 59, 80, 81, 56, 55, 40, 32, 45, 70, 75, 82];

        // 创建渐变
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(52, 152, 219, 0.5)');
        gradient.addColorStop(1, 'rgba(52, 152, 219, 0)');

        // 创建图表
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: '数据趋势',
                    data: data,
                    backgroundColor: gradient,
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 3,
                    tension: 0.3,
                    pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                    pointBorderColor: 'rgba(52, 152, 219, 1)',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ecf0f1',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 40, 80, 0.9)',
                        titleColor: '#3498db',
                        bodyColor: '#ecf0f1',
                        borderColor: 'rgba(52, 152, 219, 0.5)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#bdc3c7'
                        }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#bdc3c7',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
}

function  initSecondLineChart()
{
    const ctx = document.getElementById('neonChart').getContext('2d');
    const days = [];
    for (let i = 1; i <= 30; i++) {
        days.push(`Day ${i}`);
    }
    // 初始数据
    let data = Array.from({length: 30}, () => Math.floor(Math.random() * 80) + 20);
    const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: '用户活跃度',
                    data: data,
                    backgroundColor: null,
                    borderColor: currentColor.main,
                    borderWidth: 4,
                    tension: 0.4,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: currentColor.main,
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    fill: true,
                    pointStyle: 'circle'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20,
                        left: 20,
                        right: 20
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#e0e0ff',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 20, 70, 0.95)',
                        titleColor: currentColor.gradient,
                        borderColor: `rgba(${hexToRgb(currentColor.gradient)}, 0.7)`,
                        borderWidth: 1,
                        padding: 15,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `活跃度: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a0a0ff',
                            maxRotation: 0,
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a0a0ff',
                            padding: 10,
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart',
                    onComplete: function() {
                        // if (document.getElementById('toggleGlow').checked) {
                        //     const glowIntensity = parseInt(document.getElementById('glowControl').value);
                        //     createGlowEffect(ctx, glowIntensity);
                        // }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                }
            }
        });

        // 设置初始渐变
        chart.data.datasets[0].backgroundColor = createGradient(ctx);
        chart.update();

}
// 创建渐变
function createGradient(ctx, opacity = 0.45) {


    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, `rgba(${hexToRgb(currentColor.main)}, ${opacity})`);
    gradient.addColorStop(1, `rgba(${hexToRgb(currentColor.secondary)}, 0)`);
    return gradient;
}

// 将HEX颜色转换为RGB
function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;

    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }

    return `${r}, ${g}, ${b}`;
}

// 创建霓虹效果
function createGlowEffect(ctx, glowIntensity) {
    ctx.shadowColor = currentColor.main;
    ctx.shadowBlur = glowIntensity;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}


function  initZhuZhuangTu()
{
  // 获取 canvas 元素的上下文
  var ctx = document.getElementById('myBarChart').getContext('2d');

  // 创建一个新的 Chart 实例
  var myBarChart = new Chart(ctx, {
    type: 'bar', // 指定图表类型为柱状图
    data: {
      labels: ['一月', '二月', '三月', '四月'], // X轴标签
      datasets: [{
        label: '月度销售额', // 数据集标签
        data: [65, 59, 80, 81], // 数据值
        backgroundColor: [
          'rgba(255, 99, 132)',
          'rgba(54, 162, 235)',
          'rgba(255, 206, 86)',
          'rgba(75, 192, 192)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true // 确保Y轴从0开始
        }
      }
    }
  });

}


function  initFirstGaGue()
{
    const chart = echarts.init(document.getElementById('firstCanvs'));
 // 基础配置
        const option = {
            series: [{
                type: 'gauge',
                center: ['50%', '60%'],
                startAngle: 200,   // 起始角度
                endAngle: -20,     // 结束角度
                radius: '100%',

                // 指针配置
                pointer: {
                    show: true,
                    length: '70%',
                    width: 6,
                    itemStyle: {
                        color: '#58D9F9',
                        shadowColor: '#58D9F9',
                        shadowBlur: 10
                    }
                },

                // 刻度配置
                axisLine: {
                    lineStyle: {
                        width: 20,
                        color: [
                            [0.3, '#76e7ea'],
                            [0.7, '#32acec'],
                            [1, '#7842ba']
                        ]
                    }
                },

                // 刻度标签
                axisTick: {
                    distance: -30,
                    length: 8,
                    lineStyle: {
                        color: '#fff',
                        width: 2
                    }
                },

                // 分段标签
                splitLine: {
                    distance: -40,
                    length: 15,
                    lineStyle: {
                        color: '#fff',
                        width: 3
                    }
                },

                // 刻度值
                axisLabel: {
                    color: 'auto',
                    fontSize: 12,
                    distance: -60,
                    formatter: function(value) {
                        return value + '%';
                    }
                },

                // 指针数值显示
                detail: {
                    valueAnimation: true,
                    formatter: '{value}%',
                    color: 'inherit',
                    fontSize: 30,
                    offsetCenter: [0, '-20%']
                },

                // 初始数据
                data: [{ value: 50, name: '上行速率' }]
            }]
        };

        // 应用配置
        chart.setOption(option);

        // 动态更新数据
        let currentValue = 50;
        setInterval(() => {
            // 生成随机值（40-100之间）
            currentValue = Math.random() * 60 + 40;

            // 更新数据
            chart.setOption({
                series: [{
                    data: [{ value: currentValue.toFixed(1) }]
                }]
            });
        }, 2000);

        // 窗口自适应
        window.addEventListener('resize', () => chart.resize());
}

function  initSecondGaGue()
{
    const chart = echarts.init(document.getElementById('secondCanvs'));
 // 基础配置
        const option = {
            series: [{
                type: 'gauge',
                center: ['50%', '60%'],
                startAngle: 200,   // 起始角度
                endAngle: -20,     // 结束角度
                radius: '100%',

                // 指针配置
                pointer: {
                    show: true,
                    length: '70%',
                    width: 6,
                    itemStyle: {
                        color: '#65c6de',
                        shadowColor: '#58D9F9',
                        shadowBlur: 10
                    }
                },

                // 刻度配置
                axisLine: {
                    lineStyle: {
                        width: 20,
                        color: [
                            [0.3, '#2A5CAA'],
                            [0.7, '#3DB2A7'],
                            [1, '#A389D4']
                        ]
                    }
                },

                // 刻度标签
                axisTick: {
                    distance: -30,
                    length: 8,
                    lineStyle: {
                        color: '#fff',
                        width: 2
                    }
                },

                // 分段标签
                splitLine: {
                    distance: -40,
                    length: 15,
                    lineStyle: {
                        color: '#fff',
                        width: 3
                    }
                },

                // 刻度值
                axisLabel: {
                    color: 'auto',
                    fontSize: 12,
                    distance: -60,
                    formatter: function(value) {
                        return value + '%';
                    }
                },

                // 指针数值显示
                detail: {
                    valueAnimation: true,
                    formatter: '{value}%',
                    color: 'inherit',
                    fontSize: 30,
                    offsetCenter: [0, '-20%']
                },

                // 初始数据
                data: [{ value: 50, name: '下行速率' }]
            }]
        };

        // 应用配置
        chart.setOption(option);

        // 动态更新数据
        let currentValue = 50;
        setInterval(() => {
            // 生成随机值（40-100之间）
            currentValue = Math.random() * 60 + 40;

            // 更新数据
            chart.setOption({
                series: [{
                    data: [{ value: currentValue.toFixed(1) }]
                }]
            });
        }, 2000);

        // 窗口自适应
        window.addEventListener('resize', () => chart.resize());
}