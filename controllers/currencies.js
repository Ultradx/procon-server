// Beggining State of currencies
const currencies = [
  'EURO',
  'US DOLLAR',
  'SWISS FRANC',
  'BRITISH POUND',
  'JPY',
  'CAD',
]

// Beggining State of exchangeRates
let exchangeRates = [
  { from: currencies[0], to: currencies[1], rate: '1.3764' },
  { from: currencies[0], to: currencies[2], rate: '1.2079' },
  { from: currencies[0], to: currencies[3], rate: '0.8731' },
  { from: currencies[1], to: currencies[4], rate: '76.72' },
  { from: currencies[2], to: currencies[1], rate: '1.1379' },
  { from: currencies[3], to: currencies[5], rate: '1.5648' },
]

const addNewPair = async (req, res) => {
  let from = req.body.from
  let to = req.body.to
  let rate = req.body.rate

  // If is not a real number then return status 405
  if (isNaN(rate)) {
    res.status(405).send('Ratio must be real number')
    return
  }
  console.log('here')
  if (
    from != '' &&
    from != undefined &&
    to != '' &&
    to != undefined &&
    rate != '' &&
    rate != undefined
  ) {
    // we do this uppercase so we can compare it with the exchangeRates
    from = from.toUpperCase()
    to = to.toUpperCase()
    if (from === to) {
      res.status(405).send('You Cant Add Two Times The Same Pair!')
      return
    }
    const results = getRates(from, to)
    if (results == 0) {
      // if we not find something similar then we add to array
      console.log('im in', results)
      exchangeRates.push({ from: from, to: to, rate: rate })
      // we check if there is any left pair with the same name as the currencies so we can remove it from the user choice
      if (!currencies.includes(from)) {
        currencies.push(from)
      }
      if (!currencies.includes(to)) {
        currencies.push(to)
      }
    } else {
      res.status(405).send('There is already a similar pair!')
      return
    }
  } else {
    res.status(405).send('Please Fill All Inputs!')
    return
  }

  res.status(200).send('Pair Added Successfully!')
}

// We find the pair we want to update ratio only and save changes
const updateRate = (from, to, rate) => {
  console.log('im to updateRate')
  for (var i = 0; i < exchangeRates.length; i++) {
    if (exchangeRates[i].from == from && exchangeRates[i].to == to) {
      exchangeRates[i].rate = rate
      break
    }
  }
}

// Update function that checks inputs and sends outpouts
const updatePair = async (req, res) => {
  let from = req.body.from
  let to = req.body.to
  const rate = req.body.rate

  if (isNaN(rate)) {
    res.status(405).send('Ratio must be real number')
    return
  }
  if (
    from != '' &&
    from != undefined &&
    to != '' &&
    to != undefined &&
    rate != '' &&
    rate != undefined
  ) {
    from = from.toUpperCase()
    to = to.toUpperCase()
    const results = getRates(from, to)
    console.log('im in', results)
    if (results !== 0) {
      updateRate(from, to, rate)
    } else {
      res.status(405).send('Pair Not Found To Update!!')
      return
    }
  } else {
    res.status(405).send('Please Fill All Inputs!')
    return
  }

  res.status(200).send('Pair Updated Successfully!')
}

// find pair and remove it
const deleteFromArray = (from, to) => {
  console.log('im to deleteFromArray')
  for (var i = 0; i < exchangeRates.length; i++) {
    if (exchangeRates[i].from == from && exchangeRates[i].to == to) {
      exchangeRates.splice(i, 1)
      break
    }
  }
}

// We check if there is any remaining pair with the same names as that we have
// If no then delete it and from currenies array so the user cant access it
const checkCurrencyInPairsAndDelete = (value) => {
  const from_arr = exchangeRates.filter((name) => name.from === value)
  const to_arr = exchangeRates.filter((name) => name.to === value)

  if (from_arr.length === 0) {
    if (to_arr.length === 0) {
      for (var i = 0; i < currencies.length; i++) {
        if (currencies[i] == value) {
          currencies.splice(i, 1)
          break
        }
      }
    }
  }
}

// Same logic as before just check the inputs and send results
const deletePair = async (req, res) => {
  let from = req.body.from
  let to = req.body.to

  if (from != '' && from != undefined && to != '' && to != undefined) {
    from = from.toUpperCase()
    to = to.toUpperCase()
    const results = getRates(from, to)
    console.log('im in', results)
    if (results !== 0) {
      deleteFromArray(from, to)
      checkCurrencyInPairsAndDelete(from)
      checkCurrencyInPairsAndDelete(to)
    } else {
      res.status(200).send('Pair Not Found To Delete!!')
      return
    }
  } else {
    res.status(200).send('Please Fill All Inputs!')
    return
  }

  res.status(200).send('Pair Deleted Successfully!')
}

/** Αυτη η συναρτηση ειναι λιγο περιεργει. Θελουμε να δουμε αν το ζευγαρι τιμωων
 * βρισκεται στον πινακα και απο τις δυο πλευρες αν ειναι με την σωστη σειρα τοτε
 * απλα στελνει πισω το ratio που εχει αποθυκευση αλλιως κανει διαιρεση και στελνει το ratio
 */
const getRates = (from, to) => {
  const from_arr = exchangeRates.filter((name) => name.from === from)
  const to_arr = from_arr.filter((name) => name.to === to)

  if (to_arr.length > 0) {
    // let converteValue = 1 / to_arr[0].rate
    let converteValue = Number(to_arr[0].rate).toFixed(4)
    console.log(converteValue)
    return converteValue
  } else {
    console.log('Im in the second')
    const check_from_sec_arr = exchangeRates.filter((name) => name.from === to)
    const check_to_arr = check_from_sec_arr.filter((name) => name.to === from)
    if (check_to_arr.length > 0) {
      // let x = parseFloat(check_to_arr[0].rate)
      let converteValue = 1 / check_to_arr[0].rate
      converteValue = Number(converteValue).toFixed(4)
      console.log(converteValue)
      return converteValue
    }
    return 0
  }
}

// Gets the rate and multiplies the amount with the rate
const getConverteCurrencies = async (req, res) => {
  const amount = req.body.amount
  const from = req.body.from
  const to = req.body.to

  if (isNaN(amount)) {
    res.send('Amount must be real number')
    return
  }
  if (from === to) {
    res.send(`${amount} ${from} ---> ${amount} ${to}`)
    return
  }

  const rates = getRates(from, to)
  console.log('getConverteCurrencies', rates)
  console.log(amount)
  if (rates != 0 && amount != undefined && amount != '') {
    let converted = amount * rates
    converted = Number(converted).toFixed(4)
    // const answer =
    res.send(`${amount} ${from} ---> ${converted} ${to}`)
    // res.send({ rates, converted })
  } else {
    res.send(`Pair (${from}/${to}) Not Found In Database!`)
  }
}

const getCurrencies = (req, res) => {
  console.log('send currencies')
  res.send(currencies)
}

const getPairs = async (req, res) => {
  res.send(exchangeRates)
}

module.exports = {
  getCurrencies,
  getPairs,
  getConverteCurrencies,
  addNewPair,
  updatePair,
  deletePair,
}
