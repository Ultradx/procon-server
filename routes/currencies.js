const {
  getCurrencies,
  getPairs,
  getConverteCurrencies,
  addNewPair,
  updatePair,
  deletePair,
} = require('../controllers/currencies')
const refreshTokenController = require('../controllers/refreshTokenController')
const auth = require('../middleware/auth')

const express = require('express')
const router = express.Router()

router.get('/refresh', refreshTokenController.handleRefreshToken)
console.log('help')
router.get('/currencies', getCurrencies)
router.get('/pairs', getPairs)
router.post('/rates', getConverteCurrencies)
router.post('/new', auth, addNewPair)
router.post('/update', auth, updatePair)
router.delete('/delete', auth, deletePair)

module.exports = router
