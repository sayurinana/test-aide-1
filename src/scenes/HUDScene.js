/**
 * HUD 界面场景
 */

import Phaser from 'phaser'
import { COLORS } from '../config.js'

export class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HUDScene' })
  }

  create() {
    // HUD 初始化
    console.log('HUDScene 初始化完成')
  }

  update(time, delta) {
    // HUD 更新
  }
}
