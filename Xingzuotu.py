import base64
import io

import numpy as np
import matplotlib.pyplot as plt

# 定义16-QAM信号的I和Q值
amplitude_levels = [-3, -1, 1, 3]  # 对应于16-QAM的幅度级别

# 创建一个空列表用于存储星座点
constellation_points = []

# 生成所有可能的组合以形成16-QAM星座点
for i in amplitude_levels:
    for q in amplitude_levels:
        constellation_points.append(complex(i, q))

# 将星座点转换为numpy数组以便绘图
constellation_array = np.array(constellation_points)
print(constellation_array)
# 计算每个点的颜色强度（这里简单地根据I+Q的和来决定）
color_intensity = np.real(constellation_array) + np.imag(constellation_array)
color_intensity_normalized = (color_intensity - np.min(color_intensity)) / (np.max(color_intensity) - np.min(color_intensity))

# 使用colormap应用渐变颜色
cmap = plt.cm.get_cmap('viridis')  # 可以选择其他colormap如'plasma', 'magma', 'inferno'等

# 设置图表大小
plt.figure(figsize=(8, 8),facecolor=(1,1,1))

# 绘制散点图，并指定点的大小（s参数）和背景颜色
scatter = plt.scatter(np.real(constellation_array), np.imag(constellation_array),
                      c=color_intensity_normalized, cmap=cmap, s=600, edgecolors='w')

# 设置背景颜色
plt.gca().set_facecolor((0.9, 0.9, 0.9))  # RGB颜色值，范围从0到1

# 添加颜色条
plt.colorbar(scatter)

# 添加标题和标签
plt.title('16-QAM Constellation Diagram with Gradient Colors', fontsize=15)
plt.xlabel('In-phase (I)', fontsize=12)
plt.ylabel('Quadrature (Q)', fontsize=12)

# 增强网格线
plt.grid(True, which='both', linestyle='--', linewidth=0.5)

# 调整坐标轴范围和比例
plt.axis([-4, 4, -4, 4])
plt.axis('equal')
buf = io.BytesIO()
plt.savefig(buf, format='png')
buf.seek(0)
image_base64 = base64.b64encode(buf.read()).decode('utf-8')
buf.close()
image_base64 = "data:image/png;base64," + image_base64
print(image_base64)
# 显示图形
plt.show()