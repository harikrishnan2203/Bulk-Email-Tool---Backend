const express = require('express')
const router = express.Router()
const MailController = require('../Controller/MailController')

router.post('/create-cred', MailController.createCred)
router.get('/get-cred', MailController.getCred)
router.delete('/deletion-cred', MailController.deletionCred)
router.post('/sendmail', MailController.sendMail)
router.get('/get-logs', MailController.getLogs)
router.get('/today-count', MailController.countToday)
router.post('/chart', MailController.chartLogs)

module.exports = router