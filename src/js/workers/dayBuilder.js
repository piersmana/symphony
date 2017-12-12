'use strict'

import * as THREE from 'three'

// Geometry
import GenerateBlockGeometry from '../helpers/GenerateBlockGeometry'

self.addEventListener('message', function (e) {
  let data = e.data
  switch (data.cmd) {
    case 'build':
      console.log('building merkle trees...')
      let blocks = data.blocks

      let returnData = {
        sizes: [],
        blockCount: blocks.length,
        dayIndex: data.dayIndex,
        blocks: data.blocks,
        timeStamp: data.timeStamp,
        focusOnBlock: data.focusOnBlock
      }

      for (let index = 0; index < blocks.length; index++) {
        let block = blocks[index]

        let feeToInputRatio = 0
        if (block.fee && block.input) {
          feeToInputRatio = block.fee / block.input
        }
        block.feeToInputRatio = feeToInputRatio

        let blockGeoData = new GenerateBlockGeometry(block)
        returnData.sizes.push(blockGeoData.boxDimensions)

        returnData.blocks[index].feeToInputRatio = feeToInputRatio
      }

      self.postMessage(returnData)
      break
    case 'stop':
      self.postMessage('WORKER STOPPED')
      self.close()
      break
    default:
      self.postMessage('Unknown command')
  }

  self.postMessage(e.data)
}, false)
