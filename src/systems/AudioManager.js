/**
 * 音效管理器
 * 使用 Web Audio API 程序化生成音效
 */

export class AudioManager {
  constructor() {
    this.context = null
    this.masterVolume = 0.5
    this.sfxVolume = 0.7
    this.musicVolume = 0.3
    this.enabled = true
    this.musicNode = null

    this.init()
  }

  init() {
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.warn('Web Audio API 不支持')
      this.enabled = false
    }
  }

  // 确保音频上下文已激活
  resume() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume()
    }
  }

  // 设置主音量
  setMasterVolume(value) {
    this.masterVolume = Math.max(0, Math.min(1, value))
  }

  // 设置音效音量
  setSfxVolume(value) {
    this.sfxVolume = Math.max(0, Math.min(1, value))
  }

  // 设置音乐音量
  setMusicVolume(value) {
    this.musicVolume = Math.max(0, Math.min(1, value))
    if (this.musicGain) {
      this.musicGain.gain.value = this.masterVolume * this.musicVolume
    }
  }

  // 切换静音
  toggleMute() {
    this.enabled = !this.enabled
    if (this.musicGain) {
      this.musicGain.gain.value = this.enabled ? this.masterVolume * this.musicVolume : 0
    }
    return this.enabled
  }

  // 播放音效
  playSfx(type) {
    if (!this.enabled || !this.context) return
    this.resume()

    const volume = this.masterVolume * this.sfxVolume

    switch (type) {
      case 'attack':
        this.playAttackSound(volume)
        break
      case 'hit':
        this.playHitSound(volume)
        break
      case 'kill':
        this.playKillSound(volume)
        break
      case 'skill':
        this.playSkillSound(volume)
        break
      case 'hurt':
        this.playHurtSound(volume)
        break
      case 'select':
        this.playSelectSound(volume)
        break
      case 'buff':
        this.playBuffSound(volume)
        break
      case 'wave':
        this.playWaveSound(volume)
        break
      case 'gameover':
        this.playGameOverSound(volume)
        break
    }
  }

  // 攻击音效 - 剑划过空气
  playAttackSound(volume) {
    const osc = this.context.createOscillator()
    const gain = this.context.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(800, this.context.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 0.1)

    gain.gain.setValueAtTime(volume * 0.3, this.context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1)

    osc.connect(gain)
    gain.connect(this.context.destination)

    osc.start()
    osc.stop(this.context.currentTime + 0.1)
  }

  // 命中音效
  playHitSound(volume) {
    const osc = this.context.createOscillator()
    const gain = this.context.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(300, this.context.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.05)

    gain.gain.setValueAtTime(volume * 0.2, this.context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(this.context.destination)

    osc.start()
    osc.stop(this.context.currentTime + 0.05)
  }

  // 击杀音效
  playKillSound(volume) {
    // 短促的爆裂音
    const noise = this.createNoise(0.1)
    const filter = this.context.createBiquadFilter()
    const gain = this.context.createGain()

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2000, this.context.currentTime)
    filter.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 0.1)

    gain.gain.setValueAtTime(volume * 0.3, this.context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.context.destination)

    noise.start()
    noise.stop(this.context.currentTime + 0.1)
  }

  // 技能音效
  playSkillSound(volume) {
    const osc1 = this.context.createOscillator()
    const osc2 = this.context.createOscillator()
    const gain = this.context.createGain()

    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(600, this.context.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(1200, this.context.currentTime + 0.2)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(800, this.context.currentTime)
    osc2.frequency.exponentialRampToValueAtTime(400, this.context.currentTime + 0.2)

    gain.gain.setValueAtTime(volume * 0.2, this.context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(this.context.destination)

    osc1.start()
    osc2.start()
    osc1.stop(this.context.currentTime + 0.2)
    osc2.stop(this.context.currentTime + 0.2)
  }

  // 受伤音效
  playHurtSound(volume) {
    const osc = this.context.createOscillator()
    const gain = this.context.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, this.context.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, this.context.currentTime + 0.15)

    gain.gain.setValueAtTime(volume * 0.4, this.context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15)

    osc.connect(gain)
    gain.connect(this.context.destination)

    osc.start()
    osc.stop(this.context.currentTime + 0.15)
  }

  // UI选择音效
  playSelectSound(volume) {
    const osc = this.context.createOscillator()
    const gain = this.context.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, this.context.currentTime)
    osc.frequency.setValueAtTime(1000, this.context.currentTime + 0.05)

    gain.gain.setValueAtTime(volume * 0.15, this.context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1)

    osc.connect(gain)
    gain.connect(this.context.destination)

    osc.start()
    osc.stop(this.context.currentTime + 0.1)
  }

  // 获得强化音效
  playBuffSound(volume) {
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.context.createOscillator()
      const gain = this.context.createGain()

      osc.type = 'sine'
      osc.frequency.value = freq

      const startTime = this.context.currentTime + i * 0.08
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(volume * 0.15, startTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)

      osc.connect(gain)
      gain.connect(this.context.destination)

      osc.start(startTime)
      osc.stop(startTime + 0.15)
    })
  }

  // 波次开始音效
  playWaveSound(volume) {
    const osc = this.context.createOscillator()
    const gain = this.context.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(200, this.context.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.3)

    gain.gain.setValueAtTime(volume * 0.25, this.context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3)

    osc.connect(gain)
    gain.connect(this.context.destination)

    osc.start()
    osc.stop(this.context.currentTime + 0.3)
  }

  // 游戏结束音效
  playGameOverSound(volume) {
    const notes = [392, 349, 330, 262] // G4, F4, E4, C4 下行
    notes.forEach((freq, i) => {
      const osc = this.context.createOscillator()
      const gain = this.context.createGain()

      osc.type = 'sine'
      osc.frequency.value = freq

      const startTime = this.context.currentTime + i * 0.25
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(volume * 0.2, startTime + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4)

      osc.connect(gain)
      gain.connect(this.context.destination)

      osc.start(startTime)
      osc.stop(startTime + 0.4)
    })
  }

  // 创建白噪声
  createNoise(duration) {
    const bufferSize = this.context.sampleRate * duration
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.context.createBufferSource()
    noise.buffer = buffer
    return noise
  }

  // 启动背景音乐（简单的程序化环境音）
  startMusic() {
    if (!this.enabled || !this.context || this.musicNode) return
    this.resume()

    // 创建低频环境音
    const osc = this.context.createOscillator()
    const lfo = this.context.createOscillator()
    const lfoGain = this.context.createGain()
    this.musicGain = this.context.createGain()

    osc.type = 'sine'
    osc.frequency.value = 80

    lfo.type = 'sine'
    lfo.frequency.value = 0.1

    lfoGain.gain.value = 20

    lfo.connect(lfoGain)
    lfoGain.connect(osc.frequency)

    this.musicGain.gain.value = this.masterVolume * this.musicVolume * 0.1

    osc.connect(this.musicGain)
    this.musicGain.connect(this.context.destination)

    osc.start()
    lfo.start()

    this.musicNode = osc
    this.lfoNode = lfo
  }

  // 停止背景音乐
  stopMusic() {
    if (this.musicNode) {
      this.musicNode.stop()
      this.musicNode = null
    }
    if (this.lfoNode) {
      this.lfoNode.stop()
      this.lfoNode = null
    }
  }

  // 清理
  dispose() {
    this.stopMusic()
    if (this.context) {
      this.context.close()
    }
  }
}

// 单例
let audioManagerInstance = null

export function getAudioManager() {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager()
  }
  return audioManagerInstance
}
