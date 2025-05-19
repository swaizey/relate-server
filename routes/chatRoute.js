const e = require('express')
const { sendMsg, getSingleChat, chats } = require('../controllers/chatController')
const router = e.Router()

router.post('/', sendMsg)
router.get('/:member1/:member2', getSingleChat)
router.get('/:id', chats)

module.exports = router