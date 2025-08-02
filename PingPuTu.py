import numpy as np
import matplotlib.pyplot as plt

# 采样率（每秒样本数）
sampling_rate = 1000

# 生成时间轴（从0到1秒的1000个点）
t = np.linspace(0, 1, sampling_rate, endpoint=False)

# 创建一个信号 - 两个正弦波的组合
freq1 = 50  # 第一个正弦波的频率 (Hz)
freq2 = 120  # 第二个正弦波的频率 (Hz)
signal = np.sin(2 * np.pi * freq1 * t) + np.sin(2 * np.pi * freq2 * t)

# 使用fft计算频域变换
fft_vals = np.fft.fft(signal)

# 计算对应的频率轴
fft_freq = np.fft.fftfreq(len(t), 1/sampling_rate)

# 我们通常只关心正频率部分
positive_fft_freq_mask = fft_freq > 0
fft_freq = fft_freq[positive_fft_freq_mask]
fft_vals = fft_vals[positive_fft_freq_mask]

# 绘制原始信号
plt.figure(figsize=(12, 6))

plt.subplot(2, 1, 1)
plt.plot(t, signal)
plt.title('Time Domain Signal')
plt.xlabel('Time [s]')
plt.ylabel('Amplitude')

# 绘制频谱图
plt.subplot(2, 1, 2)
plt.plot(fft_freq, np.abs(fft_vals))
plt.title('Frequency Domain (Spectrum)')
plt.xlabel('Frequency [Hz]')
plt.ylabel('Magnitude')

plt.tight_layout()
plt.show()