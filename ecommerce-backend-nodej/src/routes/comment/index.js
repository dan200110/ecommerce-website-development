const express = require('express')
const commentController = require('../../controller/comment.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
const {authenticationV2} = require('../../auth/authUtils')

router.use(authenticationV2)
router.use('/v1/api/comment', require('./comment'))
router.post('', asyncHandler(commentController.createComment))

module.exports = router
